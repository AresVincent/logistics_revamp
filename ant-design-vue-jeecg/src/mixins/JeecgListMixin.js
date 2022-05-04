/**
 * 新增修改完成調用 modalFormOk方法 編輯彈框組件ref定義為modalForm
 * 高級查詢按鈕調用 superQuery方法  高級查詢組件ref定義為superQueryModal
 * data中url定義 list為查詢列表  delete為刪除單條記錄  deleteBatch為批量刪除
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction,downFile,getFileAccessHttpUrl } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from "@/store/mutation-types"
import store from '@/store'

export const JeecgListMixin = {
  data(){
    return {
      /* 查詢條件-請不要在queryParam中聲明非字符串值的屬性 */
      queryParam: {},
      /* 數據源 */
      dataSource:[],
      /* 分頁參數 */
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "條"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序參數 */
      isorter:{
        column: 'createTime',
        order: 'desc',
      },
      /* 篩選參數 */
      filters: {},
      /* table加載狀態 */
      loading:false,
      /* table選中keys*/
      selectedRowKeys: [],
      /* table選中records*/
      selectionRows: [],
      /* 查詢摺疊 */
      toggleSearchStatus:false,
      /* 高級查詢條件生效狀態 */
      superQueryFlag:false,
      /* 高級查詢條件 */
      superQueryParams: '',
      /** 高級查詢拼接方式 */
      superQueryMatchType: 'and',
    }
  },
  created() {
      if(!this.disableMixinCreated){
        console.log(' -- mixin created -- ')
        this.loadData();
        //初始化字典配置 在自己頁面定義
        this.initDictConfig();
      }
  },
  computed: {
    //token header
    tokenHeader(){
      let head = {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)}
      let tenantid = Vue.ls.get(TENANT_ID)
      if(tenantid){
        head['tenant-id'] = tenantid
      }
      return head;
    }
  },
  methods:{
    loadData(arg) {
      if(!this.url.list){
        this.$message.error("請設置url.list屬性!")
        return
      }
      //加載數據 若傳入參數1則加載第一頁的內容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//查詢條件
      console.log('查詢條件',params);
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：適配不分頁的數據列表------------
          this.dataSource = res.result.records||res.result;
          if(res.result.total)
          {
            this.ipagination.total = res.result.total;
          }else{
            this.ipagination.total = 0;
          }
          //update-end---author:zhangyafei    Date:20201118  for：適配不分頁的數據列表------------
        }else{
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    initDictConfig(){
      console.log("--這是一個假的方法!")
    },
    handleSuperQuery(params, matchType) {
      //高級查詢方法
      console.log('參數：',params,'類型：',matchType);
      if(!params){
        this.superQueryParams=''
        this.superQueryFlag = false
      }else{
        this.superQueryFlag = true
        this.superQueryParams=JSON.stringify(params)
        this.superQueryMatchType = matchType
      }
      this.loadData(1)
    },
    getQueryParams() {
      //獲取查詢條件
      let sqp = {}
      if(this.superQueryParams){
        sqp['superQueryParams']=encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    getQueryField() {
      //TODO 字段權限控制
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    searchQuery() {
      this.loadData(1);
      // 點擊查詢清空列表選中行
      // https://gitee.com/jeecg/jeecg-boot/issues/I4KTU1
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    superQuery() {
      this.$refs.superQueryModal.show();
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
    },
    batchDel: function () {
      if(!this.url.deleteBatch){
        this.$message.error("請設置url.deleteBatch屬性!")
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('請選擇一條記錄！');
        return;
      } else {
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ",";
        }
        var that = this;
        this.$confirm({
          title: "確認刪除",
          content: "是否刪除選中數據?",
          onOk: function () {
            that.loading = true;
            deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
              if (res.success) {
                //重新計算分頁問題
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
            });
          }
        });
      }
    },
    handleDelete: function (id) {
      if(!this.url.delete){
        this.$message.error("請設置url.delete屬性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, {id: id}).then((res) => {
        if (res.success) {
          //重新計算分頁問題
          that.reCalculatePage(1)
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    reCalculatePage(count){
      //總數量-count
      let total=this.ipagination.total-count;
      //獲取刪除后的分頁數
      let currentIndex=Math.ceil(total/this.ipagination.pageSize);
      //刪除后的分頁數<所在當前頁
      if(currentIndex<this.ipagination.current){
        this.ipagination.current=currentIndex;
      }
      console.log('currentIndex',currentIndex)
    },
    handleEdit: function (record) {
      console.log(record)
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title = "編輯";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleAdd: function () {
      this.$refs.modalForm.add();
      this.$refs.modalForm.title = "新增";
      this.$refs.modalForm.disableSubmit = false;
    },
    handleTableChange(pagination, filters, sorter) {
      //分頁、排序、篩選變化時觸發
      //TODO 篩選
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
    handleToggleSearch(){
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    // 給popup查詢使用(查詢區域不支持回填多個字段，限制只返回一個字段)
    getPopupField(fields){
      return fields.split(',')[0]
    },
    modalFormOk() {
      // 新增/修改 成功時，重載列表
      this.loadData();
      //清空列表選中
      this.onClearSelected()
    },
    handleDetail:function(record){
      this.$refs.modalForm.edit(record);
      this.$refs.modalForm.title="詳情";
      this.$refs.modalForm.disableSubmit = true;
    },
    /* 導出 */
    handleExportXls2(){
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },
    handleExportXls(fileName,timeout=9000){
      if(!fileName || typeof fileName != "string"){
        fileName = "導出文件"
      }
      let param = this.getQueryParams();
      if(this.selectedRowKeys && this.selectedRowKeys.length>0){
        param['selections'] = this.selectedRowKeys.join(",")
      }
      console.log("導出參數",param)
      downFile(this.url.exportXlsUrl,param,timeout).then((data)=>{
        if (!data) {
          this.$message.warning("文件下載失敗")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下載完成移除元素
          window.URL.revokeObjectURL(url); //釋放掉blob對象
        }
      })
    },
    //4px export method
    handlePFXExportXls(fileName,timeout=9000){
      if(!fileName || typeof fileName != "string"){
        fileName = "導出文件"
      }
      let param = this.getQueryParams();
      if(this.selectedRowKeys && this.selectedRowKeys.length>0){
        param['selections'] = this.selectedRowKeys.join(",")
      }
      console.log("導出參數",param)
      downFile(this.url.exportFPXXlsUrl,param,timeout).then((data)=>{
        if (!data) {
          this.$message.warning("文件下載失敗")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data],{type: 'application/vnd.ms-excel'}), fileName+'.xls')
        }else{
          let url = window.URL.createObjectURL(new Blob([data],{type: 'application/vnd.ms-excel'}))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName+'.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下載完成移除元素
          window.URL.revokeObjectURL(url); //釋放掉blob對象
        }
      })
    },
    /* 導入 */
    handleImportExcel(info){
      this.loading = true;
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.loading = false;
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上傳成功`);
          if (info.file.response.code === 201) {
            let { message, result: { msg, fileUrl, fileName } } = info.file.response
            let href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (<div>
                  <span>{msg}</span><br/>
                  <span>具體詳情請 <a href={href} target="_blank" download={fileName}>點擊下載</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上傳成功`)
          }
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`);
        }
      } else if (info.file.status === 'error') {
        this.loading = false;
        if (info.file.response.status === 500) {
          let data = info.file.response
          const token = Vue.ls.get(ACCESS_TOKEN)
          if (token && data.message.includes("Token失效")) {
            this.$error({
              title: '登錄已過期',
              content: '很抱歉，登錄已過期，請重新登錄',
              okText: '重新登錄',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  window.location.reload();
                })
              }
            })
          }
        } else {
          this.$message.error(`文件上傳失敗: ${info.file.msg} `);
        }
      }
    },
    /* 圖片預覽 */
    getImgView(text){
      if(text && text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      return getFileAccessHttpUrl(text)
    },
    /* 文件下載 */
    // update--autor:lvdandan-----date:20200630------for：修改下載文件方法名uploadFile改為downloadFile------
    downloadFile(text){
      if(!text){
        this.$message.warning("未知的文件")
        return;
      }
      if(text.indexOf(",")>0){
        text = text.substring(0,text.indexOf(","))
      }
      let url = getFileAccessHttpUrl(text)
      window.open(url);
    },
  }

}