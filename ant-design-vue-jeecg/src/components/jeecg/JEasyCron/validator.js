import CronParser from 'cron-parser'
import { replaceWeekName } from './tabs/const'

export default (rule, value, callback) => {
  // 沒填寫就不校驗
  if (!value) {
    callback()
    return true
  }
  const values = value.split(' ').filter(item => !!item)
  if (values.length > 7) {
    callback(new Error('Cron表達式最多7項！'))
    return false
  }
  // 檢查第7項
  let e = value
  if (values.length === 7) {
    const year = replaceWeekName(values[6])
    if (year !== '*' && year !== '?') {
      let yearValues = []
      if (year.indexOf('-') >= 0) {
        yearValues = year.split('-')
      } else if (year.indexOf('/')) {
        yearValues = year.split('/')
      } else {
        yearValues = [year]
      }
      // console.info(yearValues)
      // 判斷是否都是数字
      const checkYear = yearValues.some(item => isNaN(item))
      if (checkYear) {
        callback(new Error('Cron表達式參數[年]錯誤：' + year))
        return false
      }
    }
    // 取其中的前六項
    e = values.slice(0, 6).join(' ')
  }
  // 6位 沒有年
  // 5位沒有秒、年
  let result = true
  try {
    const iter = CronParser.parseExpression(e)
    iter.next()
    callback()
  } catch (e) {
    callback(new Error('Cron表達式錯誤：' + e))
    result = false
  }
  return result
}
