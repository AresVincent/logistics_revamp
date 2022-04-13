<template>
  <a-card :bordered="false">
    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="自提點/自提櫃">
              <a-input placeholder="請輸入自提點/自提櫃" v-model="queryParam.type"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查詢</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展開' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查詢區域-END -->

    <!-- 操作按鈕區域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('物流網點表')">導出</a-button>
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

    <logistics-outlets-modal ref="modalForm" @ok="modalFormOk"></logistics-outlets-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import LogisticsOutletsModal from './modules/LogisticsOutletsModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'LogisticsOutletsList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      LogisticsOutletsModal
    },
    data () {
      return {
        description: '物流網點表管理頁面',
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
            title:'自提點/自提櫃',
            align:"center",
            dataIndex: 'type_dictText'
          },
          {
            title:'所屬快遞公司',
            align:"center",
            dataIndex: 'companyId'
          },
          {
            title:'地區ID',
            align:"center",
            dataIndex: 'areaId_dictText'
          },
          {
            title:'自提點/自提櫃代碼',
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
            dataIndex: 'shortAddress'
          },
          {
            title:'長地址',
            align:"center",
            dataIndex: 'address'
          },
          {
            title:'英文地址',
            align:"center",
            dataIndex: 'addressEn'
          },
          {
            title:'電話號碼',
            align:"center",
            dataIndex: 'phone'
          },
          {
            title:'經度',
            align:"center",
            dataIndex: 'longitude'
          },
          {
            title:'緯度',
            align:"center",
            dataIndex: 'latitude'
          },
          {
            title:'營業時間',
            align:"center",
            dataIndex: 'storeOperationHr'
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
          list: "/outlet/logisticsOutlets/list",
          delete: "/outlet/logisticsOutlets/delete",
          deleteBatch: "/outlet/logisticsOutlets/deleteBatch",
          exportXlsUrl: "/outlet/logisticsOutlets/exportXls",
          importExcelUrl: "outlet/logisticsOutlets/importExcel",
          
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
        fieldList.push({type:'string',value:'type',text:'自提點/自提櫃',dictCode:''})
        fieldList.push({type:'int',value:'companyId',text:'所屬快遞公司',dictCode:'express_company'})
        fieldList.push({type:'int',value:'areaId',text:'地區ID',dictCode:'select id value, area text from common_area'})
        fieldList.push({type:'string',value:'storeCode',text:'自提點/自提櫃代碼',dictCode:''})
        fieldList.push({type:'string',value:'storeName',text:'自提點/自提櫃名稱',dictCode:''})
        fieldList.push({type:'string',value:'shortAddress',text:'短地址',dictCode:''})
        fieldList.push({type:'string',value:'address',text:'長地址',dictCode:''})
        fieldList.push({type:'string',value:'addressEn',text:'英文地址',dictCode:''})
        fieldList.push({type:'string',value:'phone',text:'電話號碼',dictCode:''})
        fieldList.push({type:'string',value:'longitude',text:'經度',dictCode:''})
        fieldList.push({type:'string',value:'latitude',text:'緯度',dictCode:''})
        fieldList.push({type:'string',value:'storeOperationHr',text:'營業時間',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>