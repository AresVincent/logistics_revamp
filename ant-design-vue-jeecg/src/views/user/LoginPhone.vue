<template>
  <div>
    <a-form-model ref="form" :model="model" :rules="validatorRules">
      <a-form-model-item required prop="mobile">
        <a-input v-model="model.mobile" size="large" type="text" placeholder="請輸入手機號">
          <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-model-item>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-model-item required prop="captcha">
            <a-input v-model="model.captcha" size="large" type="text" placeholder="請輸入驗證碼">
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-model-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a-button
            class="getCaptcha"
            tabindex="-1"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && '獲取驗證碼' || (state.time+' s')"></a-button>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
  import { postAction } from '@/api/manage'
  import { mapActions } from 'vuex'

  export default {
    name: 'LoginPhone',
    data(){
      return {
        model:{
          mobile: '',
          captcha: ''
        },
        //手機號登錄用
        state: {
          time: 60,
          smsSendBtn: false,
        },
        validatorRules:{
          mobile: [
            { required: true, message: '請輸入手機號碼!' },
            { validator: this.validateMobile }
          ],
          captcha: [{
            required: true, message: '請輸入驗證碼!'
          }]
        }

      }
    },
    methods:{
      ...mapActions(['PhoneLogin']),
      handleLogin(rememberMe){
        this.validateFields([ 'mobile', 'captcha' ], (err) => {
          if (!err) {
            let loginParams = {
              mobile: this.model.mobile,
              captcha: this.model.captcha,
              remember_me: rememberMe
            }
            console.log("登錄參數", loginParams)
            this.PhoneLogin(loginParams).then((res) => {
              this.$emit('success', res.result)
            }).catch((err) => {
              this.$emit('fail', err)
            });
          }else{
            this.$emit('validateFail')
          }
        })
      },
      // 校驗手機號
      validateMobile(rule,value,callback){
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)){
          callback();
        }else{
          callback("您的手機號碼格式不正確!");
        }
      },
      //獲取驗證碼
      getCaptcha (e) {
        e.preventDefault();
        let that = this;
        that.validateFields([ 'mobile' ], (err) => {
            if (!err) {
              that.state.smsSendBtn = true;
              let interval = window.setInterval(() => {
                if (that.state.time-- <= 0) {
                  that.state.time = 60;
                  that.state.smsSendBtn = false;
                  window.clearInterval(interval);
                }
              }, 1000);

              const hide = that.$message.loading('驗證碼發送中..', 0);
              let smsParams = {};
              smsParams.mobile=that.model.mobile;
              smsParams.smsmode="0";
              postAction("/sys/sms",smsParams)
                .then(res => {
                  if(!res.success){
                    setTimeout(hide, 0);
                    that.cmsFailed(res.message);
                  }
                  console.log(res);
                  setTimeout(hide, 500);
                })
                .catch(err => {
                  setTimeout(hide, 1);
                  clearInterval(interval);
                  that.state.time = 60;
                  that.state.smsSendBtn = false;
                  that.requestFailed(err);
                });
            }
          }
        );
      },
      cmsFailed(err){
        this.$notification[ 'error' ]({
          message: '獲取驗證碼失敗',
          description:err,
          duration: 4,
        });
      },
      /**
       * 驗證字段
       * @param arr
       * @param callback
       */
      validateFields(arr, callback){
        let promiseArray = []
        for(let item of arr){
          let p = new Promise((resolve, reject) => {
            this.$refs['form'].validateField(item, (err)=>{
              if(!err){
                resolve();
              }else{
                reject(err);
              }
            })
          });
          promiseArray.push(p)
        }
        Promise.all(promiseArray).then(()=>{
          callback()
        }).catch(err=>{
          callback(err)
        })
      },


    }

  }
</script>

<style scoped>
.getCaptcha{
  display: block;
  width: 100%;
  height: 40px;
}
</style>