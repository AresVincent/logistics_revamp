<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="關閉">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用戶名">
          <a-input placeholder="請輸入用戶名" v-decorator="['userName', {}]" readOnly/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理人用戶名">
          <j-select-user-by-dep placeholder="請輸入代理人用戶名" v-decorator="['agentUserName', validatorRules.agentUserName]" :trigger-change="true"></j-select-user-by-dep>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理開始時間">
          <j-date
            v-decorator="[ 'startTime', validatorRules.startTime]"
            :trigger-change="true"
            :showTime="true"
            date-format="YYYY-MM-DD HH:mm:ss"
            style="width:100%"
            placeholder="請選擇開始時間" >
          </j-date>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="代理結束時間">
          <j-date
            v-decorator="[ 'endTime', validatorRules.endTime]"
            :trigger-change="true"
            :showTime="true"
            date-format="YYYY-MM-DD HH:mm:ss"
            style="width:100%"
            placeholder="請選擇結束時間" >
          </j-date>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="狀態">
          <a-radio-group class="fontiframe" name="radioGroup" v-decorator="[ 'status', {}]">
            <a-radio class="radioGroup" value="1">有效</a-radio>
            <a-radio class="radioGroup" value="0">無效</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>

    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction, getAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate.vue';
  import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'

  export default {
    name: "SysUserAgentModal",
    components: {
      JDate,
      JSelectUserByDep
    },
    data () {
      return {
        title:"操作",
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
        username:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          agentUserName:{rules: [{ required: true, message: '請輸入代理人用戶名!' }]},
          startTime:{rules: [{ required: true, message: '請輸入代理開始時間!' }]},
          endTime:{rules: [{ required: true, message: '請輸入代理結束時間!' }]},
        },
        url: {
          add: "/sys/sysUserAgent/add",
          edit: "/sys/sysUserAgent/edit",
          queryByUserName:"/sys/sysUserAgent/queryByUserName",
        },
      }
    },
    created () {
    },
    methods: {
      agentSettings(username){
        this.username = username;
        this.init();

      },
      init () {
        var params = {userName:this.username};//查詢條件
        getAction(this.url.queryByUserName,params).then((res)=>{
          if(res.success){
            console.log("獲取流程節點信息",res);
            this.edit (res.result);
          }else{
            this.edit({userName:this.username,status:"0"});
          }
        })
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'userName','agentUserName','status','startTime','endTime'))
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 觸發表單驗證
        this.form.validateFields((err, values) => {
          if (!err) {
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
            let formData = Object.assign(this.model, values);
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                //this.init();
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })



          }
        })
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>

<style scoped>

</style>