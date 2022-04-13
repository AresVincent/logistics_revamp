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
      <a-button type="primary" icon="download" @click="handleExportXls('物流/洗衣狀態表')">導出</a-button>
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
        rowKey="dicId"
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

    <logistics-washing-t-dic-modal ref="modalForm" @ok="modalFormOk"></logistics-washing-t-dic-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import LogisticsWashingTDicModal from './modules/LogisticsWashingTDicModal'

  export default {
    name: 'LogisticsWashingTDicList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      LogisticsWashingTDicModal
    },
    data () {
      return {
        description: '物流/洗衣狀態表管理頁面',
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
            title:'主键',
            align:"center",
            sorter: true,
            dataIndex: 'dicId'
          },
          {
            title:'字典類型',
            align:"center",
            dataIndex: 'dicTypeKey'
          },
          {
            title:'狀態碼',
            align:"center",
            dataIndex: 'dicKey'
          },
          {
            title:'狀態名稱',
            align:"center",
            dataIndex: 'dicValue'
          },
          {
            title:'描述',
            align:"center",
            dataIndex: 'dicDescription'
          },
          {
            title:'激活狀態',
            align:"center",
            dataIndex: 'status'
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
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/washing/dict/list",
          delete: "/washing/dict/delete",
          deleteBatch: "/washing/dict/deleteBatch",
          exportXlsUrl: "/washing/dict/exportXls",
          importExcelUrl: "/washing/dict/importExcel",
          
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
        fieldList.push({type:'int',value:'dicId',text:'主键',dictCode:''})
        fieldList.push({type:'string',value:'dicTypeKey',text:'字典類型',dictCode:''})
        fieldList.push({type:'string',value:'dicKey',text:'狀態碼',dictCode:''})
        fieldList.push({type:'string',value:'dicValue',text:'狀態名稱',dictCode:''})
        fieldList.push({type:'string',value:'dicDescription',text:'描述',dictCode:''})
        fieldList.push({type:'string',value:'status',text:'激活狀態',dictCode:''})
        fieldList.push({type:'string',value:'createUser',text:'創建人',dictCode:''})
        fieldList.push({type:'string',value:'updateUser',text:'更新人',dictCode:''})
        fieldList.push({type:'string',value:'id',text:'主键',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>