import { getVmParentByName } from '@/utils/util'

const FormTypes = {
  normal: 'normal',
  input: 'input',
  inputNumber: 'inputNumber',
  checkbox: 'checkbox',
  select: 'select',
  date: 'date',
  datetime: 'datetime',
  time: 'time',
  upload: 'upload',
  file: 'file',
  image: 'image',
  popup:'popup',
  list_multi:"list_multi",
  sel_search:"sel_search",
  sel_search_async:"sel_search_async",
  radio:'radio',
  checkbox_meta:"checkbox_meta",
  input_pop:'input_pop',
  sel_depart: 'sel_depart',
  sel_user: 'sel_user',
  slot: 'slot',
  hidden: 'hidden'
}
const VALIDATE_NO_PASSED = Symbol()
export { FormTypes, VALIDATE_NO_PASSED }

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

/**
 * 一次性驗證主表單和所有的次表單
 * @param form 主表單 form 對象
 * @param cases 接收一個數組，每項都是一個JEditableTable實例
 * @returns {Promise<any>}
 * @author sunjianlei
 */
export function validateFormAndTables(form, cases) {

  if (!(form && typeof form.validateFields === 'function')) {
    throw `form 參數需要的是一個form對象，而傳入的卻是${typeof form}`
  }

  let options = {}
  return new Promise((resolve, reject) => {
    // 驗證主表表單
    form.validateFields((err, values) => {
      err ? reject({ error: VALIDATE_NO_PASSED }) : resolve(values)
    })
  }).then(values => {
    Object.assign(options, { formValue: values })
    // 驗證所有子表的表單
    return validateTables(cases)
  }).then(all => {
    Object.assign(options, { tablesValue: all })
    return Promise.resolve(options)
  }).catch(error => {
    return Promise.reject(error)
  })

}
/**
 * 一次性驗證主表單和所有的次表單(新版本)
 * @param form 主表單 form 對象
 * @param cases 接收一個數組，每項都是一個JEditableTable實例
 * @returns {Promise<any>}
 * @author sunjianlei
 */
export function validateFormModelAndTables(form,values, cases,isDelId) {

  if (!(form && typeof form.validate === 'function')) {
    throw `form 參數需要的是一個form對象，而傳入的卻是${typeof form}`
  }
  let options = {}
  return new Promise((resolve, reject) => {
    // 驗證主表表單
    form.validate((valid,obj) => {
      valid ?resolve(values):reject({ error: VALIDATE_NO_PASSED })
    })
  }).then(values => {
    Object.assign(options, { formValue: values })
    // 驗證所有子表的表單
    console.log('驗證子表',isDelId,'真')
    if(isDelId){
      return validateTables(cases,isDelId)
    }
    return validateTables(cases)
  }).then(all => {
    Object.assign(options, { tablesValue: all })
    return Promise.resolve(options)
  }).catch(error => {
    return Promise.reject(error)
  })

}

/**
 * 驗證並獲取一個或多個表格的所有值
 * @param cases 接收一個數組，每項都是一個JEditableTable實例
 * @param deleteTempId 是否刪除臨時ID，如果設為true，行編輯就不返回新增行的ID，ID需要後台生成
 * @author sunjianlei
 */
export function validateTables(cases, deleteTempId) {
  console.log('是否新增行：',deleteTempId)
  if (!(cases instanceof Array)) {
    throw `'validateTables'函數的'cases'參數需要的是一個數組，而傳入的卻是${typeof cases}`
  }
  return new Promise((resolve, reject) => {
    let tables = []
    let index = 0;
    if(!cases || cases.length === 0){
      resolve()
    }
    (function next() {
      let vm = cases[index]
      vm.getAll(true, deleteTempId).then(all => {
        tables[index] = all
        // 判斷校驗是否全部完成，完成返回成功，否則繼續進行下一步校驗
        if (++index === cases.length) {
          resolve(tables)
        } else (
          next()
        )
      }, error => {
        // 出現未驗證通過的表單，不再進行下一步校驗，直接返回失敗並跳轉到該表格
        if (error === VALIDATE_NO_PASSED) {
          // 嘗試獲取tabKey，如果在ATab組件內即可獲取
          let paneKey;
          let tabPane = getVmParentByName(vm, 'ATabPane')
          if (tabPane) {
            paneKey = tabPane.$vnode.key
          }
          reject({error: VALIDATE_NO_PASSED, index, paneKey})
        }
        reject(error)
      })
    })()
  })
}