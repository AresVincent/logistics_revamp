<template>
  <a-card :bordered="false">

    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :span="6">
            <a-form-item label="標題">
              <a-input placeholder="請輸入標題" v-model="queryParam.titile"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :span="6">
            <a-form-item label="內容">
              <a-input placeholder="請輸入內容" v-model="queryParam.msgContent"></a-input>
            </a-form-item>
          </a-col>-->

          <a-col :span="8">
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
      <a-button type="primary" icon="download" @click="handleExportXls('系統通告')">導出</a-button>
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
          <a  v-if="record.sendStatus == 0" @click="handleEdit(record)">編輯</a>

          <a-divider type="vertical" v-if="record.sendStatus == 0"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item v-if="record.sendStatus != 1">
                <a-popconfirm title="確定刪除嗎?" @confirm="() => handleDelete(record.id)">
                  <a>刪除</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.sendStatus == 0">
                <a-popconfirm title="確定發布嗎?" @confirm="() => releaseData(record.id)">
                  <a>發布</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item v-if="record.sendStatus == 1">
                <a-popconfirm title="確定撤銷嗎?" @confirm="() => reovkeData(record.id)">
                  <a>撤銷</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                  <a @click="handleDetail(record)">查看</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table區域-end -->

    <!-- 表單區域 -->
    <sysAnnouncement-modal ref="modalForm" @ok="modalFormOk"></sysAnnouncement-modal>
    <!-- 查看詳情 -->
    <j-modal class="detail-modal" title="查看詳情" :visible.sync="detailModal.visible" :top="50" :width="600" switchFullscreen :footer="null">
      <iframe v-if="detailModal.url" class="detail-iframe" :src="detailModal.url"/>
    </j-modal>

  </a-card>
</template>

<script>
  import SysAnnouncementModal from './modules/SysAnnouncementModal'
  import {doReleaseData, doReovkeData} from '@/api/api'
  import {getAction} from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { ACCESS_TOKEN } from '@/store/mutation-types'

  export default {
    name: "SysAnnouncementList",
    mixins: [JeecgListMixin],
    components: {
      SysAnnouncementModal
    },
    data() {
      return {
        description: '系統通告表管理頁面',
        // 查詢條件
        queryParam: {},
        // 表頭
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },

          {
            title: '標題',
            align: "center",
            dataIndex: 'titile'
          },
          {
            title: '消息類型',
            align: "center",
            dataIndex: 'msgCategory',
            customRender: function (text) {
              if (text == '1') {
                return "通知公告";
              } else if (text == "2") {
                return "系統消息";
              } else {
                return text;
              }
            }
          },
          /*{
            title: '開始時間',
            align: "center",
            dataIndex: 'startTime'
          },
          {
            title: '結束時間',
            align: "center",
            dataIndex: 'endTime'
          },*/
          {
            title: '發布人',
            align: "center",
            dataIndex: 'sender'
          },
          {
            title: '優先級',
            align: "center",
            dataIndex: 'priority',
            customRender: function (text) {
              if (text == 'L') {
                return "低";
              } else if (text == "M") {
                return "中";
              } else if (text == "H") {
                return "高";
              } else {
                return text;
              }
            }
          },
          {
            title: '通告對象',
            align: "center",
            dataIndex: 'msgType',
            customRender: function (text) {
              if (text == 'USER') {
                return "指定用戶";
              } else if (text == "ALL") {
                return "全體用戶";
              } else {
                return text;
              }
            }
          },
          {
            title: '發布狀態',
            align: "center",
            dataIndex: 'sendStatus',
            customRender: function (text) {
              if (text == 0) {
                return "未發布";
              } else if (text == 1) {
                return "已發布";
              } else if (text == 2) {
                return "已撤銷";
              } else {
                return text;
              }
            }
          },
          {
            title: '發布時間',
            align: "center",
            dataIndex: 'sendTime'
          },
          {
            title: '撤銷時間',
            align: "center",
            dataIndex: 'cancelTime'
          },
          /*{
                title: '刪除狀態（0，正常，1已刪除）',
                align:"center",
                dataIndex: 'delFlag'
              },*/
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        detailModal: {visible: false, url: '',},
        url: {
          list: "/sys/annountCement/list",
          delete: "/sys/annountCement/delete",
          deleteBatch: "/sys/annountCement/deleteBatch",
          releaseDataUrl: "/sys/annountCement/doReleaseData",
          reovkeDataUrl: "sys/annountCement/doReovkeData",
          exportXlsUrl: "sys/annountCement/exportXls",
          importExcelUrl: "sys/annountCement/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      //執行發布操作
      releaseData: function (id) {
        console.log(id);
        var that = this;
        doReleaseData({id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData(1);
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //執行撤銷操作
      reovkeData: function (id) {
        var that = this;
        doReovkeData({id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData(1);
            this.syncHeadNotic(id)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      syncHeadNotic(anntId){
        getAction("sys/annountCement/syncNotic",{anntId:anntId})
      },
      handleDetail:function(record){
        const domain = window._CONFIG['domianURL']
        const token = this.$ls.get(ACCESS_TOKEN)
        this.detailModal.url = `${domain}/sys/annountCement/show/${record.id}?token=${token}`
        this.detailModal.visible = true
      },
    }
  }
</script>
<style scoped lang="less">
  @import '~@assets/less/common.less';

  /** 查看詳情彈窗的樣式 */
  .detail-modal {
    .detail-iframe {
      border: 0;
      width: 100%;
      height: 88vh;
      min-height: 600px;
    }

    &.fullscreen .detail-iframe {
      height: 100%;
    }
  }

  .detail-modal /deep/ .ant-modal {
    top: 30px;

    .ant-modal-body {
      font-size: 0;
      padding: 0;
    }
  }

  .detail-modal.fullscreen /deep/ .ant-modal {
    top: 0;
  }

</style>