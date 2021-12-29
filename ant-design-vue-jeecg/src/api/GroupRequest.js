import Vue from 'vue'

/**
 * 將一個請求分組
 *
 * @param getPromise 傳入一個可以獲取到Promise對象的方法
 * @param groupId 分組ID，如果不傳或者為空則不分組
 * @param expire 過期時間，默認 半分鐘
 */
export function httpGroupRequest(getPromise, groupId, expire = 1000 * 30) {
  if (groupId == null || groupId === '') {
    console.log("--------popup----------getFrom  DB-------with---no--groupId ")
    return getPromise()
  }

  if (Vue.ls.get(groupId)) {
    console.log("---------popup--------getFrom  Cache--------groupId = " + groupId)
    return Promise.resolve(Vue.ls.get(groupId));
  } else {
    console.log("--------popup----------getFrom  DB---------groupId = " + groupId)
  }

  // 還沒有發出請求，就發出第一次的請求
  return getPromise().then(res => {
    Vue.ls.set(groupId, res, expire);
    return Promise.resolve(res);
  })
}


