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
      <a-button type="primary" icon="download" @click="handleExportXls('洗衣網點表')">導出</a-button>
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

    <washing-outlets-modal ref="modalForm" @ok="modalFormOk"></washing-outlets-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import WashingOutletsModal from './modules/WashingOutletsModal'

  export default {
    name: 'WashingOutletsList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      WashingOutletsModal
    },
    data () {
      return {
        description: '洗衣網點表管理頁面',
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
            title:'自提點/自提櫃編碼',
            align:"center",
            dataIndex: 'storeCode'
          },
          {
            title:'自提點/自提櫃名稱',
            align:"center",
            dataIndex: 'storeName'
          },
          {
            title:'短地址',
            align:"center",
            dataIndex: 'storeShortAddress'
          },
          {
            title:'完整地址',
            align:"center",
            dataIndex: 'storeFullAddress'
          },
          {
            title:'營業時間',
            align:"center",
            dataIndex: 'storeOperationHr'
          },
          {
            title:'陽光洗衣店編碼',
            align:"center",
            dataIndex: 'sunshineStoreCode'
          },
          {
            title:'陽光洗衣店id',
            align:"center",
            dataIndex: 'sunshineStoreId'
          },
          {
            title:'創建人',
            align:"center",
            dataIndex: 'createUser'
          },
          {
            title:'更新人',
            align:"center",
            dataIndex: 'updateUser'
          },
          {
            title:'國家',
            align:"center",
            dataIndex: 'storeCountry'
          },
          {
            title:'區域',
            align:"center",
            dataIndex: 'storeRegion'
          },
          {
            title:'地區',
            align:"center",
            dataIndex: 'storeCities'
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
          list: "/washing/outlet/list",
          delete: "/washing/outlet/delete",
          deleteBatch: "/washing/outlet/deleteBatch",
          exportXlsUrl: "/washing/outlet/exportXls",
          importExcelUrl: "/washing/outlet/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
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
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'storeCode',text:'自提點/自提櫃編碼',dictCode:''})
        fieldList.push({type:'string',value:'storeName',text:'自提點/自提櫃名稱',dictCode:''})
        fieldList.push({type:'string',value:'storeShortAddress',text:'短地址',dictCode:''})
        fieldList.push({type:'string',value:'storeFullAddress',text:'完整地址',dictCode:''})
        fieldList.push({type:'string',value:'storeOperationHr',text:'營業時間',dictCode:''})
        fieldList.push({type:'string',value:'sunshineStoreCode',text:'陽光洗衣店編碼',dictCode:''})
        fieldList.push({type:'string',value:'sunshineStoreId',text:'陽光洗衣店id',dictCode:''})
        fieldList.push({type:'string',value:'createUser',text:'創建人',dictCode:''})
        fieldList.push({type:'string',value:'updateUser',text:'更新人',dictCode:''})
        fieldList.push({type:'string',value:'storeCountry',text:'國家',dictCode:''})
        fieldList.push({type:'string',value:'storeRegion',text:'區域',dictCode:''})
        fieldList.push({type:'string',value:'storeCities',text:'地區',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>