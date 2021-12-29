import XEUtils from 'xe-utils'
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { JVXETypes } from '@/components/jeecg/JVxeTable/jvxeTypes'
import VxeWebSocketMixins from '../mixins/vxe.web.socket.mixins'
import { initDictOptions } from '@/components/dict/JDictSelectUtil'

import { getRefPromise } from '../utils/vxeUtils'
import { getEnhancedMixins, replaceProps } from '../utils/cellUtils'

import JVxeToolbar from './JVxeToolbar'
import JVxeSubPopover from './JVxeSubPopover'
import JVxeDetailsModal from './JVxeDetailsModal'
import JVxePagination from './JVxePagination'
import { cloneObject, getVmParentByName, pushIfNotExist, randomString, simpleDebounce } from '@/utils/util'
import { UtilTools } from 'vxe-table/packages/tools/src/utils'
import { getNoAuthCols } from '@/utils/authFilter'

export default {
  name: 'JVxeTable',
  provide() {
    return {
      superTrigger: (name, event) => this.trigger(name, event)
    }
  },
  mixins: [VxeWebSocketMixins],
  components: {JVxeToolbar, JVxeSubPopover, JVxeDetailsModal, JVxePagination},
  props: {
    rowKey: PropTypes.string.def('id'),
    // 列信息
    columns: {
      type: Array,
      required: true
    },
    // 數據源
    dataSource: {
      type: Array,
      required: true
    },
    authPre: {
      type: String,
      required: false,
      default: ''
    },
    // 是否显示工具欄
    toolbar: PropTypes.bool.def(false),
    // 工具欄配置
    toolbarConfig: PropTypes.object.def(() => ({
      // prefix 前綴；suffix 後綴；
      slots: ['prefix', 'suffix'],
      // add 新增按鈕；remove 刪除按鈕；clearSelection 清空選擇按鈕；collapse 展開收起
      btns: ['add', 'remove', 'clearSelection'],
    })),
    // 是否显示行號
    rowNumber: PropTypes.bool.def(false),
    // 是否可選擇行
    rowSelection: PropTypes.bool.def(false),
    // 選擇行類型
    rowSelectionType: PropTypes.oneOf(['checkbox', 'radio']).def('checkbox'),
    // 是否可展開行
    rowExpand: PropTypes.bool.def(false),
    // 展開行配置
    expandConfig: PropTypes.object.def(() => ({})),
    // 頁面是否在加載中
    loading: PropTypes.bool.def(false),
    height: PropTypes.instanceOf([Number, String]).def('auto'),
    // 最大高度
    maxHeight: {
      type: Number,
      default: () => null,
    },
    // 要禁用的行 TODO 未實現
    disabledRows: PropTypes.object.def(() => ({})),
    // 是否禁用全部組件
    disabled: PropTypes.bool.def(false),
    // 是否可拖拽排序 TODO 僅實現上下排序，未實現拖拽排序（可能無法實現或較為困難）
    dragSort: PropTypes.bool.def(false),
    // 排序字段保存的Key
    dragSortKey: PropTypes.string.def('orderNum'),
    // 大小，可選值有：medium（中）、small（小）、mini（微）、tiny（非常小）
    size: PropTypes.oneOf(['medium', 'small', 'mini', 'tiny']).def('medium'),
    // 是否显示邊框線
    bordered: PropTypes.bool.def(false),
    // 分頁器參數，設置了即可显示分頁器
    pagination: PropTypes.object.def(() => ({})),
    // 點擊行時是否显示子表單
    clickRowShowSubForm: PropTypes.bool.def(false),
    // 點擊行時是否显示主表單
    clickRowShowMainForm: PropTypes.bool.def(false),
    // 是否點擊選中行，優先級最低
    clickSelectRow: PropTypes.bool.def(false),
    // 是否開啟 reload 數據效果
    reloadEffect: PropTypes.bool.def(false),
    // 校驗規則
    editRules: PropTypes.object.def(() => ({})),
    // 是否異步刪除行，如果你要實現異步刪除，那麼需要把這個選項開啟，
    // 在remove事件里調用confirmRemove方法才會真正刪除（除非刪除的全是新增的行）
    asyncRemove: PropTypes.bool.def(false),
    // 是否一直显示組件，如果為false則只有點擊的時候才出現組件
    // 注：該參數不能動態修改；如果行、列字段多的情況下，會根據機器性能造成不同程度的卡頓。
    alwaysEdit: PropTypes.bool.def(false),
    // 聯動配置，數組，詳情配置見文檔
    linkageConfig: PropTypes.array.def(() => []),
  },
  data() {
    return {
      isJVXETable: true,
      // caseId，表格唯一標識
      caseId: `_j-vxe-${randomString(8)}_`,
      // 內置columns
      _innerColumns: [],
      // 內置 EditRules
      _innerEditRules: [],
      // 記錄滾動條位置
      scroll: {top: 0, left: 0},
      // 當前是否正在滾動
      scrolling: false,
      // vxe 默認配置
      defaultVxeProps: {
        'row-id': this.rowKey,
        // 高亮hover的行
        'highlight-hover-row': true,
        // 溢出隱藏並显示tooltip
        'show-overflow': true,
        // 表頭溢出隱藏並显示tooltip
        'show-header-overflow': true,
        'show-footer-overflow': true,
        // 可編輯配置
        'edit-config': {trigger: 'click', mode: 'cell', showStatus: true},
        'expand-config': {
          iconClose: 'ant-table-row-expand-icon ant-table-row-collapsed',
          iconOpen: 'ant-table-row-expand-icon ant-table-row-expanded'
        },
        // 虛擬滾動配置，y軸大於30條數據時啟用虛擬滾動
        // 'scroll-y': {
        //   gt: 30
        // },
        // 'scroll-x': {
        //   gt: 15
        // },
        'radio-config': {highlight: true},
        'checkbox-config': {highlight: true},
      },
      // 綁定左側選擇框
      selectedRows: [],
      // 綁定左側選擇框已選擇的id
      selectedRowIds: [],
      // 統計列配置
      statistics: {
        has: false,
        sum: [],
        average: [],
      },
      // 允許執行刷新特效的行ID
      reloadEffectRowKeysMap: {},
      //配置了但是沒有授權的按鈕和列 集合
      excludeCode:[],
      // 聯動下拉選項（用於隔離不同的下拉選項）
      // 內部聯動配置，map
      _innerLinkageConfig: null,
    }
  },
  computed: {

    // vxe 最終 columns
    vxeColumns() {
      this._innerColumns.forEach(column => {
        let renderOptions = {
          caseId: this.caseId,
          bordered: this.bordered,
          disabled: this.disabled,
          scrolling: this.scrolling,
          reloadEffect: this.reloadEffect,
          reloadEffectRowKeysMap: this.reloadEffectRowKeysMap,
          listeners: this.cellListeners,
        }
        if (column.$type === JVXETypes.rowDragSort) {
          renderOptions.dragSortKey = this.dragSortKey
        }
        // slot 組件特殊處理
        if (column.$type === JVXETypes.slot) {
          if (this.$scopedSlots.hasOwnProperty(column.slotName)) {
            renderOptions.slot = this.$scopedSlots[column.slotName]
            renderOptions.target = this
          }
        }
        // 處理聯動列，聯動列只能作用於 select 組件
        if (column.$type === JVXETypes.select && this._innerLinkageConfig != null) {
          // 判斷當前列是否是聯動列
          if (this._innerLinkageConfig.has(column.key)) {
            renderOptions.linkage = {
              config: this._innerLinkageConfig.get(column.key),
              getLinkageOptionsSibling: this.getLinkageOptionsSibling,
              getLinkageOptionsAsync: this.getLinkageOptionsAsync,
              linkageSelectChange: this.linkageSelectChange,
            }
          }
        }
        if (column.editRender) {
          Object.assign(column.editRender, renderOptions)
        }
        if (column.cellRender) {
          Object.assign(column.cellRender, renderOptions)
        }
        // update--begin--autor:lvdandan-----date:20201019------for:LOWCOD-882 【新行編輯】列表上帶按鈕的遮擋問題
        if (column.$type === JVXETypes.file || column.$type === JVXETypes.image) {
          if (column.width && column.width.endsWith('px')) {
            column.width = Number.parseInt(column.width.substr(0,column.width.length-2))+Number.parseInt(1)+'px';
          }
        }
        // update--begin--autor:lvdandan-----date:20201019------for:LOWCOD-882 【新行編輯】列表上帶按鈕的遮擋問題

        // update--begin--autor:lvdandan-----date:20201211------for:JT-118 【online】 日期、時間控件長度較小
        if (column.$type === JVXETypes.datetime || column.$type === JVXETypes.userSelect || column.$type === JVXETypes.departSelect) {
          let width = column.width && column.width.endsWith('px')?Number.parseInt(column.width.substr(0,column.width.length-2)):0;
          if(width <= 190){
            column.width = '190px'
          }
        }
        if (column.$type === JVXETypes.date) {
          let width = column.width && column.width.endsWith('px')?Number.parseInt(column.width.substr(0,column.width.length-2)):0;
          if(width <= 135){
            column.width = '135px'
          }
        }
        // update--end--autor:lvdandan-----date:20201211------for:JT-118 【online】 日期、時間控件長度較小
      })
      return this._innerColumns
    },
    // vxe 最終 editRules
    vxeEditRules() {
      return Object.assign({}, this.editRules, this._innerEditRules)
    },
    // vxe 最終 props
    vxeProps() {
      let expandConfig = Object.assign({}, this.defaultVxeProps['expand-config'], this.expandConfig)

      return Object.assign({}, this.defaultVxeProps, {
        showFooter: this.statistics.has,
      }, this.$attrs, {
        loading: this.loading,
        columns: this.vxeColumns,
        editRules: this.vxeEditRules,
        // data: this.dataSource,
        height: this.height === 'auto' ? null : this.height,
        maxHeight: this.maxHeight,
        border: this.bordered,
        expandConfig: expandConfig,
        footerMethod: this.handleFooterMethod,
        // footerSpanMethod: this.handleFooterSpanMethod,
      })
    },
    // vxe 最終 events
    vxeEvents() {
      // 內置事件
      let events = {
        'scroll': this.handleVxeScroll,
        'cell-click': this.handleCellClick,
        'edit-closed': this.handleEditClosed,
        'edit-actived': this.handleEditActived,
        'radio-change': this.handleVxeRadioChange,
        'checkbox-all': this.handleVxeCheckboxAll,
        'checkbox-change': this.handleVxeCheckboxChange,
      }
      // 用戶傳遞的事件，進行合併操作
      Object.keys(this.$listeners).forEach(key => {
        let listen = this.$listeners[key]
        if (events.hasOwnProperty(key)) {
          if (Array.isArray(listen)) {
            listen.push(events[key])
          } else {
            listen = [events[key], listen]
          }
        }
        events[key] = listen
      })
      return events
    },
    // 組件監聽事件
    cellListeners() {
      return {
        trigger: (name, event) => this.trigger(name, event),
        valueChange: event => this.trigger('valueChange', event),
        /** 當前行向上移一位 */
        rowMoveUp: rowIndex => this.rowResort(rowIndex, rowIndex - 1),
        /** 當前行向下移一位 */
        rowMoveDown: rowIndex => this.rowResort(rowIndex, rowIndex + 1),
        /** 在當前行下面插入一行 */
        rowInsertDown: rowIndex => this.insertRows({}, rowIndex + 1),
      }
    },
  },
  watch: {
    dataSource: {
      //   deep: true,
      immediate: true,
      async handler() {
        let vxe = await getRefPromise(this, 'vxe')

        this.dataSource.forEach((data, idx) => {
          // 開啟了排序就自動計算排序值
          if (this.dragSort) {
            this.$set(data, this.dragSortKey, idx + 1)
          }
          // 處理聯動回顯數據
          if (this._innerLinkageConfig != null) {
            for (let configItem of this._innerLinkageConfig.values()) {
              this.autoSetLinkageOptionsByData(data, '', configItem, 0)
            }
          }
        })

        // 阻斷vue監聽大數據，提高性能
        vxe.loadData(this.dataSource)

        // TODO 解析disabledRows
        // let disabled = false
        //
        // let disabledRowIds = (this.disabledRowIds || [])
        // // 解析disabledRows
        // Object.keys(this.disabledRows).forEach(disabledColKey => {
        //   // 判斷是否有該屬性
        //   if (data.hasOwnProperty(disabledColKey)) {
        //     if (disabled !== true) {
        //       let temp = this.disabledRows[disabledColKey]
        //       // 禁用規則可以是一個數組
        //       if (Array.isArray(temp)) {
        //         disabled = temp.includes(data[disabledColKey])
        //       } else {
        //         disabled = (temp === data[disabledColKey])
        //       }
        //       if (disabled) {
        //         disabledRowIds.push(row.id)
        //       }
        //     }
        //   }
        // })
      },
    },
    columns: {
      immediate: true,
      handler(columns) {
        //獲取不需要显示列
        this.loadExcludeCode()
        let _innerColumns = []
        let _innerEditRules = {}
        let {rowNumber, rowSelection, rowExpand, dragSort} = this
        let expandColumn, seqColumn, checkboxColumn, radioColumn, dragSortColumn
        if (Array.isArray(columns)) {
          this.statistics.has = false
          this.statistics.sum = []
          this.statistics.average = []

          // 處理成vxe可識別的columns
          columns.forEach(column => {
            if(this.excludeCode.indexOf(column.key)>=0){
              return false
            }
            let col = {...column}
            let {type} = col
            const enhanced = getEnhancedMixins(type)
            if (type === JVXETypes.rowNumber) {
              seqColumn = col
            } else if (type === JVXETypes.rowCheckbox) {
              checkboxColumn = col
            } else if (type === JVXETypes.rowRadio) {
              radioColumn = col
            } else if (type === JVXETypes.rowExpand) {
              expandColumn = col
            } else if (type === JVXETypes.rowDragSort) {
              dragSortColumn = col
            } else {
              col.field = col.key
              // 防止和vxeTable自帶的type起衝突
              col.$type = col.type
              delete col.type
              let renderName = 'cellRender', renderOptions = {name: JVXETypes._prefix + type}
              if (type) {
                // hidden 是特殊的組件
                if (type === JVXETypes.hidden) {
                  col.visible = false
                } else if (enhanced.switches.editRender) {
                  renderName = 'editRender'
                  renderOptions.type = (enhanced.switches.visible || this.alwaysEdit) ? 'visible' : 'default'
                }
              } else {
                renderOptions.name = JVXETypes._prefix + JVXETypes.normal
              }
              col[renderName] = renderOptions
              // 處理字典
              if (col.dictCode) {
                this._loadDictConcatToOptions(col)
              }
              // 處理校驗
              if (col.validateRules) {
                let rules = []
                if (Array.isArray(col.validateRules)) {
                  for (let rule of col.validateRules) {
                    let replace = {
                      message: replaceProps(col, rule.message)
                    }
                    if (rule.unique || rule.pattern === 'only') {
                      // 唯一校驗器
                      rule.validator = uniqueValidator.bind(this)
                    } else if (rule.pattern) {
                      // 非空
                      if (rule.pattern === fooPatterns[0].value) {
                        rule.required = true
                        delete rule.pattern
                      } else {
                        // 兼容Online表單的特殊規則
                        for (let foo of fooPatterns) {
                          if (foo.value === rule.pattern) {
                            rule.pattern = foo.pattern
                            break
                          }
                        }
                      }
                    } else if (typeof rule.handler === 'function') {
                      // 自定義函數校驗
                      rule.validator = handlerConvertToValidator.bind(this)
                    }
                    rules.push(Object.assign({}, rule, replace))
                  }
                }
                _innerEditRules[col.key] = rules
              }
              // 處理統計列
              // sum = 求和、average = 平均值
              if (Array.isArray(col.statistics)) {
                this.statistics.has = true
                col.statistics.forEach(item => {
                  let arr = this.statistics[item.toLowerCase()]
                  if (Array.isArray(arr)) {
                    pushIfNotExist(arr, col.key)
                  }
                })
              }
              _innerColumns.push(col)
            }
          })
        }
        // 判斷是否開啟了序號
        if (rowNumber) {
          let col = {type: 'seq', title: '#', width: 60, fixed: 'left', align: 'center'}
          if (seqColumn) {
            col = Object.assign(col, seqColumn, {type: 'seq'})
          }
          _innerColumns.unshift(col)
        }
        // 判斷是否開啟了可選擇行
        if (rowSelection) {
          let width = 40
          if (this.statistics.has && !rowExpand && !dragSort) {
            width = 60
          }
          let col = {type: this.rowSelectionType, width, fixed: 'left', align: 'center'}
          // radio
          if (this.rowSelectionType === 'radio' && radioColumn) {
            col = Object.assign(col, radioColumn, {type: 'radio'})
          }
          // checkbox
          if (this.rowSelectionType === 'checkbox' && checkboxColumn) {
            col = Object.assign(col, checkboxColumn, {type: 'checkbox'})
          }
          _innerColumns.unshift(col)
        }
        // 是否可展開行
        if (rowExpand) {
          let width = 40
          if (this.statistics.has && !dragSort) {
            width = 60
          }
          let col = {type: 'expand', title: '', width, fixed: 'left', align: 'center', slots: {content: 'expandContent'}}
          if (expandColumn) {
            col = Object.assign(col, expandColumn, {type: 'expand'})
          }
          _innerColumns.unshift(col)
        }
        // 是否可拖動排序
        if (dragSort) {
          let width = 40
          if (this.statistics.has) {
            width = 60
          }
          let col = {type: JVXETypes.rowDragSort, title: '', width, fixed: 'left', align: 'center', cellRender: {name: JVXETypes._prefix + JVXETypes.rowDragSort}}
          if (dragSortColumn) {
            col = Object.assign(col, dragSortColumn, {type: JVXETypes.rowDragSort})
          }
          _innerColumns.unshift(col)
        }

        this._innerColumns = _innerColumns
        this._innerEditRules = _innerEditRules
      }
    },
    // watch linkageConfig
    // 整理多級聯動配置
    linkageConfig: {
      immediate: true,
      handler() {
        if (Array.isArray(this.linkageConfig) && this.linkageConfig.length > 0) {
          // 獲取聯動的key順序
          let getLcKeys = (key, arr) => {
            let col = this._innerColumns.find(col => col.key === key)
            if (col) {
              arr.push(col.key)
              if (col.linkageKey) {
                return getLcKeys(col.linkageKey, arr)
              }
            }
            return arr
          }
          let configMap = new Map()
          this.linkageConfig.forEach(lc => {
            let keys = getLcKeys(lc.key, [])
            // 多個key共享一個，引用地址
            let configItem = {
              ...lc, keys,
              optionsMap: new Map()
            }
            keys.forEach(k => configMap.set(k, configItem))
          })
          this._innerLinkageConfig = configMap
        } else {
          this._innerLinkageConfig = null
        }
      }
    },
  },
  created() {
  },
  mounted() {
    this.handleTabsChange()
  },
  methods: {

    /**
     * 自動判斷父級是否是 <a-tabs/> 組件，然後添加事件監聽，自動重置表格
     */
    handleTabsChange() {
      // 獲取父級
      const tabs = getVmParentByName(this, 'ATabs')
      const tabPane = getVmParentByName(this, 'ATabPane')
      if (tabs && tabPane) {
        // 用戶自定義的 key
        const currentKey = tabPane.$vnode.key
        // 添加 activeKey 監聽
        const unwatch = tabs.$children[0].$watch('$data._activeKey', async (key) => {
          // 切換到自己時重新計算
          if (currentKey === key) {
            await this.$nextTick()
            await this.refreshScroll()
            await this.recalculate()
          }
        })
        // 當前實例銷毀時取消監聽
        this.$on('beforeDestroy', () => unwatch())
      }
    },

    handleVxeScroll(event) {
      let {$refs, scroll} = this

      // 記錄滾動條的位置
      scroll.top = event.scrollTop
      scroll.left = event.scrollLeft

      $refs.subPopover ? $refs.subPopover.close() : null
      this.scrolling = true
      this.closeScrolling()
    },
    // 當手動勾選單選時觸發的事件
    handleVxeRadioChange(event) {
      let row = event.$table.getRadioRecord()
      this.selectedRows = row ? [row] : []
      this.handleSelectChange('radio', this.selectedRows, event)
    },
    // 當手動勾選全選時觸發的事件
    handleVxeCheckboxAll(event) {
      this.selectedRows = event.$table.getCheckboxRecords()
      this.handleSelectChange('checkbox-all', this.selectedRows, event)
    },
    // 當手動勾選並且值發生改變時觸發的事件
    handleVxeCheckboxChange(event) {
      this.selectedRows = event.$table.getCheckboxRecords()
      this.handleSelectChange('checkbox', this.selectedRows, event)
    },
    // 行選擇change事件
    handleSelectChange(type, selectedRows, $event) {
      let action
      if (type === 'radio') {
        action = 'selected'
      } else if (type === 'checkbox') {
        action = selectedRows.includes($event.row) ? 'selected' : 'unselected'
      } else {
        action = 'selected-all'
      }

      this.selectedRowIds = selectedRows.map(row => row.id)
      this.trigger('selectRowChange', {
        type: type,
        action: action,
        $event: $event,
        row: $event.row,
        selectedRows: this.selectedRows,
        selectedRowIds: this.selectedRowIds
      })
    },

    // 點擊單元格時觸發的事件
    handleCellClick(event) {
      let {row, column, $event, $table} = event
      let {$refs} = this

      // 點擊了可編輯的
      if (column.editRender) {
        $refs.subPopover ? $refs.subPopover.close() : null
        return
      }

      // 显示詳細信息
      if (column.own.showDetails) {
        // 兩個如果同時存在的話會出現死循環
        $refs.subPopover ? $refs.subPopover.close() : null
        $refs.detailsModal ? $refs.detailsModal.open(event) : null
      } else if ($refs.subPopover) {
        $refs.subPopover.toggle(event)
      } else if (this.clickSelectRow) {
        let className = $event.target.className || ''
        className = typeof className === 'string' ? className : className.toString()
        // 點擊的是expand，不做處理
        if (className.includes('vxe-table--expand-btn')) {
          return
        }
        // 點擊的是checkbox，不做處理
        if (className.includes('vxe-checkbox--icon') || className.includes('vxe-cell--checkbox')) {
          return
        }
        // 點擊的是radio，不做處理
        if (className.includes('vxe-radio--icon') || className.includes('vxe-cell--radio')) {
          return
        }
        if (this.rowSelectionType === 'radio') {
          $table.setRadioRow(row)
          this.handleVxeRadioChange(event)
        } else {
          $table.toggleCheckboxRow(row)
          this.handleVxeCheckboxChange(event)
        }
      }
    },

    // 單元格編輯狀態下被關閉時會觸發該事件
    handleEditClosed({column}) {
      // 執行增強
      getEnhancedMixins(column.own.$type, 'aopEvents').editClosed.apply(this, arguments)
    },

    // 單元格被激活編輯時會觸發該事件
    handleEditActived({column}) {
      // 執行增強
      getEnhancedMixins(column.own.$type, 'aopEvents').editActived.apply(this, arguments)
    },

    /** 表尾數據處理方法，用於显示統計信息 */
    handleFooterMethod({columns, data}) {
      const {statistics} = this
      let footers = []
      if (statistics.has) {
        if (statistics.sum.length > 0) {
          footers.push(this.getFooterStatisticsMap({
            columns: columns,
            title: '合計',
            checks: statistics.sum,
            method: (column) => XEUtils.sum(data, column.property)
          }))
        }
        if (statistics.average.length > 0) {
          footers.push(this.getFooterStatisticsMap({
            columns: columns,
            title: '平均',
            checks: statistics.average,
            method: (column) => XEUtils.mean(data, column.property)
          }))
        }
      }
      return footers
    },

    getFooterStatisticsMap({columns, title, checks, method}) {
      return columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return title
        }
        if (checks.includes(column.property)) {
          return method(column, columnIndex)
        }
        return null
      })
    },

    /** 表尾單元格合併方法 */
    handleFooterSpanMethod(event) {
      if (event.columnIndex === 0) {
        return {colspan: 2}
      }
    },

    /*--- 外部可調用接口方法 ---*/

    /**
     * 重置滾動條Top位置
     * @param top 新top位置，留空則滾動到上次記錄的位置，用於解決切換tab選項卡時導致白屏以及自動將滾動條滾動到頂部的問題
     */
    resetScrollTop(top) {
      this.scrollTo(null, (top == null || top === '') ? this.scroll.top : top)
    },

    /**
     * 加載新數據，和 loadData 不同的是，用該方法加載的數據都是相當於點新增按鈕新增的數據。
     * 適用於不是數據庫里查出來的沒有id的臨時數據
     * @param dataSource
     */
    async loadNewData(dataSource) {
      if (Array.isArray(dataSource)) {
        let {xTable} = this.$refs.vxe.$refs
        // issues/2784
        // 先清空所有數據
        xTable.loadData([])

        dataSource.forEach((data, idx) => {
          // 開啟了排序就自動計算排序值
          if (this.dragSort) {
            this.$set(data, this.dragSortKey, idx + 1)
          }
          // 處理聯動回顯數據
          if (this._innerLinkageConfig != null) {
            for (let configItem of this._innerLinkageConfig.values()) {
              this.autoSetLinkageOptionsByData(data, '', configItem, 0)
            }
          }
        })
        // 再新增
        return xTable.insertAt(dataSource)
      }
      return []
    },

    // 校驗table，失敗返回errMap，成功返回null
    async validateTable() {
      const errMap = await this.validate().catch(errMap => errMap)
      return errMap ? errMap : null
    },
    // 完整校驗
    async fullValidateTable() {
      const errMap = await this.fullValidate().catch(errMap => errMap)
      return errMap ? errMap : null
    },

    /** 設置某行某列的值 */
    setValues(values) {
      if (!Array.isArray(values)) {
        console.warn(`JVxeTable.setValues：必須傳遞數組`)
        return
      }
      values.forEach((item, idx) => {
        let {rowKey, values: record} = item
        let {row} = this.getIfRowById(rowKey)
        if (!row) {
          return
        }
        Object.keys(record).forEach(colKey => {
          let column = this.getColumnByKey(colKey)
          if (column) {
            let oldValue = row[colKey]
            let newValue = record[colKey]
            if (newValue !== oldValue) {
              this.$set(row, colKey, newValue)
              // 觸發 valueChange 事件
              this.trigger('valueChange', {
                type: column.own.$type,
                value: newValue,
                oldValue: oldValue,
                col: column.own,
                column: column,
                isSetValues: true,
              })
            }
          } else {
            console.warn(`JVxeTable.setValues：沒有找到key為"${colKey}"的列`)
          }
        })
      })
    },

    /** 獲取所有的數據，包括values、deleteIds */
    getAll() {
      return {
        tableData: this.getTableData(),
        deleteData: this.getDeleteData()
      }
    },
    /** 獲取表格表單里的值 */
    getValues(callback, rowIds) {
      let tableData = this.getTableData({rowIds: rowIds})
      callback('', tableData)
    },
    /** 獲取表格數據 */
    getTableData(options = {}) {
      let {rowIds} = options
      let tableData
      // 僅查詢指定id的行
      if (Array.isArray(rowIds) && rowIds.length > 0) {
        tableData = []
        rowIds.forEach(rowId => {
          let {row} = this.getIfRowById(rowId)
          if (row) {
            tableData.push(row)
          }
        })
      } else {
        // 查詢所有行
        tableData = this.$refs.vxe.getTableData().fullData
      }
      return this.filterNewRows(tableData, false)
    },
    /** 僅獲取新增的數據 */
    getNewData() {
      let newData = cloneObject(this.$refs.vxe.getInsertRecords())
      newData.forEach(row => delete row.id)
      return newData
    },
    /** 僅獲取新增的數據,帶有id */
    getNewDataWithId() {
      let newData = cloneObject(this.$refs.vxe.getInsertRecords())
      return newData
    },
    /** 根據ID獲取行，新增的行也能查出來 */
    getIfRowById(id) {
      let row = this.getRowById(id), isNew = false
      if (!row) {
        row = this.getNewRowById(id)
        if (!row) {
          console.warn(`JVxeTable.getIfRowById：沒有找到id為"${id}"的行`)
          return {row: null}
        }
        isNew = true
      }
      return {row, isNew}
    },
    /** 通過臨時ID獲取新增的行 */
    getNewRowById(id) {
      let records = this.getInsertRecords()
      for (let record of records) {
        if (record.id === id) {
          return record
        }
      }
      return null
    },
    /** 僅獲取被刪除的數據（新增又被刪除的數據不會被獲取到） */
    getDeleteData() {
      return cloneObject(this.$refs.vxe.getRemoveRecords())
    },
    /**
     * 添加一行或多行
     *
     * @param rows
     * @param isOnlJs 是否是onlineJS增強觸發的
     * @return
     */
    async addRows(rows = {}, isOnlJs) {
      return this._addOrInsert(rows, -1, 'added', isOnlJs)
    },

    /**
     * 添加一行或多行
     *
     * @param rows
     * @param index 添加下標，数字，必填
     * @return
     */
    async insertRows(rows, index) {
      if (typeof index !== 'number' || index < 0) {
        console.warn(`【JVXETable】insertRows：index必須傳遞数字，且大於-1`)
        return
      }
      return this._addOrInsert(rows, index, 'inserted')
    },
    /**
     * 添加一行或多行臨時數據，不會填充默認值，傳什麼就添加進去什麼
     * @param rows
     * @param options 選項
     * @param options.setActive 是否激活最後一行的編輯模式
     */
    async pushRows(rows = {}, options = {}) {
      let {xTable} = this.$refs.vxe.$refs
      let {setActive, index} = options
      setActive = setActive == null ? false : !!setActive
      index = index == null ? -1 : index
      index = index === -1 ? index : xTable.tableFullData[index]
      // 插入行
      let result = await xTable.insertAt(rows, index)
      if (setActive) {
        // 激活最後一行的編輯模式
        xTable.setActiveRow(result.rows[result.rows.length - 1])
      }
      await this._recalcSortNumber()
      return result
    },

    /** 清空選擇行 */
    clearSelection() {
      let event = {$table: this.$refs.vxe, target: this}
      if (this.rowSelectionType === JVXETypes.rowRadio) {
        this.$refs.vxe.clearRadioRow()
        this.handleVxeRadioChange(event)
      } else {
        this.$refs.vxe.clearCheckboxRow()
        this.handleVxeCheckboxChange(event)
      }
    },

    /** 刪除一行或多行數據 */
    async removeRows(rows) {
      const res = await this._remove(rows)
      await this._recalcSortNumber()
      return res
    },

    /** 根據id刪除一行或多行 */
    removeRowsById(rowId) {
      let rowIds
      if (Array.isArray(rowId)) {
        rowIds = rowId
      } else {
        rowIds = [rowId]
      }
      let rows = rowIds.map((id) => {
        let {row} = this.getIfRowById(id)
        if (!row) {
          return
        }
        if (row) {
          return row
        } else {
          console.warn(`【JVXETable】removeRowsById：${id}不存在`)
          return null
        }
      }).filter((row) => row != null)
      return this.removeRows(rows)
    },

    getColumnByKey() {
      return this.$refs.vxe.getColumnByField.apply(this.$refs.vxe, arguments)
    },

    /* --- 輔助方法 ---*/

    // 觸發事件
    trigger(name, event = {}) {
      event.$target = this
      event.$table = this.$refs.vxe
      //online增強參數兼容
      event.target = this
      this.$emit(name, event)
    },

    /** 【多級聯動】獲取同級聯動下拉選項 */
    getLinkageOptionsSibling(row, col, config, request) {
      // 如果當前列不是頂級列
      let key = ''
      if (col.key !== config.key) {
        // 就找出聯動上級列
        let idx = config.keys.findIndex(k => col.key === k)
        let parentKey = config.keys[idx - 1]
        key = row[parentKey]
        // 如果聯動上級列沒有選擇數據，就直接返回空數組
        if (key === '' || key == null) {
          return []
        }
      } else {
        key = 'root'
      }
      let options = config.optionsMap.get(key)
      if (!Array.isArray(options)) {
        if (request) {
          let parent = key === 'root' ? '' : key
          return this.getLinkageOptionsAsync(config, parent)
        } else {
          options = []
        }
      }
      return options
    },
    /** 【多級聯動】獲取聯動下拉選項（異步） */
    getLinkageOptionsAsync(config, parent) {
      return new Promise(resolve => {
        let key = parent ? parent : 'root'
        let options
        if (config.optionsMap.has(key)) {
          options = config.optionsMap.get(key)
          if (options instanceof Promise) {
            options.then(opt => {
              config.optionsMap.set(key, opt)
              resolve(opt)
            })
          } else {
            resolve(options)
          }
        } else if (typeof config.requestData === 'function') {
          // 調用requestData方法，通過傳入parent來獲取子級
          let promise = config.requestData(parent)
          config.optionsMap.set(key, promise)
          promise.then(opt => {
            config.optionsMap.set(key, opt)
            resolve(opt)
          })
        } else {
          resolve([])
        }
      })
    },
    // 【多級聯動】 用於回顯數據，自動填充 optionsMap
    autoSetLinkageOptionsByData(data, parent, config, level) {
      if (level === 0) {
        this.getLinkageOptionsAsync(config, '')
      } else {
        this.getLinkageOptionsAsync(config, parent)
      }
      if (config.keys.length - 1 > level) {
        let value = data[config.keys[level]]
        if (value) {
          this.autoSetLinkageOptionsByData(data, value, config, level + 1)
        }
      }
    },
    // 【多級聯動】聯動組件change時，清空下級組件
    linkageSelectChange(row, col, config, value) {
      if (col.linkageKey) {
        this.getLinkageOptionsAsync(config, value)
        let idx = config.keys.findIndex(k => k === col.key)
        let values = {}
        for (let i = idx; i < config.keys.length; i++) {
          values[config.keys[i]] = ''
        }
        // 清空後幾列的數據
        this.setValues([{rowKey: row.id, values}])
      }
    },

    /** 加載數據字典併合併到 options */
    _loadDictConcatToOptions(column) {
      initDictOptions(column.dictCode).then((res) => {
        if (res.success) {
          let newOptions = (column.options || [])// .concat(res.result)
          res.result.forEach(item => {
            // 過濾重複數據
            for (let option of newOptions) if (option.value === item.value) return
            newOptions.push(item)
          })
          this.$set(column, 'options', newOptions)
        } else {
          console.group(`JVxeTable 查詢字典(${column.dictCode})發生異常`)
          console.warn(res.message)
          console.groupEnd()
        }
      })
    },
    //options自定義賦值 刷新
    virtualRefresh(){
      this.scrolling = true
      this.closeScrolling()
    },
    // 設置 this.scrolling 防抖模式
    closeScrolling: simpleDebounce(function () {
      this.scrolling = false
    }, 100),

    /**
     * 過濾添加的行
     * @param rows 要篩選的行數據
     * @param remove true = 刪除新增，false=只刪除id
     * @param handler function
     */
    filterNewRows(rows, remove = true, handler) {
      let insertRecords = this.$refs.vxe.getInsertRecords()
      let records = []
      for (let row of rows) {
        let item = cloneObject(row)
        if (insertRecords.includes(row)) {
          handler ? handler({item, row, insertRecords}) : null

          if (remove) {
            continue
          }
          delete item.id
        }
        records.push(item)
      }
      return records
    },

    // 刪除選中的數據
    async removeSelection() {
      let res = await this._remove(this.selectedRows)
      this.clearSelection()
      await this._recalcSortNumber()
      return res
    },

    /**
     * 【刪除指定行數據】（重寫vxeTable的內部方法，添加了從keepSource中刪除）
     * 如果傳 row 則刪除一行
     * 如果傳 rows 則刪除多行
     * 如果為空則刪除所有
     */
    _remove(rows) {
      const xTable = this.$refs.vxe.$refs.xTable

      const {afterFullData, tableFullData, tableSourceData, editStore, treeConfig, checkboxOpts, selection, isInsertByRow, scrollYLoad} = xTable
      const {actived, removeList, insertList} = editStore
      const {checkField: property} = checkboxOpts
      let rest = []
      const nowData = afterFullData
      if (treeConfig) {
        throw new Error(UtilTools.getLog('vxe.error.noTree', ['remove']))
      }
      if (!rows) {
        rows = tableFullData
      } else if (!XEUtils.isArray(rows)) {
        rows = [rows]
      }
      // 如果是新增，則保存記錄
      rows.forEach(row => {
        if (!isInsertByRow(row)) {
          removeList.push(row)
        }
      })
      // 如果綁定了多選屬性，則更新狀態
      if (!property) {
        XEUtils.remove(selection, row => rows.indexOf(row) > -1)
      }
      // 從數據源中移除
      if (tableFullData === rows) {
        rows = rest = tableFullData.slice(0)
        tableFullData.length = 0
        nowData.length = 0
      } else {
        rest = XEUtils.remove(tableFullData, row => rows.indexOf(row) > -1)
        XEUtils.remove(nowData, row => rows.indexOf(row) > -1)
      }
      // 【從keepSource中刪除】
      if (xTable.keepSource) {
        let rowIdSet = new Set(rows.map(row => row.id))
        XEUtils.remove(tableSourceData, row => rowIdSet.has(row.id))
      }

      // 如果當前行被激活編輯，則清除激活狀態
      if (actived.row && rows.indexOf(actived.row) > -1) {
        xTable.clearActived()
      }
      // 從新增中移除已刪除的數據
      XEUtils.remove(insertList, row => rows.indexOf(row) > -1)
      xTable.handleTableData()
      xTable.updateFooter()
      xTable.updateCache()
      xTable.checkSelectionStatus()
      if (scrollYLoad) {
        xTable.updateScrollYSpace()
      }
      return xTable.$nextTick().then(() => {
        xTable.recalculate()
        return {row: rest.length ? rest[rest.length - 1] : null, rows: rest}
      })
    },

    /** 行重新排序 */
    async rowResort(oldIndex, newIndex) {
      const xTable = this.$refs.vxe.$refs.xTable
      window.xTable = xTable
      const sort = (array) => {
        // 存儲舊數據，並刪除舊項目
        let row = array.splice(oldIndex, 1)[0]
        // 向新項目里添加舊數據
        array.splice(newIndex, 0, row)
      }
      sort(xTable.tableFullData)
      if (xTable.keepSource) {
        sort(xTable.tableSourceData)
      }
      await this.$nextTick()
      await this._recalcSortNumber()
    },

    /** 重新計算排序字段的數值 */
    async _recalcSortNumber() {
      const xTable = this.$refs.vxe.$refs.xTable
      if (this.dragSort) {
        xTable.tableFullData.forEach((data, idx) => data[this.dragSortKey] = (idx + 1))
      }
      await xTable.updateCache(true)
      return await xTable.updateData()
    },

    async _addOrInsert(rows = {}, index, triggerName, isOnlJs) {
      let {xTable} = this.$refs.vxe.$refs
      let records
      if (Array.isArray(rows)) {
        records = rows
      } else {
        records = [rows]
      }
      // 遍歷添加默認值
      records.forEach(record => this._createRow(record))
      let result = await this.pushRows(records, {index: index, setActive: true})
      // 遍歷插入的行
      // update--begin--autor:lvdandan-----date:20201117------for:LOWCOD-987 【新行編輯】js增強附表內置方法調用問題 #1819
      // online js增強時以傳過來值為準，不再賦默認值
      if (isOnlJs != true) {
        for (let i = 0; i < result.rows.length; i++) {
          let row = result.rows[i]
          this.trigger(triggerName, {
            row: row,
            $table: xTable,
            target: this,
          })
        }
      }
      // update--end--autor:lvdandan-----date:20201117------for:LOWCOD-987 【新行編輯】js增強附表內置方法調用問題 #1819
      return result
    },
    // 創建新行，自動添加默認值
    _createRow(record = {}) {
      let {xTable} = this.$refs.vxe.$refs
      // 添加默認值
      xTable.tableFullColumn.forEach(column => {
        let col = column.own
        if (col.key && (record[col.key] == null || record[col.key] === '')) {
          // 設置默認值
          let createValue = getEnhancedMixins(col.$type || col.type, 'createValue')
          record[col.key] = createValue({row: record, column, $table: xTable})
        }
        // update-begin--author:sunjianlei---date:20210819------for: 處理聯動列，聯動列只能作用於 select 組件
        if (col.$type === JVXETypes.select && this._innerLinkageConfig != null) {
          // 判斷當前列是否是聯動列
          if (this._innerLinkageConfig.has(col.key)) {
            let configItem = this._innerLinkageConfig.get(col.key)
            this.getLinkageOptionsAsync(configItem, '')
          }
        }
        // update-end--author:sunjianlei---date:20210819------for: 處理聯動列，聯動列只能作用於 select 組件
      })
      return record
    },

    /*--- 渲染函數 ---*/

    // 渲染 vxe
    renderVxeGrid(h) {
      return h('vxe-grid', {
        ref: 'vxe',
        class: ['j-vxe-table'],
        props: this.vxeProps,
        on: this.vxeEvents,
        // 作用域插槽的格式為
        scopedSlots: this.$scopedSlots,
      })
    },
    // 渲染工具欄
    renderToolbar(h) {
      if (this.toolbar) {
        return h('j-vxe-toolbar', {
          props: {
            toolbarConfig: this.toolbarConfig,
            excludeCode: this.excludeCode,
            size: this.size,
            disabled: this.disabled,
            disabledRows: this.disabledRows,
            selectedRowIds: this.selectedRowIds,
          },
          on: {
            // 新增事件
            add: () => this.addRows(),
            // 保存事件
            save: () => this.trigger('save', {
              $table: this.$refs.vxe,
              target: this,
            }),
            // 刪除事件
            remove: () => {
              let $table = this.$refs.vxe
              let deleteRows = this.filterNewRows(this.selectedRows)
              // 觸發刪除事件
              if (deleteRows.length > 0) {
                let removeEvent = {deleteRows, $table, target: this}
                if (this.asyncRemove) {
                  // 確認刪除，只有調用這個方法才會真刪除
                  removeEvent.confirmRemove = () => this.removeSelection()
                } else {
                  this.removeSelection()
                }
                this.trigger('remove', removeEvent)
              } else {
                this.removeSelection()
              }
            },
            // 清除選擇事件
            clearSelection: this.clearSelection
          },
          scopedSlots: {
            toolbarPrefix: this.$scopedSlots.toolbarPrefix,
            toolbarSuffix: this.$scopedSlots.toolbarSuffix,
          },
        })
      }
      return null
    },
    // 渲染 toolbarAfter 插槽
    renderToolbarAfterSlot() {
      if (this.$scopedSlots['toolbarAfter']) {
        return this.$scopedSlots['toolbarAfter']()
      }
      return null
    },
    // 渲染點擊時彈出的子表
    renderSubPopover(h) {
      if (this.clickRowShowSubForm && this.$scopedSlots.subForm) {
        return h('j-vxe-sub-popover', {
          ref: 'subPopover',
          scopedSlots: {
            subForm: this.$scopedSlots.subForm,
          }
        })
      }
      return null
    },
    // 渲染點擊時彈出的詳細信息
    renderDetailsModal(h) {
      if (this.clickRowShowMainForm && this.$scopedSlots.mainForm) {
        return h('j-vxe-details-modal', {
          ref: 'detailsModal',
          scopedSlots: {
            subForm: this.clickRowShowSubForm ? this.$scopedSlots.subForm : null,
            mainForm: this.$scopedSlots.mainForm
          }
        })
      }
    },
    // 渲染分頁器
    renderPagination(h) {
      if (this.pagination && Object.keys(this.pagination).length > 0) {
        return h('j-vxe-pagination', {
          props: {
            size: this.size,
            disabled: this.disabled,
            pagination: this.pagination
          },
          on: {
            change: (e) => this.trigger('pageChange', e)
          },
        })
      }
      return null
    },
    loadExcludeCode(){
      if(!this.authPre || this.authPre.length==0){
        this.excludeCode = []
      }else{
        let pre = this.authPre
        if(!pre.endsWith(':')){
          pre += ':'
        }
        this.excludeCode = getNoAuthCols(pre)
      }
    }

  },
  render(h) {
    return h('div', {
      class: ['j-vxe-table-box', `size--${this.size}`]
    }, [
      this.renderSubPopover(h),
      this.renderDetailsModal(h),
      this.renderToolbar(h),
      this.renderToolbarAfterSlot(),
      this.renderVxeGrid(h),
      this.renderPagination(h),
    ])
  },
  beforeDestroy() {
    this.$emit('beforeDestroy')
  }
}

