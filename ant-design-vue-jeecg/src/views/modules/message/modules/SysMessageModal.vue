<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width=650
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto;padding-bottom: 53px;">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="消息標題">
          <a-input placeholder="請輸入消息標題" v-decorator="['esTitle', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="發送內容">
          <a-input placeholder="請輸入發送內容" v-decorator="['esContent', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="發送所需參數">
          <a-input placeholder="請輸入發送所需參數Json格式" v-decorator="['esParam', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="接收人">
          <a-input placeholder="請輸入接收人" v-decorator="['esReceiver', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="發送方式">
          <j-dict-select-tag :triggerChange="true" dictCode="msgType" v-decorator="[ 'esType', {}]" placeholder="請選擇發送方式">
          </j-dict-select-tag>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="發送時間">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'esSendTime', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="發送狀態">
          <j-dict-select-tag :triggerChange="true" dictCode="msgSendStatus" v-decorator="[ 'esSendStatus', {}]" placeholder="請選擇發送狀態">
          </j-dict-select-tag>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="發送次數">
          <a-input-number v-decorator="[ 'esSendNum', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="發送失敗原因">
          <a-input v-decorator="['esResult', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="備註">
          <a-input v-decorator="['remark', {}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
    <div v-show="!disableSubmit">
      <a-button style="margin-right: .8rem" @confirm="handleCancel">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "SysMessageModal",
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        disableSubmit: true,
        url: {
          add: "/sys/message/sysMessage/add",
          edit: "/sys/message/sysMessage/edit",
        },
      }
    },
    created() {
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'esContent', 'esParam', 'esReceiver', 'esResult', 'esSendNum', 'esSendStatus', 'esTitle', 'esType', 'remark'))
          //時間格式化
          this.form.setFieldsValue({esSendTime: this.model.esSendTime ? moment(this.model.esSendTime) : null})
        });

      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 觸發表單驗證
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //時間格式化
            formData.esSendTime = formData.esSendTime ? formData.esSendTime.format('YYYY-MM-DD HH:mm:ss') : null;

            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })


          }
        })
      },
      handleCancel() {
        this.close()
      },


    }
  }
</script>

<style scoped>

</style>