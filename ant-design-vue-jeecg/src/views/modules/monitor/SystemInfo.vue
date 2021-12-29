<template>
  <a-skeleton active :loading="loading" :paragraph="{rows: 17}">
    <a-card :bordered="false">

      <a-alert type="info" :showIcon="true">
        <div slot="message">
          上次更新時間：{{ this.time }}
          <a-divider type="vertical"/>
          <a @click="handleClickUpdate">立即更新</a>
        </div>
      </a-alert>

      <a-table
        rowKey="id"
        size="middle"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="tableLoading"
        style="margin-top: 20px;">

        <template slot="param" slot-scope="text, record">
          <a-tag :color="textInfo[record.param].color">{{ text }}</a-tag>
        </template>

        <template slot="text" slot-scope="text, record">
          {{ textInfo[record.param].text }}
        </template>

        <template slot="value" slot-scope="text, record">
          {{ text }} {{ textInfo[record.param].unit }}
        </template>

      </a-table>
    </a-card>
  </a-skeleton>
</template>
<script>
  import moment from 'moment'
  import { getAction } from '@/api/manage'

  moment.locale('zh-cn')

  export default {
    data() {
      return {
        time: '',
        loading: true,
        tableLoading: true,
        columns: [{
          title: '參數',
          width: '30%',
          dataIndex: 'param',
          scopedSlots: { customRender: 'param' }
        }, {
          title: '描述',
          width: '40%',
          dataIndex: 'text',
          scopedSlots: { customRender: 'text' }
        }, {
          title: '當前值',
          width: '30%',
          dataIndex: 'value',
          scopedSlots: { customRender: 'value' }
        }],
        dataSource: [],
        // 列表通過 textInfo 渲染出顏色、描述和單位
        textInfo: {
          'system.cpu.count': { color: 'green', text: 'CPU 數量', unit: '核' },
          'system.cpu.usage': { color: 'green', text: '系統 CPU 使用率', unit: '%' },
          'process.start.time': { color: 'purple', text: '應用啟動時間點', unit: '' },
          'process.uptime': { color: 'purple', text: '應用已運行時間', unit: '秒' },
          'process.cpu.usage': { color: 'purple', text: '當前應用 CPU 使用率', unit: '%' }
        },
        // 當一條記錄中需要取出多條數據的時候需要配置該字段
        moreInfo: {}
      }
    },
    mounted() {
      this.loadTomcatInfo()
    },
    methods: {

      handleClickUpdate() {
        this.loadTomcatInfo()
      },

      loadTomcatInfo() {
        this.tableLoading = true
        this.time = moment().format('YYYY年MM月DD日 HH時mm分ss秒')
        Promise.all([
          getAction('actuator/metrics/system.cpu.count'),
          getAction('actuator/metrics/system.cpu.usage'),
          getAction('actuator/metrics/process.start.time'),
          getAction('actuator/metrics/process.uptime'),
          getAction('actuator/metrics/process.cpu.usage')
        ]).then((res) => {
          let info = []
          res.forEach((value, id) => {
            let more = this.moreInfo[value.name]
            if (!(more instanceof Array)) {
              more = ['']
            }
            more.forEach((item, idx) => {
              let param = value.name + item
              let val = value.measurements[idx].value
              if (param === 'system.cpu.usage' || param === 'process.cpu.usage') {
                val = this.convert(val, Number)
              }
              if (param === 'process.start.time') {
                val = this.convert(val, Date)
              }
              info.push({ id: param + id, param, text: 'false value', value: val })
            })
          })
          this.dataSource = info
        }).catch((e) => {
          console.error(e)
          this.$message.error('獲取服務器信息失敗')
        }).finally(() => {
          this.loading = false
          this.tableLoading = false
        })
      },

      convert(value, type) {
        if (type === Number) {
          return Number(value * 100).toFixed(2)
        } else if (type === Date) {
          return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
        return value
      }
    }
  }
</script>
<style></style>
