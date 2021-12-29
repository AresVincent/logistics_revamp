import store from '@/store/'
import { randomUUID } from '@/utils/util'
// vxe socket
const vs = {
  // 頁面唯一 id，用於標識同一用戶，不同頁面的websocket
  pageId: randomUUID(),
  // webSocket 對象
  ws: null,
  // 一些常量
  constants: {
    // 消息類型
    TYPE: 'type',
    // 消息數據
    DATA: 'data',
    // 消息類型：心跳檢測
    TYPE_HB: 'heart_beat',
    // 消息類型：通用數據傳遞
    TYPE_CSD: 'common_send_date',
    // 消息類型：更新vxe table數據
    TYPE_UVT: 'update_vxe_table',
  },
  // 心跳檢測
  heartCheck: {
    // 間隔時間，間隔多久發送一次心跳消息
    interval: 10000,
    // 心跳消息超時時間，心跳消息多久沒有回復后重連
    timeout: 6000,
    timeoutTimer: null,
    clear() {
      clearTimeout(this.timeoutTimer)
      return this
    },
    start() {
      vs.sendMessage(vs.constants.TYPE_HB, '')
      // 如果超過一定時間還沒重置，說明後端主動斷開了
      this.timeoutTimer = window.setTimeout(() => {
        vs.reconnect()
      }, this.timeout)
      return this
    },
    // 心跳消息返回
    back() {
      this.clear()
      window.setTimeout(() => this.start(), this.interval)
    },
  },

  /** 初始化 WebSocket */
  initialWebSocket() {
    if (this.ws === null) {
      const userId = store.getters.userInfo.id
      const domain = window._CONFIG['domianURL'].replace('https://', 'wss://').replace('http://', 'ws://')
      const url = `${domain}/vxeSocket/${userId}/${this.pageId}`

      this.ws = new WebSocket(url)
      this.ws.onopen = this.on.open.bind(this)
      this.ws.onerror = this.on.error.bind(this)
      this.ws.onmessage = this.on.message.bind(this)
      this.ws.onclose = this.on.close.bind(this)

      console.log('this.ws: ', this.ws)
    }
  },

  // 發送消息
  sendMessage(type, message) {
    try {
      let ws = this.ws
      if (ws != null && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: type,
          data: message
        }))
      }
    } catch (err) {
      console.warn('【VXEWebSocket】發送消息失敗：(' + err.code + ')')
    }
  },

  /** 綁定全局VXE表格 */
  tableMap: new Map(),
  CSDMap: new Map(),
  /** 添加綁定 */
  addBind(map, key, value) {
    let binds = map.get(key)
    if (Array.isArray(binds)) {
      binds.push(value)
    } else {
      map.set(key, [value])
    }
  },
  /** 移除綁定 */
  removeBind(map, key, value) {
    let binds = map.get(key)
    if (Array.isArray(binds)) {
      for (let i = 0; i < binds.length; i++) {
        let bind = binds[i]
        if (bind === value) {
          binds.splice(i, 1)
          break
        }
      }
      if (binds.length === 0) {
        map.delete(key)
      }
    } else {
      map.delete(key)
    }
  },
  // 呼叫綁定的表單
  callBind(map, key, callback) {
    let binds = map.get(key)
    if (Array.isArray(binds)) {
      binds.forEach(callback)
    }
  },

  lockReconnect: false,
  /** 嘗試重連 */
  reconnect() {
    if (this.lockReconnect) return
    this.lockReconnect = true
    setTimeout(() => {
      if (this.ws && this.ws.close) {
        this.ws.close()
      }
      this.ws = null
      console.info('【VXEWebSocket】嘗試重連...')
      this.initialWebSocket()
      this.lockReconnect = false
    }, 5000)
  },

  on: {
    open() {
      console.log('【VXEWebSocket】連接成功')
      this.heartCheck.start()
    },
    error(e) {
      console.warn('【VXEWebSocket】連接發生錯誤:', e)
      this.reconnect()
    },
    message(e) {
      // 解析消息
      let json
      try {
        json = JSON.parse(e.data)
      } catch (e) {
        console.warn('【VXEWebSocket】收到無法解析的消息:', e.data)
        return
      }
      let type = json[this.constants.TYPE]
      let data = json[this.constants.DATA]
      switch (type) {
        // 心跳檢測
        case this.constants.TYPE_HB:
          this.heartCheck.back()
          break
        // 通用數據傳遞
        case this.constants.TYPE_CSD:
          this.callBind(this.CSDMap, data.key, (fn) => fn.apply(this, data.args))
          break
        // 更新form數據
        case this.constants.TYPE_UVT:
          this.callBind(this.tableMap, data.socketKey, (vm) => this.onVM['onUpdateTable'].apply(vm, data.args))
          break
        default:
          console.warn('【VXEWebSocket】收到不識別的消息類型:' + type)
          break
      }
    },
    close(e) {
      console.log('【VXEWebSocket】連接被關閉:', e)
      this.reconnect()
    },
  },

  onVM: {
    /** 收到更新表格的消息 */
    onUpdateTable(row, caseId) {
      // 判斷是不是自己發的消息
      if (this.caseId !== caseId) {
        const tableRow = this.getIfRowById(row.id).row
        // 局部保更新數據
        if (tableRow) {
          // 特殊處理拖輪狀態
          if (row['tug_status'] && tableRow['tug_status']) {
            row['tug_status'] = Object.assign({}, tableRow['tug_status'], row['tug_status'])
          }
          // 判斷是否啟用重載特效
          if (this.reloadEffect) {
            this.$set(this.reloadEffectRowKeysMap, row.id, true)
          }
          Object.keys(row).forEach(key => {
            if (key !== 'id') {
              this.$set(tableRow, key, row[key])
            }
          })
          this.$refs.vxe.reloadRow(tableRow)
        }
      }
    },
  },

}

export default {
  props: {
    // 是否開啟使用 webSocket 無痕刷新
    socketReload: {
      type: Boolean,
      default: false
    },
    socketKey: {
      type: String,
      default: 'vxe-default'
    },
  },
  data() {
    return {}
  },
  mounted() {
    if (this.socketReload) {
      vs.initialWebSocket()
      vs.addBind(vs.tableMap, this.socketKey, this)
    }
  },
  methods: {

    /** 發送socket消息更新行 */
    socketSendUpdateRow(row) {
      vs.sendMessage(vs.constants.TYPE_UVT, {
        socketKey: this.socketKey,
        args: [row, this.caseId],
      })
    },

  },
  beforeDestroy() {
    vs.removeBind(vs.tableMap, this.socketKey, this)
  },
}

/**
 * 添加WebSocket通用數據傳遞綁定，相同的key可以添加多個方法綁定
 * @param key 唯一key
 * @param fn 當消息來的時候觸發的回調方法
 */
export function addBindSocketCSD(key, fn) {
  if (typeof fn === 'function') {
    vs.addBind(vs.CSDMap, key, fn)
  }
}

/**
 * 移除WebSocket通用數據傳遞綁定
 * @param key 唯一key
 * @param fn 要移除的方法，必須和添加時的方法內存層面上保持一致才可以正確移除
 */
export function removeBindSocketCSD(key, fn) {
  if (typeof fn === 'function') {
    vs.removeBind(vs.CSDMap, key, fn)
  }
}
