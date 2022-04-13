<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="自提點/自提櫃編碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeCode">
              <a-input v-model="model.storeCode" placeholder="請輸入自提點/自提櫃編碼"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="自提點/自提櫃名稱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeName">
              <a-input v-model="model.storeName" placeholder="請輸入自提點/自提櫃名稱"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="短地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeShortAddress">
              <a-input v-model="model.storeShortAddress" placeholder="請輸入短地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="完整地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeFullAddress">
              <a-input v-model="model.storeFullAddress" placeholder="請輸入完整地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="營業時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeOperationHr">
              <a-input v-model="model.storeOperationHr" placeholder="請輸入營業時間"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="陽光洗衣店編碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sunshineStoreCode">
              <a-input v-model="model.sunshineStoreCode" placeholder="請輸入陽光洗衣店編碼"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="陽光洗衣店id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sunshineStoreId">
              <a-input v-model="model.sunshineStoreId" placeholder="請輸入陽光洗衣店id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="創建人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="createUser">
              <a-input v-model="model.createUser" placeholder="請輸入創建人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="更新人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateUser">
              <a-input v-model="model.updateUser" placeholder="請輸入更新人"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="國家" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeCountry">
              <a-input v-model="model.storeCountry" placeholder="請輸入國家"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="區域" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeRegion">
              <a-input v-model="model.storeRegion" placeholder="請輸入區域"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="地區" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeCities">
              <a-input v-model="model.storeCities" placeholder="請輸入地區"  ></a-input>
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
    name: 'WashingOutletsForm',
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
        },
        url: {
          add: "/washing/outlet//add",
          edit: "/washing/outlet//edit",
          queryById: "/washing/outlet//queryById"
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