<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="自提點/自提櫃" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-dict-select-tag type="list" v-model="model.type" dictCode="" placeholder="請選擇自提點/自提櫃" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="所屬快遞公司" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyId">
              <a-input-number v-model="model.companyId" placeholder="請輸入所屬快遞公司" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地區ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="areaId">
              <j-dict-select-tag type="list" v-model="model.areaId" dictCode="select id value, area text from common_area" placeholder="請選擇地區ID" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="自提點/自提櫃代碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeCode">
              <a-input v-model="model.storeCode" placeholder="請輸入自提點/自提櫃代碼"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="自提點/自提櫃名稱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeName">
              <a-input v-model="model.storeName" placeholder="請輸入自提點/自提櫃名稱"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="短地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shortAddress">
              <a-input v-model="model.shortAddress" placeholder="請輸入短地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="長地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="address">
              <a-input v-model="model.address" placeholder="請輸入長地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="英文地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="addressEn">
              <a-input v-model="model.addressEn" placeholder="請輸入英文地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="電話號碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="請輸入電話號碼"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="經度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="longitude">
              <a-input v-model="model.longitude" placeholder="請輸入經度"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="緯度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="latitude">
              <a-input v-model="model.latitude" placeholder="請輸入緯度"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="營業時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeOperationHr">
              <a-input v-model="model.storeOperationHr" placeholder="請輸入營業時間"  ></a-input>
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
    name: 'LogisticsOutletsForm',
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
           type: [
              { required: true, message: '請輸入自提點/自提櫃!'},
           ],
           companyId: [
              { required: true, message: '請輸入所屬快遞公司!'},
           ],
           areaId: [
              { required: true, message: '請輸入地區ID!'},
           ],
           address: [
              { required: true, message: '請輸入長地址!'},
           ],
           phone: [
              { required: true, message: '請輸入電話號碼!'},
           ],
           longitude: [
              { required: true, message: '請輸入經度!'},
           ],
           latitude: [
              { required: true, message: '請輸入緯度!'},
           ],
        },
        url: {
          add: "/outlet/logisticsOutlets/add",
          edit: "/outlet/logisticsOutlets/edit",
          queryById: "/outlet/logisticsOutlets/queryById"
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