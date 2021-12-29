import Vue from 'vue'
import * as api from '@/api/api'
import { isURL } from '@/utils/validate'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import onlineCommons from '@jeecg/antd-online-mini'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : (hour <= 11 ? '上午好' : (hour <= 13 ? '中午好' : (hour < 20 ? '下午好' : '晚上好')))
}

export function welcome() {
  const arr = ['休息一會兒吧', '準備吃什麼呢?', '要不要打一把 DOTA', '我猜你可能累了']
  let index = Math.floor((Math.random()*arr.length))
  return arr[index]
}

/**
 * 觸發 window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * 過濾對象中為空的屬性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for ( let key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}

/**
 * 時間格式化
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  let regPos = /^\d+(\.\d+)?$/;
  if(regPos.test(value)){
    //如果是数字
    let getDate = new Date(value);
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  }else{
    //TODO
    value = value.trim();
    return value.substr(0,fmt.length);
  }
}

// 生成首頁路由
export function generateIndexRouter(data) {
let indexRouter = [{
          path: '/',
          name: 'dashboard',
          //component: () => import('@/components/layouts/BasicLayout'),
          component: resolve => require(['@/components/layouts/TabLayout'], resolve),
          meta: { title: '首頁' },
          redirect: '/dashboard/analysis',
          children: [
            ...generateChildRouters(data)
          ]
        },{
          "path": "*", "redirect": "/404", "hidden": true
        }]
  return indexRouter;
}

// 生成嵌套路由（子路由）

function  generateChildRouters (data) {
  const routers = [];
  for (let item of data) {
    let component = "";
    if(item.component.indexOf("layouts")>=0){
       component = "components/"+item.component;
    }else{
       component = "views/"+item.component;
    }

    // eslint-disable-next-line
    let URL = (item.meta.url|| '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2)) // URL支持{{ window.xxx }}佔位符變量
    if (isURL(URL)) {
      item.meta.url = URL;
    }

    let componentPath
    if(item.component=="modules/online/cgform/OnlCgformHeadList"){
      componentPath = onlineCommons.OnlCgformHeadList
    }else if(item.component=="modules/online/cgform/OnlCgformCopyList"){
      componentPath = onlineCommons.OnlCgformCopyList
    }else if(item.component=="modules/online/cgform/auto/OnlCgformAutoList"){
      componentPath = onlineCommons.OnlCgformAutoList
    }else if(item.component=="modules/online/cgform/auto/OnlCgformTreeList"){
      componentPath = onlineCommons.OnlCgformTreeList
    }else if(item.component=="modules/online/cgform/auto/erp/OnlCgformErpList"){
      componentPath = onlineCommons.OnlCgformErpList
    }else if(item.component=="modules/online/cgform/auto/tab/OnlCgformTabList"){
      componentPath = onlineCommons.OnlCgformTabList
    }else if(item.component=="modules/online/cgform/auto/innerTable/OnlCgformInnerTableList"){
      componentPath = onlineCommons.OnlCgformInnerTableList
    }else if(item.component=="modules/online/cgreport/OnlCgreportHeadList"){
      componentPath = onlineCommons.OnlCgreportHeadList
    }else if(item.component=="modules/online/cgreport/auto/OnlCgreportAutoList"){
      componentPath = onlineCommons.OnlCgreportAutoList
    }else{
      componentPath = resolve => require(['@/' + component+'.vue'], resolve)
    }

    let menu =  {
      path: item.path,
      name: item.name,
      redirect:item.redirect,
      component: componentPath,
      //component: resolve => require(['@/' + component+'.vue'], resolve),
      hidden:item.hidden,
      //component:()=> import(`@/views/${item.component}.vue`),
      meta: {
        title:item.meta.title ,
        icon: item.meta.icon,
        url:item.meta.url ,
        permissionList:item.meta.permissionList,
        keepAlive:item.meta.keepAlive,
        /*update_begin author:wuxianquan date:20190908 for:賦值 */
        internalOrExternal:item.meta.internalOrExternal,
        /*update_end author:wuxianquan date:20190908 for:賦值 */
        componentName:item.meta.componentName
      }
    }
    if(item.alwaysShow){
      menu.alwaysShow = true;
      menu.redirect = menu.path;
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters( item.children)];
    }
    //--update-begin----author:scott---date:20190320------for:根據後台菜單配置，判斷是否路由菜單字段，動態選擇是否生成路由（為了支持參數URL菜單）------
    //判斷是否生成路由
    if(item.route && item.route === '0'){
      //console.log(' 不生成路由 item.route：  '+item.route);
      //console.log(' 不生成路由 item.path：  '+item.path);
    }else{
      routers.push(menu);
    }
    //--update-end----author:scott---date:20190320------for:根據後台菜單配置，判斷是否路由菜單字段，動態選擇是否生成路由（為了支持參數URL菜單）------
  }
  return routers
}

