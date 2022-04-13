<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail" >
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="假期代碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="holidayCode" v-has="'holiday'">
              <a-input v-model="model.holidayCode" placeholder="请输入假期代碼"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="年份" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="occurYear">
              <j-dict-select-tag type="list" v-model="model.occurYear" dictCode="year" placeholder="请选择年份" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="occurDate">
              <j-date placeholder="请选择日期" v-model="model.occurDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="假期名稱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="holidayName">
              <a-input v-model="model.holidayName" placeholder="请输入假期名稱"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="假期描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="holidayDescription">
              <a-input v-model="model.holidayDescription" placeholder="请输入假期描述"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="勞工假" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="statutoryHoliday">
              <a-input-number v-model="model.statutoryHoliday" placeholder="请输入勞工假" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="公眾假期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="publicHoliday">
              <a-input-number v-model="model.publicHoliday" placeholder="请输入公眾假期" style="width: 100%" />
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
    name: 'CommonHolidayForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
            statutoryHoliday:1,
            publicHoliday:1,
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
           holidayCode: [
              { required: true, message: '请输入假期代碼!'},
           ],
           occurDate: [
              { required: true, message: '请输入日期!'},
           ],
           holidayName: [
              { required: true, message: '请输入假期名稱!'},
           ],
           statutoryHoliday: [
              { required: true, message: '请输入勞工假!'},
           ],
           publicHoliday: [
              { required: true, message: '请输入公眾假期!'},
           ],
        },
        url: {
          add: "/common/holiday/add",
          edit: "/common/holiday/edit",
          queryById: "/common/holiday/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
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
        // 触发表单验证
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