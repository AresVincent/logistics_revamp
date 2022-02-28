<template>
      <a-card :bordered="false">
        <!-- 查詢區域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" :form="form" @submit="submitSearch" >
                <a-row :gutter="24">
                  <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <a-form-item label="物流用戶ID">
                        <a-select 
                            v-decorator="['company']" 
                            placeholder="請選擇物流用戶ID" 
                            labelInValue
                            style="width:120px"
                            allowClear>
                          <a-select-option v-for="d in options" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
                        </a-select>
                    </a-form-item>
                  </a-col>                    
                  <a-col :xl="6" :lg="7" :md="8" :sm="24">
                      <a-form-item label="交收表日期">
                        <a-date-picker placeholder="請選擇日期" v-decorator="['date']"  />
                      </a-form-item>
                  </a-col>
                  <a-col :xl="6" :lg="7" :md="8" :sm="24">
                      <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                      <a-button type="primary" html-type="submit" icon="search">查詢</a-button>
                      <a-button type="primary" @click="reset" icon="reload" style="margin-left: 8px">重置</a-button>
                      </span>
                  </a-col>
                </a-row>
            </a-form>
        </div>
        <!-- 查詢區域-END -->

    <!-- table區域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="company_name"
        :columns="columns"
        :dataSource="recordData"
        :loading="loading"
        :pagination="ipagination"
        class="j-table-force-nowrap"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="gotoRecord(record)" href="javascript:void(0)">查看</a>
        </span>

      </a-table>
    </div>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { ajaxGetDictItems,getDictItemsFromCache } from '@/api/api'

  export default {
    name: 'DailyRecord',
    mixins:[ mixinDevice],
    components: {
    },
    data () {
      return {
        // 表頭
        columns: [
          {
            title: 'ID',
            dataIndex: 'id',
            width:60,
            align:"center",
           
          },
          {
            title:'公司名稱',
            align:"center",
            dataIndex: 'company_name'
          },
          {
            title:'日期',
            align:"center",
            dataIndex: 'sendTime',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        recordData:[

        ],
        url: {
          list: "/logistics_order/logisticsOrder/list",
          delete: "/logistics_order/logisticsOrder/delete",
          deleteBatch: "/logistics_order/logisticsOrder/deleteBatch",
          exportXlsUrl: "/logistics_order/logisticsOrder/exportXls",
          importExcelUrl: "logistics_order/logisticsOrder/importExcel",
        },
        form:this.$form.createForm(this),
        loading:false,
        ipagination:{
          pageSize:10,
          showSizeChanger:true,
          pageSizeOptions:['10','20','50'],
        },
        options: [],
        async:false,
        dict:"logistics_user,name,id",
      }
    },
    created(){
      this.initDictData();
    },
    mounted(){
      this.form.setFieldsValue({"company":[],date:""})
    },
    computed: {

    },
    methods: {
      //initial DictData
      initDictData(){
        if(!this.async){
          //如果字典項集合有數據
          if(this.dictOptions && this.dictOptions.length>0){
            this.options = [...this.dictOptions]
          }else{
            //根據字典Code, 初始化字典數組
            let dictStr = ''
            if(this.dict){
                let arr = this.dict.split(',')
                if(arr[0].indexOf('where')>0){
                  let tbInfo = arr[0].split('where')
                  dictStr = tbInfo[0].trim()+','+arr[1]+','+arr[2]+','+encodeURIComponent(tbInfo[1])
                }else{
                  dictStr = this.dict
                }
                if (this.dict.indexOf(",") == -1) {
                  //優先從緩存中讀取字典配置
                  if (getDictItemsFromCache(this.dictCode)) {
                    this.options = getDictItemsFromCache(this.dictCode);
                    return
                  }
                }
                ajaxGetDictItems(dictStr, null).then((res) => {
                  if (res.success) {
                    this.options = res.result;
                  }
                })
            }
          }
        }else{
          if(!this.dict){
            console.error('搜索組件未配置字典項')
          }else{
            //異步一開始也加載一點數據
            this.loading=true
            getAction(`/sys/dict/loadDict/${this.dict}`,{pageSize: this.pageSize, keyword:''}).then(res=>{
              this.loading=false
              if(res.success){
                this.options = res.result
              }else{
                this.$message.warning(res.message)
              }
            })
          }
        }
      },
      reset(){
        this.form.setFieldsValue({"company":[],date:""})
        this.recordData=[]
        console.log('reset');
      },
      submitSearch(e){
          e.preventDefault();
          this.form.validateFields((err,values)=>{
            if(err){
              return;
            }
            let arrayList=[]
            //當沒有選擇公司與時間時
            if(values.company.length<1 && values.date==""){
              return;
            }else if(values.company.length<1){  //只選擇了時間
              console.log(this.options);
              for(var i in this.options){
                arrayList.push({
                  id:this.options[i].value,
                  company_name:this.options[i].text,
                  sendTime:values.date.format('yyyy/MM/DD')
                })
              }
            }else if(values.date==""){   //只選擇了公司
              const initialYear=2021,initialMonth=6;
              let nowYear=new Date().getFullYear(),nowMonth=new Date().getMonth()+1,nowDate=new Date().getDate();
              let leapDay=[31,29,31,30,31,30,31,31,30,31,30,31];
              let normalDay=[31,28,31,30,31,30,31,31,30,31,30,31]
              a:for(var year=2021;year<=nowYear;year++){
                let dayLength=normalDay;
                if(year%4==0&&year%100!=0||year%400==0){
                  dayLength=leapDay
                }
                let minMonth=0;
                if(year==initialYear){
                  minMonth=initialMonth;
                }
                for(var month=minMonth;month<12;month++){
                  console.log(nowYear,nowMonth,nowDate)
                  for(var day=1;day<=dayLength[month];day++){
                   if(year>=nowYear&&(month+1)>=nowMonth&&day>nowDate){
                     break a;
                   }
                    arrayList.push({
                      id:values.company.key,
                      company_name:values.company.label,
                      sendTime:(year+'/'+(month+1)+'/'+day)
                    })
                  
                  }
                }
              } 
            }else{
              arrayList.push({
                id:values.company.key,
                company_name:values.company.label,
                sendTime:values.date.format('yyyy/MM/DD')
              });
            }
            this.recordData=arrayList;
            console.log(values);
          })
      },
      gotoRecord(record){
        console.log(record)
        let url='/online/cgreport/1478948967703412738';
        // url+='?user_id='+record.id;
        // url+='&pickup_date='+record.sendTime;
        // window.open(url,"_self");
        this.$router.push({path:url,query:{user_id:record.id,pickup_date:record.sendTime}});
      },
     
    }
  }
</script>
<style scoped>
</style>