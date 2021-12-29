<template>
  <a-table bordered :columns="columns" :data-source="data" :scroll="scrollWidth" rowKey="orderNo" :pagination="pageSetting" @change="pageChange(value)">
    <!-- <a-pagination v-model="current" pageSize=5 position="both"></a-pagination> -->
    <template v-slot:action>
      <a href="javascript:;">Delete</a>
    </template>
    <!-- v-slot:status="text"查看key为status的所在列的数据,record这是所在行的所有数据 -->
    <template v-slot:status="text">
      <a-badge :status="text=='已完成'? 'success' :text=='未完成'? 'warning' :'error'" :text="text" ></a-badge>
    </template>
  </a-table>
</template>
<script>
const cols=[
  {
    title: '订单号',
    dataIndex: 'orderNo',
    width: 200,
    align:"center",

  },
  {
    title: '下单时间',
    dataIndex: 'orderTime',
    align:"center",
    width: 200,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    align:"center",
  },
  {
    title: 'Action',
    width: 100,
    key: 'action',
    scopedSlots: { customRender: 'action' },
    align:"center",
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
    name:"OrderSimple",
    props:{
        scrollWidth:Object
    },
    data(){
        return {
          columns:cols,
          data:datas,
          pageSetting:{
          pageSize:10,
          showSizeChanger:true,
          pageSizeOptions:['10','20','50']
        }
        }
    },
    methods:{
      pageChange:(value)=>{
        console.log(value)
      }
    }
})
</script>
