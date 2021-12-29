<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
    cancelText="關閉">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item label="父級節點" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pid">
          <j-tree-select
            ref="treeSelect"
            placeholder="請選擇父級節點"
            v-model="model.pid"
            dict="sys_category,name,id"
            pidField="pid"
            pidValue="0"
           :disabled="disabled">
          </j-tree-select>
        </a-form-model-item>

        <a-form-model-item label="分類名稱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
          <a-input v-model="model.name" placeholder="請輸入分類名稱"></a-input>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>

  import { httpAction,getAction } from '@/api/manage'
  import JTreeSelect from '@/components/jeecg/JTreeSelect'

  export default {
    name: "SysCategoryModal",
    components: {
      JTreeSelect
    },
    data () {
      return {
        title:"操作",
        width:800,
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

        confirmLoading: false,
        validatorRules:{
          pid:{},
          name: [{ required: true, message: '請輸入類型名稱!' }]
        },
        url: {
          add: "/sys/category/add",
          edit: "/sys/category/edit",
          checkCode:"/sys/category/checkCode",
        },
        expandedRowKeys:[],
        pidField:"pid",
        subExpandedKeys:[]

      }
    },
    created () {
    },
    computed : {
      disabled() {
          return this.model.id?true : false;
      }
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.$refs.form.resetFields();
      },
      handleOk () {
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
                // close的時候清空了表單的值 導致model為空 修改值在列表頁沒有變 此處需要複製一下model
                that.submitSuccess({...this.model})
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
      submitSuccess(formData){
        if(!formData.id){
          let treeData = this.$refs.treeSelect.getCurrTreeData()
          this.expandedRowKeys=[]
          this.getExpandKeysByPid(formData[this.pidField],treeData,treeData)
          if(formData.pid && this.expandedRowKeys.length==0){
            this.expandedRowKeys = this.subExpandedKeys;
          }
          this.$emit('ok',formData,this.expandedRowKeys.reverse());
        }else{
          this.$emit('ok',formData);
      }
      },
      getExpandKeysByPid(pid,arr,all){
        if(pid && arr && arr.length>0){
          for(let i=0;i<arr.length;i++){
            if(arr[i].key==pid){
              this.expandedRowKeys.push(arr[i].key)
              this.getExpandKeysByPid(arr[i]['parentId'],all,all)
            }else{
              this.getExpandKeysByPid(pid,arr[i].children,all)
            }
          }
        }
      },

    }
  }
</script>