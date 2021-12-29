import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { getEnhancedMixins, JVXERenderType, replaceProps } from '@/components/jeecg/JVxeTable/utils/cellUtils'

// noinspection JSUnusedLocalSymbols
export default {
  inject: {
    getParentContainer: {default: () => ((node) => node.parentNode)},
  },
  props: {
    value: PropTypes.any,
    row: PropTypes.object,
    column: PropTypes.object,
    // 組件參數
    params: PropTypes.object,
    // 渲染選項
    renderOptions: PropTypes.object,
    // 渲染類型
    renderType: PropTypes.string.def('default'),
  },
  data() {
    return {
      innerValue: null,
    }
  },
  computed: {
    caseId() {
      return this.renderOptions.caseId
    },
    originColumn() {
      return this.column.own
    },
    $type() {
      return this.originColumn.$type
    },
    rows() {
      return this.params.data
    },
    fullDataLength() {
      return this.params.$table.tableFullData.length
    },
    rowIndex() {
      return this.params.rowIndex
    },
    columnIndex() {
      return this.params.columnIndex
    },
    cellProps() {
      let {originColumn: col, renderOptions} = this

      let props = {}

      // 輸入佔位符
      props['placeholder'] = replaceProps(col, col.placeholder)

      // 解析props
      if (typeof col.props === 'object') {
        Object.keys(col.props).forEach(key => {
          props[key] = replaceProps(col, col.props[key])
        })
      }

      // 判斷是否是禁用的列
      props['disabled'] = (typeof col['disabled'] === 'boolean' ? col['disabled'] : props['disabled'])

      // TODO 判斷是否是禁用的行
      // if (props['disabled'] !== true) {
      //   props['disabled'] = ((this.disabledRowIds || []).indexOf(row.id) !== -1)
      // }

      // 判斷是否禁用所有組件
      if (renderOptions.disabled === true) {
        props['disabled'] = true
      }

      // update-begin-author:taoyan date:20211011 for: online表單，附表用戶選擇器{"multiSelect":false}不生效，單表可以生效 #3036
      let jsonStr = col['fieldExtendJson']
      if(jsonStr){
        let fieldExtendJson = JSON.parse(jsonStr)
        if(fieldExtendJson && fieldExtendJson['multiSelect']==false){
          props['multi'] = false
        }
      }
      // update-end-author:taoyan date:20211011 for: online表單，附表用戶選擇器{"multiSelect":false}不生效，單表可以生效 #3036

      return props
    },
  },
  watch: {
    $type: {
      immediate: true,
      handler($type) {
        this.enhanced = getEnhancedMixins($type)
        this.listeners = getListeners.call(this)
      },
    },
    value: {
      immediate: true,
      handler(val) {
        let value = val

        // 驗證值格式
        let originValue = this.row[this.column.property]
        let getValue = this.enhanced.getValue.call(this, originValue)
        if (originValue !== getValue) {
          // 值格式不正確，重新賦值
          value = getValue
          vModel.call(this, value)
        }

        this.innerValue = this.enhanced.setValue.call(this, value)

        // 判斷是否啟用翻譯
        if (this.renderType === JVXERenderType.spaner && this.enhanced.translate.enabled) {
          let res = this.enhanced.translate.handler.call(this, value)
          // 異步翻譯，目前僅【多級聯動】使用
          if (res instanceof Promise) {
            res.then(value => this.innerValue = value)
          } else {
            this.innerValue = res
          }
        }
      },
    },
  },
  created() {
  },
  methods: {

    /** 通用處理change事件 */
    handleChangeCommon(value) {
      let handle = this.enhanced.getValue.call(this, value)
      this.trigger('change', {value: handle})
      // 觸發valueChange事件
      this.parentTrigger('valueChange', {
        type: this.$type,
        value: handle,
        oldValue: this.value,
        col: this.originColumn,
        rowIndex: this.params.rowIndex,
        columnIndex: this.params.columnIndex,
      })
    },
    /** 通用處理blur事件 */
    handleBlurCommon(value) {
      this.trigger('blur', {value})
    },

    /**
     *  如果事件存在的話，就觸發
     * @param name 事件名
     * @param event 事件參數
     * @param args 其他附帶參數
     */
    trigger(name, event, args = []) {
      let listener = this.listeners[name]
      if (typeof listener === 'function') {
        if (typeof event === 'object') {
          event = this.packageEvent(name, event)
        }
        listener(event, ...args)
      }
    },
    parentTrigger(name, event, args = []) {
      args.unshift(this.packageEvent(name, event))
      this.trigger('trigger', name, args)
    },
    packageEvent(name, event = {}) {
      event.row = this.row
      event.column = this.column
      //online增強參數兼容
      event.column['key'] = this.column['property']
      event.cellTarget = this
      if (!event.type) {
        event.type = name
      }
      if (!event.cellType) {
        event.cellType = this.$type
      }
      // 是否校驗表單，默認為true
      if (typeof event.validate !== 'boolean') {
        event.validate = true
      }
      return event
    },

  },
  model: {
    prop: 'value',
    event: 'change'
  },
  /**
   * 【自定義增強】用於實現一些增強事件
   * 【注】這裏只是定義接口，具體功能需要到各個組件內實現（也有部分功能實現）
   * 【注】該屬性不是Vue官方屬性，是JVxeTable組件自定義的
   *      所以方法內的 this 指向並不是當前組件，而是方法自身，
   *      也就是說並不能 this 打點調實例里的任何方法
   */
  enhanced: {
    // 註冊參數（詳見：https://xuliangzhan_admin.gitee.io/vxe-table/#/table/renderer/edit）
    installOptions: {
      // 自動聚焦的 class 類名
      autofocus: '',
    },
    // 事件攔截器（用於兼容）
    interceptor: {
      // 已實現：event.clearActived
      // 說明：比如點擊了某個組件的彈出層面板之後，此時被激活單元格不應該被自動關閉，通過返回 false 可以阻止默認的行為。
      ['event.clearActived'](params, event, target) {
        return true
      },
      // 自定義：event.clearActived.className
      // 說明：比原生的多了一個參數：className，用於判斷點擊的元素的樣式名（遞歸到頂層）
      ['event.clearActived.className'](params, event, target) {
        return true
      },
    },
    // 【功能開關】
    switches: {
      // 是否使用 editRender 模式（僅當前組件，並非全局）
      // 如果設為true，則表頭上方會出現一個可編輯的圖標
      editRender: true,
      // false = 組件觸發后可視）；true = 組件一直可視
      visible: false,
    },
    // 【切面增強】切面事件處理，一般在某些方法執行后同步執行
    aopEvents: {
      // 單元格被激活編輯時會觸發該事件
      editActived() {
      },
      // 單元格編輯狀態下被關閉時會觸發該事件
      editClosed() {
      },
    },
    // 【翻譯增強】可以實現例如select組件保存的value，但是span模式下需要显示成text
    translate: {
      // 是否啟用翻譯
      enabled: false,
      /**
       * 【翻譯處理方法】如果handler留空，則使用默認的翻譯方法
       * (this指向當前組件)
       *
       * @param value 需要翻譯的值
       * @returns{*} 返回翻譯后的數據
       */
      handler(value,) {
        // 默認翻譯方法
        return filterDictText(this.column.own.options, value)
      },
    },
    /**
     * 【獲取值增強】組件拋出的值
     * (this指向當前組件)
     *
     * @param value 保存到數據庫里的值
     * @returns{*} 返回處理后的值
     */
    getValue(value) {
      return value
    },
    /**
     * 【設置值增強】設置給組件的值
     * (this指向當前組件)
     *
     * @param value 組件觸發的值
     * @returns{*} 返回處理后的值
     */
    setValue(value) {
      return value
    },
    /**
     * 【新增行增強】在用戶點擊新增時觸發的事件，返回新行的默認值
     *
     * @param row 行數據
     * @param column 列配置，.own 是用戶配置的參數
     * @param $table vxe 實例
     * @param renderOptions 渲染選項
     * @param params 可以在這裏獲取 $table
     *
     * @returns 返回新值
     */
    createValue({row, column, $table, renderOptions, params}) {
      return column.own.defaultValue
    },
  }
}

function getListeners() {
  let listeners = Object.assign({}, (this.renderOptions.listeners || {}))
  if (!listeners.change) {
    listeners.change = async (event) => {
      vModel.call(this, event.value)
      await this.$nextTick()
      // 處理 change 事件相關邏輯（例如校驗）
      this.params.$table.updateStatus(this.params)
    }
  }
  return listeners
}

export function vModel(value, row, property) {
  if (!row) {
    row = this.row
  }
  if (!property) {
    property = this.column.property
  }
  this.$set(row, property, value)
}

/** 模擬觸發事件 */
export function dispatchEvent({cell, $event}, className, handler) {
  // alwaysEdit 下不模擬觸發事件，否者會導致觸發兩次
  if (this && this.alwaysEdit) {
    return
  }
  window.setTimeout(() => {
    let element = cell.getElementsByClassName(className)
    if (element && element.length > 0) {
      if (typeof handler === 'function') {
        handler(element[0])
      } else {
        // 模擬觸發點擊事件
        if($event){
          element[0].dispatchEvent($event)
        }
      }
    }
  }, 10)
}