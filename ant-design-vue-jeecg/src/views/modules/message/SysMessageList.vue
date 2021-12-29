<template>
  <a-card :bordered="false">

    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="消息標題">
              <a-input placeholder="請輸入消息標題" v-model="queryParam.esTitle"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="發送內容">
              <a-input placeholder="請輸入發送內容" v-model="queryParam.esContent"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="接收人">
                <a-input placeholder="請輸入接收人" v-model="queryParam.esReceiver"></a-input>
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
      <a-button @click="handleAdd" v-show="show" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" v-show="show" icon="download" @click="handleExportXls('消息')">導出</a-button>
      <a-upload v-show="show" name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
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
        <span slot="esContent" slot-scope="text">
          <j-ellipsis :value="text" :length="10" />
        </span>

        <span slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="handleDetail(record)">詳情</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多<a-icon type="down"/></a>
            <a-menu slot="overlay">
               <a-menu-item v-show="show">
                <a  @click="handleEdit(record)">編輯</a>
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
    <!-- table區域-end -->

    <!-- 表單區域 -->
    <sysMessage-modal ref="modalForm" @ok="modalFormOk"></sysMessage-modal>
  </a-card>
</template>

<script>
  import SysMessageModal from './modules/SysMessageModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: "SysMessageList",
    mixins: [JeecgListMixin],
    components: {
      JEllipsis,
      SysMessageModal
    },
    data() {
      return {
        description: '消息管理頁面',
        // 新增修改按鈕是否显示
        show: false,
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
            title: '消息標題',
            align: "center",
            dataIndex: 'esTitle'
          },
          {
            title: '發送內容',
            align: "center",
            dataIndex: 'esContent',
            scopedSlots: {customRender: 'esContent'},
          },
          {
            title: '接收人',
            align: "center",
            dataIndex: 'esReceiver'
          },
          {
            title: '發送次數',
            align: "center",
            dataIndex: 'esSendNum'
          },
          {
            title: '發送狀態',
            align: 'center',
            dataIndex: 'esSendStatus_dictText'
          },
          {
            title: '發送時間',
            align: "center",
            dataIndex: 'esSendTime'
          },
          {
            title: '發送方式',
            align: 'center',
            dataIndex: 'esType_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/sys/message/sysMessage/list",
          delete: "/sys/message/sysMessage/delete",
          deleteBatch: "/sys/message/sysMessage/deleteBatch",
          exportXlsUrl: "sys/message/sysMessage/exportXls",
          importExcelUrl: "sys/message/sysMessage/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {}
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