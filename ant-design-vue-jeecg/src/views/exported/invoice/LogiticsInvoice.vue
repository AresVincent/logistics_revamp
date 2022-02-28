<template>
      <a-card :bordered="false">
        <!-- 查詢區域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" :form="form" @submit="submitSearch">
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
                      <a-form-item label="Invoice月份">
                        <a-month-picker placeholder="請選擇月份" v-decorator="['month']"  />
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
      <!-- <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已選擇 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>項
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div> -->

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
  const initialDate="2021/6";
  export default {
    name: 'LogisticsOrderList',
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
            title:'支付狀態',
            align:"center",
            dataIndex: 'status'
          },
          {
            title:'結算月份時間',
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
          pageSizeOptions:['10','20','50']
        },
        options: [],
        async:false,
        dict:"logistics_user,name,id",
      }
    },
    created(){
      this.initDictData();
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
        this.form.setFieldsValue({"company":[],month:""})
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
            if(typeof(values.company)== "undefined" && typeof(values.month)=="undefined"){
              return;
            }else if(typeof(values.company)== "undefined"){
              console.log(this.options);
              for(var i in this.options){
                arrayList.push({
                  id:this.options[i].value,
                  company_name:this.options[i].text,
                  status:'未支付',
                  sendTime:values.month.year()+'/'+(values.month.month()+1)
                })
              }
            }else if(typeof(values.month)=="undefined"){
              //lastest to now
              let nowYear=new Date().getFullYear();
              let nowMonth=new Date().getMonth()+1;
              let lastestYear=initialDate.split("/")[0];
              let lastestMonth=initialDate.split("/")[1];
              for(var i=lastestYear;i<=nowYear;i++){
                for(var j=0;j<12;j++){
                  if(i<=lastestYear&&j<lastestMonth){
                    continue;
                  }
                  if(i==nowYear&&j>=nowMonth){
                    continue;
                  }
                  arrayList.push({
                    id:values.company.key,
                    company_name:values.company.label,
                    status:'未支付',
                    sendTime:i+'/'+(j+1)
                  })
                }
              }
              console.log(nowYear+'/'+nowMonth+'/'+lastestYear+'/'+lastestMonth)
            }else{
              
              arrayList.push({
                id:values.company.key,
                company_name:values.company.label,
                status:'未支付',
                sendTime:values.month.year()+'/'+(values.month.month()+1)
              });
            }
            this.recordData=arrayList;
            console.log(values);
          })
      },
      gotoRecord(record){
        console.log(record)
        let url='/online/cgreport/1478953832211054593';
        url+='?invoice_year='+new Date(record.sendTime).getFullYear();
        url+='&invoice_month='+(new Date(record.sendTime).getMonth()+1);
        url+="&user_id='"+record.id+"'";
        window.open(url);
      },
     
    }
  }
</script>
<style scoped>
</style>