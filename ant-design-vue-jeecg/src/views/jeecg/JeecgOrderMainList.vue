<template>
  <a-card :bordered="false">

    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="6" :sm="24">
            <a-form-item label="訂單號">
              <a-input placeholder="請輸入訂單號" v-model="queryParam.orderCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="訂單類型">
              <a-select placeholder="請輸入訂單類型"  v-model="queryParam.ctype">
                <a-select-option value="1">國內訂單</a-select-option>
                <a-select-option value="2">國際訂單</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查詢</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按鈕區域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('一對多示例')">導出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">導入</a-button>
      </a-upload>

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
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">編輯</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
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
    <jeecgOrderMain-modal ref="modalForm" @ok="modalFormOk"></jeecgOrderMain-modal>
  </a-card>
</template>

<script>
  import JeecgOrderMainModal from './modules/JeecgOrderMainModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "JeecgOrderMainList",
    mixins: [JeecgListMixin],
    components: {
      JeecgOrderMainModal
    },
    data () {
      return {
        description: '訂單管理頁面',
        importExcelUrl:`${window._CONFIG['domianURL']}/test/jeecgOrderMain/importExcel`,
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
            title: '訂單號',
            align:"center",
            dataIndex: 'orderCode'
          },
          {
            title: '訂單類型',
            align:"center",
            dataIndex: 'ctype',
            customRender: (text, record, index) => {
              let re = "";
              if (text === '1') {
                re = "國內訂單";
              } else if (text === '2') {
                re = "國際訂單";
              }
              return re;
            }
          },
          {
            title: '訂單日期',
            align:"center",
            dataIndex: 'orderDate'
          },
          {
            title: '訂單金額',
            align:"center",
            dataIndex: 'orderMoney'
          },
          {
            title: '訂單備註',
            align:"center",
            dataIndex: 'content'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],

		url: {
          list: "/test/jeecgOrderMain/list",
          delete: "/test/jeecgOrderMain/delete",
          deleteBatch: "/test/jeecgOrderMain/deleteBatch",
          exportXlsUrl: "/test/jeecgOrderMain/exportXls",
        }
      }
    },
    methods: {
    }
  }
</script>
<style scoped>
  /** Button按鈕間距 */
  .ant-btn {
    margin-left: 3px
  }
  .ant-card-body .table-operator{
    margin-bottom: 18px;
  }
  .ant-table-tbody .ant-table-row td{
    padding-top:15px;
    padding-bottom:15px;
  }
  .anty-row-operator button{margin: 0 5px}
  .ant-btn-danger{background-color: #ffffff}

  .ant-modal-cust-warp{height: 100%}
  .ant-modal-cust-warp .ant-modal-body{height:calc(100% - 110px) !important;overflow-y: auto}
  .ant-modal-cust-warp .ant-modal-content{height:90% !important;overflow-y: hidden}
</style>