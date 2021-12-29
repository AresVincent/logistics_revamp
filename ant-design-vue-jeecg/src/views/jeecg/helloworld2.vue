<template>
  <div>
    hello world!
  </div>
</template>
<script>
  export default {
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