<template>
  <a-card :bordered="false">

    <!-- 查詢區域 -->
    <!--
   -->
    <!-- 操作按鈕區域 -->
    <div class="table-operator">
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
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
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
    <sysDepart-modal ref="sysDepartModal" @ok="modalFormOk"></sysDepart-modal>
  </a-card>
</template>

<script>
  import SysDepartModal from './modules/DepartModal'
  /*  import { filterObj } from '@/utils/util'
    , queryByFactories*/
  import {queryDepartTreeList} from '@/api/api'
  import {deleteAction} from '@/api/manage'

  // 表頭
  const columns = [
    {
      title: '機構名稱',
      dataIndex: 'departName',
    },
    {
      title: '機構類型',
      align: "center",
      dataIndex: 'orgType'
    },
    {
      title: '機構編碼',
      dataIndex: 'orgCode'
    },
    {
      title: '手機號',
      dataIndex: 'mobile'
    },
    {
      title: '傳真',
      dataIndex: 'fax'
    },
    {
      title: '地址',
      dataIndex: 'address'
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'departOrder'
    },
    {
      title: '操作',
      align: "center",
      dataIndex: 'action',
      scopedSlots: {customRender: 'action'},
    }
  ];

  export default {
    name: "DepartList2",
    components: {
      SysDepartModal
    },
    data() {
      return {
        description: 'jeecg 生成SysDepart代碼管理頁面',
        // 查詢條件
        queryParam: {},
        //數據集
        factories: '',
        dataSource: [],
        columns: columns,
        // 分頁參數
        /*        ipagination:{
                  current: 1,
                  pageSize: 5,
                  pageSizeOptions: ['5', '10', '20'],
                  showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "條"
                  },
                  showQuickJumper: true,
                  showSizeChanger: true,
                  total: 0
                },*/
        isorter: {
          column: 'createTime',
          order: 'desc',
        },
        loading: false,
        selectedRowKeys: [],
        selectedRows: [],
        url: {
          list: "/sys/sysDepart/list",
          delete: "/sys/sysDepart/delete",
          deleteBatch: "/sys/sysDepart/deleteBatch",
        },

      }
    },
    created() {
      this.loadData();
    },
    methods: {
      loadData() {
        this.dataSource = [];
        queryDepartTreeList().then((res) => {
          if (res.success) {
            this.dataSource = res.result;
          }
        })

      },

      getQueryField() {
        //TODO 字段權限控制
        var str = "id,";
        for (var a = 0; a < this.columns.length; a++) {
          str += "," + this.columns[a].dataIndex;
        }
        return str;
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectionRows = selectionRows;
      },
      onClearSelected() {
        this.selectedRowKeys = [];
        this.selectionRows = [];
      },
//TODO getQueryParams
      handleDelete: function (id) {
        var that = this;
        deleteAction(that.url.delete, {id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleDetail(record) {
        this.$refs.sysDepartModal.edit(record);
        this.$refs.sysDepartModal.title = "詳情";
        this.$refs.sysDepartModal.disableSubmit = true;
      },
      batchDel: function () {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('請選擇一條記錄！');
          return;
        } else {
          var ids = "";
          for (var a = 0; a < this.selectedRowKeys.length; a++) {
            ids += this.selectedRowKeys[a] + ",";
          }
          var that = this;
          this.$confirm({
            title: "確認刪除",
            content: "是否刪除選中數據?",
            onOk: function () {
              deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      handleEdit: function (record) {
        this.$refs.sysDepartModal.edit(record);
        this.$refs.sysDepartModal.title = "編輯";
      },
      handleAdd() {
        this.$refs.sysDepartModal.add();
        this.$refs.sysDepartModal.title = "新增";
      },
      handleTableChange(pagination, filters, sorter) {
        //分頁、排序、篩選變化時觸發
        console.log(sorter);
        //TODO 篩選
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        /*this.ipagination = pagination;*/
        this.loadData();
      },
      modalFormOk() {
        // 新增/修改 成功時，重載列表
        this.loadData();
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>