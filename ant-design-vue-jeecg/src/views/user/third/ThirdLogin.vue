<template>
  <div>
    <div class="user-login-other">
      <span>其他登錄方式</span>
      <a @click="onThirdLogin('github')" title="github"><a-icon class="item-icon" type="github"></a-icon></a>
      <a @click="onThirdLogin('wechat_enterprise')" title="企業微信"> <icon-font class="item-icon" type="icon-qiyeweixin3" /></a>
      <a @click="onThirdLogin('dingtalk')" title="釘釘"><a-icon class="item-icon" type="dingding"></a-icon></a>
      <a @click="onThirdLogin('wechat_open')" title="微信"><a-icon class="item-icon" type="wechat"></a-icon></a>
    </div>
    <!-- 第三方登錄綁定賬號密碼輸入彈框 -->
    <a-modal title="請輸入密碼" :visible="thirdPasswordShow" @ok="thirdLoginCheckPassword" @cancel="thirdLoginNoPassword">
      <a-input-password placeholder="請輸入密碼" v-model="thirdLoginPassword" />
    </a-modal>

    <!-- 第三方登錄提示是否綁定賬號彈框 -->
    <a-modal :footer="null" :closable="false" :visible="thirdConfirmShow" :class="'ant-modal-confirm'">
      <div class="ant-modal-confirm-body-wrapper">
        <div class="ant-modal-confirm-body">
          <a-icon type="question-circle" style="color:#faad14"/>
          <span class="ant-modal-confirm-title">提示</span>
          <div class="ant-modal-confirm-content">
            已有同名賬號存在,請確認是否綁定該賬號？
          </div>
        </div>
        <div class="ant-modal-confirm-btns">
          <a-button @click="thirdLoginUserCreate" :loading="thirdCreateUserLoding">創建新賬號</a-button>
          <a-button @click="thirdLoginUserBind" type="primary">確認綁定</a-button>
        </div>
      </div>
    </a-modal>

    <!-- 第三方登錄綁定手機號 -->
    <a-modal :visible="bindingPhoneModal" :class="'ant-modal-confirm'">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="thirdHandleOk">
          確定
        </a-button>
      </template>
      <div class="ant-modal-confirm-body-wrapper">
        <a-form-model-item>
          <span>綁定手機號</span>
        </a-form-model-item>
        <a-form-model-item>
          <a-input
              size="large"
              type="text"
              placeholder="手機號"
              v-model="thirdPhone">
            <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-model-item>

        <a-row :gutter="16">
          <a-col class="gutter-row" :span="16">
            <a-form-model-item>
              <a-input
                  size="large"
                  type="text"
                  placeholder="請輸入驗證碼"
                  v-model="thirdCaptcha">
                <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col class="gutter-row" :span="8">
            <a-button
                class="getCaptcha"
                tabindex="-1"
                :disabled="thirdState.smsSendBtn"
                @click.stop.prevent="getThirdCaptcha"
                v-text="!thirdState.smsSendBtn && '獲取驗證碼' || (thirdState.time+' s')"></a-button>
          </a-col>
        </a-row>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { JeecgThirdLoginMixin } from '@views/user/third/JeecgThirdLoginMixin'
import { Icon } from 'ant-design-vue';

const IconFont = Icon.createFromIconfontCN({
 // scriptUrl: '//at.alicdn.com/t/font_2316098_umqusozousr.js',
  scriptUrl: '/cdn/font-icon/font_2316098_umqusozousr.js',
});
export default {
  name: 'thirdLogin',
  mixins: [JeecgThirdLoginMixin],
  components: {
    IconFont,
  }
}
</script>

<style lang="less" scoped>
.user-login-other {
  text-align: left;
  margin-top: 24px;
  line-height: 22px;

.item-icon {
  font-size: 24px;
  color: rgba(0, 0, 0, .2);
  margin-left: 16px;
  vertical-align: middle;
  cursor: pointer;
  transition: color .3s;

&  :hover {
  color: #1890ff;
}
}
.register {
  float: right;
}
}
</style>