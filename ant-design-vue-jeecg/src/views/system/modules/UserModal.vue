<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: 100%;overflow: auto;padding-bottom: 53px;">

    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>

    </template>

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item label="用戶賬號" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="username">
          <a-input placeholder="請輸入用戶賬號" v-model="model.username" :readOnly="!!model.id"/>
        </a-form-model-item>

        <template v-if="!model.id">
          <a-form-model-item label="登錄密碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="password" >
            <a-input type="password" placeholder="請輸入登錄密碼" v-model="model.password" />
          </a-form-model-item>

          <a-form-model-item label="確認密碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="confirmpassword" >
            <a-input type="password" @blur="handleConfirmBlur" placeholder="請重新輸入登錄密碼" v-model="model.confirmpassword"/>
          </a-form-model-item>
        </template>

        <a-form-model-item label="用戶姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="realname">
          <a-input placeholder="請輸入用戶姓名" v-model="model.realname" />
        </a-form-model-item>

        <a-form-model-item label="工號" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="workNo">
          <a-input placeholder="請輸入工號" v-model="model.workNo" />
        </a-form-model-item>

        <a-form-model-item label="職務" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-position placeholder="請選擇職務" :multiple="false" v-model="model.post"/>
        </a-form-model-item>

        <a-form-model-item label="角色分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!roleDisabled" >
          <j-multi-select-tag
            :disabled="disableSubmit"
            v-model="model.selectedroles"
            :options="rolesOptions"
            placeholder="請選擇角色">
          </j-multi-select-tag>
        </a-form-model-item>

        <!--部門分配-->
        <a-form-model-item label="部門分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled">
          <j-select-depart v-model="model.selecteddeparts" :multi="true" @back="backDepartInfo" :backDepart="true" :treeOpera="true">></j-select-depart>
        </a-form-model-item>

        <!--租戶分配-->
        <a-form-model-item label="租戶分配" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!departDisabled">
          <j-multi-select-tag
            :disabled="disableSubmit"
            v-model="model.relTenantIds"
            :options="tenantsOptions"
            placeholder="請選擇租戶">
          </j-multi-select-tag>
        </a-form-model-item>

        <a-form-model-item label="身份" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group  v-model="model.userIdentity"  @change="identityChange">
            <a-radio :value="1">普通用戶</a-radio>
            <a-radio :value="2">上級</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="負責部門" :labelCol="labelCol" :wrapperCol="wrapperCol"  v-if="departIdShow==true">
          <j-multi-select-tag
            :disabled="disableSubmit"
            v-model="model.departIds"
            :options="nextDepartOptions"
            placeholder="請選擇負責部門">
          </j-multi-select-tag>
        </a-form-model-item>

        <a-form-model-item label="頭像" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-image-upload class="avatar-uploader" text="上傳" v-model="model.avatar"></j-image-upload>
        </a-form-model-item>

        <a-form-model-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            style="width: 100%"
            placeholder="請選擇生日"
            v-model="model.birthday"
            :format="dateFormat"
            :getCalendarContainer="node => node.parentNode"/>
        </a-form-model-item>

        <a-form-model-item label="性別" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select  v-model="model.sex"  placeholder="請選擇性別" :getPopupContainer= "(target) => target.parentNode">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item label="郵箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">
          <a-input placeholder="請輸入郵箱" v-model="model.email" />
        </a-form-model-item>

        <a-form-model-item label="手機號碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
          <a-input placeholder="請輸入手機號碼" v-model="model.phone" />
        </a-form-model-item>

        <a-form-model-item label="座機" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="telephone">
          <a-input placeholder="請輸入座機" v-model="model.telephone" />
        </a-form-model-item>

        <a-form-model-item label="工作流引擎" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag  v-model="model.activitiSync"  placeholder="請選擇是否同步工作流引擎" :type="'radio'" dictCode="activiti_sync"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>


    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="確定放棄編輯？" @confirm="handleCancel" okText="確定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import moment from 'moment'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getAction } from '@/api/manage'
  import { addUser,editUser,queryUserRole,queryall } from '@/api/api'
  import { disabledAuthFilter } from "@/utils/authFilter"
  import { duplicateCheck } from '@/api/api'

  export default {
    name: "UserModal",
    components: {
    },
    data () {
      return {
        departDisabled: false, //是否是我的部門調用該頁面
        roleDisabled: false, //是否是角色維護調用該頁面
        modalWidth:800,
        drawerWidth:700,
        modaltoggleFlag:true,
        confirmDirty: false,
        userId:"", //保存用戶id
        disableSubmit:false,
        dateFormat:"YYYY-MM-DD",
        validatorRules:{
          username:[{required: true, message: '請輸入用戶賬號!'},
                    {validator: this.validateUsername,}],
          password: [{required: true,pattern:/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,message: '密碼由8位數字、大小寫字母和特殊符號組成!'},
                     {validator: this.validateToNextPassword,trigger: 'change'}],
          confirmpassword: [{required: true, message: '請重新輸入登錄密碼!',},
                            { validator: this.compareToFirstPassword,}],
          realname:[{ required: true, message: '請輸入用戶名稱!' }],
          phone: [{required: true, message: '請輸入手機號!'}, {validator: this.validatePhone}],
          email: [{validator: this.validateEmail}],
          roles:{},
          workNo:[ { required: true, message: '請輸入工號' },
                  { validator: this.validateWorkNo }],
          telephone: [{ pattern: /^852\d{8}$/, message: '請輸入正確的座機號碼' },]
        },
        departIdShow:false,
        title:"操作",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        uploadLoading:false,
        confirmLoading: false,
        headers:{},
        url: {
          fileUpload: window._CONFIG['domianURL']+"/sys/common/upload",
          userWithDepart: "/sys/user/userDepartList", // 引入為指定用戶查看部門信息需要的url
          userId:"/sys/user/generateUserId", // 引入生成添加用戶情況下的url
          syncUserByUserName:"/act/process/extActProcess/doSyncUserByUserName",//同步用戶到工作流
          queryTenantList: '/sys/tenant/queryList'
        },
        tenantsOptions: [],
        rolesOptions:[],
        nextDepartOptions:[],
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}
      this.initRoleList()
      this.initTenantList()
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    methods: {
      add () {
        this.refresh();
        this.edit({activitiSync:'1',userIdentity:1});
      },
      edit (record) {
        let that = this;
        that.visible = true;
        //根據屏幕寬度自適應抽屜寬度
        this.resetScreenSize();
        that.userId = record.id;
        that.model = Object.assign({},{selectedroles:'',selecteddeparts:''}, record);
        //身份為上級顯示負責部門，否則不顯示
        if(this.model.userIdentity==2){
          this.departIdShow=true;
        }else{
          this.departIdShow=false;
        }

        if(record.hasOwnProperty("id")){
          that.getUserRoles(record.id);
          that.getUserDeparts(record.id);
        }
        console.log('that.model=',that.model)
      },
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      //窗口最大化切換
      toggleScreen(){
        if(this.modaltoggleFlag){
          this.modalWidth = window.innerWidth;
        }else{
          this.modalWidth = 800;
        }
        this.modaltoggleFlag = !this.modaltoggleFlag;
      },
      // 根據屏幕變化,設置抽屜尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      },
      //初始化租戶字典
      initTenantList(){
        getAction(this.url.queryTenantList).then(res=>{
          if(res.success){
            this.tenantsOptions = res.result.map((item,index,arr)=>{
              let c = {label:item.name, value: item.id+""}
              return c;
            })
            console.log('this.tenantsOptions: ',this.tenantsOptions)
          }
        })
      },
      //初始化角色字典
      initRoleList(){
        queryall().then((res)=>{
          if(res.success){
            this.rolesOptions = res.result.map((item,index,arr)=>{
              let c = {label:item.roleName, value:item.id}
              return c;
            })
            console.log('this.rolesOptions: ',this.rolesOptions)
          }
        });
      },
      getUserRoles(userid){
        queryUserRole({userid:userid}).then((res)=>{
          if(res.success){
            this.model.selectedroles = res.result.join(",");
            console.log('that.model.selectedroles=',this.model.selectedroles)
          }
        });
      },
      getUserDeparts(userid){
        let that = this;
        getAction(that.url.userWithDepart,{userId:userid}).then((res)=>{
          if(res.success){
            let departOptions=[];
            let selectDepartKeys=[]
            for (let i = 0; i < res.result.length; i++) {
              selectDepartKeys.push(res.result[i].key);
              //新增負責部門選擇下拉框
              departOptions.push({
                value: res.result[i].key,
                label: res.result[i].title
              })
            }
            that.model.selecteddeparts = selectDepartKeys.join(",")
            that.nextDepartOptions=departOptions;
            console.log('that.nextDepartOptions=',that.nextDepartOptions)
          }
        })
      },
      backDepartInfo(info) {
        this.model.departIds = this.model.selecteddeparts;
        this.nextDepartOptions = info.map((item,index,arr)=>{
          let c = {label:item.text, value: item.value+""}
          return c;
        })
      },
      refresh () {
        this.userId=""
        this.nextDepartOptions=[];
        this.departIdShow=false;
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.nextDepartOptions=[];
        this.departIdShow=false;
        this.$refs.form.resetFields();
      },
      moment,
      handleSubmit () {
        const that = this;
        // 觸發表單驗證
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            //如果是上級擇傳入departIds,否則為空
            if(this.model.userIdentity!==2){
              this.model.departIds="";
            }
            let obj;
            if(!this.model.id){
              this.model.id = this.userId;
              obj=addUser(this.model);
            }else{
              obj=editUser(this.model);
            }
            obj.then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }else{
            return false;
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateToNextPassword (rule, value, callback) {
        const confirmpassword=this.model.confirmpassword;
        if (value && confirmpassword && value !== confirmpassword) {
          callback('兩次輸入的密碼不一樣！');
        }
        if (value && this.confirmDirty) {
          this.$refs.form.validateField(['confirmpassword']);
        }
        callback();
      },
      compareToFirstPassword (rule, value, callback) {
        if (value && value !== this.model.password) {
          callback('兩次輸入的密碼不一樣！');
        } else {
          callback()
        }
      },
      validatePhone(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(new RegExp(/^852\d{8}$/).test(value)){
            var params = {
              tableName: 'sys_user',
              fieldName: 'phone',
              fieldVal: value,
              dataId: this.userId
            };
            duplicateCheck(params).then((res) => {
              if (res.success) {
                callback()
              } else {
                callback("手機號已存在!")
              }
            })
          }else{
            callback("請輸入正確格式的手機號碼!");
          }
        }
      },
      validateEmail(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)){
            var params = {
              tableName: 'sys_user',
              fieldName: 'email',
              fieldVal: value,
              dataId: this.userId
            };
            duplicateCheck(params).then((res) => {
              console.log(res)
              if (res.success) {
                callback()
              } else {
                callback("郵箱已存在!")
              }
            })
          }else{
            callback("請輸入正確格式的郵箱!")
          }
        }
      },
      validateUsername(rule, value, callback){
        var params = {
          tableName: 'sys_user',
          fieldName: 'username',
          fieldVal: value,
          dataId: this.userId
        };
        duplicateCheck(params).then((res) => {
          if (res.success) {
          callback()
        } else {
          callback("用戶名已存在!")
        }
      })
      },
      validateWorkNo(rule, value, callback){
        var params = {
          tableName: 'sys_user',
          fieldName: 'work_no',
          fieldVal: value,
          dataId: this.userId
        };
        duplicateCheck(params).then((res) => {
          if (res.success) {
            callback()
          } else {
            callback("工號已存在!")
          }
        })
      },
      handleConfirmBlur(e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value
      },
      beforeUpload: function(file){
        var fileType = file.type;
        if(fileType.indexOf('image')<0){
          this.$message.warning('請上傳圖片');
          return false;
        }
        //TODO 驗證文件大小
      },
      identityChange(e){
        if(e.target.value===1){
            this.departIdShow=false;
        }else{
            this.departIdShow=true;
        }
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }
  .ant-upload-select-picture-card i {
    font-size: 49px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-table-tbody .ant-table-row td{
    padding-top:10px;
    padding-bottom:10px;
  }

  .drawer-bootom-button {
    position: absolute;
    bottom: -8px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>