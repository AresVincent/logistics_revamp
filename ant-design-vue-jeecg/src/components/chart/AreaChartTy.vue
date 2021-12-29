<template>
  <div :style="{ padding: '0' }">
    <h4 :style="{ marginBottom: '20px' }">{{ title }}</h4>

    <v-chart ref="chart" :forceFit="true" :height="height" :data="dataSource" :scale="scale">
      <v-tooltip :shared="false"/>
      <v-axis/>
      <v-line position="x*y" :size="lineSize" :color="lineColor"/>
      <v-area position="x*y" :color="color"/>
    </v-chart>

  </div>
</template>

<script>
  import { triggerWindowResizeEvent } from '@/utils/util'

  export default {
    name: 'AreaChartTy',
    props: {
      // 圖表數據
      dataSource: {
        type: Array,
        required: true
      },
      // 圖表標題
      title: {
        type: String,
        default: ''
      },
      // x 軸別名
      x: {
        type: String,
        default: 'x'
      },
      // y 軸別名
      y: {
        type: String,
        default: 'y'
      },
      // Y軸最小值
      min: {
        type: Number,
        default: 0
      },
      // Y軸最大值
      max: {
        type: Number,
        default: null
      },
      // 圖表高度
      height: {
        type: Number,
        default: 254
      },
      // 線的粗細
      lineSize: {
        type: Number,
        default: 2
      },
      // 面積的顏色
      color: {
        type: String,
        default: ''
      },
      // 線的顏色
      lineColor: {
        type: String,
        default: ''
      }
    },
    computed: {
      scale() {
        return [
          { dataKey: 'x', title: this.x, alias: this.x },
          { dataKey: 'y', title: this.y, alias: this.y, min: this.min, max: this.max }
        ]
      }
    },
    mounted() {
      triggerWindowResizeEvent()
    }
  }
</script>

<style lang="less" scoped>
  @import "chart";
</style>