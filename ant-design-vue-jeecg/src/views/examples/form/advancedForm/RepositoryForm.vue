<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item label="倉庫名">
          <a-input
            placeholder="請輸入倉庫名稱"
            v-decorator="[
              'repository.name',
              {rules: [{ required: true, message: '請輸入倉庫名稱', whitespace: true}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="倉庫域名">
          <a-input
            addonBefore="http://"
            addonAfter=".com"
            placeholder="請輸入"
            v-decorator="[
              'repository.domain',
              {rules: [{ required: true, message: '請輸入倉庫域名', whitespace: true}, {validator: validate}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="倉庫管理員">
          <a-select placeholder="請選擇管理員" v-decorator="[ 'repository.manager', {rules: [{ required: true, message: '請選擇管理員'}]} ]">
            <a-select-option value="王同學">王同學</a-select-option>
            <a-select-option value="李同學">李同學</a-select-option>
            <a-select-option value="黃同學">黃同學</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="審批人">
          <a-select placeholder="請選擇審批員" v-decorator="[ 'repository.auditor', {rules: [{ required: true, message: '請選擇審批員'}]} ]">
            <a-select-option value="王曉麗">王曉麗</a-select-option>
            <a-select-option value="李軍">李軍</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="生效日期">
          <a-range-picker
            style="width: 100%"
            v-decorator="[
              'repository.effectiveDate',
              {rules: [{ required: true, message: '請選擇生效日期'}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="倉庫類型">
          <a-select
            placeholder="請選擇倉庫類型"
            v-decorator="[
              'repository.type',
              {rules: [{ required: true, message: '請選擇倉庫類型'}]}
            ]" >
            <a-select-option value="公開">公開</a-select-option>
            <a-select-option value="私密">私密</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item v-if="showSubmit">
      <a-button htmlType="submit" >Submit</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  export default {
    name: "RepositoryForm",
    props: {
      showSubmit: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        form: this.$form.createForm(this)
      }
    },
    methods: {
      handleSubmit (e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$notification['error']({
              message: 'Received values of form:',
              description: values
            })
          }
        })
      },
      validate (rule, value, callback) {
        const regex = /^user-(.*)$/
        if (!regex.test(value)) {
          callback('需要以 user- 開頭')
        }
        callback()
      }
    }
  }
</script>

<style scoped>

</style>