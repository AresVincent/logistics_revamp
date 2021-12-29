<template>
  <a-modal
    title="導入EXCEL"
    :width="600"
    :visible="visible"
    :confirmLoading="uploading"
    @cancel="handleClose">

    <div style="margin: 0px 0px 5px 1px" v-if="online">
      <span style="display: inline-block;height: 32px;line-height: 32px;vertical-align: middle;">是否開啟校驗:</span>
      <span style="display: inline-block;height: 32px;margin-left: 6px">
         <a-switch :checked="validateStatus==1" @change="handleChangeValidateStatus" checked-children="是" un-checked-children="否" size="small"/>
      </span>
    </div>

    <a-upload
      name="file"
      :multiple="true"
      accept=".xls,.xlsx"
      :fileList="fileList"
      :remove="handleRemove"
      :beforeUpload="beforeUpload">
      <a-button>
        <a-icon type="upload" />
        選擇導入文件
      </a-button>
    </a-upload>

    <template slot="footer">
      <a-button @click="handleClose">關閉</a-button>
      <a-button
        type="primary"
        @click="handleImport"
        :disabled="fileList.length === 0"
        :loading="uploading">
        {{ uploading ? '上傳中...' : '開始上傳' }}
      </a-button>
    </template>

  </a-modal>
</template>

<script>
  import { postAction } from '@/api/manage'
  export default {
    name: 'JImportModal',
    props:{
      url:{
        type: String,
        default: '',
        required: false
      },
      biz:{
        type: String,
        default: '',
        required: false
      },
      //是否online導入
      online:{
        type: Boolean,
        default: false,
        required: false
      }
    },
    data(){
      return {
        visible:false,
        uploading:false,
        fileList:[],
        uploadAction:'',
        foreignKeys:'',
        validateStatus: 0
      }
    },
    watch: {
      url (val) {
        if(val){
         this.uploadAction = window._CONFIG['domianURL']+val
        }
      }
    },
    created () {
      this.uploadAction = window._CONFIG['domianURL']+this.url
    },

    methods:{
      handleClose(){
        this.visible=false
      },
      show(arg){
        this.fileList = []
        this.uploading = false
        this.visible = true
        this.foreignKeys = arg;
        this.validateStatus = 0
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList
      },
      beforeUpload(file) {
        this.fileList = [...this.fileList, file]
        return false;
      },
      handleImport() {
        const { fileList } = this;
        const formData = new FormData();
        if(this.biz){
          formData.append('isSingleTableImport',this.biz);
        }
        if(this.foreignKeys && this.foreignKeys.length>0){
          formData.append('foreignKeys',this.foreignKeys);
        }
        if(this.online==true){
          formData.append('validateStatus',this.validateStatus);
        }
        fileList.forEach((file) => {
          formData.append('files[]', file);
        });
        this.uploading = true
        postAction(this.uploadAction, formData).then((res) => {
          this.uploading = false
          if(res.success){
            if(res.code == 201){
              this.errorTip(res.message, res.result)
            }else{
              this.$message.success(res.message)
            }
            this.visible=false
            this.$emit('ok')
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      // 是否開啟校驗 開關改變事件
      handleChangeValidateStatus(checked){
        this.validateStatus = checked==true?1:0
      },
      // 錯誤信息提示
      errorTip(tipMessage, fileUrl) {
        const h = this.$createElement;
        let href = window._CONFIG['domianURL'] + fileUrl
        this.$warning({
          title: '導入成功,但是有錯誤數據!',
          content: h('div', {}, [
            h('div', tipMessage),
            h('span', '具體詳情請 '),
            h('a', {
              attrs: {
                href: href,
                target: '_blank'
              },
            },'點擊下載'),
          ]),
          onOk() {},
        });
      },

    }
  }
</script>

<style scoped>

</style>