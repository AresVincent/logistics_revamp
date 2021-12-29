/**
 * 獲取字符串的長度ascii長度為1 中文長度為2
 * @param str
 * @returns {number}
 */
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

/**
 * 給定一個字符串和一個長度,將此字符串按指定長度截取
 * @param str
 * @param maxLength
 * @returns {string}
 */
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}

// 下劃線轉換駝峰
export function underLinetoHump(name) {
  return name.replace(/\_(\w)/g, function(all, letter){
    return letter.toUpperCase();
  });
}
// 駝峰轉換下劃線
export function humptoUnderLine(name) {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}