// 兼容 online 的規則
const fooPatterns = [
  {title: '非空', value: '*', pattern: /^.+$/},
  {title: '6到16位数字', value: 'n6-16', pattern: /^\d{6,16}$/},
  {title: '6到16位任意字符', value: '*6-16', pattern: /^.{6,16}$/},
  {title: '6到18位字母', value: 's6-18', pattern: /^[a-z|A-Z]{6,18}$/},
  {title: '網址', value: 'url', pattern: /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/},
  {title: '電子郵件', value: 'e', pattern: /^([\w]+\.*)([\w]+)@[\w]+\.\w{3}(\.\w{2}|)$/},
  {title: '手機號碼', value: 'm', pattern: /^1[3456789]\d{9}$/},
  {title: '郵政編碼', value: 'p', pattern: /^[1-9]\d{5}$/},
  {title: '字母', value: 's', pattern: /^[A-Z|a-z]+$/},
  {title: '数字', value: 'n', pattern: /^-?\d+(\.?\d+|\d?)$/},
  {title: '整數', value: 'z', pattern: /^-?\d+$/},
  {title: '金額', value: 'money', pattern: /^(([1-9][0-9]*)|([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2}))$/},
]

/** 舊版handler轉為新版Validator */
function handlerConvertToValidator(event) {
  const {column, rule} = event
  return new Promise((resolve, reject) => {
    rule.handler(event, (flag, msg) => {
      let message = rule.message
      if (typeof msg === 'string') {
        message = replaceProps(column.own, msg)
      }
      if (flag == null) {
        resolve(message)
      } else if (!!flag) {
        resolve(message)
      } else {
        reject(new Error(message))
      }
    }, this, event)
  })
}

/** 唯一校驗器 */
function uniqueValidator(event) {
  const {cellValue, column, rule} = event
  let tableData = this.getTableData()
  let findCount = 0
  for (let rowData of tableData) {
    if (rowData[column.own.key] === cellValue) {
      if (++findCount >= 2) {
        return Promise.reject(new Error(rule.message))
      }
    }
  }
  return Promise.resolve()
}