/*
*
* 這裏填寫用戶自定義的表達式
* 可用在Online表單的默認值表達式中使用
* 需要外部使用的變量或方法一定要 export，否則無法識別
* 示例：
*   export const name = '張三'; // const 是常量
*   export let age = 17; // 看情況 export const 還是 let ，兩者都可正常使用
*   export function content(arg) { // export 方法，可傳參數，使用時要加括號，值一定要return回去，可以返回Promise
*     return 'content' + arg;
*   }
*   export const address = (arg) => content(arg) + ' | 北京市'; // export 箭頭函數也可以
*
*/

/** 字段默認值官方示例：獲取地址 */
export function demoFieldDefVal_getAddress(arg) {
  if (!arg) {
    arg = '朝陽區'
  }
  return `北京市 ${arg}`
}