<template>
  <a-card :bordered="false">
    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查詢區域-END -->

    <!-- 操作按鈕區域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('洗衣訂單表')">導出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">導入</a-button>
      </a-upload>
      <!-- 高級查詢區域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>刪除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table區域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已選擇 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>項
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">無圖片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">無文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下載
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">編輯</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">詳情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="確定刪除嗎?" @confirm="() => handleDelete(record.id)">
                  <a>刪除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <washing-order-modal ref="modalForm" @ok="modalFormOk"></washing-order-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import WashingOrderModal from './modules/WashingOrderModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'

  let washingTypeArray=[];
  let oneOrZero=[];
  let trueOrFalse=[]; 


  export default {
    name: 'WashingOrderList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      WashingOrderModal
    },
    data () {
      return {
        description: '洗衣訂單表管理頁面',
        // 表頭
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'洗衣類型',
            align:"center",
            dataIndex: 'type',
            customRender:function(text,record,index){
              return filterDictText(washingTypeArray,text)
            }
          },
          {
            title:'運單號',
            align:"center",
            dataIndex: 'waybillNo'
          },
          {
            title:'訂單號',
            align:"center",
            dataIndex: 'orderNo'
          },
          {
            title:'訂單狀態',
            align:"center",
            dataIndex: 'orderStatus_dictText'
          },
          {
            title:'寄件人姓名',
            align:"center",
            dataIndex: 'consignorName'
          },
          {
            title:'寄件人電話',
            align:"center",
            dataIndex: 'consignorPhone'
          },
          {
            title:'洗衣服務費',
            align:"center",
            dataIndex: 'cost'
          },
          {
            title:'收件人姓名',
            align:"center",
            dataIndex: 'consigneeName'
          },
          {
            title:'收件人電話',
            align:"center",
            dataIndex: 'consigneePhone'
          },
          {
            title:'件數',
            align:"center",
            dataIndex: 'packageNumber'
          },
          {
            title:'自提點',
            align:"center",
            dataIndex: 'pickUpPoint_dictText'
          },
          {
            title:'是否租用/購買洗衣袋?',
            align:"center",
            dataIndex: 'rentTag',
             customRender:function(text,record,index){
              return filterDictText(trueOrFalse,text)
            }
          },
          {
            title:'洗衣袋費用',
            align:"center",
            dataIndex: 'packageRentCost'
          },
          {
            title:'下單時間',
            align:"center",
            dataIndex: 'orderTime',
            sorter: true,
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'攬收時間',
            align:"center",
            dataIndex: 'collectTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'洗衣完成時間',
            align:"center",
            dataIndex: 'washedTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'倉庫簽入時間',
            align:"center",
            dataIndex: 'warehouseReceiveTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'倉庫簽出時間',
            align:"center",
            dataIndex: 'signTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'收件人區域',
            align:"center",
            dataIndex: 'receiptCity'
          },
          {
            title:'收件人地區',
            align:"center",
            dataIndex: 'receiptDistrict'
          },
          {
            title:'收件人地址',
            align:"center",
            dataIndex: 'receiptAddress'
          },
          {
            title:'是否上門派送?',
            align:"center",
            dataIndex: 'homePickupTag',
            customRender:function(text,record,index){
              return filterDictText(trueOrFalse,text)
            }
          },
          {
            title:'是否已付款?',
            align:"center",
            dataIndex: 'payTag',
            customRender:function(text,record,index){
              return filterDictText(oneOrZero,text)
            }
          },
          {
            title:'是否已審核?',
            align:"center",
            dataIndex: 'checkTag',
            customRender:function(text,record,index){
              return filterDictText(oneOrZero,text)
            }
          },
          {
            title:'更新人',
            align:"center",
            dataIndex: 'updatedBy'
          },
          {
            title:'更新日期',
            align:"center",
            dataIndex: 'updatedTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'是否刪除?',
            align:"center",
            dataIndex: 'delFlag',
            customRender:function(text,record,index){
              return filterDictText(oneOrZero,text)
            }
          },
          {
            title:'支付代碼',
            align:"center",
            dataIndex: 'paymentCode_dictText',
          },
          {
            title:'總金額',
            align:"center",
            dataIndex: 'total'
          },
          {
            title:'收款人',
            align:'center',
            dataIndex:'collectedBy'
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
        url: {
          list: "/washing/order/list",
          delete: "/washing/order/delete",
          deleteBatch: "//washing/order/deleteBatch",
          exportXlsUrl: "/washing/order/exportXls",
          importExcelUrl: "/washing/order/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
        isorter:{
          column:"orderTime",
          order:'desc'
        },
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){

        initDictOptions('washing_type').then((res) => {
          if(res.success){
            washingTypeArray=res.result
          }
        });
        initDictOptions('true_or_false').then(res=>{
          if(res.success){
            trueOrFalse=res.result;
          }
        });
        initDictOptions('one_or_zero').then(res=>{
          if(res.success){
            oneOrZero=res.result;
          }
        })
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'type',text:'洗衣類型',dictCode:'washing_type'})
        fieldList.push({type:'string',value:'waybillNo',text:'運單號',dictCode:''})
        fieldList.push({type:'string',value:'orderNo',text:'訂單號',dictCode:''})
        fieldList.push({type:'sel_search',value:'orderStatus',text:'訂單狀態',dictTable:'logistics_washing_t_dic',dictText:'dic_value',dictCode:'dic_key'})
        fieldList.push({type:'string',value:'consignorName',text:'寄件人姓名',dictCode:''})
        fieldList.push({type:'string',value:'consignorPhone',text:'寄件人電話',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'cost',text:'洗衣服務費',dictCode:''})
        fieldList.push({type:'string',value:'consigneeName',text:'收件人姓名',dictCode:''})
        fieldList.push({type:'string',value:'consigneePhone',text:'收件人電話',dictCode:''})
        fieldList.push({type:'int',value:'packageNumber',text:'件數',dictCode:''})
        fieldList.push({type:'sel_search',value:'pickUpPoint',text:'自提點',dictTable:'logistics_outlet',dictText:'store_name',dictCode:'store_code'})
        fieldList.push({type:'string',value:'rentTag',text:'是否租用/購買洗衣袋?',dictCode:'true_or_false'})
        fieldList.push({type:'BigDecimal',value:'packageRentCost',text:'洗衣袋費用',dictCode:''})
        fieldList.push({type:'date',value:'orderTime',text:'下單時間'})
        fieldList.push({type:'date',value:'collectTime',text:'攬收時間'})
        fieldList.push({type:'date',value:'washedTime',text:'洗衣完成時間'})
        fieldList.push({type:'date',value:'warehouseReceiveTime',text:'倉庫簽入時間'})
        fieldList.push({type:'date',value:'signTime',text:'倉庫簽出時間'})
        fieldList.push({type:'string',value:'receiptCity',text:'收件人區域',dictCode:''})
        fieldList.push({type:'string',value:'receiptDistrict',text:'收件人地區',dictCode:''})
        fieldList.push({type:'string',value:'receiptAddress',text:'收件人地址',dictCode:''})
        fieldList.push({type:'string',value:'homePickupTag',text:'是否上門派送?',dictCode:'true_or_false'})
        fieldList.push({type:'string',value:'payTag',text:'是否已付款?',dictCode:'one_or_zero'})
        fieldList.push({type:'string',value:'checkTag',text:'是否已審核?',dictCode:'one_or_zero'})
        fieldList.push({type:'string',value:'updatedBy',text:'更新人',dictCode:''})
        fieldList.push({type:'date',value:'updatedTime',text:'更新日期'})
        fieldList.push({type:'string',value:'delFlag',text:'是否刪除?',dictCode:''})
        fieldList.push({type:'sel_search',value:'paymentCode',text:'支付代碼',dictTable:'common_payments',dictText:"payment_description",dictCode:"payment_code"})
        fieldList.push({type:'BigDecimal',value:'total',text:'總金額',dictCode:''})
        fieldList.push({type:'sel_search',value:'collectedBy',text:'收款人',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>