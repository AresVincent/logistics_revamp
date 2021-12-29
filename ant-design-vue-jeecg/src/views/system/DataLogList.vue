<template>
  <a-card :bordered="false">
    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="表名">
              <a-input placeholder="請輸入表名" v-model="queryParam.dataTable"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="數據ID">
              <a-input placeholder="請輸入ID" v-model="queryParam.dataId"></a-input>
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
    <div class="table-operator">
      <a-button @click="handleCompare()" type="primary" icon="plus">數據比較</a-button>
    </div>

    <!--table區 -->
    <div>
      <!--已選擇的清空 -->
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已選擇&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>項&nbsp;&nbsp;
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
        :rowSelection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}"
        @change="handleTableChange"
      >
        <!-- 字符串超長截取省略號显示-->
        <span slot="dataContent" slot-scope="text, record">
          <j-ellipsis :value="text" :length="80" />
        </span>
      </a-table>
    </div>
    <data-log-modal ref="modalForm" @ok="modalFormOk"></data-log-modal>
  </a-card>
</template>

<script>
  import DataLogModal from './modules/DataLogModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: 'DataLogList',
    mixins: [JeecgListMixin],
    components: {
      JEllipsis,
      DataLogModal
    },
    data() {
      return {
        description: '數據日誌管理頁面',
        //表頭
        columns: [
          {
            title: '表名',
            align: 'center',
            dataIndex: 'dataTable',
            width: "120"
          }, {
            title: '數據ID',
            align: 'center',
            dataIndex: 'dataId',
            width: "120"
          }, {
            title: '版本號',
            align: 'center',
            dataIndex: 'dataVersion',
            width: "50"
          }, {
            title: '數據內容',
            align: 'center',
            dataIndex: 'dataContent',
            width: "150",
            scopedSlots: {customRender: 'dataContent'},
          }, {
            title: '創建人',
            align: 'center',
            dataIndex: 'createBy',
            width: "100"
          },
        ],
        url: {
          list: "/sys/dataLog/list",
        },
      }
    },
    methods: {
      handleCompare: function () {
        if (!this.selectionRows || this.selectionRows.length != 2) {
          this.openNotifIcon('請選擇兩條數據');
          return false;
        } else if (this.selectionRows[0].dataId != this.selectionRows[1].dataId) {
          this.openNotifIcon('請選擇相同的數據庫表和數據ID進行比較');
          return false;
        } else {
          this.$refs.modalForm.addModal(this.selectionRows);
          this.$refs.modalForm.title = "數據比較";
        }
      },
      openNotifIcon(msg) {
        this.$notification['warning']({
          message: '提示信息',
          description: msg,
        });
      },
    }

  }

</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>