<template>
  <a-card :bordered="false">

    <!-- 操作按鈕區域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="primary"
        icon="delete">批量刪除
      </a-button>
    </div>

    <!-- table區域-begin -->
    <div>

      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已選擇&nbsp;<a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>項&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        :columns="columns"
        size="middle"
        :pagination="false"
        :dataSource="dataSource"
        :loading="loading"
        @expand="expandSubmenu"
        :expandedRowKeys="expandedRowKeys"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @expandedRowsChange="handleExpandedRowsChange">

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
                <a href="javascript:;" @click="handleAddSub(record)">添加下級</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="handleDataRule(record)">數據規則</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="確定刪除嗎?" @confirm="() => handleDelete(record.id)" placement="topLeft">
                  <a>刪除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <!-- 字符串超長截取省略號显示 -->
        <span slot="url" slot-scope="text">
          <j-ellipsis :value="text" :length="25"/>
        </span>
        <!-- 字符串超長截取省略號显示-->
        <span slot="component" slot-scope="text">
          <j-ellipsis :value="text"/>
        </span>
      </a-table>

    </div>
    <!-- table區域-end -->

    <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal>
    <permission-data-rule-list ref="PermissionDataRuleList" @ok="modalFormOk"></permission-data-rule-list>

  </a-card>
</template>

<script>
  import PermissionModal from './modules/PermissionModal'
  import { getSystemMenuList, getSystemSubmenu, getSystemSubmenuBatch } from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PermissionDataRuleList from './PermissionDataRuleList'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  const columns = [
    {
      title: '菜單名稱',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '菜單類型',
      dataIndex: 'menuType',
      key: 'menuType',
      customRender: function(text) {
        if (text == 0) {
          return '菜單'
        } else if (text == 1) {
          return '菜單'
        } else if (text == 2) {
          return '按鈕/權限'
        } else {
          return text
        }
      }
    },/*{
      title: '權限編碼',
      dataIndex: 'perms',
      key: 'permissionCode',
    },*/{
      title: 'icon',
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: '組件',
      dataIndex: 'component',
      key: 'component',
      scopedSlots: { customRender: 'component' }
    },
    {
      title: '路徑',
      dataIndex: 'url',
      key: 'url',
      scopedSlots: { customRender: 'url' }
    },
    {
      title: '排序',
      dataIndex: 'sortNo',
      key: 'sortNo'
    },
    {
      title: '操作',
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      align: 'center',
      width: 150
    }
  ]

  export default {
    name: 'PermissionListAsync',
    mixins: [JeecgListMixin],
    components: {
      PermissionDataRuleList,
      PermissionModal,
      JEllipsis
    },
    data() {
      return {
        description: '這是菜單管理頁面',
        // 表頭
        columns: columns,
        loading: false,
        // 展開的行，受控屬性
        expandedRowKeys: [],
        url: {
          list: '/sys/permission/list',
          delete: '/sys/permission/delete',
          deleteBatch: '/sys/permission/deleteBatch'
        }
      }
    },
    methods: {
      loadData() {
        this.loading = true
        getSystemMenuList().then((res) => {
          if (res.success) {
            this.dataSource = res.result
            return this.loadDataByExpandedRows(this.dataSource)
          }
        }).finally(()=>{
          this.loading = false
        })
      },
      expandSubmenu(expanded, record){
        if (expanded && (!record.children || record.children.length === 0)) {
          getSystemSubmenu({parentId:record.id}).then((res) => {
            if (res.success) {
              record.children = res.result
            }
          })
        }
      },
      // 根據已展開的行查詢數據（用於保存后刷新時異步加載子級的數據）
      loadDataByExpandedRows(dataList) {
        if (this.expandedRowKeys.length > 0) {
          return getSystemSubmenuBatch({ parentIds: this.expandedRowKeys.join(',') }).then((res) => {
            if (res.success) {
              let childrenMap = res.result
              let fn = (list) => {
                if(list&&list.length>0){
                  list.forEach(data => {
                    if (this.expandedRowKeys.includes(data.id)) {
                      data.children = childrenMap[data.id]
                      fn(data.children)
                    }
                  })
                }
              }
              fn(dataList)
            }
          })
        } else {
          return Promise.resolve()
        }
      },
      // 打開數據規則編輯
      handleDataRule(record) {
        this.$refs.PermissionDataRuleList.edit(record)
      },
      handleAddSub(record) {
        this.$refs.modalForm.title = "添加子菜單";
        this.$refs.modalForm.disableSubmit = false;
        this.$refs.modalForm.edit({status:'1',permsType:'1',route:true,'parentId':record.id,menuType:1});
      },
      handleExpandedRowsChange(expandedRows) {
        this.expandedRowKeys = expandedRows
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>