<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="主键" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dicId">
              <a-input-number v-model="model.dicId" placeholder="請輸入主键" style="width: 100%" disabled/>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="字典類型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dicTypeKey">
              <a-input v-model="model.dicTypeKey" placeholder="請輸入字典類型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="狀態碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dicKey">
              <a-input v-model="model.dicKey" placeholder="請輸入狀態碼"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="狀態名稱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dicValue">
              <a-input v-model="model.dicValue" placeholder="請輸入狀態名稱"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dicDescription">
              <a-input v-model="model.dicDescription" placeholder="請輸入描述"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="激活狀態" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <a-input v-model="model.status" placeholder="請輸入激活狀態"  ></a-input>
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
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'LogisticsWashingTDicForm',
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
           dicId: [
              { required: true, message: '請輸入主键!'},
           ],
        },
        url: {
          add: "/washing/dict/add",
          edit: "/washing/dict/edit",
          queryById: "/washing/dict/queryById"
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