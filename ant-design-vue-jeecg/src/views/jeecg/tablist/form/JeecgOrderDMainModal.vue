<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="orderMainModel" :rules="validatorRules">
        <!-- 主表單區域 -->
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="orderCode"
          label="訂單號"
          required
          hasFeedback>
          <a-input placeholder="請輸入訂單號" v-model="orderMainModel.orderCode"  />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="訂單類型">
          <a-select placeholder="請輸入訂單類型" v-model="orderMainModel.ctype">
            <a-select-option value="1">國內訂單</a-select-option>
            <a-select-option value="2">國際訂單</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="訂單日期">
          <a-date-picker showTime valueFormat='YYYY-MM-DD HH:mm:ss' v-model="orderMainModel.orderDate"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="訂單金額">
          <a-input-number style="width: 200px" v-model="orderMainModel.orderMoney" />
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="訂單備註">
          <a-input placeholder="請輸入訂單備註" v-model="orderMainModel.content"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "JeecgOrderDMainModal",
    components: {
      JDate
    },
    data() {
      return {
        title: "操作",
        visible: false,
        orderMainModel: {
          jeecgOrderCustomerList: [{}],
          jeecgOrderTicketList: [{}]
        },
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        validatorRules: {
          orderCode: [
            { required: true, message: '請輸入訂單號!' }
          ]
        },
        url: {
          add: "/test/order/add",
          edit: "/test/order/edit",
          orderCustomerList: "/test/order/listOrderCustomerByMainId",
          orderTicketList: "/test/order/listOrderTicketByMainId",
        },
      }
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.orderMainModel = Object.assign({}, record);
        console.log(this.orderMainModel)
        //初始化明細表數據
        this.visible = true;
      },
      close() {
        this.$emit('close');
        this.visible = false;
        this.$refs.form.resetFields();
      },
      handleOk() {
        const that = this;
        // 觸發表單驗證
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.orderMainModel.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }

            httpAction(httpurl, this.orderMainModel, method).then((res) => {
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
          }else{
            return false;
          }
        })
      },
      handleCancel() {
        this.close()
      }
    }
  }
</script>

<style scoped>
  .ant-btn {
    padding: 0 10px;
    margin-left: 3px;
  }

  .ant-form-item-control {
    line-height: 0px;
  }

  /** 主表單行間距 */
  .ant-form .ant-form-item {
    margin-bottom: 10px;
  }

  /** Tab頁面行間距 */
  .ant-tabs-content .ant-form-item {
    margin-bottom: 0px;
  }
</style>