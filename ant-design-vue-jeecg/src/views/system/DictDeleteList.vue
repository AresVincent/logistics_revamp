<template>
  <a-modal
    :width="modalWidth"
    :style="modalStyle"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel">
    <template slot="footer">
      <a-button @click="handleCancel">關閉</a-button>
    </template>
    <a-table
      ref="table"
      rowKey="id"
      size="middle"
      :columns="columns"
      :loading="loading"
      :dataSource="dataSource"
      :pagination="false">
      <span slot="action" slot-scope="text, record">
        <a @click="handleBack(record.id)"><a-icon type="redo"/>字典取回</a>
        <a-divider type="vertical"/>
        <a @click="handleDelete(record.id)"><a-icon type="scissor"/>徹底刪除</a>
      </span>
    </a-table>

  </a-modal>


</template>

<script>
  import { getAction,deleteAction,putAction } from '@/api/manage'
  export default {
    name: "DictDeleteList",
    data () {
      return {
        modalWidth: '90%',
        modalStyle: { 'top': '20px'},
        title: '操作',
        visible: false,
        loading: false,
        dataSource:[],
        columns:[
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 120,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '字典名稱',
            align: "left",
            dataIndex: 'dictName'
          },
          {
            title: '字典編號',
            align: "left",
            dataIndex: 'dictCode'
          },
          {
            title: '描述',
            align: "left",
            dataIndex: 'description'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'}
          }
        ]
      }
    },

    methods: {
      handleCancel(){
        this.visible = false
        //回收站字典列表刷新
        this.$emit("refresh")
      },
      show(){
        this.visible = true
        this.loadData();
      },
      loadData(){
        this.loading = true
        getAction("/sys/dict/deleteList").then(res=>{
          this.loading = false
          if(res.success){
            this.dataSource = res.result
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      handleBack(id){
        putAction("/sys/dict/back/"+id).then(res=>{
          if(res.success){
            this.$message.success(res.message)
            this.loadData();
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      handleDelete(id){
        this.$confirm({
          title: '徹底刪除字典',
          content: (<div>
            <p>您確定要徹底刪除這個字典項嗎？</p>
            <p style="color:red;">注意：徹底刪除后將無法恢復，請謹慎操作！</p>
            </div>),
          centered: false,
          onOk: () => {
          var that = this;
          deleteAction("/sys/dict/deletePhysic/"+id).then((res) => {
            if (res.success) {
              this.$message.success(res.message)
              this.loadData();
            } else {
              that.$message.warning(res.message);
            }
          });
        },
      })
      }

    }
  }
</script>

<style scoped>

</style>