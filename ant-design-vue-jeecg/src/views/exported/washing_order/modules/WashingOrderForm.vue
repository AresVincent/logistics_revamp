<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="洗衣類型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-search-select-tag v-model="model.type" placeholder="請輸入洗衣類型" dict="washing_type"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="運單號" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="waybillNo">
              <a-input v-model="model.waybillNo" placeholder="請輸入運單號"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="訂單號" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderNo">
              <a-input v-model="model.orderNo" placeholder="請輸入訂單號"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="訂單狀態" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderStatus">
              <j-search-select-tag v-model="model.orderStatus" placeholder="請選擇訂單狀態" dict="logistics_washing_t_dic,dic_value,dic_key"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="寄件人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="consignorName">
              <a-input v-model="model.consignorName" placeholder="請輸入寄件人姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="寄件人電話" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="consignorPhone">
              <a-input v-model="model.consignorPhone" placeholder="請輸入寄件人電話"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="洗衣服務費" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="cost">
              <a-input-number v-model="model.cost" placeholder="請輸入洗衣服務費" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收件人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="consigneeName">
              <a-input v-model="model.consigneeName" placeholder="請輸入收件人姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收件人電話" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="consigneePhone">
              <a-input v-model="model.consigneePhone" placeholder="請輸入收件人電話"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="件數" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="packageNumber">
              <a-input-number v-model="model.packageNumber" placeholder="請輸入件數" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="自提點" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pickUpPoint">
              <a-input v-model="model.pickUpPoint" placeholder="請輸入自提點"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否租用/購買洗衣袋?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rentTag">
              <j-search-select-tag v-model="model.rentTag" placeholder="請選擇是否租用/購買洗衣袋?" dict="true_or_false"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="洗衣袋費用" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="packageRentCost">
              <a-input-number v-model="model.packageRentCost" placeholder="請輸入洗衣袋費用" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="下單時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderTime">
              <j-date placeholder="請選擇下單時間" v-model="model.orderTime"  style="width: 100%" date-format="YYYY-MM-DD hh:mm:ss" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="攬收時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="collectTime">
              <j-date placeholder="請選擇攬收時間" v-model="model.collectTime"  style="width: 100%" date-format="YYYY-MM-DD hh:mm:ss" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="洗衣完成時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="washedTime">
              <j-date placeholder="請選擇洗衣完成時間" v-model="model.washedTime"  style="width: 100%" date-format="YYYY-MM-DD hh:mm:ss" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="倉庫簽入時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="warehouseReceiveTime">
              <j-date placeholder="請選擇倉庫簽入時間" v-model="model.warehouseReceiveTime"  style="width: 100%" date-format="YYYY-MM-DD hh:mm:ss" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="倉庫簽出時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="signTime">
              <j-date placeholder="請選擇倉庫簽出時間" v-model="model.signTime" date-format="YYYY-MM-DD hh:mm:ss"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收件人區域" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receiptCity">
              <a-input v-model="model.receiptCity" placeholder="請輸入收件人區域"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收件人地區" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receiptDistrict">
              <a-input v-model="model.receiptDistrict" placeholder="請輸入收件人地區"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收件人地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="receiptAddress">
              <a-input v-model="model.receiptAddress" placeholder="請輸入收件人地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否上門派送?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="homePickupTag">
              <j-search-select-tag v-model="model.homePickupTag" placeholder="請選擇是否上門派送" dict="one_or_zero"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否已付款?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="payTag">
                <j-search-select-tag v-model="model.payTag" placeholder="請選擇是否已付款?" dict="one_or_zero"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否已審核?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkTag">
              <j-search-select-tag v-model="model.checkTag" placeholder="請選擇是否已審核?" dict="one_or_zero"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="更新人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updatedBy">
              <a-input v-model="model.updatedBy" placeholder="請輸入更新人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="更新時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updatedTime">
              <j-date placeholder="請選擇更新時間" v-model="model.updatedTime" date-format="YYYY-MM-DD hh:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否刪除?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="delFlag">
              <j-search-select-tag v-model="model.delFlag" placeholder="請選擇是否刪除" dict="one_or_zero"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="支付代碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paymentCode">
                <j-search-select-tag v-model="model.paymentCode" placeholder="請選擇支付代碼" dict="common_payments,payment_description,payment_code"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="總金額" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="total">
              <a-input-number v-model="model.total" placeholder="請輸入總金額" style="width: 100%" />
            </a-form-model-item>
          </a-col>
           <a-col :span="24">
            <a-form-model-item label="收款人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="total">
              <a-select v-model="model.collectedBy" placeholder="請選擇收款人" style="width: 100%" >
                  <a-select-option value="4px">4px</a-select-option>
                  <a-select-option value="Kings">Kings</a-select-option>
                  <a-select-option value="Alita">Alita</a-select-option>
                  <a-select-option value="Other">其他</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'WashingOrderForm',
    components: {
    },
    props: {
      //表單禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
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
           orderNo: [
              { required: true, message: '請輸入訂單號!'},
           ],
           orderStatus: [
              { required: true, message: '請輸入訂單狀態!'},
           ],
           consignorName: [
              { required: true, message: '請輸入寄件人姓名!'},
           ],
           consignorPhone: [
              { required: true, message: '請輸入寄件人電話!'},
           ],
           cost: [
              { required: true, message: '請輸入洗衣服務費!'},
           ],
           consigneeName: [
              { required: true, message: '請輸入收件人姓名!'},
           ],
           consigneePhone: [
              { required: true, message: '請輸入收件人電話!'},
           ],
           packageNumber: [
              { required: true, message: '請輸入件數!'},
           ],
           pickUpPoint: [
              { required: true, message: '請輸入自提點!'},
           ],
        },
        url: {
          add: "/washing/order/add",
          edit: "/washing/order/edit",
          queryById: "/washing/order/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //備份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 觸發表單驗證
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>