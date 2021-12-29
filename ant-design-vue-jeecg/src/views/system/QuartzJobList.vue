<template>
  <a-card :bordered="false">

    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" :model="queryParam" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="10">
            <a-form-model-item label="任務類名" prop="jobClassName">
              <a-input placeholder="請輸入任務類名" v-model="queryParam.jobClassName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-model-item label="任務狀態" prop="status">
              <a-select style="width: 220px" v-model="queryParam.status" placeholder="請選擇狀態">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="0">正常</a-select-option>
                <a-select-option value="-1">停止</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="10" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查詢</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form-model>
    </div>

    <!-- 操作按鈕區域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('定時任務信息')">導出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">導入</a-button>
      </a-upload>
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

        <!-- 字符串超長截取省略號显示-->
        <span slot="description" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>
        <span slot="parameterRender" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>


        <span slot="action" slot-scope="text, record">
          <a @click="resumeJob(record)" v-if="record.status==-1">啟動</a>
          <a @click="pauseJob(record)" v-if="record.status==0">停止</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item><a @click="executeImmediately(record)">立即執行</a></a-menu-item>
              <a-menu-item><a @click="handleEdit(record)">編輯</a></a-menu-item>
              <a-menu-item>
                <a-popconfirm title="確定刪除嗎?" @confirm="() => handleDelete(record.id)">
                  <a>刪除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

        <!-- 狀態渲染模板 -->
        <template slot="customRenderStatus" slot-scope="status">
          <a-tag v-if="status==0" color="green">已啟動</a-tag>
          <a-tag v-if="status==-1" color="orange">已暫停</a-tag>
        </template>
      </a-table>
    </div>
    <!-- table區域-end -->

    <!-- 表單區域 -->
    <quartzJob-modal ref="modalForm" @ok="modalFormOk"></quartzJob-modal>
  </a-card>
</template>

<script>
  import QuartzJobModal from './modules/QuartzJobModal'
  import { getAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: "QuartzJobList",
    mixins:[JeecgListMixin],
    components: {
      QuartzJobModal,
      JEllipsis
    },
    data () {
      return {
        description: '定時任務在線管理',
        // 查詢條件
        queryParam: {},
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
            title: '任務類名',
            align:"center",
            dataIndex: 'jobClassName',
            sorter: true,
/*            customRender:function (text) {
              return "*"+text.substring(9,text.length);
            }*/
          },
          {
            title: 'cron表達式',
            align:"center",
            dataIndex: 'cronExpression'
          },
          {
            title: '參數',
            align:"center",
            width: 150,
            dataIndex: 'parameter',
            scopedSlots: {customRender: 'parameterRender'},
          },
          {
            title: '描述',
            align:"center",
            width: 250,
            dataIndex: 'description',
            scopedSlots: {customRender: 'description'},
          },
          {
            title: '狀態',
            align:"center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'customRenderStatus' },
            filterMultiple: false,
            filters: [
              { text: '已啟動', value: '0' },
              { text: '已暫停', value: '-1' },
            ]
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            width:180,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/sys/quartzJob/list",
          delete: "/sys/quartzJob/delete",
          deleteBatch: "/sys/quartzJob/deleteBatch",
          pause: "/sys/quartzJob/pause",
          resume: "/sys/quartzJob/resume",
          exportXlsUrl: "sys/quartzJob/exportXls",
          importExcelUrl: "sys/quartzJob/importExcel",
          execute: "sys/quartzJob/execute"
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },

    methods: {

      //篩選需要重寫handleTableChange
      handleTableChange(pagination, filters, sorter) {
        //分頁、排序、篩選變化時觸發
        //TODO 篩選
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        //這種篩選方式只支持單選

        // update-begin-author:liusq date:20210624 for:前台定時任務無法翻頁  #2666
        if(filters && Object.keys(filters).length>0 && filters.status){
          this.filters.status = filters.status[0];
        }
        // update-end-author:liusq date:20210624 for:前台定時任務無法翻頁  #2666
        this.ipagination = pagination;
        this.loadData();
      },
      pauseJob: function(record){
        var that = this;
        //暫停定時任務
        this.$confirm({
          title:"確認暫停",
          content:"是否暫停選中任務?",
          onOk: function(){
            getAction(that.url.pause,{id:record.id}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              }else{
                that.$message.warning(res.message);
              }
            });
          }
        });

      },
      resumeJob: function(record){
        var that = this;
        //恢復定時任務
        this.$confirm({
          title:"確認啟動",
          content:"是否啟動選中任務?",
          onOk: function(){
            getAction(that.url.resume,{id:record.id}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              }else{
                that.$message.warning(res.message);
              }
            });
          }
        });
      },
      executeImmediately(record){
        var that = this;
        //立即執行定時任務
        this.$confirm({
          title:"確認提示",
          content:"是否立即執行任務?",
          onOk: function(){
            getAction(that.url.execute,{id:record.id}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              }else{
                that.$message.warning(res.message);
              }
            });
          }
        });
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>