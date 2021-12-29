<template>
  <a-card :bordered="false">

    <!-- 操作按鈕區域 -->
    <div class="table-operator" :md="24" :sm="24" style="margin: -25px 0px 10px 0px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>

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
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">詳情</a>
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
    <jeecgOrderCustomer-modal ref="modalForm" @ok="modalFormOk"></jeecgOrderCustomer-modal>
  </a-card>
</template>

<script>
  import JeecgOrderCustomerModal from './form/JeecgOrderCustomerModal'
  import JeecgOrderDMainList from './JeecgOrderDMainList'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage'

  export default {
    name: "JeecgOrderCustomerList",
    mixins: [JeecgListMixin],
    components: {
      JeecgOrderDMainList,
      JeecgOrderCustomerModal
    },
    data() {
      return {
        description: '訂單客戶信息',
        // 表頭
        columns: [
          {
            title: '客戶名',
            align: "center",
            width: 100,
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '性別',
            align: "center",
            dataIndex: 'sex',
            customRender: function (text) {
              if (text == 1) {
                return "男";
              } else if (text == 2) {
                return "女";
              } else {
                return text;
              }
            }
          },
          {
            title: '身份證號碼',
            align: "center",
            dataIndex: 'idcard',
          },
          {
            title: '電話',
            dataIndex: 'telphone',
            align: "center",
          },
          {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 130,
            scopedSlots: {customRender: 'action'},
          },
        ],
        url: {
          list: "/test/order/listOrderCustomerByMainId",
          delete: "/test/order/deleteCustomer",
          deleteBatch: "/test/order/deleteBatchCustomer",
        }
      }
    },
    methods: {
      loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        //update-begin--Author:kangxiaolin  Date:20190905 for：[442]主子表分開維護，生成的代碼子表的分頁改為真實的分頁--------------------
        var params = this.getQueryParams();
        getAction(this.url.list, {orderId: params.mainId, pageNo : this.ipagination.current,
          pageSize :this.ipagination.pageSize}).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          } else {
            this.dataSource = null;
          }
        })
        //update-end--Author:kangxiaolin  Date:20190905 for：[442]主子表分開維護，生成的代碼子表的分頁改為真實的分頁--------------------

      },
      getOrderMain(orderId) {
        this.queryParam.mainId = orderId;
        this.loadData(1);
      },
      handleAdd: function () {
        this.$refs.modalForm.add(this.queryParam.mainId);
        this.$refs.modalForm.title = "添加客戶信息";
      },
    }
  }
</script>
<style scoped>
  .ant-card {
    margin-left: -30px;
    margin-right: -30px;
  }
</style>