/**
 * 深度克隆對象、數組
 * @param obj 被克隆的對象
 * @return 克隆后的對象
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 隨機生成数字
 *
 * 示例：生成長度為 12 的隨機數：randomNumber(12)
 * 示例：生成 3~23 之間的隨機數：randomNumber(3, 23)
 *
 * @param1 最小值 | 長度
 * @param2 最大值
 * @return int 生成后的数字
 */
export function randomNumber() {
  // 生成 最小值 到 最大值 區間的隨機數
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  if (arguments.length === 1) {
    let [length] = arguments
  // 生成指定長度的隨機数字，首位一定不是 0
    let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
    return parseInt(nums.join(''))
  } else if (arguments.length >= 2) {
    let [min, max] = arguments
    return random(min, max)
  } else {
    return Number.NaN
  }
}

/**
 * 隨機生成字符串
 * @param length 字符串的長度
 * @param chats 可選字符串區間（只會生成傳入的字符串中的字符）
 * @return string 生成的字符串
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * 隨機生成uuid
 * @return string 生成的uuid
 */
export function randomUUID() {
  let chats = '0123456789abcdef'
  return randomString(32, chats)
}

/**
 * 下劃線轉駝峰
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string){
  return string.replace( /_([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  });
}

/**
 * 判斷是否显示辦理按鈕
 * @param bpmStatus
 * @returns {*}
 */
export function showDealBtn(bpmStatus){
  if(bpmStatus!="1"&&bpmStatus!="3"&&bpmStatus!="4"){
    return true;
  }
  return false;
}

/**
 * 增強CSS，可以在頁面上輸出全局css
 * @param css 要增強的css
 * @param id style標籤的id，可以用來清除舊樣式
 */
export function cssExpand(css, id) {
  let style = document.createElement('style')
  style.type = "text/css"
  style.innerHTML = `@charset "UTF-8"; ${css}`
  // 清除舊樣式
  if (id) {
    let $style = document.getElementById(id)
    if ($style != null) $style.outerHTML = ''
    style.id = id
  }
  // 應用新樣式
  document.head.appendChild(style)
}


/** 用於js增強事件，運行JS代碼，可以傳參 */
// options 所需參數：
//    參數名         類型            說明
//    vm             VueComponent    vue實例
//    event          Object          event對象
//    jsCode         String          待執行的js代碼
//    errorMessage   String          執行出錯后的提示（控制台）
export function jsExpand(options = {}) {

  // 綁定到window上的keyName
  let windowKeyName = 'J_CLICK_EVENT_OPTIONS'
  if (typeof window[windowKeyName] != 'object') {
    window[windowKeyName] = {}
  }

  // 隨機生成JS增強的執行id，防止衝突
  let id = randomString(16, 'qwertyuioplkjhgfdsazxcvbnm'.toUpperCase())
  // 封裝按鈕點擊事件
  let code = `
    (function (o_${id}) {
      try {
        (function (globalEvent, vm) {
          ${options.jsCode}
        })(o_${id}.event, o_${id}.vm)
      } catch (e) {
        o_${id}.error(e)
      }
      o_${id}.done()
    })(window['${windowKeyName}']['EVENT_${id}'])
  `
  // 創建script標籤
  const script = document.createElement('script')
  // 將需要傳遞的參數掛載到window對象上
  window[windowKeyName]['EVENT_' + id] = {
    vm: options.vm,
    event: options.event,
    // 當執行完成時，無論如何都會調用的回調事件
    done() {
      // 執行完后刪除新增的 script 標籤不會撤銷執行結果（已產生的結果不會被撤銷）
      script.outerHTML = ''
      delete window[windowKeyName]['EVENT_' + id]
    },
    // 當js運行出錯的時候調用的事件
    error(e) {
      console.group(`${options.errorMessage || '用戶自定義JS增強代碼運行出錯'}（${new Date()}）`)
      console.error(e)
      console.groupEnd()
    }
  }
  // 將事件掛載到document中
  script.innerHTML = code
  document.body.appendChild(script)
}


