<template>
  <a-form @submit="handleSubmit" :form="form" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="任務名">
          <a-input placeholder="請輸入任務名稱" v-decorator="[ 'task.name', {rules: [{ required: true, message: '請輸入任務名稱', whitespace: true}]} ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="任務描述">
          <a-input placeholder="請輸入任務描述" v-decorator="[ 'task.description', {rules: [{ required: true, message: '請輸入任務描述', whitespace: true}]} ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="執行人">
          <a-select
            placeholder="請選擇執行人"
            v-decorator="[
              'task.executor',
              {rules: [{ required: true, message: '請選擇執行人'}]}
            ]" >
            <a-select-option value="黃麗麗">黃麗麗</a-select-option>
            <a-select-option value="李大刀">李大刀</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item
          label="責任人">
          <a-select
            placeholder="請選擇責任人"
            v-decorator="[
              'task.manager',
              {rules: [{ required: true, message: '請選擇責任人'}]}
            ]" >
            <a-select-option value="王偉">王偉</a-select-option>
            <a-select-option value="李紅軍">李紅軍</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="提醒時間">
          <a-time-picker
            style="width: 100%"
            v-decorator="[
              'task.time',
              {rules: [{ required: true, message: '請選擇提醒時間'}]}
            ]" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 9, offset: 1}" :lg="{span: 10}" :md="{span: 24}" :sm="24">
        <a-form-item
          label="任務類型">
          <a-select
            placeholder="請選擇任務類型"
            v-decorator="[ 'task.type', {rules: [{ required: true, message: '請選擇任務類型'}]} ]" >
            <a-select-option value="定時執行">定時執行</a-select-option>
            <a-select-option value="周期執行">周期執行</a-select-option>
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
    name: "TaskForm",
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
      }
    }
  }
</script>

<style scoped>

</style>