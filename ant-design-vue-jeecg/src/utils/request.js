import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import router from '@/router/index'
import { ACCESS_TOKEN, TENANT_ID } from "@/store/mutation-types"

/**
 * 【指定 axios的 baseURL】
 * 如果手工指定 baseURL: '/jeecg-boot'
 * 則映射後端域名，通過 vue.config.js
 * @type {*|string}
 */
let apiBaseUrl = window._CONFIG['domianURL'] || "/jeecg-boot";
//console.log("apiBaseUrl= ",apiBaseUrl)
// 創建 axios 實例
const service = axios.create({
  //baseURL: '/jeecg-boot',
  baseURL: apiBaseUrl, // api base_url
  timeout: 9000 // 請求超時時間
})

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log("------異常響應------",token)
    console.log("------異常響應------",error.response.status)
    switch (error.response.status) {
      case 403:
        Vue.prototype.$Jnotification.error({ message: '系統提示', description: '拒絕訪問',duration: 4})
        break
      case 500:
        console.log("------error.response------",error.response)
        // update-begin- --- author:liusq ------ date:20200910 ---- for:處理Blob情況----
        let type=error.response.request.responseType;
        if(type === 'blob'){
          blobToJson(data);
          break;
        }
        // update-end- --- author:liusq ------ date:20200910 ---- for:處理Blob情況----
        if(token && data.message.includes("Token失效")){
          // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效採用彈框模式，不直接跳轉----
          if (/wxwork|dingtalk/i.test(navigator.userAgent)) {
            Vue.prototype.$Jmessage.loading('登錄已過期，正在重新登陸', 0)
          } else {
            Vue.prototype.$Jmodal.error({
              title: '登錄已過期',
              content: '很抱歉，登錄已過期，請重新登錄',
              okText: '重新登錄',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  try {
                    let path = window.document.location.pathname
                    console.log('location pathname -> ' + path)
                    if (path != '/' && path.indexOf('/user/login') == -1) {
                      window.location.reload()
                    }
                  } catch (e) {
                    window.location.reload()
                  }
                })
              }
            })
          }
          // update-end- --- author:scott ------ date:20190225 ---- for:Token失效採用彈框模式，不直接跳轉----
        }
        break
      case 404:
          Vue.prototype.$Jnotification.error({ message: '系統提示', description:'很抱歉，資源未找到!',duration: 4})
        break
      case 504:
        Vue.prototype.$Jnotification.error({ message: '系統提示', description: '網絡超時'})
        break
      case 401:
        Vue.prototype.$Jnotification.error({ message: '系統提示', description:'很抱歉，登錄已過期，請重新登錄',duration: 4})
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        Vue.prototype.$Jnotification.error({
          message: '系統提示',
          description: data.message,
          duration: 4
        })
        break
    }
  } else if (error.message) {
    if (error.message.includes('timeout')) {
      Vue.prototype.$Jnotification.error({message: '系統提示', description: '網絡超時'})
    } else {
      Vue.prototype.$Jnotification.error({message: '系統提示', description: error.message})
    }
  }
  return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ 'X-Access-Token' ] = token // 讓每個請求攜帶自定義 token 請根據實際情況自行修改
  }

  // update-begin--author:sunjianlei---date:20200723---for 如果當前在low-app環境，並且攜帶了appId，就向Header里傳遞appId
  const $route = router.currentRoute
  if ($route && $route.name && $route.name.startsWith('low-app') && $route.params.appId) {
    config.headers['X-Low-App-ID'] = $route.params.appId
  }
  // update-end--author:sunjianlei---date:20200723---for 如果當前在low-app環境，並且攜帶了appId，就向Header里傳遞appId

  //update-begin-author:taoyan date:2020707 for:多租戶
  let tenantid = Vue.ls.get(TENANT_ID)
  if (!tenantid) {
    tenantid = 0;
  }
  config.headers[ 'tenant-id' ] = tenantid
  //update-end-author:taoyan date:2020707 for:多租戶
  if(config.method=='get'){
    if(config.url.indexOf("sys/dict/getDictItems")<0){
      config.params = {
        _t: Date.parse(new Date())/1000,
        ...config.params
      }
    }
  }
  return config
},(error) => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
    return response.data
  }, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}
/**
 * Blob解析
 * @param data
 */
function blobToJson(data) {
  let fileReader = new FileReader();
  let token = Vue.ls.get(ACCESS_TOKEN);
  fileReader.onload = function() {
    try {
      let jsonData = JSON.parse(this.result);  // 說明是普通對象數據，後台轉換失敗
      console.log("jsonData",jsonData)
      if (jsonData.status === 500) {
        console.log("token----------》",token)
        if(token && jsonData.message.includes("Token失效")){
          Modal.error({
            title: '登錄已過期',
            content: '很抱歉，登錄已過期，請重新登錄',
            okText: '重新登錄',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN)
                window.location.reload()
              })
            }
          })
        }
      }
    } catch (err) {
      // 解析成對象失敗，說明是正常的文件流
      console.log("blob解析fileReader返回err",err)
    }
  };
  fileReader.readAsText(data)
}

export {
  installer as VueAxios,
  service as axios
}