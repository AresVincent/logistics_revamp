<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="關閉"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="dictName"
          required
          label="字典名稱">
          <a-input placeholder="請輸入字典名稱" v-model="model.dictName"/>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="dictCode"
          required
          label="字典編碼">
          <a-input placeholder="請輸入字典編碼" v-model="model.dictCode"/>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述">
          <a-input v-model="model.description"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { addDict, editDict, duplicateCheck } from '@/api/api'

  export default {
    name: 'DictModal',
    data() {
      return {
        value: 1,
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        confirmLoading: false,
        validatorRules: {
          dictName: [{ required: true, message: '請輸入字典名稱!' }],
          dictCode: [
            { required: true, message: '請輸入字典編碼!' },
            { validator: this.validateDictCode }]
          }
      }
    },
    created() {
    },
    methods: {
      validateDictCode(rule, value, callback) {
        // 重複校驗
        var params = {
          tableName: 'sys_dict',
          fieldName: 'dict_code',
          fieldVal: value,
          dataId: this.model.id
        }
        duplicateCheck(params).then((res) => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      },
      handleChange(value) {
        this.model.status = value
      },
      add() {
        this.edit({})
      },
      edit(record) {
        if (record.id) {
          this.visiblekey = true
        } else {
          this.visiblekey = false
        }
        this.model = Object.assign({}, record)
        this.visible = true
      },
      // 確定
      handleOk() {
        const that = this
        // 觸發表單驗證
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true
            this.model.dictName = (this.model.dictName || '').trim()
            this.model.dictCode = (this.model.dictCode || '').trim()
            this.model.description = (this.model.description || '').trim()
            let obj
            if (!this.model.id) {
              obj = addDict(this.model)
            } else {
              obj = editDict(this.model)
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }else{
            return false;
          }
        })
      },
      // 關閉
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.$refs.form.resetFields();
      }
    }
  }
</script>