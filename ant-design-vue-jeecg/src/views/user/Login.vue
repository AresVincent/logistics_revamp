<template>
  <div class="main">
    <a-form-model class="user-layout-login" @keyup.enter.native="handleSubmit">
      <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"  @change="handleTabClick">
        <a-tab-pane key="tab1" tab="賬號密碼登錄">
          <login-account ref="alogin" @validateFail="validateFail" @success="requestSuccess" @fail="requestFailed"></login-account>
        </a-tab-pane>
<!--        <a-tab-pane key="tab2" tab="手機號登錄">-->
<!--          <login-phone ref="plogin" @validateFail="validateFail" @success="requestSuccess" @fail="requestFailed"></login-phone>-->
<!--        </a-tab-pane>-->
      </a-tabs>

      <a-form-model-item>
        <a-checkbox @change="handleRememberMeChange" default-checked>自動登錄</a-checkbox>
        <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">
          忘記密碼
        </router-link>
        <router-link :to="{ name: 'register'}" class="forge-password" style="float: right;margin-right: 10px" >
          註冊賬戶
        </router-link>
      </a-form-model-item>

      <a-form-item style="margin-top:24px">
        <a-button size="large" type="primary"  htmlType="submit"  class="login-button"  :loading="loginBtn"  @click.stop.prevent="handleSubmit" :disabled="loginBtn">確定
        </a-button>
      </a-form-item>

    </a-form-model>

    <two-step-captcha v-if="requiredTwoStepCaptcha" :visible="stepCaptchaVisible" @success="stepCaptchaSuccess" @cancel="stepCaptchaCancel"></two-step-captcha>
    <login-select-tenant ref="loginSelect" @success="loginSelectOk"></login-select-tenant>
<!--    <third-login ref="thirdLogin"></third-login>-->
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN, ENCRYPTED_STRING } from '@/store/mutation-types'
import ThirdLogin from './third/ThirdLogin'
import LoginSelectTenant from './LoginSelectTenant'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { getEncryptedString } from '@/utils/encryption/aesEncrypt'
import { timeFix } from '@/utils/util'

import LoginAccount from './LoginAccount'
import LoginPhone from './LoginPhone'

export default {
    components: {
      LoginSelectTenant,
      TwoStepCaptcha,
      ThirdLogin,
      LoginAccount,
      LoginPhone
    },
    data () {
      return {
        customActiveKey: 'tab1',
        rememberMe: true,
        loginBtn: false,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        encryptedString:{
          key:"",
          iv:"",
        },
      }
    },
    created() {
      Vue.ls.remove(ACCESS_TOKEN)
      this.getRouterData();
      this.rememberMe = true
    },
    methods:{
      handleTabClick(key){
        this.customActiveKey = key
      },
      handleRememberMeChange(e){
        this.rememberMe = e.target.checked
      },
      /**跳轉到登錄頁面的參數-賬號獲取*/
      getRouterData(){
        this.$nextTick(() => {
          let temp = this.$route.params.username || this.$route.query.username || ''
          if (temp) {
            this.$refs.alogin.acceptUsername(temp)
          }
        })
      },

      //登錄
      handleSubmit () {
        this.loginBtn = true;
        if (this.customActiveKey === 'tab1') {
          // 使用賬戶密碼登錄
          this.$refs.alogin.handleLogin(this.rememberMe)
        } else {
          //手機號碼登錄
          this.$refs.plogin.handleLogin(this.rememberMe)
        }
      },
      // 校驗失敗
      validateFail(){
        this.loginBtn = false;
      },
      // 登錄後台成功
      requestSuccess(loginResult){
        this.$refs.loginSelect.show(loginResult)
      },
      //登錄後台失敗
      requestFailed (err) {
        let description = ((err.response || {}).data || {}).message || err.message || "請求出現錯誤，請稍後再試"
        this.$notification[ 'error' ]({
          message: '登錄失敗',
          description: description,
          duration: 4,
        });
        //賬戶密碼登錄錯誤后更新驗證碼
        if(this.customActiveKey === 'tab1' && description.indexOf('密碼錯誤')>0){
          this.$refs.alogin.handleChangeCheckCode()
        }
        this.loginBtn = false;
      },
      loginSelectOk(){
        this.loginSuccess()
      },
      //登錄成功
      loginSuccess () {
        this.$router.push({ path: "/dashboard/analysis" }).catch(()=>{
          console.log('登錄跳轉首頁出錯')
        })
        this.$notification.success({
          message: '歡迎',
          description: `${timeFix()}，歡迎回來`,
        });
      },

      stepCaptchaSuccess () {
        this.loginSuccess()
      },
      stepCaptchaCancel () {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },
      //獲取密碼加密規則
      getEncrypte(){
        var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
        if(encryptedString == null){
          getEncryptedString().then((data) => {
            this.encryptedString = data
          });
        }else{
          this.encryptedString = encryptedString;
        }
      }

    }

  }
</script>
<style lang="less" scoped>
  .user-layout-login {
    label {
      font-size: 14px;
    }
  .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

  .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

  .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

    .item-icon {
        font-size: 24px;
        color: rgba(0,0,0,.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

      &:hover {
          color: #1890ff;
        }
      }

    .register {
        float: right;
      }
    }
  }
</style>
<style>
  .valid-error .ant-select-selection__placeholder{
    color: #f5222d;
  }
</style>