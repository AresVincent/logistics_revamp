import { AllCells, JVXETypes } from '@/components/jeecg/JVxeTable'
import JVxeCellMixins from '../mixins/JVxeCellMixins'

export const JVXERenderType = {
  editer: 'editer',
  spaner: 'spaner',
  default: 'default',
}

/** 安裝所有vxe組件 */
export function installAllCell(VXETable) {
  // 遍歷所有組件批量註冊
  Object.keys(AllCells).forEach(type => installOneCell(VXETable, type))
}

/** 安裝單個vxe組件 */
export function installOneCell(VXETable, type) {
  const switches = getEnhancedMixins(type, 'switches')
  if (switches.editRender === false) {
    installCellRender(VXETable, type, AllCells[type])
  } else {
    installEditRender(VXETable, type, AllCells[type])
  }
}

/** 註冊可編輯組件 */
export function installEditRender(VXETable, type, comp, spanComp) {
  // 獲取當前組件的增強
  const enhanced = getEnhancedMixins(type)
  // span 組件
  if (!spanComp && AllCells[type + ':span']) {
    spanComp = AllCells[type + ':span']
  } else {
    spanComp = AllCells[JVXETypes.normal]
  }
  // 添加渲染
  VXETable.renderer.add(JVXETypes._prefix + type, {
    // 可編輯模板
    renderEdit: createRender(comp, enhanced, JVXERenderType.editer),
    // 显示模板
    renderCell: createRender(spanComp, enhanced, JVXERenderType.spaner),
    // 增強註冊
    ...enhanced.installOptions,
  })
}

/** 註冊普通組件 */
export function installCellRender(VXETable, type, comp = AllCells[JVXETypes.normal]) {
  // 獲取當前組件的增強
  const enhanced = getEnhancedMixins(type)
  VXETable.renderer.add(JVXETypes._prefix + type, {
    // 默認显示模板
    renderDefault: createRender(comp, enhanced, JVXERenderType.default),
    // 增強註冊
    ...enhanced.installOptions,
  })
}

function createRender(comp, enhanced, renderType) {
  return function (h, renderOptions, params) {
    return [h(comp, {
      props: {
        value: params.row[params.column.property],
        row: params.row,
        column: params.column,
        params: params,
        renderOptions: renderOptions,
        renderType: renderType,
      }
    })]
  }
}

// 已混入的組件增強
const AllCellsMixins = new Map()

/** 獲取某個組件的增強 */
export function getEnhanced(type) {
  let cell = AllCells[type]
  if (cell && cell.enhanced) {
    return cell.enhanced
  }
  return null
}

/**
 * 獲取某個組件的增強（混入默認值）
 *
 * @param type JVXETypes
 * @param name 可空，增強名稱，留空返回所有增強
 */
export function getEnhancedMixins(type, name) {
  const getByName = (e) => name ? e[name] : e
  if (AllCellsMixins.has(type)) {
    return getByName(AllCellsMixins.get(type))
  }
  let defEnhanced = JVxeCellMixins.enhanced
  let enhanced = getEnhanced(type)
  if (enhanced) {
    Object.keys(defEnhanced).forEach(key => {
      let def = defEnhanced[key]
      if (enhanced.hasOwnProperty(key)) {
        // 方法如果存在就不覆蓋
        if (typeof def !== 'function' && typeof def !== 'string') {
          enhanced[key] = Object.assign({}, def, enhanced[key])
        }
      } else {
        enhanced[key] = def
      }
    })
    AllCellsMixins.set(type, enhanced)
    return getByName(enhanced)
  }
  AllCellsMixins.set(type, defEnhanced)
  return getByName(defEnhanced)
}


/** 輔助方法：替換${...}變量 */
export function replaceProps(col, value) {
  if (value && typeof value === 'string') {
    let text = value
    text = text.replace(/\${title}/g, col.title)
    text = text.replace(/\${key}/g, col.key)
    text = text.replace(/\${defaultValue}/g, col.defaultValue)
    return text
  }
  return value
}
