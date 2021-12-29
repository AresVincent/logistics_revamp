import { USER_AUTH,SYS_BUTTON_AUTH } from "@/store/mutation-types"

const hasPermission = {
    install (Vue, options) {
          //console.log(options);
          Vue.directive('has', {
            inserted: (el, binding, vnode)=>{
                //console.log("頁面權限控制----");
                //console.time()
                //節點權限處理，如果命中則不進行全局權限處理
                if(!filterNodePermission(el, binding, vnode)){
                  filterGlobalPermission(el, binding, vnode);
                }
                //console.timeEnd() //計時結束並輸出時長
            }
          });
    }
};

/**
 * 流程節點權限控制
 */
export function filterNodePermission(el, binding, vnode) {
  let permissionList = [];
  try {
    let obj = vnode.context.$props.formData;
    if (obj) {
      let bpmList = obj.permissionList;
      for (let bpm of bpmList) {
        if(bpm.type != '2') {
          permissionList.push(bpm);
        }
      }
    }else{
      return false;
    }
  } catch (e) {
    //console.log("頁面權限異常----", e);
  }
  if (permissionList === null || permissionList === "" || permissionList === undefined||permissionList.length<=0) {
    //el.parentNode.removeChild(el)
    return false;
  }

  console.log("流程節點頁面權限--NODE--");
  let permissions = [];
  for (let item of permissionList) {
    if(item.type != '2') {
      permissions.push(item.action);
    }
  }
  //console.log("頁面權限----"+permissions);
  //console.log("頁面權限----"+binding.value);
  if (!permissions.includes(binding.value)) {
    //el.parentNode.removeChild(el)
    return false;
  }else{
    for (let item2 of permissionList) {
      if(binding.value === item2.action){
        return true;
      }
    }
  }
  return false;
}

/**
 * 全局權限控制
 */
export function filterGlobalPermission(el, binding, vnode) {
  //console.log("全局頁面權限--Global--");

  let permissionList = [];
  let allPermissionList = [];

  //let authList = Vue.ls.get(USER_AUTH);
  let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]");
  for (let auth of authList) {
    if(auth.type != '2') {
      permissionList.push(auth);
    }
  }
  //console.log("頁面權限--Global--",sessionStorage.getItem(SYS_BUTTON_AUTH));
  let allAuthList = JSON.parse(sessionStorage.getItem(SYS_BUTTON_AUTH) || "[]");
  for (let gauth of allAuthList) {
    if(gauth.type != '2') {
      allPermissionList.push(gauth);
    }
  }
  //設置全局配置是否有命中
  let invalidFlag = false;//無效命中
  if(allPermissionList != null && allPermissionList != "" && allPermissionList != undefined && allPermissionList.length > 0){
    for (let itemG of allPermissionList) {
      if(binding.value === itemG.action){
        if(itemG.status == '0'){
          invalidFlag = true;
          break;
        }
      }
    }
  }
  if(invalidFlag){
    return;
  }
  if (permissionList === null || permissionList === "" || permissionList === undefined||permissionList.length<=0) {
    el.parentNode.removeChild(el);
    return;
  }
  let permissions = [];
  for (let item of permissionList) {
    //權限策略1显示2禁用
    if(item.type != '2'){
      //update--begin--autor:wangshuai-----date:20200729------for：按鈕權限，授權標識的提示信息是多個用逗號分隔邏輯處理 gitee#I1OUGU-------
      if(item.action){
        if(item.action.includes(",")){
          let split = item.action.split(",")
            for (let i = 0; i <split.length ; i++) {
              if(!split[i] ||split[i].length==0){
                continue;
              }
              permissions.push(split[i]);
          }
        }else{
          permissions.push(item.action);
        }
      }
      //update--end--autor:wangshuai-----date:20200729------for：按鈕權限，授權標識的提示信息是多個用逗號分隔邏輯處理 gitee#I1OUGU------
    }
  }
  if (!permissions.includes(binding.value)) {
    el.parentNode.removeChild(el);
  }
}

export default hasPermission;
