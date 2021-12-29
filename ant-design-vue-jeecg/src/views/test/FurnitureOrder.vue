<template>
<a-card>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="addOrder">新增</a-button>
      <a-button type="primary" icon="delete" @click="deleteOrder">批量删除</a-button>
    </div>
    <order-detail  :changeSelection="changeSelect" :submitDel="deleteOrder"></order-detail>
    <a-modal v-model="confirmDelete" title="警告" @ok="submitDelete" :centered="true">
      <p>是否刪除訂單xxxx！</p>
    </a-modal>
</a-card>
</template>
<script>
import OrderDetail from "./modules/OrderDetail"
export default({
    name:"FurnitureOrder",
    components:{
        OrderDetail,
    },
    data(){
        return{
          obj:"",
          isShowEdit:"",
          isShowCreate:"",
          confirmDelete:false,
        }
    },
    methods:{
      addOrder(){
        console.log("add");
      },
      deleteOrder(){
        console.log("delect")
        this.confirmDelete=true;
      },
      submitDelete(){
        console.log("confirmed!");
        this.confirmDelete=false;
      },
      changeSelect(selectedRowKeys,selectedRows){
        this.obj=selectedRows;
        console.log("key:"+this.row);
        console.log(selectedRows);
      },
    }
})
</script>
