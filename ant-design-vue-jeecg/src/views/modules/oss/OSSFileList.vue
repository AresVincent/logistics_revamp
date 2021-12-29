<template>
  <a-card :bordered="false">
    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="文件名稱">
              <a-input placeholder="請輸入文件名稱" v-model="queryParam.fileName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="文件地址">
              <a-input placeholder="請輸入文件地址" v-model="queryParam.url"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
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
      <!--      <a-button type="primary" icon="download" @click="handleExportXls('文件列表')">導出</a-button>-->
      <a-upload
          name="file"
          :multiple="false"
          :action="uploadAction"
          :headers="tokenHeader"
          :showUploadList="false"
          :beforeUpload="beforeUpload"
          @change="handleChange">
        <a-button>
          <a-icon type="upload"/>
          OSS文件上傳
        </a-button>
      </a-upload>

      <a-upload
        name="file"
        :multiple="false"
        :action="minioUploadAction"
        :headers="tokenHeader"
        :showUploadList="false"
        :beforeUpload="beforeUpload"
        @change="handleChange">
        <a-button>
          <a-icon type="upload"/>
          MINIO文件上傳
        </a-button>
      </a-upload>
    </div>

    <!-- table區域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已選擇 <a
          style="font-weight: 600">{{
        selectedRowKeys.length }}</a>項
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
          <a @click="handlePreview(record)">預覽</a>
          <a-divider type="vertical"/>
          <a @click="ossDelete(record.id)">刪除</a>
        </span>

      </a-table>
    </div>
    <!-- table區域-end -->
  </a-card>
</template>

<script>
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "OSSFileList",
    mixins: [JeecgListMixin],
    data() {
      return {
        description: '文件列表',
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
            title: '文件名稱',
            align: "center",
            dataIndex: 'fileName'
          },
          {
            title: '文件地址',
            align: "center",
            dataIndex: 'url'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          upload: "/sys/oss/file/upload",
          list: "/sys/oss/file/list",
          delete: "/sys/oss/file/delete",
          minioUpload: "/sys/upload/uploadMinio"
        }
      }
    },
    computed: {
      uploadAction() {
        return window._CONFIG['domianURL'] + this.url.upload;
      },
      minioUploadAction() {
        return window._CONFIG['domianURL'] + this.url.minioUpload;
      },
    },
    methods: {
      beforeUpload(file) {
        var fileType = file.type;
        if (fileType === 'image') {
          if (fileType.indexOf('image') < 0) {
            this.$message.warning('請上傳圖片');
            return false;
          }
        } else if (fileType === 'file') {
          if (fileType.indexOf('image') >= 0) {
            this.$message.warning('請上傳文件');
            return false;
          }
        }
        return true
      },
      handleChange(info) {
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            this.loadData()
            this.$message.success(`${info.file.name} 上傳成功!`);
          } else {
            this.$message.error(`${info.file.response.message}`);
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.response.message}`);
        }
      },
      ossDelete(id) {
        var that = this;
        that.$confirm({
          title: "確認刪除",
          content: "是否刪除選中文件?",
          onOk: function () {
            that.handleDelete(id)
          }
        });
      },
      handlePreview(record) {
        if (record && record.url) {
          let url = window._CONFIG['onlinePreviewDomainURL'] + '?url=' + encodeURIComponent(record.url)
          window.open(url, '_blank')
        }
      }
    }
  }
</script>

<style scoped>
  @import '~@assets/less/common.less';
</style>
