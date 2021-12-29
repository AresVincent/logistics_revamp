<template>
  <div>
    <a-form style="max-width: 500px; margin: 40px auto 0;">
      <a-alert
        :closable="true"
        message="確認轉賬后，資金將直接打入對方賬戶，無法退回。"
        style="margin-bottom: 24px;"
      />
      <a-form-item
        label="付款賬戶"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        ant-design@alipay.com
      </a-form-item>
      <a-form-item
        label="收款賬戶"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        test@example.com
      </a-form-item>
      <a-form-item
        label="收款人姓名"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        Alex
      </a-form-item>
      <a-form-item
        label="轉賬金額"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}"
        class="stepFormText"
      >
        ￥ 5,000.00
      </a-form-item>
      <a-form-item :wrapperCol="{span: 19, offset: 5}">
        <a-button :loading="loading" type="primary" @click="nextStep">提交</a-button>
        <a-button style="margin-left: 8px" @click="prevStep">上一步</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  export default {
    name: "Step2",
    data () {
      return {
        loading: false
      }
    },
    methods: {
      nextStep () {
        let that = this
        that.loading = true
        setTimeout(function () {
          that.$emit('nextStep')
        }, 1500)
      },
      prevStep () {
        this.$emit('prevStep')
      }
    }
  }
</script>

<style lang="less" scoped>
  .stepFormText {
    margin-bottom: 24px;

    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 22px;
    }
  }

</style>