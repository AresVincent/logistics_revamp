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

    <s-table
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :lg="4" :md="24">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="role.actionEntitySet.length > 0">
              <a-tag color="cyan" v-for="(action, k) in role.actionEntitySet" :key="k">{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
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
      style="top: 20px;"
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
          label="角色名稱"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="起一個名字" v-model="mdl.name" id="role_name" />
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
          label="擁有權限"
          hasFeedback
        >
          <a-row :gutter="16" v-for="(permission, index) in mdl.permissions" :key="index">
            <a-col :span="4">
              {{ permission.permissionName }}：
            </a-col>
            <a-col :span="20">
              <a-checkbox-group :options="permission.actionsOptions"/>
            </a-col>
          </a-row>

        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import { getRoleList, getServiceList } from '@/api/manage'

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
            title: '角色名稱',
            dataIndex: 'name',
          },
          {
            title: '狀態',
            dataIndex: 'status'
          },
          {
            title: '創建時間',
            dataIndex: 'createTime',
            sorter: true
          }, {
            title: '操作',
            width: '150px',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
          }
        ],
        // 加載數據方法 必須為 Promise 對象
        loadData: parameter => {
          return getRoleList(parameter)
            .then(res => {
              return res.result
            })
        },

        selectedRowKeys: [],
        selectedRows: []
      }
    },
    created () {
      getServiceList().then(res => {
        console.log('getServiceList.call()', res)
      })

      getRoleList().then(res => {
        console.log('getRoleList.call()', res)
      })
    },
    methods: {
      handleEdit (record) {
        this.mdl = Object.assign({}, record)

        this.mdl.permissions.forEach(permission => {
          permission.actionsOptions = permission.actionEntitySet.map(action => {
            return { label: action.describe, value: action.action, defaultCheck: action.defaultCheck }
          })
        })

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