<template>
  <a-card :bordered="false">
    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="公司區域ID">
              <j-dict-select-tag placeholder="請選擇公司區域ID" v-model="queryParam.companyRegionId" dictCode="district"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="公司地區ID">
              <j-dict-select-tag placeholder="請選擇公司地區ID" v-model="queryParam.companyAreaId" dictCode="area"/>
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
      <a-button type="primary" icon="download" @click="handleExportXls('物流用戶表')">導出</a-button>
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
        bordered
        rowKey="id"
        class="j-table-force-nowrap"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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

    <logistics-user-modal ref="modalForm" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import LogisticsUserModal from './modules/LogisticsUserModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import '@/assets/less/TableExpand.less'

  export default {
    name: "LogisticsUserList",
    mixins:[JeecgListMixin],
    components: {
      LogisticsUserModal
    },
    data () {
      return {
        description: '物流用戶表管理頁面',
        // 表頭
        columns: [
          {
            title:'公司名稱',
            align:"center",
            dataIndex: 'name'
          },
          {
            title:'電郵地址',
            align:"center",
            dataIndex: 'email'
          },
          {
            title:'聯絡人',
            align:"center",
            dataIndex: 'contactPerson'
          },
          {
            title:'電話號碼',
            align:"center",
            dataIndex: 'phone'
          },
          {
            title:'公司區域ID',
            align:"center",
            dataIndex: 'companyRegionId_dictText'
          },
          {
            title:'公司地區ID',
            align:"center",
            dataIndex: 'companyAreaId_dictText'
          },
          {
            title:'街道名稱',
            align:"center",
            dataIndex: 'companyStreet'
          },
          {
            title:'大廈名稱',
            align:"center",
            dataIndex: 'companyBuilding'
          },
          {
            title:'公司地址',
            align:"center",
            dataIndex: 'companyAddress'
          },
          {
            title:'應用密鑰',
            align:"center",
            dataIndex: 'appKey'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/user/logisticsUser/list",
          delete: "/user/logisticsUser/delete",
          deleteBatch: "/user/logisticsUser/deleteBatch",
          exportXlsUrl: "/user/logisticsUser/exportXls",
          importExcelUrl: "user/logisticsUser/importExcel",
          
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
      }
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
         fieldList.push({type:'string',value:'token',text:'登錄令牌',dictCode:''})
         fieldList.push({type:'string',value:'name',text:'公司名稱',dictCode:''})
         fieldList.push({type:'string',value:'username',text:'登錄名',dictCode:''})
         fieldList.push({type:'string',value:'email',text:'電郵地址',dictCode:''})
         fieldList.push({type:'string',value:'password',text:'密碼',dictCode:''})
         fieldList.push({type:'string',value:'salt',text:'鹽',dictCode:''})
         fieldList.push({type:'string',value:'contactPerson',text:'聯絡人',dictCode:''})
         fieldList.push({type:'string',value:'phone',text:'電話號碼',dictCode:''})
         fieldList.push({type:'int',value:'companyRegionId',text:'公司區域ID',dictCode:'district'})
         fieldList.push({type:'int',value:'companyAreaId',text:'公司地區ID',dictCode:'area'})
         fieldList.push({type:'string',value:'companyStreet',text:'街道名稱',dictCode:''})
         fieldList.push({type:'string',value:'companyBuilding',text:'大廈名稱',dictCode:''})
         fieldList.push({type:'string',value:'companyAddress',text:'公司地址',dictCode:''})
         fieldList.push({type:'string',value:'appKey',text:'應用密鑰',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>