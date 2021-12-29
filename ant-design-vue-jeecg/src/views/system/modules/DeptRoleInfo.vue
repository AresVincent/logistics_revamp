<template>
  <a-card :bordered="false">
    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索區域 -->
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="10" :sm="12">
            <a-form-item label="部門角色名稱" style="margin-left:8px">
              <a-input placeholder="請輸入部門角色" v-model="queryParam.roleName"></a-input>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchQuery" icon="search" style="margin-left: 18px">查詢</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>
    <!-- 操作按鈕區域 -->
    <div class="table-operator" :md="24" :sm="24">
      <a-button @click="handleAdd" type="primary" icon="plus">新建部門角色</a-button>
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
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已選擇 <a style="font-weight: 600">
          {{selectedRowKeys.length }}</a>項
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
                <a @click="handlePerssion(record)">授權</a>
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
    <sys-depart-role-modal ref="modalForm" @ok="modalFormOk"/>
    <dept-role-auth-modal ref="modalDeptRole" />
  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {getAction} from '@/api/manage'
  import SysDepartRoleModal from './SysDepartRoleModal'
  import DeptRoleAuthModal from './DeptRoleAuthModal'

  export default {
    name: 'DeptRoleInfo',
    components: { DeptRoleAuthModal, SysDepartRoleModal },
    mixins: [JeecgListMixin],
    data() {
      return {
        description: '部門角色信息',
        currentDeptId: '',
        // 表頭
        columns: [{
          title: '部門角色名稱',
          align: "center",
          dataIndex: 'roleName'
        },
        {
          title: '部門角色編碼',
          align: "center",
          dataIndex: 'roleCode'
        },
        {
          title: '部門',
          align: "center",
          dataIndex: 'departId_dictText'
        },
        {
          title: '備註',
          align: "center",
          dataIndex: 'description'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          width: 170
        }],
        url: {
          list: "/sys/sysDepartRole/list",
          delete: "/sys/sysDepartRole/delete",
          deleteBatch: "/sys/sysDepartRole/deleteBatch",
        }
      }
    },
    created() {
    },
    methods: {
      searchReset() {
        this.queryParam = {}
        this.loadData(1);
      },
      loadData(arg) {
        if (!this.url.list) {
          this.$message.error("請設置url.list屬性!")
          return
        }
        //加載數據 若傳入參數1則加載第一頁的內容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams();//查詢條件
        params.deptId = this.currentDeptId;
        getAction(this.url.list, params).then((res) => {
          if (res.success && res.result) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
        })
      },
      open(record) {
        this.currentDeptId = record.id;
        this.loadData(1);
      },
      clearList() {
        this.currentDeptId = '';
        this.dataSource = [];
      },
      hasSelectDept() {
        if (this.currentDeptId == '') {
          this.$message.error("請選擇一個部門!")
          return false;
        }
        return true;
      },
      handleEdit: function (record) {
        this.$refs.modalForm.title = "編輯";
        this.$refs.modalForm.departDisabled = true;
        this.$refs.modalForm.disableSubmit = false;
        this.$refs.modalForm.edit(record,record.departId);
      },
      handleAdd: function () {
        if (this.currentDeptId == '') {
          this.$message.error("請選擇一個部門!")
        } else {
          this.$refs.modalForm.departDisabled = true;
          this.$refs.modalForm.add(this.currentDeptId);
          this.$refs.modalForm.title = "新增";
        }
      },
      handlePerssion: function(record){
        this.$refs.modalDeptRole.show(record.id,record.departId);
      },
    }
  }
</script>

<style scoped>

</style>