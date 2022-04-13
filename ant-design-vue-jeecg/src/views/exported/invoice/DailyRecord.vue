<template>
      <a-card :bordered="false">
        <!-- 查詢區域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline"   @keyup.enter.native="searchQuery" >
                <a-row :gutter="24">
                  <!-- <a-col :xl="6" :lg="8" :md="8" :sm="24">
                        <a-form-item label="物流用戶ID">
                          <j-search-select-tag placeholder="請選擇物流用戶ID" v-model="queryParam.userId" dict="logistics_user,name,id"/>
                        </a-form-item>
                  </a-col>                     -->
                  <a-col :xl="6" :lg="8" :md="8" :sm="24">
                      <a-form-item label="交收表日期">
                          <j-date placeholder="請選擇下單時間" v-model="queryParam.date"  style="width: 100%" />
                      </a-form-item>
                  </a-col>
                  <a-col :xl="6" :lg="8" :md="8" :sm="24">
                      <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                      <a-button type="primary" @click="searchQuery" icon="search">查詢</a-button>
                      <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
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
        rowKey="companyName"
        :columns="columns"
        :dataSource="dataSource"
        :loading="loading"
        :pagination="ipagination"
        class="j-table-force-nowrap"
      >
        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="getWaybill(record)" href="javascript:void(0)">查看</a>
        </span>
      </a-table>
    </div>
      <template>
      <a-drawer class="container" :destroyOnClose="true" title='預覽' :visible="iframeShow" wrapClassName="iframeWrap" width="560px"
      :bodyStyle="{'display':'flex','justify-content':'center'}"
       @close="closeDrawer"
        
      >
        <div class="iframeBox">
          <iframe :src="iframeURL" allow="fullscreen" width="520px" height="580px"></iframe>
        </div>
     </a-drawer>
    </template>
  </a-card>
</template>

<script>

   import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import {downFile} from '@/api/manage'

  export default {
    name: 'DailyRecord',
    mixins:[ mixinDevice,JeecgListMixin],
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
            customRender:(text,record,index)=>{
              return (index+1);
            }
          },
          {
            title:'公司名稱',
            align:"center",
            dataIndex: 'companyName'
          },
          {
            title:'日期',
            align:"center",
            dataIndex: 'date',
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
          list:"logistics/deliveryList/list"
        },
        queryParam:{
          date:this.YMD(new Date())
        },
        dictOptions:{},
        superFieldList:[],
        iframeShow:false,
        iframeURL:''
      }
    },
    created(){
      this.initDictConfig();
      this.getSuperFieldList();
    },
    mounted(){
    },
    computed: {

    },
    methods: {
     getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'company_name',text:'訂單號',dictCode:''})
        fieldList.push({type:'date',value:'date',text:'下單時間',dictCode:''})
        fieldList.push({type:'sel_search',value:'userId',text:'物流用戶ID',dictTable:'logistics_user', dictText:'name', dictCode:'id'})
        this.superFieldList = fieldList
      },
      getWaybill(record){ 
        let token = Vue.ls.get(ACCESS_TOKEN);
        downFile(record.link,{token:token}).then(res=>{
          let blobObj=this.base64ToBlob(res);
          //生成文件訪問url
          let blobUrl=window.URL.createObjectURL(blobObj);
          console.log('link:',blobUrl)
          this.iframeURL=blobUrl
          this.iframeShow=true;
        }).catch(err=>{
          
        })
      },
      YMD(date){
        return (
          date.getFullYear()+'-'
          +(date.getMonth()+1>=10 ? date.getMonth()+1:'0'+(date.getMonth()+1))+'-'
          +(date.getDate()>=10 ? date.getDate():'0'+date.getDate())
        )
      },
      base64ToBlob(code){
        // code = code.replace(/[\n\r]/g, '');
        // var raw = code;
        return new Blob([code], {type: 'application/pdf'});//转成pdf类型
      },
      closeDrawer(){
        this.iframeShow=false;
        console.log('關閉')
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/orderTable.less';
</style>