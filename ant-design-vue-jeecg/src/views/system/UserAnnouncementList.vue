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
          <a-col :span="6">
            <a-form-item label="發布人">
              <a-input placeholder="請輸入發布人" v-model="queryParam.sender"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查詢</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" @click="readAll" icon="book">全部標註已讀</a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
        <a @click="showAnnouncement(record)">查看</a>
      </span>
    </a-table>
    <show-announcement ref="ShowAnnouncement"></show-announcement>
    <dynamic-notice ref="showDynamNotice" :path="openPath" :formData="formData"/>
  </a-card>
</template>

<script>
  import { filterObj } from '@/utils/util'
  import { getAction,putAction } from '@/api/manage'
  import ShowAnnouncement from '@/components/tools/ShowAnnouncement'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import DynamicNotice from '../../components/tools/DynamicNotice'

  export default {
    name: "UserAnnouncementList",
    mixins: [JeecgListMixin],
    components: {
      DynamicNotice,
      ShowAnnouncement
    },
    data () {
      return {
        description: '系統通告表管理頁面',
        queryParam: {},
        columns: [{
          title: '標題',
          align:"center",
          dataIndex: 'titile'
        },{
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
        },{
          title: '發布人',
          align:"center",
          dataIndex: 'sender'
        },{
          title: '發布時間',
          align:"center",
          dataIndex: 'sendTime'
        },{
          title: '優先級',
          align:"center",
          dataIndex: 'priority',
          customRender:function (text) {
            if(text=='L'){
              return "低";
            }else if(text=="M"){
              return "中";
            }else if(text=="H"){
              return "高";
            } else {
              return text;
            }
          }
        },{
          title: '閱讀狀態',
          align:"center",
          dataIndex: 'readFlag',
          customRender:function (text) {
            if(text=='0'){
              return "未讀";
            }else if(text=="1"){
              return "已讀";
            } else {
              return text;
            }
          }
        },{
          title: '操作',
          dataIndex: 'action',
          align:"center",
          scopedSlots: { customRender: 'action' },
        }],
		    url: {
          list: "/sys/sysAnnouncementSend/getMyAnnouncementSend",
          editCementSend:"sys/sysAnnouncementSend/editByAnntIdAndUserId",
          readAllMsg:"sys/sysAnnouncementSend/readAll",
        },
        loading:false,
        openPath:'',
        formData:''
      }
    },
    methods: {
      handleDetail: function(record){
        this.$refs.sysAnnouncementModal.detail(record);
        this.$refs.sysAnnouncementModal.title="查看";
      },
      showAnnouncement(record){
        putAction(this.url.editCementSend,{anntId:record.anntId}).then((res)=>{
          if(res.success){
            this.loadData();
            this.syncHeadNotic(record.anntId)
          }
        });
        if(record.openType==='component'){
          this.openPath = record.openPage;
          this.formData = {id:record.busId};
          this.$refs.showDynamNotice.detail();
        }else{
          this.$refs.ShowAnnouncement.detail(record);
        }
      },
      syncHeadNotic(anntId){
        getAction("sys/annountCement/syncNotic",{anntId:anntId})
      },
      readAll(){
        var that = this;
        that.$confirm({
          title:"確認操作",
          content:"是否全部標註已讀?",
          onOk: function(){
            putAction(that.url.readAllMsg).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.syncHeadNotic();
              }
            });
          }
        });
      },
    }
  }
</script>
<style scoped>
  .ant-card-body .table-operator{
    margin-bottom: 18px;
  }
  .anty-row-operator button{margin: 0 5px}
  .ant-btn-danger{background-color: #ffffff}z

  .ant-modal-cust-warp{height: 100%}
  .ant-modal-cust-warp .ant-modal-body{height:calc(100% - 110px) !important;overflow-y: auto}
  .ant-modal-cust-warp .ant-modal-content{height:90% !important;overflow-y: hidden}
</style>