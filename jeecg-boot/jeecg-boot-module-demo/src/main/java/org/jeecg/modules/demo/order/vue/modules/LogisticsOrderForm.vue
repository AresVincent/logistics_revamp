<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="運單號" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="waybillNo">
              <a-input v-model="model.waybillNo" placeholder="請輸入運單號"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="訂單狀態" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <a-input v-model="model.status" placeholder="請輸入訂單狀態"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="派送類型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <a-input v-model="model.type" placeholder="請輸入派送類型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="物流用戶ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="userId">
              <j-search-select-tag v-model="model.userId" dict="logistics_user,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="寄件人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendName">
              <a-input v-model="model.sendName" placeholder="請輸入寄件人姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="寄件人電話" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendPhone">
              <a-input v-model="model.sendPhone" placeholder="請輸入寄件人電話"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="攬收地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendAddress">
              <a-input v-model="model.sendAddress" placeholder="請輸入攬收地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收件人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="getName">
              <a-input v-model="model.getName" placeholder="請輸入收件人姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收件人電話" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="getPhone">
              <a-input v-model="model.getPhone" placeholder="請輸入收件人電話"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="收件人地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="getAddress">
              <a-input v-model="model.getAddress" placeholder="請輸入收件人地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="自提點/自提櫃代碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="getPickuppoint">
              <a-input v-model="model.getPickuppoint" placeholder="請輸入自提點/自提櫃代碼"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="重量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="weight">
              <a-input-number v-model="model.weight" placeholder="請輸入重量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="體積" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="volume">
              <a-input v-model="model.volume" placeholder="請輸入體積"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="運費" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="price">
              <a-input-number v-model="model.price" placeholder="請輸入運費" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="下單時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendTime">
              <j-date placeholder="請選擇下單時間" v-model="model.sendTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="寬度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="width">
              <a-input-number v-model="model.width" placeholder="請輸入寬度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="長度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="length">
              <a-input-number v-model="model.length" placeholder="請輸入長度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="高度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="height">
              <a-input-number v-model="model.height" placeholder="請輸入高度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否包含電池?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="includeBattery">
              <a-input v-model="model.includeBattery" placeholder="請輸入是否包含電池?"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="簽收時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status6Time">
              <j-date placeholder="請選擇簽收時間"  v-model="model.status6Time" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否上門取件?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pickupTag">
              <a-input v-model="model.pickupTag" placeholder="請輸入是否上門取件?"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="攬收日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pickupDate">
              <j-date placeholder="請選擇攬收日期" v-model="model.pickupDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="備註" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remarks">
              <a-input v-model="model.remarks" placeholder="請輸入備註"  ></a-input>
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
    name: 'LogisticsOrderForm',
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
           userId: [
              { required: true, message: '請輸入物流用戶ID!'},
           ],
           sendName: [
              { required: true, message: '請輸入寄件人姓名!'},
           ],
           sendPhone: [
              { required: true, message: '請輸入寄件人電話!'},
           ],
           sendAddress: [
              { required: true, message: '請輸入攬收地址!'},
           ],
           getName: [
              { required: true, message: '請輸入收件人姓名!'},
           ],
           getPhone: [
              { required: true, message: '請輸入收件人電話!'},
           ],
           getAddress: [
              { required: true, message: '請輸入收件人地址!'},
           ],
        },
        url: {
          add: "/order/logisticsOrder/add",
          edit: "/order/logisticsOrder/edit",
          queryById: "/order/logisticsOrder/queryById"
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