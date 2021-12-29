<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色ID">
              <a-input placeholder="請輸入"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="狀態">
              <a-select placeholder="請選擇" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">關閉</a-select-option>
                <a-select-option value="2">運行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary">查詢</a-button>
              <a-button style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table :columns="columns" :data="loadData">

      <span slot="actions" slot-scope="text, record">
        <a-tag v-for="(action, index) in record.actionList" :key="index">{{ action.describe }}</a-tag>
      </span>

      <span slot="status" slot-scope="text">
        {{ text | statusFilter }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">編輯</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">詳情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">刪除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-modal
      title="操作"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="唯一識別碼"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="唯一識別碼" v-model="mdl.id" id="no" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="權限名稱"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="起一個名字" v-model="mdl.name" id="permission_name" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="狀態"
          hasFeedback
          validateStatus="warning"
        >
          <a-select v-model="mdl.status">
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="2">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-textarea :rows="5" v-model="mdl.describe" placeholder="..." id="describe"/>
        </a-form-item>

        <a-divider />

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="賦予權限"
          hasFeedback
        >
          <a-select
            style="width: 100%"
            mode="multiple"
            v-model="mdl.actions"
            :allowClear="true"
          >
            <a-select-option v-for="(action, index) in permissionList" :key="index" :value="action.value">{{ action.label }}</a-select-option>
          </a-select>
        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  import STable from '@/components/table/'

  export default {
    name: "TableList",
    components: {
      STable
    },
    data () {
      return {
        description: '列表使用場景：後台管理中的權限管理以及角色管理，可用於基於 RBAC 設計的角色權限控制，顆粒度細到每一個操作類型。',

        visible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form: null,
        mdl: {},

        // 高級搜索 展開/關閉
        advanced: false,
        // 查詢參數
        queryParam: {},
        // 表頭
        columns: [
          {
            title: '唯一識別碼',
            dataIndex: 'id'
          },
          {
            title: '權限名稱',
            dataIndex: 'name',
          },
          {
            title: '可操作權限',
            dataIndex: 'actions',
            scopedSlots: { customRender: 'actions' },
          },
          {
            title: '狀態',
            dataIndex: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
          }
        ],
        // 向後端拉取可以用的操作列表
        permissionList: null,
        // 加載數據方法 必須為 Promise 對象
        loadData: parameter => {
          return this.$http.get('/mock/api/permission', {
            params: Object.assign(parameter, this.queryParam)
          }).then(res => {
            let result = res.result
            result.data.map(permission => {
                permission.actionList = JSON.parse(permission.actionData)
                return permission
              })
            return result
          })
        },

        selectedRowKeys: [],
        selectedRows: []
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          1: '正常',
          2: '禁用'
        }
        return statusMap[status]
      }
    },
    created () {
      this.loadPermissionList()
    },
    methods: {
      loadPermissionList () {
        // permissionList
        new Promise((resolve => {
          const data = [
            { label: '新增', value: 'add', defaultChecked: false },
            { label: '查詢', value: 'get', defaultChecked: false },
            { label: '修改', value: 'update', defaultChecked: false },
            { label: '列表', value: 'query', defaultChecked: false },
            { label: '刪除', value: 'delete', defaultChecked: false },
            { label: '導入', value: 'import', defaultChecked: false },
            { label: '導出', value: 'export', defaultChecked: false }
          ]
          setTimeout(resolve(data), 1500)
        })).then(res => {
          this.permissionList = res
        })
      },
      handleEdit (record) {
        this.mdl = Object.assign({}, record)
        console.log(this.mdl)
        this.visible = true
      },
      handleOk () {

      },
      onChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
    },
    watch: {
      /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
    }
  }
</script>