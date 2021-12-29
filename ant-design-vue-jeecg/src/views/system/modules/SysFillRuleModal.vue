<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="關閉">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="規則名稱" prop="ruleName">
          <a-input placeholder="請輸入規則名稱" v-model="model.ruleName"/>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol"  :wrapperCol="wrapperCol" label="規則Code"  prop="ruleCode" >
          <a-input placeholder="請輸入規則Code" :disabled="disabledCode" v-model="model.ruleCode"/>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="規則實現類" prop="ruleClass" >
          <a-input placeholder="請輸入規則實現類" v-model="model.ruleClass"/>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="規則參數" prop="ruleParams">
          <a-textarea placeholder="請輸入規則參數" :rows="5" v-model="model.ruleParams"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'SysFillRuleModal',
    components: {},
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        labelCol: { xs: { span: 24 }, sm: { span: 5 } },
        wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },

        confirmLoading: false,
        validatorRules: {
          ruleName: [{ required: true, message: '規則名稱不能為空' }],
          ruleCode: [
            { required: true, message: '規則Code不能為空' },
            { validator: (rule, value, callback) => validateDuplicateValue('sys_fill_rule', 'rule_code', value, this.model.id, callback) }
          ],
          ruleClass: [{ required: true, message: '規則實現類不能為空' }],
          ruleParams: [{
            validator: (rule, value, callback) => {

              try {
                let json = JSON.parse(value)
                if (json instanceof Array) {
                  callback('只能傳遞JSON對象，不能傳遞JSON數組')
                } else if (json instanceof Object) {
                  callback()
                } else {
                  callback('請輸入JSON字符串')
                }
              } catch {
                callback('請輸入JSON字符串')
              }
            }
          }],
        },
        url: {
          add: '/sys/fillRule/add',
          edit: '/sys/fillRule/edit',
        },
      }
    },
    computed: {
      disabledCode() {
        return !!this.model.id
      }
    },
    created() {
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.visible = true
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.model = Object.assign({}, record)
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        const that = this
        // 觸發表單驗證
        this.$refs.form.validate((ok, err) => {
          if (ok) {
            that.confirmLoading = true
            let httpUrl = this.url.add, method = 'post'
            if (this.model.id) {
              httpUrl = this.url.edit
              method = 'put'
            }

            httpAction(httpUrl, this.model, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
            })
          }
        })
      },
      handleCancel() {
        this.close()
      }

    }
  }
</script>

<style lang="less" scoped>

</style>