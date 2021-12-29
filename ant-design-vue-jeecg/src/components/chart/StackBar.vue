<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data">
      <v-coord type="rect" direction="LB" />
      <v-tooltip />
      <v-legend />
      <v-axis dataKey="State" :label="label" />
      <v-stack-bar position="State*流程數量"  color="流程狀態" />
    </v-chart>
  </div>

</template>

<script>
  const DataSet = require('@antv/data-set');

  export default {
    name: 'StackBar',
    props: {
      dataSource: {
        type: Array,
        required: true,
        default: () => [
          { 'State': '請假', '流轉中': 25, '已歸檔': 18 },
          { 'State': '出差', '流轉中': 30, '已歸檔': 20 },
          { 'State': '加班', '流轉中': 38, '已歸檔': 42},
          { 'State': '用車', '流轉中': 51, '已歸檔': 67}
        ]
      },
      height: {
        type: Number,
        default: 254
      }
    },
    data() {
      return {
        label: { offset: 12 }
      }
    },
    computed: {
      data() {
        const dv = new DataSet.View().source(this.dataSource);
        dv.transform({
          type: 'fold',
          fields: ['流轉中', '已歸檔'],
          key: '流程狀態',
          value: '流程數量',
          retains: ['State'],
        });
       return dv.rows;
      }
    }
  }
</script>