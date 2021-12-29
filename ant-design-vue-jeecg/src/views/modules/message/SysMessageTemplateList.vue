<template>
  <a-card :bordered="false">

    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-item label="模板CODE">
              <a-input placeholder="請輸入模板CODE" v-model="queryParam.templateCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="模板內容">
              <a-input placeholder="請輸入模板內容" v-model="queryParam.templateContent"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="模板標題">
                <a-input placeholder="請輸入模板標題" v-model="queryParam.templateName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="模板類型">
                <a-input placeholder="請輸入模板類型" v-model="queryParam.templateType"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
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

    <!-- 操作按鈕區域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('消息模板')">導出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">導入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            刪除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table區域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已選擇 <a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>項
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <!-- 字符串超長截取省略號显示-->
        <span slot="templateContent" slot-scope="text">
          <j-ellipsis :value="text" :length="25" />
        </span>


        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">編輯</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="確定刪除嗎?" @confirm="() => handleDelete(record.id)">
                  <a>刪除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                  <a @click="handleTest(record)">發送測試</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table區域-end -->

    <!-- 表單區域 -->
    <sysMessageTemplate-modal ref="modalForm" @ok="modalFormOk"></sysMessageTemplate-modal>

    <sysMessageTest-modal ref="testModal"></sysMessageTest-modal>
  </a-card>
</template>

<script>
  import SysMessageTemplateModal from './modules/SysMessageTemplateModal'
  import SysMessageTestModal from './modules/SysMessageTestModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: "SysMessageTemplateList",
    mixins: [JeecgListMixin],
    components: {
      JEllipsis,
      SysMessageTemplateModal,
      SysMessageTestModal
    },
    data() {
      return {
        description: '消息模板管理頁面',
        // 表頭
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '模板CODE',
            align: "center",
            dataIndex: 'templateCode'
          },
          {
            title: '模板標題',
            align: "center",
            dataIndex: 'templateName'
          },
          {
            title: '模板內容',
            align: "center",
            dataIndex: 'templateContent',
            scopedSlots: {customRender: 'templateContent'},
          },
          {
            title: '模板類型',
            align: "center",
            dataIndex: 'templateType',
            customRender: function (text) {
              if(text=='1') {
                return "短信";
              }
              if(text=='2') {
                return "郵件";
              }
              if(text=='3') {
                return "微信";
              }
              if(text=='4') {
                return "系統";
              }
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/sys/message/sysMessageTemplate/list",
          delete: "/sys/message/sysMessageTemplate/delete",
          deleteBatch: "/sys/message/sysMessageTemplate/deleteBatch",
          exportXlsUrl: "sys/message/sysMessageTemplate/exportXls",
          importExcelUrl: "sys/message/sysMessageTemplate/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleTest(record){
        this.$refs.testModal.open(record);
        this.$refs.testModal.title = "發送測試";
      }

    }
  }
</script>
<style lang="less" scoped>
  /** Button按鈕間距 */
  .ant-btn {
    margin-left: 3px
  }

  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>