<template>
  <a-card :bordered="false">

    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="12">
            <a-form-item label="賬號">
              <!--<a-input placeholder="請輸入賬號查詢" v-model="queryParam.username"></a-input>-->
              <j-input placeholder="輸入賬號模糊查詢" v-model="queryParam.username"></j-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="性別">
              <a-select v-model="queryParam.sex" placeholder="請選擇性別">
                <a-select-option value="">請選擇</a-select-option>
                <a-select-option value="1">男</a-select-option>
                <a-select-option value="2">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>


          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="真實名字">
                <a-input placeholder="請輸入真實名字" v-model="queryParam.realname"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="手機號碼">
                <a-input placeholder="請輸入手機號碼查詢" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="8">
              <a-form-item label="用戶狀態">
                <a-select v-model="queryParam.status" placeholder="請選擇">
                  <a-select-option value="">請選擇</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">凍結</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
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
      </a-form>
    </div>

    <!-- 操作按鈕區域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus" >添加用戶</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('用戶信息')">導出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">導入</a-button>
      </a-upload>
      <j-third-app-button biz-type="user" :selected-row-keys="selectedRowKeys" syncToApp syncToLocal @sync-finally="onSyncFinally"/>
      <a-button type="primary" icon="hdd" @click="recycleBinVisible=true">回收站</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            刪除
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')"/>
            凍結
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')"/>
            解凍
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
      <j-super-query :fieldList="superQueryFieldList" @handleSuperQuery="handleSuperQuery"/>
    </div>

    <!-- table區域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>已選擇&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>項&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <template slot="avatarslot" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" >編輯</a>

          <a-divider type="vertical" />

          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)">詳情</a>
              </a-menu-item>

              <a-menu-item>
                <a href="javascript:;" @click="handleChangePassword(record.username)">密碼</a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm title="確定刪除嗎?" @confirm="() => handleDelete(record.id)">
                  <a>刪除</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==1">
                <a-popconfirm title="確定凍結嗎?" @confirm="() => handleFrozen(record.id,2,record.username)">
                  <a>凍結</a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==2">
                <a-popconfirm title="確定解凍嗎?" @confirm="() => handleFrozen(record.id,1,record.username)">
                  <a>解凍</a>
                </a-popconfirm>
              </a-menu-item>

            </a-menu>
          </a-dropdown>
        </span>


      </a-table>
    </div>
    <!-- table區域-end -->

    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <!-- 用戶回收站 -->
    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import UserModal from './modules/UserModal'
  import PasswordModal from './modules/PasswordModal'
  import {putAction,getFileAccessHttpUrl} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import SysUserAgentModal from "./modules/SysUserAgentModal";
  import JInput from '@/components/jeecg/JInput'
  import UserRecycleBinModal from './modules/UserRecycleBinModal'
  import JSuperQuery from '@/components/jeecg/JSuperQuery'
  import JThirdAppButton from '@/components/jeecgbiz/thirdApp/JThirdAppButton'

  export default {
    name: "UserList",
    mixins: [JeecgListMixin],
    components: {
      JThirdAppButton,
      SysUserAgentModal,
      UserModal,
      PasswordModal,
      JInput,
      UserRecycleBinModal,
      JSuperQuery
    },
    data() {
      return {
        description: '這是用戶管理頁面',
        queryParam: {},
        recycleBinVisible: false,
        columns: [
          /*{
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },*/
          {
            title: '用戶賬號',
            align: "center",
            dataIndex: 'username',
            width: 120,
            sorter: true
          },
          {
            title: '用戶姓名',
            align: "center",
            width: 100,
            dataIndex: 'realname',
          },
          {
            title: '頭像',
            align: "center",
            width: 120,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
          },

          {
            title: '性別',
            align: "center",
            width: 80,
            dataIndex: 'sex_dictText',
            sorter: true
          },
          {
            title: '生日',
            align: "center",
            width: 100,
            dataIndex: 'birthday'
          },
          {
            title: '手機號碼',
            align: "center",
            width: 100,
            dataIndex: 'phone'
          },
          {
            title: '部門',
            align: "center",
            width: 180,
            dataIndex: 'orgCodeTxt'
          },
          {
            title: '負責部門',
            align: "center",
            width: 180,
            dataIndex: 'departIds_dictText'
          },
          {
            title: '狀態',
            align: "center",
            width: 80,
            dataIndex: 'status_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 170
          }

        ],
        superQueryFieldList: [
          { type: 'input', value: 'username', text: '用戶賬號', },
          { type: 'input', value: 'realname', text: '用戶姓名', },
          { type: 'select', value: 'sex', dbType: 'int', text: '性別', dictCode: 'sex' },
        ],
        url: {
          syncUser: "/act/process/extActProcess/doSyncUser",
          list: "/sys/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/sys/user/deleteBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar)
      },

      batchFrozen: function (status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning('請選擇一條記錄！');
          return false;
        } else {
          let ids = "";
          let that = this;
          let isAdmin = false;
          that.selectionRows.forEach(function (row) {
            if (row.username == 'admin') {
              isAdmin = true;
            }
          });
          if (isAdmin) {
            that.$message.warning('管理員賬號不允許此操作,請重新選擇！');
            return;
          }
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          that.$confirm({
            title: "確認操作",
            content: "是否" + (status == 1 ? "解凍" : "凍結") + "選中賬號?",
            onOk: function () {
              frozenBatch({ids: ids, status: status}).then((res) => {
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
      handleMenuClick(e) {
        if (e.key == 1) {
          this.batchDel();
        } else if (e.key == 2) {
          this.batchFrozen(2);
        } else if (e.key == 3) {
          this.batchFrozen(1);
        }
      },
      handleFrozen: function (id, status, username) {
        let that = this;
        //TODO 後台校驗管理員角色
        if ('admin' == username) {
          that.$message.warning('管理員賬號不允許此操作！');
          return;
        }
        frozenBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleChangePassword(username) {
        this.$refs.passwordmodal.show(username);
      },
      passwordModalOk() {
        //TODO 密碼修改完成 不需要刷新頁面，可以把datasource中的數據更新一下
      },
      onSyncFinally({isToLocal}) {
        // 同步到本地時刷新下數據
        if (isToLocal) {
          this.loadData()
        }
      },
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>