/**
 * 重複值驗證工具方法
 *
 * 使用示例：
 * { validator: (rule, value, callback) => validateDuplicateValue('sys_fill_rule', 'rule_code', value, this.model.id, callback) }
 *
 * @param tableName 被驗證的表名
 * @param fieldName 被驗證的字段名
 * @param fieldVal 被驗證的值
 * @param dataId 數據ID，可空
 * @param callback
 */
export function validateDuplicateValue(tableName, fieldName, fieldVal, dataId, callback) {
  if (fieldVal) {
    let params = { tableName, fieldName, fieldVal, dataId }
    api.duplicateCheck(params).then(res => {
      res['success'] ? callback() : callback(res['message'])
    }).catch(err => {
      callback(err.message || err)
    })
  } else {
    callback()
  }
}

/**
 * 根據編碼校驗規則code，校驗傳入的值是否合法
 *
 * 使用示例：
 * { validator: (rule, value, callback) => validateCheckRule('common', value, callback) }
 *
 * @param ruleCode 編碼校驗規則 code
 * @param value 被驗證的值
 * @param callback
 */
export function validateCheckRule(ruleCode, value, callback) {
  if (ruleCode && value) {
    value = encodeURIComponent(value)
    api.checkRuleByCode({ ruleCode, value }).then(res => {
      res['success'] ? callback() : callback(res['message'])
    }).catch(err => {
      callback(err.message || err)
    })
  } else {
    callback()
  }
}

/**
 * 如果值不存在就 push 進數組，反之不處理
 * @param array 要操作的數據
 * @param value 要添加的值
 * @param key 可空，如果比較的是對象，可能存在地址不一樣但值實際上是一樣的情況，可以傳此字段判斷對象中唯一的字段，例如 id。不傳則直接比較實際值
 * @returns {boolean} 成功 push 返回 true，不處理返回 false
 */
export function pushIfNotExist(array, value, key) {
  for (let item of array) {
    if (key && (item[key] === value[key])) {
      return false
    } else if (item === value) {
      return false
    }
  }
  array.push(value)
  return true
}

/**
 * 可用於判斷是否成功
 * @type {symbol}
 */
export const succeedSymbol = Symbol()
/**
 * 可用於判斷是否失敗
 * @type {symbol}
 */
export const failedSymbol = Symbol()

/**
 * 使 promise 無論如何都會 resolve，除非傳入的參數不是一個Promise對象或返回Promise對象的方法
 * 一般用在 Promise.all 中
 *
 * @param promise 可傳Promise對象或返回Promise對象的方法
 * @returns {Promise<any>}
 */
export function alwaysResolve(promise) {
  return new Promise((resolve, reject) => {
    let p = promise
    if (typeof promise === 'function') {
      p = promise()
    }
    if (p instanceof Promise) {
      p.then(data => {
        resolve({ type: succeedSymbol, data })
      }).catch(error => {
        resolve({ type: failedSymbol, error })
      })
    } else {
      reject('alwaysResolve: 傳入的參數不是一個Promise對象或返回Promise對象的方法')
    }
  })
}

/**
 * 簡單實現防抖方法
 *
 * 防抖(debounce)函數在第一次觸發給定的函數時，不立即執行函數，而是給出一個期限值(delay)，比如100ms。
 * 如果100ms內再次執行函數，就重新開始計時，直到計時結束后再真正執行函數。
 * 這樣做的好處是如果短時間內大量觸發同一事件，只會執行一次函數。
 *
 * @param fn 要防抖的函數
 * @param delay 防抖的毫秒數
 * @returns {Function}
 */
