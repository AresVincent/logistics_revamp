<template>
  <a-card :bordered="false">

    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" :model="queryParam" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="8">
            <a-form-model-item label="規則名稱" prop="ruleName">
              <a-input placeholder="請輸入規則名稱" v-model="queryParam.ruleName"/>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="規則Code" prop="ruleCode">
              <a-input placeholder="請輸入規則Code" v-model="queryParam.ruleCode"/>
            </a-form-model-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
      </a-form-model>
    </div>

    <!-- 操作按鈕區域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('編碼校驗規則')">導出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
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
    <a-alert type="info" showIcon style="margin-bottom: 16px;">
      <template slot="message">
        <span>已選擇</span>
        <a style="font-weight: 600;padding: 0 4px;">{{ selectedRowKeys.length }}</a>
        <span>項</span>
        <template v-if="selectedRowKeys.length>0">
          <a-divider type="vertical"/>
          <a @click="onClearSelected">清空</a>
        </template>
      </template>
    </a-alert>

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

      <template slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">編輯</a>
        <a-divider type="vertical"/>
        <a @click="handleTest(record)">功能測試</a>
        <a-divider type="vertical"/>
        <a-dropdown>
          <a class="ant-dropdown-link">
            <span>更多</span>
            <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a-popconfirm title="確定刪除嗎？" @confirm="handleDelete(record.id)">刪除</a-popconfirm>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>

    </a-table>
    <!-- table區域-end -->

    <!-- 表單區域 -->
    <sys-check-rule-modal ref="modalForm" @ok="modalFormOk"/>

    <sys-check-rule-test-modal ref="testModal"/>

  </a-card>
</template>

<script>
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysCheckRuleModal from './modules/SysCheckRuleModal'
  import SysCheckRuleTestModal from './modules/SysCheckRuleTestModal'

  export default {
    name: 'SysCheckRuleList',
    mixins: [JeecgListMixin],
    components: { SysCheckRuleModal, SysCheckRuleTestModal, JEllipsis },
    data() {
      return {
        description: '編碼校驗規則管理頁面',
        // 表頭
        columns: [
          {
            title: '#',
            key: 'rowIndex',
            width: 60,
            align: 'center',
            customRender: (t, r, i) => i + 1
          },
          {
            title: '規則名稱',
            align: 'center',
            dataIndex: 'ruleName'
          },
          {
            title: '規則Code',
            align: 'center',
            dataIndex: 'ruleCode'
          },
          {
            title: '規則描述',
            align: 'center',
            dataIndex: 'ruleDescription',
            customRender: (t) => (<j-ellipsis value={t} length={48}/>)
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: '/sys/checkRule/list',
          delete: '/sys/checkRule/delete',
          deleteBatch: '/sys/checkRule/deleteBatch',
          exportXlsUrl: 'sys/checkRule/exportXls',
          importExcelUrl: 'sys/checkRule/importExcel',
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
      }
    },
    methods: {
      handleTest(record) {
        this.$refs.testModal.open(record.ruleCode)
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>