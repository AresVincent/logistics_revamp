import { getVmParentByName } from '@/utils/util'
import { JVXETypes } from '@comp/jeecg/JVxeTable/index'

export const VALIDATE_FAILED = Symbol()

/**
 * 獲取指定的 $refs 對象
 * 有時候可能會遇到組件未掛載到頁面中的情況，導致無法獲取 $refs 中的某個對象
 * 這個方法可以等待掛載完成之後再返回 $refs 的對象，避免報錯
 * @author sunjianlei
 **/
export function getRefPromise(vm, name) {
  return new Promise((resolve) => {
    (function next() {
      let ref = vm.$refs[name]
      if (ref) {
        resolve(ref)
      } else {
        setTimeout(() => {
          next()
        }, 10)
      }
    })()
  })
}

/** 獲取某一数字輸入框列中的最大的值 */
export function getInputNumberMaxValue(col, rowsValues) {
  let maxNum = 0
  Object.values(rowsValues).forEach((rowValue, index) => {
    let val = rowValue[col.key], num
    try {
      num = Number.parseFloat(val)
    } catch {
      num = 0
    }
    // 把首次循環的結果當成最大值
    if (index === 0) {
      maxNum = num
    } else {
      maxNum = (num > maxNum) ? num : maxNum
    }
  })
  return maxNum
}

/**
 *
 * 根據 tagName 獲取父級節點
 *
 * @param dom 一級dom節點
 * @param tagName 標籤名，不區分大小寫
 * @return {HTMLElement | NULL}
 */
export function getParentNodeByTagName(dom, tagName = 'body') {
  if (tagName === 'body') {
    return document.body
  }
  if (dom.parentNode) {
    if (dom.parentNode.tagName.toLowerCase() === tagName.trim().toLowerCase()) {
      return dom.parentNode
    } else {
      return getParentNodeByTagName(dom.parentNode, tagName)
    }
  } else {
    return null
  }
}

/**
 * vxe columns 封裝成高級查詢可識別的選項
 * @param columns
 * @param handler 單獨處理方法
 */
export function vxePackageToSuperQuery(columns, handler) {
  if (Array.isArray(columns)) {
    // 高級查詢所需要的參數
    let fieldList = []
    // 遍歷列
    for (let i = 0; i < columns.length; i++) {
      let col = columns[i]
      if (col.type === JVXETypes.rowCheckbox ||
        col.type === JVXETypes.rowRadio ||
        col.type === JVXETypes.rowExpand ||
        col.type === JVXETypes.rowNumber
      ) {
        continue
      }
      let field = {
        type: 'string',
        value: col.key,
        text: col.title,
        dictCode: col.dictCode || col.dict,
      }
      if (col.type === JVXETypes.date || col.type === JVXETypes.datetime) {
        field.type = col.type
        field.format = col.format
      }
      if (col.type === JVXETypes.inputNumber) {
        field.type = 'int'
      }
      if (Array.isArray(col.options)) {
        field.options = col.options
      }
      if (typeof handler === 'function') {
        Object.assign(field, handler(col, idx))
      }
      fieldList.push(field)
    }
    return fieldList
  } else {
    console.error('columns必須是一個數組')
  }
  return null
}

/**
 * 一次性驗證主表單和所有的次表單
 * @param form 主表單 form 對象
 * @param cases 接收一個數組，每項都是一個JVxeTable實例
 * @param autoJumpTab
 * @returns {Promise<any>}
 * @author sunjianlei
 */
export async function validateFormAndTables(form, cases, autoJumpTab) {
  if (!(form && typeof form.validateFields === 'function')) {
    throw `form 參數需要的是一個form對象，而傳入的卻是${typeof form}`
  }
  let dataMap = {}
  let values = await new Promise((resolve, reject) => {
    // 驗證主表表單
    form.validateFields((err, values) => {
      err ? reject({error: VALIDATE_FAILED, originError: err}) : resolve(values)
    })
  })
  Object.assign(dataMap, {formValue: values})
  // 驗證所有子表的表單
  let subData = await validateTables(cases, autoJumpTab)
  // 合併最終數據
  dataMap = Object.assign(dataMap, {tablesValue: subData})
  return dataMap
}

/**
 * 一次性驗證主表單和所有的次表單
 * @param form 主表單 form 對象
 * @param cases 接收一個數組，每項都是一個JVxeTable實例
 * @param autoJumpTab
 * @returns {Promise<any>}
 * @author sunjianlei
 */
export async function validateFormModelAndTables(form,formData, cases, autoJumpTab) {
  if (!(form && typeof form.validate === 'function')) {
    throw `form 參數需要的是一個form對象，而傳入的卻是${typeof form}`
  }
  let dataMap = {}
  let values = await new Promise((resolve, reject) => {
    // 驗證主表表單
    form.validate((valid,obj) => {
      valid ?resolve(formData): reject({error: VALIDATE_FAILED, originError: valid})
    })
  })
  Object.assign(dataMap, {formValue: values})
  // 驗證所有子表的表單
  let subData = await validateTables(cases, autoJumpTab)
  // 合併最終數據
  dataMap = Object.assign(dataMap, {tablesValue: subData})
  return dataMap
}

/**
 * 驗證並獲取一個或多個表格的所有值
 *
 * @param cases 接收一個數組，每項都是一個JVxeTable實例
 * @param autoJumpTab 校驗失敗后，是否自動跳轉tab選項
 */
export function validateTables(cases, autoJumpTab = true) {
  if (!Array.isArray(cases)) {
    throw `'validateTables'函數的'cases'參數需要的是一個數組，而傳入的卻是${typeof cases}`
  }
  return new Promise((resolve, reject) => {
    let tablesData = []
    let index = 0
    if (!cases || cases.length === 0) {
      resolve()
    }
    (function next() {
      let vm = cases[index]
      vm.validateTable().then(errMap => {
        // 校驗通過
        if (!errMap) {
          tablesData[index] = vm.getAll()
          // 判斷校驗是否全部完成，完成返回成功，否則繼續進行下一步校驗
          if (++index === cases.length) {
            resolve(tablesData)
          } else (
            next()
          )
        } else {
          // 嘗試獲取tabKey，如果在ATab組件內即可獲取
          let paneKey
          let tabPane = getVmParentByName(vm, 'ATabPane')
          if (tabPane) {
            paneKey = tabPane.$vnode.key
            // 自動跳轉到該表格
            if (autoJumpTab) {
              let tabs = getVmParentByName(tabPane, 'Tabs')
              tabs && tabs.setActiveKey && tabs.setActiveKey(paneKey)
            }
          }
          // 出現未驗證通過的表單，不再進行下一步校驗，直接返回失敗
          reject({error: VALIDATE_FAILED, index, paneKey, errMap})
        }
      })
    })()
  })
}