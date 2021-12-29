<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width=650
    placement="right"
    :closable="true"
    @close="close"
    :visible="visible"
    style="overflow: auto;padding-bottom: 53px;">

    <a-form>
      <a-form-item label='所擁有的部門權限'>

        <a-tree
          v-if="treeData.length>0"
          checkable
          @check="onCheck"
          :checkedKeys="checkedKeys"
          :treeData="treeData"
          @expand="onExpand"
          @select="onTreeNodeSelect"
          :selectedKeys="selectedKeys"
          :expandedKeys="expandedKeysss"
          :checkStrictly="checkStrictly">
          <span slot="hasDatarule" slot-scope="{slotTitle,ruleFlag}">
            {{ slotTitle }}<a-icon v-if="ruleFlag" type="align-left" style="margin-left:5px;color: red;"></a-icon>
          </span>
        </a-tree>
        <div v-else><h3>無可配置部門權限!</h3></div>
      </a-form-item>
    </a-form>

    <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="switchCheckStrictly(1)">父子關聯</a-menu-item>
          <a-menu-item key="2" @click="switchCheckStrictly(2)">取消關聯</a-menu-item>
          <a-menu-item key="3" @click="checkALL">全部勾選</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全選</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展開所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合併所有</a-menu-item>
        </a-menu>
        <a-button>
          樹操作 <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-popconfirm title="確定放棄編輯？" @confirm="close" okText="確定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit(false)" type="primary" :loading="loading" ghost style="margin-right: 0.8rem">僅保存</a-button>
      <a-button @click="handleSubmit(true)" type="primary" :loading="loading">保存並關閉</a-button>
    </div>
    <dept-role-datarule-modal ref="datarule"></dept-role-datarule-modal>
  </a-drawer>

</template>
<script>
  import {queryTreeListForDeptRole,queryDeptRolePermission,saveDeptRolePermission} from '@/api/api'
  import RoleDataruleModal from './RoleDataruleModal.vue'
  import DeptRoleDataruleModal from './DeptRoleDataruleModal'

  export default {
    name: "DeptRoleAuthModal",
    components:{
      DeptRoleDataruleModal,
      RoleDataruleModal
    },
    data(){
      return {
        departId:"",
        roleId:"",
        treeData: [],
        defaultCheckedKeys:[],
        checkedKeys:[],
        halfCheckedKeys:[],
        expandedKeysss:[],
        allTreeKeys:[],
        autoExpandParent: true,
        checkStrictly: true,
        title:"部門角色權限配置",
        visible: false,
        loading: false,
        selectedKeys:[]
      }
    },
    methods: {
      switchCheckStrictly (v) {
        if(v==1){
          this.checkStrictly = false
        }else if(v==2){
          this.checkStrictly = true
        }
      },
      onTreeNodeSelect(id){
        if(id && id.length>0){
          this.selectedKeys = id
        }
        this.$refs.datarule.show(this.selectedKeys[0],this.departId,this.roleId)
      },
      onCheck (o) {
        if(this.checkStrictly){
          this.checkedKeys = o.checked;
        }else{
          this.checkedKeys = o
        }
      },
      show(roleId,departId){
        this.departId = departId
        this.roleId=roleId
        this.visible = true;
      },
      close () {
        this.reset()
        this.$emit('close');
        this.visible = false;
      },
      onExpand(expandedKeys){
        this.expandedKeysss = expandedKeys;
        this.autoExpandParent = false
      },
      reset () {
        this.expandedKeysss = []
        this.checkedKeys = []
        this.defaultCheckedKeys = []
        this.loading = false
      },
      expandAll () {
        this.expandedKeysss = this.allTreeKeys
      },
      closeAll () {
        this.expandedKeysss = []
      },
      checkALL () {
        this.checkedKeys = this.allTreeKeys
      },
      cancelCheckALL () {
        this.checkedKeys = []
      },
      handleCancel () {
        this.close()
      },
      handleSubmit(exit) {
        let that = this;
        let params =  {
          roleId:that.roleId,
          permissionIds:that.checkedKeys.join(","),
          lastpermissionIds:that.defaultCheckedKeys.join(","),
        };
        that.loading = true;
        console.log("請求參數：",params);
        saveDeptRolePermission(params).then((res)=>{
          if(res.success){
            that.$message.success(res.message);
            that.loading = false;
            if (exit) {
              that.close()
            }
          }else {
            that.$message.error(res.message);
            that.loading = false;
            if (exit) {
              that.close()
            }
          }
          this.loadData();
        })
      },
      convertTreeListToKeyLeafPairs(treeList, keyLeafPair = []) {
        for(const {key, isLeaf, children} of treeList) {
          keyLeafPair.push({key, isLeaf})
          if(children && children.length > 0) {
            this.convertTreeListToKeyLeafPairs(children, keyLeafPair)
          }
        }
        return keyLeafPair;
      },
      loadData(){
        queryTreeListForDeptRole({departId:this.departId}).then((res) => {
          this.treeData = res.result.treeList
          this.allTreeKeys = res.result.ids
          queryDeptRolePermission({roleId:this.roleId}).then((res)=>{
            this.checkedKeys = [...res.result];
            this.defaultCheckedKeys = [...res.result];
            this.expandedKeysss = this.allTreeKeys;
          })
        })
      }
    },
    watch: {
      visible () {
        if (this.visible ) {
          this.loadData();
        }
      }
    }
  }

</script>
<style lang="less" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }

</style>