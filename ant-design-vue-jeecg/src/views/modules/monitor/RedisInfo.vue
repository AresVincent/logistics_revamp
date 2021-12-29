<template>
  <a-skeleton active :loading="loading" :paragraph="{rows: 17}">
    <a-card>
      <!-- Radis 信息實時監控 -->
      <a-row :gutter="8">
        <a-col :sm="24" :xl="12">
          <area-chart-ty v-bind="memory"/>
        </a-col>
        <a-col :sm="24" :xl="12">
          <area-chart-ty v-bind="key"/>
        </a-col>
      </a-row>

      <h3>Redis 詳細信息</h3>
      <a-table
        :loading="tableLoading"
        :columns="columns"
        :dataSource="redisInfo"
        :pagination="false"/>

    </a-card>
  </a-skeleton>
</template>
<script>
  import moment from 'moment'
  import { getAction } from '@/api/manage'
  import AreaChartTy from '@/components/chart/AreaChartTy'

  export default {
    name: 'RedisInfo',
    components: {
      AreaChartTy
    },
    data() {
      return {
        loading: true,
        tableLoading: true,
        // 定時器ID
        timer: null,
        // 定時器周期
        millisec: 3000,
        // Key 實時數量
        key: {
          title: 'Radis Key 實時數量（個）',
          dataSource: [],
          y: '數量（個）',
          height: 340,
          min: 0,
          max: 100,
          color: '#FF6987',
          lineSize: 8,
          lineColor: '#DC143C'
        },
        // 內存實時佔用情況
        memory: {
          title: 'Radis 內存實時佔用情況（KB）',
          dataSource: [],
          y: '內存（KB）',
          min: 0,
          max: 3000,
          height: 340,
          lineSize: 8
        },
        redisInfo: [],
        columns: [{
          title: 'Key',
          align: 'center',
          dataIndex: 'key'
        }, {
          title: 'Description',
          align: 'left',
          dataIndex: 'description'
        }, {
          title: 'Value',
          align: 'center',
          dataIndex: 'value'
        }],
        url: {
          keysSize: '/sys/actuator/redis/keysSize',
          memoryInfo: '/sys/actuator/redis/memoryInfo',
          info: '/sys/actuator/redis/info'
        },
        path: '/monitor/redis/info'
      }
    },
    mounted() {
      this.openTimer()
      this.loadRedisInfo()
      setTimeout(() => {
        this.loadData()
      }, 1000)
    },
    beforeDestroy() {
      this.closeTimer()
    },
    methods: {

      /** 開啟定時器 */
      openTimer() {
        this.loadData()
        this.closeTimer()
        this.timer = setInterval(() => {
          if (this.$route.path === this.path) {
            this.loadData()
          }
        }, this.millisec)
      },

      /** 關閉定時器 */
      closeTimer() {
        if (this.timer) clearInterval(this.timer)
      },

      /** 查詢數據 */
      loadData() {
        Promise.all([
          getAction(this.url.keysSize),
          getAction(this.url.memoryInfo)
        ]).then((res) => {
          let time = moment().format('hh:mm:ss')

          let [{ dbSize: currentSize }, memoryInfo] = res
          let currentMemory = memoryInfo.used_memory / 1000

          // push 數據
          this.key.dataSource.push({ x: time, y: currentSize })
          this.memory.dataSource.push({ x: time, y: currentMemory })
          // 最大長度為6
          if (this.key.dataSource.length > 6) {
            this.key.dataSource.splice(0, 1)
            this.memory.dataSource.splice(0, 1)
          }

          // 計算 Key 最大最小值
          let keyPole = this.getMaxAndMin(this.key.dataSource, 'y')
          this.key.max = Math.floor(keyPole[0]) + 10
          this.key.min = Math.floor(keyPole[1]) - 10
          if (this.key.min < 0) this.key.min = 0

          // 計算 Memory 最大最小值
          let memoryPole = this.getMaxAndMin(this.memory.dataSource, 'y')
          this.memory.max = Math.floor(memoryPole[0]) + 100
          this.memory.min = Math.floor(memoryPole[1]) - 100
          if (this.memory.min < 0) this.memory.min = 0

        }).catch((e) => {
          console.error(e)
          this.closeTimer()
          this.$message.error('獲取 Redis 信息失敗')
        }).finally(() => {
          this.loading = false
        })

      },

      // 獲取一組數據中最大和最小的值
      getMaxAndMin(dataSource, field) {
        let maxValue = null, minValue = null
        dataSource.forEach(item => {
          let value = Number.parseInt(item[field])
          // max
          if (maxValue == null) {
            maxValue = value
          } else if (value > maxValue) {
            maxValue = value
          }
          // min
          if (minValue == null) {
            minValue = value
          } else if (value < minValue) {
            minValue = value
          }
        })
        return [maxValue, minValue]
      },

      loadRedisInfo() {
        this.tableLoading = true
        getAction(this.url.info).then((res) => {
          this.redisInfo = res.result
        }).finally(() => {
          this.tableLoading = false
        })
      }

    }
  }
</script>
<style></style>
