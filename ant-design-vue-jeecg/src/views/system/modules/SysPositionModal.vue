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

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="code"
          required
          label="職務編碼">
          <a-input placeholder="請輸入職務編碼" v-model="model.code" :read-only="readOnly"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="name"
          required
          label="職務名稱">
          <a-input placeholder="請輸入職務名稱" v-model="model.name"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="postRank"
          required
          label="職級"
        >
          <j-dict-select-tag
            placeholder="請選擇職級"
            dictCode="position_rank"
            v-model="model.postRank"
          />
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { duplicateCheck } from '@/api/api'
  import JDictSelectTag from '@/components/dict/JDictSelectTag'

  let validatorCodeTimer = null

  export default {
    name: 'SysPositionModal',
    components: { JDictSelectTag },
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          code: [
              { required: true, message: '請輸入職務編碼' },
              {
                validator: (rule, value, callback) => {
                  // 函數消抖的簡單實現，防止一段時間內發送多次請求
                  if (validatorCodeTimer) {
                    // 停止上次開啟的定時器
                    clearTimeout(validatorCodeTimer)
                  }
                  validatorCodeTimer = setTimeout(() => {
                    duplicateCheck({
                      tableName: 'sys_position',
                      fieldName: 'code',
                      fieldVal: value,
                      dataId: this.model.id
                    }).then((res) => {
                      if (res.success) {
                        callback()
                      } else {
                        callback(res.message)
                      }
                    }).catch(console.error)
                  }, 300)
                }
              }
            ],
          name: [{ required: true, message: '請輸入職務名稱' }] ,
          postRank:  [{ required: true, message: '請選擇職級' }] ,
        },
        url: {
          add: '/sys/position/add',
          edit: '/sys/position/edit',
        },
        readOnly:false
      }
    },
    created() {
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.model = Object.assign({}, record)
        this.visible = true
        if(record.id){
          this.readOnly=true
        }else{
          this.readOnly=false
        }
      },
      close() {
        this.$emit('close')
        this.visible = false
        this.$refs.form.resetFields();
      },
      handleOk() {
        const that = this
        // 觸發表單驗證
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (!this.model.id) {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }

            httpAction(httpurl, this.model, method).then((res) => {
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
      handleCancel() {
        this.close()
      },


    }
  }
</script>

<style lang="less" scoped>

</style>