export function simpleDebounce(fn, delay = 100) {
  let timer = null
  return function () {
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 不用正則的方式替換所有值
 * @param text 被替換的字符串
 * @param checker  替換前的內容
 * @param replacer 替換后的內容
 * @returns {String} 替換后的字符串
 */
export function replaceAll(text, checker, replacer) {
  let lastText = text
  text = text.replace(checker, replacer)
  if (lastText !== text) {
    return replaceAll(text, checker, replacer)
  }
  return text
}

/**
 * 獲取事件冒泡路徑，兼容 IE11，Edge，Chrome，Firefox，Safari
 * 目前使用的地方：JEditableTable Span模式
 */
export function getEventPath(event) {
  let target = event.target
  let path = (event.composedPath && event.composedPath()) || event.path

  if (path != null) {
    return (path.indexOf(window) < 0) ? path.concat(window) : path
  }

  if (target === window) {
    return [window]
  }

  let getParents = (node, memo) => {
    memo = memo || []
    const parentNode = node.parentNode

    if (!parentNode) {
      return memo
    } else {
      return getParents(parentNode, memo.concat(parentNode))
    }
  }
  return [target].concat(getParents(target), window)
}

/**
 * 根據組件名獲取父級
 * @param vm
 * @param name
 * @returns {Vue | null|null|Vue}
 */
export function getVmParentByName(vm, name) {
  let parent = vm.$parent
  if (parent && parent.$options) {
    if (parent.$options.name === name) {
      return parent
    } else {
      let res = getVmParentByName(parent, name)
      if (res) {
        return res
      }
    }
  }
  return null
}

/**
 * 使一個值永遠不會為（null | undefined）
 *
 * @param value 要處理的值
 * @param def 默認值，如果value為（null | undefined）則返回的默認值，可不傳，默認為''
 */
export function neverNull(value, def) {
  return value == null ? (neverNull(def, '')) : value
}

/**
 * 根據元素值移除數組中的一個元素
 * @param array 數組
 * @param prod 屬性名
 * @param value 屬性值
 * @returns {string}
 */
export function removeArrayElement(array, prod, value) {
  let index = -1
  for(let i = 0;i<array.length;i++){
    if(array[i][prod] == value){
      index = i;
      break;
    }
  }
  if(index>=0){
    array.splice(index, 1);
  }
}

/** 判斷是否是OAuth2APP環境 */
export function isOAuth2AppEnv() {
  return /wxwork|dingtalk/i.test(navigator.userAgent)
}

/**
 * 獲取積木報表打印地址
 * @param url
 * @param id
 * @param open 是否自動打開
 * @returns {*}
 */
export function getReportPrintUrl(url, id, open) {
  // URL支持{{ window.xxx }}佔位符變量
  url = url.replace(/{{([^}]+)?}}/g, (s1, s2) => eval(s2))
  if (url.includes('?')) {
    url += '&'
  } else {
    url += '?'
  }
  url += `id=${id}`
  url += `&token=${Vue.ls.get(ACCESS_TOKEN)}`
  if (open) {
    window.open(url)
  }
  return url
}

/**
 * JS實現AOP切面
 *
 * @param obj 包含函數的對象
 * @param funcName 要切面的函數名
 * @param callback 執行方法前的回調，用於切面，callback的返回值就是funcName最終的返回值
 */
export function aspectAroundFunction(obj, funcName, callback) {
  if (typeof callback !== 'function' || !obj) {
    console.warn('【aspectAroundFunction】obj或callback格式不正確')
    return
  }
  // 保存原來的函數
  let func = obj[funcName]
  if (typeof func !== 'function') {
    console.warn('【aspectAroundFunction】' + funcName + '不是一個方法')
    return
  }
  // 賦值新方法
  // 實現當外部調用 funcName 時，首先調用我定義的新方法
  // 然後調用傳入的callback方法，以決定是否執行 funcName，以及更改參數、返回值
  obj[funcName] = function (...args) {
    return callback({
      args,
      // 只有執行 proceed 才會真正執行給定的 funcName 方法
      proceed() {
        try {
          return func.apply(obj, args)
        } catch (e) {
          console.error(e)
        }
      },
    })
  }
}