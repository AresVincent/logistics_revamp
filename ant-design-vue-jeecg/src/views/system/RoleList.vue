<template>
  <a-card :bordered="false" class="card-area">

    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <!-- 搜索區域 -->
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="名稱" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <a-input placeholder="請輸入名稱查詢" v-model="queryParam.roleName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="10" :sm="12">
            <a-form-item label="創建時間" :labelCol="{span: 5}" :wrapperCol="{span: 18, offset: 1}">
              <j-date v-model="queryParam.createTime_begin" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="請選擇開始時間" ></j-date>
              <span style="width: 10px;">~</span>
              <j-date v-model="queryParam.createTime_end" :showTime="true" date-format="YYYY-MM-DD HH:mm:ss" style="width:45%" placeholder="請選擇結束時間"></j-date>
            </a-form-item>
          </a-col>
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-col :md="6" :sm="24">
              <a-button type="primary" @click="searchQuery">查詢</a-button>
              <a-button style="margin-left: 8px" @click="searchReset">重置</a-button>
            </a-col>
          </span>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按鈕區域 -->
    <div class="table-operator"  style="margin-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('角色信息')">導出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">導入</a-button>
      </a-upload>

      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>刪除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table區域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已選擇&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>項&nbsp;&nbsp;
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
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handlePerssion(record.id)">授權</a>
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
    <role-modal ref="modalForm" @ok="modalFormOk"></role-modal>
    <user-role-modal ref="modalUserRole"></user-role-modal>
  </a-card>
</template>

<script>
  import RoleModal from './modules/RoleModal'
  import UserRoleModal from './modules/UserRoleModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: "RoleList",
    mixins:[JeecgListMixin],
    components: {
      RoleModal,
      UserRoleModal,
      JDate
    },
    data () {
      return {

        description: '角色管理頁面',
        // 查詢條件
        queryParam: {roleName:'',},
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
            title: '角色名稱',
            align:"center",
            dataIndex: 'roleName'
          },
          {
            title: '角色編碼',
            align:"center",
            dataIndex: 'roleCode'
          },
          {
            title: '備註',
            align:"center",
            dataIndex: 'description'
          },
          {
            title: '創建時間',
            dataIndex: 'createTime',
            align:"center",
            sorter: true
          },
          {
            title: '更新時間',
            dataIndex: 'updateTime',
            align:"center",
            sorter: true
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/sys/role/list",
          delete: "/sys/role/delete",
          deleteBatch: "/sys/role/deleteBatch",
          exportXlsUrl: "/sys/role/exportXls",
          importExcelUrl: "sys/role/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handlePerssion: function(roleId){
       // alert(roleId);
        this.$refs.modalUserRole.show(roleId);
      },
      onChangeDate(date, dateString) {
        console.log(date, dateString);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>