<template>
  <a-table bordered :columns="columns" :data-source="data" rowKey="orderNo"  :row-selection="rowSelection">
    <template v-slot:status="text">
      <a-badge :status="text=='已完成'? 'success' :text=='未完成'? 'warning' :'error'" :text="text" ></a-badge>
    </template>
    <template v-slot:action>
      <a-row justify="center" class="center">
        <a-col span="12"><a href="javascript:;">编辑</a></a-col>
        <a-col span="12" @click="submitDel"><a href="javascript:;">删除</a></a-col>
      </a-row>
    </template>

  </a-table>
</template>
<script>
const cols=[
  {
    title: '订单号',
    dataIndex: 'orderNo',
    align:"center",
    width:150,
  },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    align:"center",
    width:150,
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    align:"center",
    width:150,
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align:"center",
    width:150,
  },
];

const datas=[
  {
    orderNo: '90521551213',
    orderTime:'2018-02-11',
    status: "未完成",
  },
  {
    orderNo: '90521551218',
    orderTime:'2018-02-11',
    status: "已完成",
  },
  {
    orderNo: '90521551231',
    orderTime:'2018-02-11',
    status: "异常件",
  },
  {
    orderNo: '90521551232',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551233',
    orderTime:'2018-02-11',
    status: "异常件",

  },
    {
    orderNo: '90521551234',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551235',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551149',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551236',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    key: 2,
    orderNo: '90521551237',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551238',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551239',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551240',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551241',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551242',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551243',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551244',
    orderTime:'2018-02-11',
    status: "异常件",
  },
    {
    orderNo: '90521551245',
    orderTime:'2018-02-11',
    status: "异常件",
  },
];
export default({
    name:"OrderDetail",
    props:{
        changeSelection:Function,
        submitDel:Function
    },
    data(){
        return {
            columns:cols,
            data:datas,
            selectedRowKeys:[],
        }
    },
    computed:{
       rowSelection(){
         return {
           onChange:this.changeSelection,
         }
       }
    },
    methods:{

    }
})
</script>
<style scoped>
.center{
  text-align: center;
}
</style>
