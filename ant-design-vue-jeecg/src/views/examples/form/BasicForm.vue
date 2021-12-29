<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="標題"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '請輸入標題' }]}
          ]"
          name="name"
          placeholder="給目標起個名字" />
      </a-form-item>
      <a-form-item
        label="起止日期"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-range-picker
          name="buildTime"
          style="width: 100%"
          v-decorator="[
            'buildTime',
            {rules: [{ required: true, message: '請選擇起止日期' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="目標描述"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="請輸入你階段性工作目標"
          v-decorator="[
            'description',
            {rules: [{ required: true, message: '請輸入目標描述' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="衡量標準"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-textarea
          rows="4"
          placeholder="請輸入衡量標準"
          v-decorator="[
            'type',
            {rules: [{ required: true, message: '請輸入衡量標準' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="客戶"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
        <a-input
          placeholder="請描述你服務的客戶，內部客戶直接 @姓名／工號"
          v-decorator="[
            'customer',
            {rules: [{ required: true, message: '請描述你服務的客戶' }]}
          ]" />
      </a-form-item>
      <a-form-item
        label="邀評人"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input placeholder="請直接 @姓名／工號，最多可邀請 5 人" />
      </a-form-item>
      <a-form-item
        label="權重"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
      >
        <a-input-number :min="0" :max="100" />
        <span> %</span>
      </a-form-item>
      <a-form-item
        label="目標公開"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
        :required="false"
        help="客戶、邀評人默認被分享"
      >
        <a-radio-group v-model="value">
          <a-radio :value="1">公開</a-radio>
          <a-radio :value="2">部分公開</a-radio>
          <a-radio :value="3">不公開</a-radio>
        </a-radio-group>
        <a-form-item>
          <a-select mode="multiple" v-if="value === 2">
            <a-select-option value="4">同事一</a-select-option>
            <a-select-option value="5">同事二</a-select-option>
            <a-select-option value="6">同事三</a-select-option>
          </a-select>
        </a-form-item>
      </a-form-item>
      <a-form-item
        :wrapperCol="{ span: 24 }"
        style="text-align: center"
      >
        <a-button htmlType="submit" type="primary">提交</a-button>
        <a-button style="margin-left: 8px">保存</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script>
  export default {
    name: 'BaseForm',
    data () {
      return {
        description: '表單頁用於向用戶收集或驗證信息，基礎表單常見於數據項較少的表單場景。',
        value: 1,

        // form
        form: this.$form.createForm(this),

      }
    },
    methods: {

      // handler
      handleSubmit (e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            // eslint-disable-next-line no-console
            console.log('Received values of form: ', values)
          }
        })
      }
    }
  }
</script>