import Vue from 'vue'
import { axios } from '@/utils/request'
import signMd5Utils from '@/utils/encryption/signMd5Utils'

const api = {
  user: '/mock/api/user',
  role: '/mock/api/role',
  service: '/mock/api/service',
  permission: '/mock/api/permission',
  permissionNoPager: '/mock/api/permission/no-pager'
}

export default api

//post
export function postAction(url,parameter) {
  let sign = signMd5Utils.getSign(url, parameter);
  //將簽名和時間戳，添加在請求接口 Header
  let signHeader = {"X-Sign": sign,"X-TIMESTAMP": signMd5Utils.getDateTimeToString()};

  return axios({
    url: url,
    method:'post' ,
    data: parameter,
    headers: signHeader
  })
}

//post method= {post | put}
export function httpAction(url,parameter,method) {
  let sign = signMd5Utils.getSign(url, parameter);
  //將簽名和時間戳，添加在請求接口 Header
  let signHeader = {"X-Sign": sign,"X-TIMESTAMP": signMd5Utils.getDateTimeToString()};

  return axios({
    url: url,
    method:method ,
    data: parameter,
    headers: signHeader
  })
}

//put
export function putAction(url,parameter) {
  return axios({
    url: url,
    method:'put',
    data: parameter
  })
}

//get
export function getAction(url,parameter) {
  let sign = signMd5Utils.getSign(url, parameter);
  //將簽名和時間戳，添加在請求接口 Header
  let signHeader = {"X-Sign": sign,"X-TIMESTAMP": signMd5Utils.getDateTimeToString()};

  return axios({
    url: url,
    method: 'get',
    params: parameter,
    headers: signHeader
  })
}

//deleteAction
export function deleteAction(url,parameter) {
  return axios({
    url: url,
    method: 'delete',
    params: parameter
  })
}

export function getUserList(parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList(parameter) {
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return axios({
    url: api.service,
    method: parameter.id == 0 ? 'post' : 'put',
    data: parameter
  })
}

/**
 * 下載文件 用於excel導出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url,parameter){
  return axios({
    url: url,
    params: parameter,
    method:'get' ,
    responseType: 'blob'
  })
}

/**
 * 下載文件
 * @param url 文件路徑
 * @param fileName 文件名
 * @param parameter
 * @returns {*}
 */
export function downloadFile(url, fileName, parameter) {
  return downFile(url, parameter).then((data) => {
    if (!data || data.size === 0) {
      Vue.prototype['$message'].warning('文件下載失敗')
      return
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data]), fileName)
    } else {
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) //下載完成移除元素
      window.URL.revokeObjectURL(url) //釋放掉blob對象
    }
  })
}

/**
 * 文件上傳 用於富文本上傳圖片
 * @param url
 * @param parameter
 * @returns {*}
 */
export function uploadAction(url,parameter){
  return axios({
    url: url,
    data: parameter,
    method:'post' ,
    headers: {
      'Content-Type': 'multipart/form-data',  // 文件上傳
    },
  })
}

/**
 * 獲取文件服務訪問路徑
 * @param avatar
 * @param subStr
 * @returns {*}
 */
export function getFileAccessHttpUrl(avatar,subStr) {
  if(!subStr) subStr = 'http'
  try {
    if(avatar && avatar.startsWith(subStr)){
      return avatar;
    }else{
      if(avatar &&　avatar.length>0 && avatar.indexOf('[')==-1){
        return window._CONFIG['staticDomainURL'] + "/" + avatar;
      }
    }
  }catch(err){
   return;
  }
}
