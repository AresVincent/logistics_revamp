<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    okText="保存並安排任務"
    cancelText="關閉">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item :labelCol="labelCol"  :wrapperCol="wrapperCol" label="任務類名" prop="jobClassName" hasFeedback >
          <a-input placeholder="請輸入任務類名" v-model="model.jobClassName" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="Cron表達式" prop="cronExpression">
          <!-- <j-cron v-model="model.cronExpression"/>-->
          <j-easy-cron v-model="model.cronExpression" />
        </a-form-model-item>
        <a-form-model-item  :labelCol="labelCol" :wrapperCol="wrapperCol" label="參數" prop="parameter" >
          <a-textarea placeholder="請輸入參數" :rows="5" v-model="model.parameter" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol"  :wrapperCol="wrapperCol" label="描述" prop="description">
          <a-textarea placeholder="請輸入描述" :rows="3" v-model="model.description" />
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol"  label="狀態" prop="status">
          <j-dict-select-tag type="radioButton" v-model="model.status" dictCode="quartz_status"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  // import JCron from "@/components/jeecg/JCron";
  import cronValidator from "@/components/jeecg/JEasyCron/validator";

  export default {
    name: "QuartzJobModal",
    components: {
      // JCron,
    },
    data () {
      return {
        title:"操作",
        buttonStyle: 'solid',
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
        cron: {
          label: '',
          value: ''
        },
        confirmLoading: false,
        validatorRules: {
          cronExpression: [
            {required: true, message: '請輸入cron表達式!'},
            {validator: cronValidator,}
          ],
          jobClassName: [{required: true, message: '請輸入任務類名!'}]
        },
        url: {
          add: "/sys/quartzJob/add",
          edit: "/sys/quartzJob/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add() {
        // 統一設置默認值
        this.edit({
          cronExpression: '* * * * * ? *',
          status: 0,
        })
      },
      edit (record) {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.model = Object.assign({}, record)
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 觸發表單驗證
        this.$refs.form.validate((ok, err) => {
          if (ok) {
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

            console.log('提交參數',this.model)
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
                that.close();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },

    }
  }
</script>

<style scoped>

</style>