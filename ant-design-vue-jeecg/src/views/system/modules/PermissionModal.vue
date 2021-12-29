<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading">

    <div :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}">
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item label="菜單類型" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-radio-group @change="onChangeMenuType" v-model="model.menuType">
            <a-radio :value="0">一級菜單</a-radio>
            <a-radio :value="1">子菜單</a-radio>
            <a-radio :value="2">按鈕/權限</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="menuLabel"
          prop="name"
          hasFeedback >
          <a-input placeholder="請輸入菜單名稱" v-model="model.name" :readOnly="disableSubmit"/>
        </a-form-model-item>


        <a-form-model-item
          v-show="model.menuType!=0"
          label="上級菜單"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :validate-status="validateStatus"
          :hasFeedback="true"
          :required="true">
          <span slot="help">{{ validateStatus=='error'?'請選擇上級菜單':'&nbsp;&nbsp;' }}</span>
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            :treeData="treeData"
            v-model="model.parentId"
            placeholder="請選擇父級菜單"
            :disabled="disableSubmit"
            @change="handleParentIdChange">
          </a-tree-select>
        </a-form-model-item>

        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="url"
          label="菜單路徑">
          <a-input placeholder="請輸入菜單路徑" v-model="model.url" :readOnly="disableSubmit"/>
        </a-form-model-item>

        <a-form-model-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="component"
          label="前端組件">
          <a-input placeholder="請輸入前端組件" v-model="model.component" :readOnly="disableSubmit"/>
        </a-form-model-item>

        <a-form-model-item
          v-show="model.menuType==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="默認跳轉地址">
          <a-input placeholder="請輸入路由參數 redirect" v-model="model.redirect" :readOnly="disableSubmit"/>
        </a-form-model-item>

        <a-form-model-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="perms"
          label="授權標識">
          <a-input placeholder="請輸入授權標識, 如: user:list" v-model="model.perms" :readOnly="disableSubmit"/>
        </a-form-model-item>

        <a-form-model-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="授權策略">
          <j-dict-select-tag  v-model="model.permsType" placeholder="請選擇授權策略" :type="'radio'"  dictCode="global_perms_type"/>


        </a-form-model-item>
        <a-form-model-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="狀態">
          <j-dict-select-tag v-model="model.status" placeholder="請選擇狀態" :type="'radio'" dictCode="valid_status"/>

        </a-form-model-item>

        <a-form-model-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="菜單圖標">
          <a-input placeholder="點擊選擇圖標" v-model="model.icon" :readOnly="disableSubmit">
            <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
          </a-input>
        </a-form-model-item>

        <a-form-model-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="sortNo"
          label="排序">
          <a-input-number placeholder="請輸入菜單排序" v-model="model.sortNo" style="width: 200px" :readOnly="disableSubmit"/>
        </a-form-model-item>

        <a-form-model-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否路由菜單">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="model.route"/>
        </a-form-model-item>

        <a-form-model-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="隱藏路由">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="model.hidden"/>
        </a-form-model-item>

        <a-form-model-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="是否緩存路由">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="model.keepAlive"/>
        </a-form-model-item>


        <a-form-model-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="聚合路由">
          <a-switch checkedChildren="是" unCheckedChildren="否" v-model="model.alwaysShow"/>
        </a-form-model-item>

        <a-form-model-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="打開方式">
          <a-switch checkedChildren="外部" unCheckedChildren="內部" v-model="model.internalOrExternal"/>
        </a-form-model-item>

      </a-form-model>

      <!-- 選擇圖標 -->
      <icons @choose="handleIconChoose" @close="handleIconCancel" :iconChooseVisible="iconChooseVisible"></icons>
    </a-spin>
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          關閉
        </a-button>
        <a-button :disabled="disableSubmit" @click="handleOk" type="primary">確定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
  import {addPermission,editPermission,queryTreeList, duplicateCheck} from '@/api/api'
  import Icons from './icon/Icons'

  export default {
    name: "PermissionModal",
    components: {Icons},
    data () {
      return {
        drawerWidth:700,
        treeData:[],
        title:"操作",
        visible: false,
        disableSubmit:false,
        model: {},
        show:true,//根據菜單類型，動態显示隱藏表單元素
        menuLabel:'菜單名稱',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        iconChooseVisible: false,
        validateStatus:""
      }
    },
    computed:{
      validatorRules:function() {
        return {
          name:[{ required: true, message: '請輸入菜單標題!' }],
          component:[{ required: this.show, message: '請輸入前端組件!' }],
          url: [{ required: this.show, message: '請輸入菜單路徑!' }],
          permsType: [{ required: true, message: '請輸入授權策略!' }],
          perms:[{ required: false, message: '請輸入授權標識!' },{validator: this.validatePerms }]
        }
      }
    },
    created () {
    },
    methods: {
      loadTree(){
        var that = this;
        queryTreeList().then((res)=>{
          if(res.success){
            console.log(res)
            that.treeData = [];
            let treeList = res.result.treeList
            for(let a=0;a<treeList.length;a++){
              let temp = treeList[a];
              temp.isLeaf = temp.leaf;
              that.treeData.push(temp);
            }
          }
        });
      },
      add () {
        //初始化默認值
        this.edit({status:'1', permsType:'1', sortNo:1.0, route:true, menuType:0 });
      },
      edit (record) {
        this.resetScreenSize(); // 調用此方法,根據屏幕寬度自適應調整抽屜的寬度
        this.model = Object.assign({}, record);

        //根據菜單類型，動態展示頁面字段
        console.log('record: ',record)
        this.show = record.menuType==2?false:true;
        this.menuLabel = record.menuType==2?'按鈕/權限':'菜單名稱';

        this.visible = true;
        this.loadTree();
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
            if ((this.model.menuType == 1 || this.model.menuType == 2) && !this.model.parentId) {
              that.validateStatus = 'error';
              that.$message.error("請檢查你填的類型以及信息是否正確！");
              return;
            } else {
              that.validateStatus = 'success';
            }
            that.confirmLoading = true;
            let obj;
            if (!this.model.id) {
              obj = addPermission(this.model);
            } else {
              obj = editPermission(this.model);
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            });
          }else{
            return false;
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateNumber(rule, value, callback){
        if(!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)){
          callback();
        }else{
          callback("請輸入正整數!");
        }
      },
      validatePerms(rule, value, callback){
        if(value && value.length>0){
          //校驗授權標識是否存在
          var params = {
            tableName: 'sys_permission',
            fieldName: 'perms',
            fieldVal: value,
            dataId: this.model.id
          };
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback("授權標識已存在!")
            }
          })
        }else{
          callback()
        }
      },
      onChangeMenuType(e) {
        if(this.model.menuType == 2){
          this.show = false;
          this.menuLabel = '按鈕/權限';
        }else{
          this.show = true;
          this.menuLabel = '菜單名稱';
        }
        this.$nextTick(() => {
          this.$refs.form.validateField(['url','component']);
        });
      },
      selectIcons(){
        this.iconChooseVisible = true
      },
      handleIconCancel () {
        this.iconChooseVisible = false
      },
      handleIconChoose (value) {
        console.log(value)
        this.model.icon = value
        this.iconChooseVisible = false
      },
      // 根據屏幕變化,設置抽屜尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      },
      handleParentIdChange(value){
        if(!value){
          this.validateStatus="error"
        }else{
          this.validateStatus="success"
        }
      }
    }
  }
</script>

<style scoped>

</style>