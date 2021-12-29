/**
 *第三方登錄
 */
import { mapActions } from 'vuex'
import { postAction } from '@api/manage'
import { timeFix } from '@/utils/util'

export const JeecgThirdLoginMixin = {
  data() {
    return {
      //第三方登錄相關信息
      thirdLoginInfo: '',
      thirdPasswordShow: false,
      thirdLoginPassword: '',
      thirdLoginUser: '',
      thirdConfirmShow: false,
      thirdCreateUserLoding: false,
      thirdLoginState: false,
      //綁定手機號彈窗
      bindingPhoneModal: false,
      thirdPhone: '',
      thirdCaptcha: '',
      //獲取驗證碼按鈕30s之內是否可點擊
      thirdState: {
        time: 30,
        smsSendBtn: false
      },
      //第三方用戶UUID
      thirdUserUuid: '',
      thirdType: '',
      url: {
        bindingThirdPhone: '/sys/thirdLogin/bindingThirdPhone'
      }
    }
  },
  created() {
  },
  methods: {
    ...mapActions(['ThirdLogin']),
    //第三方登錄
    onThirdLogin(source) {
      let url = window._CONFIG['domianURL'] + `/sys/thirdLogin/render/${source}`
      window.open(url, `login ${source}`, 'height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      let that = this
      that.thirdType = source
      that.thirdLoginInfo = ''
      that.thirdLoginState = false
      let receiveMessage = function(event) {
        let token = event.data
        if (typeof token === 'string') {
          //如果是字符串類型 說明是token信息
          if (token === '登錄失敗') {
            that.$message.warning(token)
          } else if (token.includes('綁定手機號')) {
            that.bindingPhoneModal = true
            let strings = token.split(',')
            that.thirdUserUuid = strings[1]
          } else {
            that.doThirdLogin(token)
          }
        } else if (typeof token === 'object') {
          //對象類型 說明需要提示是否綁定現有賬號
          if (token['isObj'] === true) {
            that.thirdConfirmShow = true
            that.thirdLoginInfo = { ...token }
          }
        } else {
          that.$message.warning('不識別的信息傳遞')
        }
      }
      window.addEventListener('message', receiveMessage, false)
    },
    // 根據token執行登錄
    doThirdLogin(token) {
      if (this.thirdLoginState === false) {
        this.thirdLoginState = true
        let param={};
        param.thirdType=this.thirdType
        param.token=token
        this.ThirdLogin(param).then(res => {
          if (res.success) {
            this.loginSuccess()
          } else {
            this.requestFailed(res)
          }
        })
      }
    },
    // 綁定已有賬號 需要輸入密碼
    thirdLoginUserBind() {
      this.thirdLoginPassword = ''
      this.thirdLoginUser = this.thirdLoginInfo.uuid
      this.thirdConfirmShow = false
      this.thirdPasswordShow = true
    },
    //創建新賬號
    thirdLoginUserCreate() {
      this.thirdCreateUserLoding = true
      // 賬號名後面添加兩位隨機數
      this.thirdLoginInfo['suffix'] = parseInt(Math.random() * 98 + 1)
      //this.thirdLoginInfo.operateCode = 123 //測試校驗失敗
      postAction('/sys/third/user/create', this.thirdLoginInfo).then(res => {
        if (res.success) {
          let token = res.result
          console.log('thirdCreateNewAccount', token)
          this.doThirdLogin(token)
          this.thirdConfirmShow = false
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.thirdCreateUserLoding = false
      })
    },
    // 核實密碼
    thirdLoginCheckPassword() {
      //this.thirdLoginInfo.operateCode = 123 //測試校驗失敗
      let param = Object.assign({}, this.thirdLoginInfo, { password: this.thirdLoginPassword })
      postAction('/sys/third/user/checkPassword', param).then(res => {
        if (res.success) {
          this.thirdLoginNoPassword()
          this.doThirdLogin(res.result)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 沒有密碼 取消操作
    thirdLoginNoPassword() {
      this.thirdPasswordShow = false
      this.thirdLoginPassword = ''
      this.thirdLoginUser = ''
    },
    //獲取第三方驗證碼
    getThirdCaptcha() {
      let that = this
      if (!this.thirdPhone) {
        that.cmsFailed('請輸入手機號')
      } else {
        this.thirdState.smsSendBtn = true
        let interval = window.setInterval(() => {
          if (that.thirdState.time-- <= 0) {
            that.thirdState.time = 30
            that.thirdState.smsSendBtn = false
            window.clearInterval(interval)
          }
        }, 1000)
        const hide = this.$message.loading('驗證碼發送中..', 0)
        let smsParams = {}
        smsParams.mobile = this.thirdPhone
        smsParams.smsmode = '0'
        postAction('/sys/sms', smsParams).then(res => {
          if (!res.success) {
            setTimeout(hide, 0)
            this.cmsFailed(res.message)
          }
          setTimeout(hide, 500)
        }).catch(err => {
          setTimeout(hide, 1)
          clearInterval(interval)
          that.thirdState.time = 30
          that.thirdState.smsSendBtn = false
          this.requestFailed(err)
        })
      }
    },
    //綁定手機號點擊確定按鈕
    thirdHandleOk() {
      let bingingParams = {}
      bingingParams.mobile = this.thirdPhone
      bingingParams.captcha = this.thirdCaptcha
      bingingParams.thirdUserUuid = this.thirdUserUuid
      postAction(this.url.bindingThirdPhone, bingingParams).then(res => {
        if (res.success) {
          this.bindingPhoneModal = false
          this.doThirdLogin(res.result)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    loginSuccess () {
      // update-begin- author:sunjianlei --- date:20190812 --- for: 登錄成功后不解除禁用按鈕，防止多次點擊
      // this.loginBtn = false
      // update-end- author:sunjianlei --- date:20190812 --- for: 登錄成功后不解除禁用按鈕，防止多次點擊
      this.$router.push({ path: "/dashboard/analysis" }).catch(()=>{
        console.log('登錄跳轉首頁出錯,這個錯誤從哪裡來的')
      })
      this.$notification.success({
        message: '歡迎',
        description: `${timeFix()}，歡迎回來`,
      });
    },
    cmsFailed(err){
      this.$notification[ 'error' ]({
        message: "登錄失敗",
        description:err,
        duration: 4,
      });
    },
    requestFailed (err) {
      this.$notification[ 'error' ]({
        message: '登錄失敗',
        description: ((err.response || {}).data || {}).message || err.message || "請求出現錯誤，請稍後再試",
        duration: 4,
      });
      this.loginBtn = false;
    },
  }

}