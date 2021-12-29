<template>
  <div class="img">
    <a-upload
      name="file"
      listType="picture-card"
      :multiple="isMultiple"
      :action="uploadAction"
      :headers="headers"
      :data="{biz:bizPath}"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :disabled="disabled"
      :isMultiple="isMultiple"

      @change="handleChange"
      @preview="handlePreview"
      :class="[!isMultiple?'imgupload':'', (!isMultiple && picUrl)?'image-upload-single-over':'' ]">
      <div>
        <!--<img v-if="!isMultiple && picUrl" :src="getAvatarView()" style="width:100%;height:100%"/>-->
        <div class="iconp">
          <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">{{ text }}</div>
        </div>
      </div>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel()">
        <img alt="example" style="width: 100%" :src="previewImage"/>
      </a-modal>
    </a-upload>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getFileAccessHttpUrl } from '@/api/manage'

  const uidGenerator=()=>{
    return '-'+parseInt(Math.random()*10000+1,10);
  }
  const getFileName=(path)=>{
    if(path.lastIndexOf("\\")>=0){
      let reg=new RegExp("\\\\","g");
      path = path.replace(reg,"/");
    }
    return path.substring(path.lastIndexOf("/")+1);
  }
  export default {
    name: 'JImageUpload',
    data(){
      return {
        uploadAction:window._CONFIG['domianURL']+"/sys/common/upload",
        uploadLoading:false,
        picUrl:false,
        headers:{},
        fileList: [],
        previewImage:"",
        previewVisible: false,
      }
    },
    props:{
      text:{
        type:String,
        required:false,
        default:"上傳"
      },
      /*這個屬性用於控制文件上傳的業務路徑*/
      bizPath:{
        type:String,
        required:false,
        default:"temp"
      },
      value:{
        type:[String,Array],
        required:false
      },
      disabled:{
        type:Boolean,
        required:false,
        default: false
      },
      isMultiple:{
        type:Boolean,
        required:false,
        default: false
      },
      //update-begin-author:wangshuai date:20201021 for:LOWCOD-969 新增number屬性，用於判斷上傳數量
      number:{
        type:Number,
        required:false,
        default:0
      }
      //update-end-author:wangshuai date:20201021 for:LOWCOD-969 新增number屬性，用於判斷上傳數量
    },
    watch:{
      value: {
        handler(val,oldValue) {
          if (val instanceof Array) {
            this.initFileList(val.join(','))
          } else {
            this.initFileList(val)
          }
          if(!val || val.length==0){
            this.picUrl = false;
          }
        },
        //立刻執行handler
        immediate: true
      }
    },
    created(){
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
    },
    methods:{
      initFileList(paths){
        if(!paths || paths.length==0){
          this.fileList = [];
          return;
        }
        this.picUrl = true;
        let fileList = [];
        let arr = paths.split(",")
        for(var a=0;a<arr.length;a++){
          let url = getFileAccessHttpUrl(arr[a]);
          fileList.push({
            uid: uidGenerator(),
            name: getFileName(arr[a]),
            status: 'done',
            url: url,
            response:{
              status:"history",
              message:arr[a]
            }
          })
        }
        this.fileList = fileList
      },
      beforeUpload: function(file){
        var fileType = file.type;
        if(fileType.indexOf('image')<0){
          this.$message.warning('請上傳圖片');
          return false;
        }
      },
      handleChange(info) {
        this.picUrl = false;
        let fileList = info.fileList
        //update-begin-author:wangshuai date:20201022 for:LOWCOD-969 判斷number是否大於0和是否多選，返回選定的元素。
        if(this.number>0 && this.isMultiple){
          fileList = fileList.slice(-this.number);
        }
        //update-end-author:wangshuai date:20201022 for:LOWCOD-969 判斷number是否大於0和是否多選，返回選定的元素。
        if(info.file.status==='done'){
          if(info.file.response.success){
            this.picUrl = true;
            fileList = fileList.map((file) => {
              if (file.response) {
                file.url = file.response.message;
              }
              return file;
            });
          }
          //this.$message.success(`${info.file.name} 上傳成功!`);
        }else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上傳失敗.`);
        }else if(info.file.status === 'removed'){
          this.handleDelete(info.file)
        }
        this.fileList = fileList
        if(info.file.status==='done' || info.file.status === 'removed'){
          this.handlePathChange()
        }
      },
      // 預覽
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      getAvatarView(){
        if(this.fileList.length>0){
          let url = this.fileList[0].url
          return getFileAccessHttpUrl(url)
        }
      },
      handlePathChange(){
        let uploadFiles = this.fileList
        let path = ''
        if(!uploadFiles || uploadFiles.length==0){
          path = ''
        }
        let arr = [];
        if(!this.isMultiple && uploadFiles.length>0){
          arr.push(uploadFiles[uploadFiles.length-1].response.message)
        }else{
          for(let a=0;a<uploadFiles.length;a++){
            // update-begin-author:taoyan date:20200819 for:【開源問題z】上傳圖片組件 LOWCOD-783
            if(uploadFiles[a].status === 'done' ) {
              arr.push(uploadFiles[a].response.message)
            }else{
              return;
            }
            // update-end-author:taoyan date:20200819 for:【開源問題z】上傳圖片組件 LOWCOD-783
          }
        }
        if(arr.length>0){
          path = arr.join(",")
        }
        this.$emit('change', path);
      },
      handleDelete(file){
        //如有需要新增 刪除邏輯
        console.log(file)
      },
      handleCancel() {
        this.close();
        this.previewVisible = false;
      },
      close () {

      },
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>

<style scoped>
  /* update--begin--autor:lvdandan-----date:20201016------for：j-image-upload圖片組件單張圖片詳情回顯空白
  * https://github.com/zhangdaiscott/jeecg-boot/issues/1810
  * https://github.com/zhangdaiscott/jeecg-boot/issues/1779
  */

  /deep/ .imgupload .iconp{padding:20px;}
  /* update--end--autor:lvdandan-----date:20201016------for：j-image-upload圖片組件單張圖片詳情回顯空白*/

  /deep/ .image-upload-single-over .ant-upload-select{display: none}
</style>
