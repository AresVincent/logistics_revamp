<template>
  <a-modal
    title="重新設定密碼"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    cancelText="關閉"
    style="top:20px;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item label="用戶賬號" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="請輸入用戶賬號" v-decorator="[ 'username', {}]" :readOnly="true"/>
        </a-form-item>

        <a-form-item label="登錄密碼" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback >
          <a-input type="password" placeholder="請輸入登錄密碼" v-decorator="[ 'password', validatorRules.password]" />
        </a-form-item>

        <a-form-item label="確認密碼" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback >
          <a-input type="password" @blur="handleConfirmBlur" placeholder="請重新輸入登錄密碼" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {changePassword} from '@/api/api'

  export default {
    name: "PasswordModal",
    data () {
      return {
        visible: false,
        confirmLoading: false,
        confirmDirty: false,
        validatorRules:{
          password:{
            rules: [{
              required: true,
              pattern:/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
              message: '密碼由8位数字、大小寫字母和特殊符號組成!'
            }, {
              validator: this.validateToNextPassword,
            }],
          },
          confirmpassword:{
            rules: [{
              required: true, message: '請重新輸入登錄密碼!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          },
        },

        model: {},

        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        form:this.$form.createForm(this)
      }
    },
    created () {
      console.log("created");
    },

    methods: {
      show (username) {
        this.form.resetFields();
        this.visible = true;
        this.model.username = username;
        this.$nextTick(() => {
          this.form.setFieldsValue({username:username});
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
      },
      handleSubmit () {
        // 觸發表單驗證
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            changePassword(formData).then((res)=>{
              if(res.success){
                this.$message.success(res.message);
                this.$emit('ok');
              }else{
                this.$message.warning(res.message);
              }
            }).finally(() => {
              this.confirmLoading = false;
              this.close();
            });
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        const confirmpassword=form.getFieldValue('confirmpassword');
        console.log("confirmpassword==>",confirmpassword);
        if (value && confirmpassword && value !== confirmpassword) {
          callback('兩次輸入的密碼不一樣！');
        }
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback();
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback('兩次輸入的密碼不一樣！');
        } else {
          callback()
        }
      },
      handleConfirmBlur  (e) {
        const value = e.target.value
        this.confirmDirty = this.confirmDirty || !!value
      }
    }
  }
</script>