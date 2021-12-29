<template>
  <a-card :bordered="false">
    <a-tabs defaultActiveKey="1">
      <!-- 柱狀圖 -->
      <a-tab-pane tab="柱狀圖" key="1">
        <bar title="銷售額排行" :dataSource="barData" :height="height"/>
      </a-tab-pane>
      <!-- 多列柱狀圖 -->
      <a-tab-pane tab="多列柱狀圖" key="2">
        <bar-multid title="多列柱狀圖" :height="height"/>
      </a-tab-pane>
      <!-- 迷你柱狀圖 -->
      <a-tab-pane tab="迷你柱狀圖" key="3">
        <mini-bar :dataSource="barData" :width="400" :height="200"/>
      </a-tab-pane>
      <!-- 面積圖 -->
      <a-tab-pane tab="面積圖" key="4">
        <area-chart-ty title="銷售額排行" :dataSource="areaData" x="月份" y="銷售額" :height="height"/>
      </a-tab-pane>
      <!-- 迷你面積圖 -->
      <a-tab-pane tab="迷你面積圖" key="5">
        <div style="padding-top: 100px;width:600px;height:200px">
          <mini-area :dataSource="areaData" x="月份" y="銷售額" :height="height"/>
        </div>
      </a-tab-pane>
      <!-- 多行折線圖 -->
      <a-tab-pane tab="多行折線圖" key="6">
        <line-chart-multid title="多行折線圖" :height="height"/>
      </a-tab-pane>
      <!-- 餅圖 -->
      <a-tab-pane tab="餅圖" key="7">
        <pie title="餅圖" :height="height"/>
      </a-tab-pane>
      <!-- 雷達圖 -->
      <a-tab-pane tab="雷達圖" key="8">
        <radar title="雷達圖" :height="height"/>
      </a-tab-pane>
      <!-- 儀錶盤 -->
      <a-tab-pane tab="儀錶盤" key="9">
        <dash-chart-demo title="儀錶盤" :value="9" :height="height"/>
      </a-tab-pane>
      <!-- 進度條 -->
      <a-tab-pane tab="進度條" key="10">
        <mini-progress :percentage="30" :target="40" :height="30"/>
        <mini-progress :percentage="51" :target="60" :height="30" color="#FFA500"/>
        <mini-progress :percentage="66" :target="80" :height="30" color="#1E90FF"/>
        <mini-progress :percentage="74" :target="70" :height="30" color="#FF4500"/>
        <mini-progress :percentage="92" :target="100" :height="30" color="#49CC49"/>
      </a-tab-pane>
      <!-- 排名列表 -->
      <a-tab-pane tab="排名列表" key="11">
        <rank-list title="門店銷售排行榜" :list="rankList" style="width: 600px;margin: 0 auto;"/>
      </a-tab-pane>
      <!-- TransferBar -->
      <a-tab-pane tab="TransferBar" key="12">
        <transfer-bar title="年度消耗流量一覽表" :data="barData" x="月份" y="流量(Mb)" :height="height"/>
      </a-tab-pane>
      <!-- Trend -->
      <a-tab-pane tab="Trend" key="13">
        <trend title="Trend" term="Trend：" :percentage="30"/>
      </a-tab-pane>
      <!-- Liquid -->
      <a-tab-pane tab="Liquid" key="14">
        <liquid :height="height"/>
      </a-tab-pane>
      <!-- BarAndLine -->
      <a-tab-pane tab="BarAndLine" key="15">
        <bar-and-line :height="height"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
  import AreaChartTy from '@/components/chart/AreaChartTy'
  import Bar from '@/components/chart/Bar'
  import BarMultid from '@/components/chart/BarMultid'
  import DashChartDemo from '@/components/chart/DashChartDemo'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import Liquid from '@/components/chart/Liquid'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniArea from '@/components/chart/MiniArea'
  import MiniProgress from '@/components/chart/MiniProgress'
  import Pie from '@/components/chart/Pie'
  import Radar from '@/components/chart/Radar'
  import RankList from '@/components/chart/RankList'
  import TransferBar from '@/components/chart/TransferBar'
  import Trend from '@/components/chart/Trend'
  import BarAndLine from '@/components/chart/BarAndLine'

  export default {
    name: 'ViserChartDemo',
    components: {
      Bar, MiniBar, BarMultid, AreaChartTy, LineChartMultid,
      Pie, Radar, DashChartDemo, MiniProgress, RankList,
      TransferBar, Trend, Liquid, MiniArea, BarAndLine
    },
    data() {
      return {
        height: 420,
        rankList: [],
        barData: [],
        areaData: []
      }
    },
    created() {
      setTimeout(() => {
        this.loadBarData()
        this.loadAreaData()
        this.loadRankListData()
      }, 100)
    },
    methods: {
      loadData(x, y, max, min, before = '', after = '月') {
        let data = []
        for (let i = 0; i < 12; i += 1) {
          data.push({
            [x]: `${before}${i + 1}${after}`,
            [y]: Math.floor(Math.random() * max) + min
          })
        }
        return data
      },
      // 加載柱狀圖數據
      loadBarData() {
        this.barData = this.loadData('x', 'y', 1000, 200)
      },
      // 加載AreaChartTy的數據
      loadAreaData() {
        this.areaData = this.loadData('x', 'y', 500, 100)
      },
      loadRankListData() {
        this.rankList = this.loadData('name', 'total', 2000, 100, '北京朝陽 ', ' 號店')
      }
    }
  }
</script>

<style scoped>

</style>
