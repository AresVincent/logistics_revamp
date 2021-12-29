<template>
  <a-modal
    :title="title"
    :width="800"
    :ok=false
    :visible="visible"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ props: {disabled: disableSubmit} }"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="關閉">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="機構名稱"
          prop="departName"
          :hidden="false"
          hasFeedback >
          <a-input id="departName" placeholder="請輸入機構/部門名稱" v-model="model.departName"/>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" :hidden="seen" label="上級部門" hasFeedback>
        <a-tree-select
          style="width:100%"
          :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
          :treeData="departTree"
          v-model="model.parentId"
          placeholder="請選擇上級部門"
          :disabled="condition">
        </a-tree-select>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="機構類型">
         <template v-if="seen">
            <a-radio-group v-model="model.orgCategory" placeholder="請選擇機構類型">
              <a-radio value="1">
                公司
              </a-radio>
            </a-radio-group>
          </template>
          <template v-else>
            <a-radio-group v-model="model.orgCategory" placeholder="請選擇機構類型">
              <a-radio value="2">
                部門
              </a-radio>
              <a-radio value="3">
                崗位
              </a-radio>
            </a-radio-group>
       </template>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="mobile"
          label="電話">
          <a-input placeholder="請輸入電話" v-model="model.mobile"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="傳真">
          <a-input placeholder="請輸入傳真" v-model="model.fax"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="地址">
          <a-input placeholder="請輸入地址" v-model="model.address"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="排序">
          <a-input-number v-model="model.departOrder"/>
        </a-form-model-item>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="備註">
          <a-textarea placeholder="請輸入備註" v-model="model.memo"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { queryIdTree } from '@/api/api'
  import pick from 'lodash.pick'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  export default {
    name: "SysDepartModal",
    components: { ATextarea },
    data () {
      return {
        departTree:[],
        orgTypeData:[],
        phoneWarning:'',
        departName:"",
        title:"操作",
        seen:false,
        visible: false,
        condition:true,
        disableSubmit:false,
        model: {},
        defaultModel:{
          departOrder:0,
          orgCategory:'1'
        },
        menuhidden:false,
        menuusing:true,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        validatorRules:{
          departName:[{ required: true, message: '請輸入機構/部門名稱!' }],
          orgCode:[{ required: true, message: '請輸入機構編碼!' }],
          mobile: [{validator:this.validateMobile}],
          orgCategory:[{required: true, message: '請輸入機構類型!'}]
        },
        url: {
          add: "/sys/sysDepart/add",
        },
        dictDisabled:true,
      }
    },
    created () {
    },
    methods: {
      loadTreeData(){
        var that = this;
        queryIdTree().then((res)=>{
          if(res.success){
            that.departTree = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i];
              that.departTree.push(temp);
            }
          }

        })
      },
      add (depart) {
        if(depart){
          this.seen = false;
          this.dictDisabled = false;
        }else{
          this.seen = true;
          this.dictDisabled = true;
        }
        this.edit(depart);
      },
      edit (record) {
          this.visible = true;
          this.model = Object.assign({}, this.defaultModel, record)
          this.loadTreeData();
          this.model.parentId = record!=null?record.toString():null;
           if(this.seen){
             this.model.orgCategory = '1';
           }else{
             this.model.orgCategory = '2';
           }
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
        this.$refs.form.resetFields();
      },
      handleOk () {
        const that = this;
        // 觸發表單驗證
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            httpAction(this.url.add,this.model,"post").then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadTreeData();
                that.$emit('ok');
              }else{
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
      handleCancel () {
        this.close()
      },
      validateMobile(rule,value,callback){
        if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)){
          callback();
        }else{
          callback("您的手機號碼格式不正確!");
        }

      }
    }
  }
</script>

<style scoped>

</style>