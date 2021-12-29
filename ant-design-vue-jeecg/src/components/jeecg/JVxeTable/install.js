import Vue from 'vue'
import { getEventPath } from '@/utils/util'
import JVxeTable, { AllCells, JVXETypes } from './index'
import './less/j-vxe-table.less'
// 引入 vxe-table
import 'xe-utils'
import VXETable, { Grid } from 'vxe-table'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table/lib/index.css'
import 'vxe-table-plugin-antd/dist/style.css'
import { getEnhancedMixins, installAllCell, installOneCell } from '@/components/jeecg/JVxeTable/utils/cellUtils'

// VxeGrid所有的方法映射
const VxeGridMethodsMap = {}
Object.keys(Grid.methods).forEach(key => {
  // 使用eval可以避免閉包（但是要注意不要寫es6的代碼）
  VxeGridMethodsMap[key] = eval(`(function(){return this.$refs.vxe.${key}.apply(this.$refs.vxe,arguments)})`)
})
// 將Grid所有的方法都映射（繼承）到JVxeTable上
JVxeTable.methods = Object.assign({}, VxeGridMethodsMap, JVxeTable.methods)

// VXETable 全局配置
const VXETableSettings = {
  // z-index 起始值
  zIndex: 1000,
  table: {
    validConfig: {
      // 校驗提示方式：強制使用tooltip
      message: 'tooltip'
    }
  }
}

// 執行註冊方法
Vue.use(VXETable, VXETableSettings)
VXETable.use(VXETablePluginAntd)
Vue.component(JVxeTable.name, JVxeTable)

// 註冊自定義組件
installAllCell(VXETable)

// 添加事件攔截器 event.clearActived
// 比如點擊了某個組件的彈出層面板之後，此時被激活單元格不應該被自動關閉，通過返回 false 可以阻止默認的行為。
VXETable.interceptor.add('event.clearActived', function (params, event, target) {
  // 獲取組件增強
  let col = params.column.own
  const interceptor = getEnhancedMixins(col.$type, 'interceptor')
  // 執行增強
  let flag = interceptor['event.clearActived'].apply(this, arguments)
  if (flag === false) {
    return false
  }

  let path = getEventPath(event)
  for (let p of path) {
    let className = p.className || ''
    className = typeof className === 'string' ? className : className.toString()

    /* --- 特殊處理以下組件，點擊以下標籤時不清空編輯狀態 --- */

    // 點擊的標籤是JInputPop
    if (className.includes('j-input-pop')) {
      return false
    }
    // 點擊的標籤是JPopup的彈出層、部門選擇、用戶選擇
    if (className.includes('j-popup-modal') || className.includes('j-depart-select-modal') || className.includes('j-user-select-modal')) {
      return false
    }
    // 執行增強
    let flag = interceptor['event.clearActived.className'].apply(this, [className, ...arguments])
    if (flag === false) {
      return false
    }
  }
})

/**
 * 註冊map
 * @param type 類型
 * @param cell 輸入組件
 * @param span 显示組件，可空，默認為 JVxeNormalCell 組件
 */
export function mapCell(type, cell, span) {
  let cells = {[type]: cell}
  if (span) {
    cells[type + ':span'] = span
  }
  return cells
}

/**
 * 註冊自定義組件
 *
 * @param type 類型
 * @param cell 輸入組件
 * @param span 显示組件，可空，默認為 JVxeNormalCell 組件
 */
export function installCell(type, cell, span) {
  let exclude = [JVXETypes.rowNumber, JVXETypes.rowCheckbox, JVXETypes.rowRadio, JVXETypes.rowExpand, JVXETypes.rowDragSort]
  if (exclude.includes(type)) {
    throw new Error(`【installCell】不能使用"${type}"作為組件的type，因為這是關鍵字。`)
  }
  Object.assign(AllCells, mapCell(type, cell, span))
  installOneCell(VXETable, type)
}
