<template>
  <div>
    <div id="loader-wrapper">
      <div id="loader"></div>
      <div class="loader-section section-left"></div>
      <div class="loader-section section-right"></div>
      <div class="load_title">正在登錄 JeecgBoot 低代碼平台，請耐心等待</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { isOAuth2AppEnv, timeFix } from '@/utils/util'
import { INDEX_MAIN_PAGE_PATH } from '@/store/mutation-types'

export default {
  name: 'OAuth2Login',
  data() {
    return {
      env: {
        thirdApp: false,
        wxWork: false,
        dingtalk: false,
      },
    }
  },
  beforeCreate() {
    // 如果當前 不是 OAuth2APP環境，就重定向到 /user/login 頁面
    if (!isOAuth2AppEnv()) {
      this.$router.replace({path: '/user/login'})
    }
  },
  created() {
    this.checkEnv()
    this.doOAuth2Login()
  },
  methods: {
    ...mapActions(['ThirdLogin']),

    /** 檢測當前的環境 */
    checkEnv() {
      // 判斷當時是否是企業微信環境
      if (/wxwork/i.test(navigator.userAgent)) {
        this.env.thirdApp = true
        this.env.wxWork = true
      }
      // 判斷當時是否是釘釘環境
      if (/dingtalk/i.test(navigator.userAgent)) {
        this.env.thirdApp = true
        this.env.dingtalk = true
      }
    },

    /** 進行OAuth2登錄操作 */
    doOAuth2Login() {
      if (this.env.thirdApp) {
        // 判斷是否攜帶了Token，是就說明登錄成功
        if (this.$route.query.oauth2LoginToken) {
          this.thirdType = this.$route.query.thirdType
          let token = this.$route.query.oauth2LoginToken
          this.doThirdLogin(token)
        } else if (this.env.wxWork) {
          this.doWechatEnterpriseOAuth2Login()
        } else if (this.env.dingtalk) {
          this.doDingTalkOAuth2Login()
        }
      }
    },

    // 根據token執行登錄
    doThirdLogin(token) {
      let param = {}
      param.thirdType = this.thirdType
      param.token = token
      this.ThirdLogin(param).then(res => {
        if (res.success) {
          this.loginSuccess()
        } else {
          this.requestFailed(res)
        }
      })
    },
    loginSuccess() {
      // 登陸成功，重定向到主頁
      this.$router.replace({path: INDEX_MAIN_PAGE_PATH})
      // TODO 這個提示是否還需要？
      this.$notification.success({
        message: '歡迎',
        description: `${timeFix()}，歡迎回來`,
      })
    },
    requestFailed(err) {
      this.$error({
        title: '登錄失敗',
        content: ((err.response || {}).data || {}).message || err.message || '請求出現錯誤，請稍後再試',
        okText: '重新登陸',
        onOk() {
          window.location.reload()
        },
        onCancel() {
          window.location.reload()
        },
      })
    },

    /** 企業微信OAuth2登錄 */
    doWechatEnterpriseOAuth2Login() {
      this.sysOAuth2Login('wechat_enterprise')
    },

    /** 釘釘OAuth2登錄 */
    doDingTalkOAuth2Login() {
      this.sysOAuth2Login('dingtalk')
    },

    /** 後台構造oauth2登錄地址 */
    sysOAuth2Login(source) {
      let url = `${window._CONFIG['domianURL']}/sys/thirdLogin/oauth2/${source}/login`
      url += `?state=${encodeURIComponent(window.location.origin)}`
      window.location.href = url
    },

  },
}
</script>

<style scoped>

</style>