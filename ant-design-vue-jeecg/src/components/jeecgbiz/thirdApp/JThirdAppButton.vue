<template>
  <span v-if="syncToApp || syncToLocal">
    <j-third-app-dropdown v-if="enabledTypes.wechatEnterprise" type="wechatEnterprise" name="企微" v-bind="bindAttrs" v-on="bindEvents"/>
    <j-third-app-dropdown v-if="enabledTypes.dingtalk" type="dingtalk" name="釘釘" v-bind="bindAttrs" v-on="bindEvents"/>
  </span>
  <span v-else>未設置任何同步方向</span>
</template>

<script>
import { getAction } from '@/api/manage'
import { cloneObject } from '@/utils/util'
import JThirdAppDropdown from './JThirdAppDropdown'

const backEndUrl = {
  // 獲取啟用的第三方App
  getEnabledType: '/sys/thirdApp/getEnabledType',
  // 企業微信
  wechatEnterprise: {
    user: '/sys/thirdApp/sync/wechatEnterprise/user',
    depart: '/sys/thirdApp/sync/wechatEnterprise/depart',
  },
  // 釘釘
  dingtalk: {
    user: '/sys/thirdApp/sync/dingtalk/user',
    depart: '/sys/thirdApp/sync/dingtalk/depart',
  }
}

export default {
  name: 'JThirdAppButton',
  components: {JThirdAppDropdown},
  props: {
    // 同步類型，可以是 user、depart
    bizType: {
      type: String,
      required: true,
    },
    // 是否允許同步到第三方APP
    syncToApp: Boolean,
    // 是否允許第三方APP同步到本地
    syncToLocal: Boolean,
    // 選擇的行
    selectedRowKeys: Array,
  },
  data() {
    return {
      enabledTypes: {},
      attrs: {
        dingtalk: {},
      },
    }
  },
  computed: {
    bindAttrs() {
      return {
        syncToApp: this.syncToApp,
        syncToLocal: this.syncToLocal
      }
    },
    bindEvents() {
      return {
        'to-app': this.onToApp,
        'to-local': this.onToLocal,
      }
    },
  },
  created() {
    this.loadEnabledTypes()
  },
  methods: {
    handleMenuClick() {
      console.log(arguments)
    },
    onToApp(e) {
      this.doSync(e.type, '/toApp')
    },
    onToLocal(e) {
      this.doSync(e.type, '/toLocal')
    },
    // 獲取啟用的第三方App
    async loadEnabledTypes() {
      this.enabledTypes = await loadEnabledTypes()
    },
    // 開始同步第三方App
    doSync(type, direction) {
      let urls = backEndUrl[type]
      if (!(urls && urls[this.bizType])) {
        console.warn('配置出錯')
        return
      }
      let url = urls[this.bizType] + direction

      let selectedRowKeys = this.selectedRowKeys
      let content = '確定要開始同步全部數據嗎？可能花費較長時間！'
      if (Array.isArray(selectedRowKeys) && selectedRowKeys.length > 0) {
        content = `確定要開始同步這 ${selectedRowKeys.length} 項嗎？`
      } else {
        selectedRowKeys = []
      }
      return new Promise((resolve, reject) => {
        let model = this.$confirm({
          title: '同步',
          content,
          onOk: () => {
            model.update({
              keyboard: false,
              okText: '同步中…',
              cancelButtonProps: {props: {disabled: true}}
            })
            return getAction(url, {
              ids: selectedRowKeys.join(',')
            }).then(res => {
              let options = null
              if (res.result) {
                options = {
                  width: 600,
                  title: res.message,
                  content: (h) => {
                    let nodes
                    let successInfo = [
                      `成功信息如下：`,
                      this.renderTextarea(h, res.result.successInfo.map((v, i) => `${i + 1}. ${v}`).join('\n')),
                    ]
                    if (res.success) {
                      nodes = [
                        ...successInfo,
                        h('br'),
                        `無失敗信息！`,
                      ]
                    } else {
                      nodes = [
                        `失敗信息如下：`,
                        this.renderTextarea(h, res.result.failInfo.map((v, i) => `${i + 1}. ${v}`).join('\n')),
                        h('br'),
                        ...successInfo,
                      ]
                    }
                    return nodes
                  }
                }
              }
              if (res.success) {
                if (options != null) {
                  this.$success(options)
                } else {
                  this.$message.success(res.message)
                }
                this.$emit('sync-ok')
              } else {
                if (options != null) {
                  this.$warning(options)
                } else {
                  this.$message.warning(res.message)
                }
                this.$emit('sync-error')
              }
            }).catch(() => model.destroy()).finally(() => {
              resolve()
              this.$emit('sync-finally', {
                type,
                direction,
                isToApp: direction === '/toApp',
                isToLocal: direction === '/toLocal',
              })
            })
          },
          onCancel() {
            resolve()
          },
        })
      })
    },
    renderTextarea(h, value) {
      return h('a-textarea', {
        props: {
          value: value,
          readOnly: true,
          autosize: {minRows: 5, maxRows: 10},
        },
        style: {
          // 關閉textarea的自動換行，使其可以左右滾動
          whiteSpace: 'pre',
          overflow: 'auto',
        }
      })
    }
  },
}

// 啟用了哪些第三方App（在此緩存）
let enabledTypes = null

// 獲取啟用的第三方App
export async function loadEnabledTypes() {
  // 獲取緩存
  if (enabledTypes != null) {
    return cloneObject(enabledTypes)
  } else {
    let {success, result} = await getAction(backEndUrl.getEnabledType)
    if (success) {
      // 在此緩存
      enabledTypes = cloneObject(result)
      return result
    } else {
      console.warn('getEnabledType查詢失敗：', res)
    }
  }
  return {}
}
</script>

<style scoped>

</style>