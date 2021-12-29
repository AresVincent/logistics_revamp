<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="關閉"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form"  v-bind="layout"  :model="model" :rules="validatorRules">
        <a-form-model-item label="角色編碼" required prop="roleCode">
          <a-input v-model="model.roleCode" :disabled="roleDisabled"  placeholder="請輸入角色編碼"/>
        </a-form-model-item>
        <a-form-model-item label="角色名稱" required prop="roleName">
          <a-input v-model="model.roleName" placeholder="請輸入角色名稱"/>
        </a-form-model-item>
        <a-form-model-item label="描述" prop="description">
          <a-textarea :rows="5" v-model="model.description" placeholder="請輸入角色描述"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
  import {addRole,editRole,duplicateCheck } from '@/api/api'
  export default {
    name: "RoleModal",
    data () {
      return {
        title:"操作",
        visible: false,
        roleDisabled: false,
        model: {},
        layout: {
          labelCol: { span: 3 },
          wrapperCol: { span: 14 },
        },
        confirmLoading: false,
        validatorRules:{
          roleName: [
            { required: true, message: '請輸入角色名稱!' },
            { min: 2, max: 30, message: '長度在 2 到 30 個字符', trigger: 'blur' }
          ],
          roleCode: [
            { required: true, message: '請輸入角色名稱!'},
            { min: 0, max: 64, message: '長度不超過 64 個字符', trigger: 'blur' },
            { validator: this.validateRoleCode}
          ],
          description: [
            { min: 0, max: 126, message: '長度不超過 126 個字符', trigger: 'blur' }
          ]
        },
      }
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
        //編輯頁面禁止修改角色編碼
        if(this.model.id){
          this.roleDisabled = true;
        }else{
          this.roleDisabled = false;
        }
      },
      close () {
        this.$refs.form.clearValidate();
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 觸發表單驗證
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let obj;
            if(!this.model.id){
              obj=addRole(this.model);
            }else{
              obj=editRole(this.model);
            }
            obj.then((res)=>{
              if(res.success){
                that.$message.success(res.message);
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
      validateRoleCode(rule, value, callback){
        if(/[\u4E00-\u9FA5]/g.test(value)){
          callback("角色編碼不可輸入漢字!");
        }else{
          let params = {
            tableName: "sys_role",
            fieldName: "role_code",
            fieldVal: value,
            dataId: this.model.id,
          };
          duplicateCheck(params).then((res)=>{
            if(res.success){
              callback();
            }else{
              callback(res.message);
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>