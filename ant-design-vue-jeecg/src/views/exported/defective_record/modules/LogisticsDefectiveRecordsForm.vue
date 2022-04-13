<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="公司名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="userId">
              <j-search-select-tag v-model="model.userId" dict="logistics_user,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="訂單號" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orderNo">
              <!-- <j-search-select-tag v-model="model.orderNo" dict="logistics_order,order_no,order_no"  /> -->
              <a-input v-model="model.orderNo"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="運單號" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="waybillNo">
              <a-input v-model="model.waybillNo"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="發現時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="discoverTime">
              <j-date placeholder="請選擇發現時間" v-model="model.discoverTime"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="發現地點" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="discoverLocation">
              <j-dict-select-tag type="list" v-model="model.discoverLocation" dictCode="defective_location" placeholder="請選擇發現地點" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="發生地點" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="occurLocation">
              <j-dict-select-tag type="list" v-model="model.occurLocation" dictCode="defective_location" placeholder="請選擇發生地點" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="理賠申請" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="claimApplication">
              <j-switch v-model="model.claimApplication"  ></j-switch>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="理賠申請結果" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="claimApplicationResult">
              <j-dict-select-tag type="list" v-model="model.claimApplicationResult" dictCode="sf" placeholder="請選擇理賠申請結果" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="圖片" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="imagePath">
              <j-image-upload isMultiple  v-model="model.imagePath" ></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="額外的圖片" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="extraImage">
              <j-image-upload isMultiple  v-model="model.extraImage" ></j-image-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="理賠申請表" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="claimApplicationForm">
              <j-upload v-model="model.claimApplicationForm"   ></j-upload>
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
    name: 'LogisticsDefectiveRecordsForm',
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
          add: "logistics/defective/add",
          edit: "logistics/defective/edit",
          queryById: "logistics/defective/queryById"
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