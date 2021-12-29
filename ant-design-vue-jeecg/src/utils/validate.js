/**
 * 郵箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)
}

/**
 * 手機號碼
 * @param {*} s
 */
export function isMobile (s) {
  return /^852\d{8}$/.test(s)
}

/**
 * 電話號碼
 * @param {*} s
 */
export function isPhone (s) {
  return /^852\d{8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}
