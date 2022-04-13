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
      <a-button type="primary" icon="download" @click="handleExportXls('物流破損件記錄表')">導出</a-button>
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

    <logistics-defective-records-modal ref="modalForm" @ok="modalFormOk"></logistics-defective-records-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import LogisticsDefectiveRecordsModal from './modules/LogisticsDefectiveRecordsModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'LogisticsDefectiveRecordsList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      LogisticsDefectiveRecordsModal
    },
    data () {
      return {
        description: '物流破損件記錄表管理頁面',
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
            title:'公司名',
            align:"center",
            dataIndex: 'userId_dictText'
          },
          {
            title:'訂單號',
            align:"center",
            dataIndex: 'orderNo_dictText'
          },
          {
            title:'運單號',
            align:"center",
            dataIndex: 'waybillNo_dictText'
          },
          {
            title:'發現時間',
            align:"center",
            dataIndex: 'discoverTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'發現地點',
            align:"center",
            dataIndex: 'discoverLocation_dictText'
          },
          {
            title:'發生地點',
            align:"center",
            dataIndex: 'occurLocation_dictText'
          },
          {
            title:'理賠申請',
            align:"center",
            dataIndex: 'claimApplication',
            customRender: (text) => (text ? filterMultiDictText(this.dictOptions['claimApplication'], text) : ''),
          },
          {
            title:'理賠申請結果',
            align:"center",
            dataIndex: 'claimApplicationResult_dictText'
          },
          {
            title:'圖片',
            align:"center",
            dataIndex: 'imagePath',
            scopedSlots: {customRender: 'imgSlot'}
          },
          {
            title:'額外的圖片',
            align:"center",
            dataIndex: 'extraImage',
            scopedSlots: {customRender: 'imgSlot'}
          },
          {
            title:'理賠申請表',
            align:"center",
            dataIndex: 'claimApplicationForm',
            scopedSlots: {customRender: 'fileSlot'}
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
          list: "/defective/logisticsDefectiveRecords/list",
          delete: "/defective/logisticsDefectiveRecords/delete",
          deleteBatch: "/defective/logisticsDefectiveRecords/deleteBatch",
          exportXlsUrl: "/defective/logisticsDefectiveRecords/exportXls",
          importExcelUrl: "defective/logisticsDefectiveRecords/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
      this.$set(this.dictOptions, 'claimApplication', [{text:'是',value:'Y'},{text:'否',value:'N'}])
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'sel_search',value:'userId',text:'公司名',dictTable:'logistics_user', dictText:'name', dictCode:'id'})
        fieldList.push({type:'sel_search',value:'orderNo',text:'訂單號',dictTable:'logistics_order', dictText:'order_no', dictCode:'order_no'})
        fieldList.push({type:'sel_search',value:'waybillNo',text:'運單號',dictTable:'logistics_order', dictText:'waybill_no', dictCode:'waybill_no'})
        fieldList.push({type:'date',value:'discoverTime',text:'發現時間'})
        fieldList.push({type:'string',value:'discoverLocation',text:'發現地點',dictCode:'defective_location'})
        fieldList.push({type:'string',value:'occurLocation',text:'發生地點',dictCode:'defective_location'})
        fieldList.push({type:'switch',value:'claimApplication',text:'理賠申請'})
        fieldList.push({type:'string',value:'claimApplicationResult',text:'理賠申請結果',dictCode:'sf'})
        fieldList.push({type:'string',value:'imagePath',text:'圖片',dictCode:''})
        fieldList.push({type:'string',value:'extraImage',text:'額外的圖片',dictCode:''})
        fieldList.push({type:'string',value:'claimApplicationForm',text:'理賠申請表',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>