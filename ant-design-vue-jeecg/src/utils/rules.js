const validateMobile = (rule, value, callback) => {
  let reg = /^1(3|4|5|7|8)\d{9}$/
  if (!reg.test(value)) {
    callback('請輸入正確手機號')
  } else {
    callback()
  }
}
const validateEn = (rule, value, callback) => {
  let reg = /^[_a-zA-Z0-9]+$/
  let reg2 = /^.{4,18}$/
  // 長度為6到18個字符
  if (value !== '' && !reg.test(value)) {
    callback('只允許字母、数字、下劃線')
  } else if (value !== '' && !reg2.test(value)) {
    callback('長度6到18個字符')
  } else {
    callback()
  }
}
export const rules = {
  mobile: [{
    required: true,
    message: '請輸入手機號',
    trigger: 'blur'
  }, { validator: validateMobile, trigger: 'blur' }],
  userName: [{
    required: true, message: '請輸入用戶名', trigger: 'blur'
  }, { validator: validateEn }],
  email: [
    { required: false, type: 'email', message: '郵箱格式不正確', trigger: 'blur' }
  ],
  // 驗證自然數
  naturalNumber: /^(([0-9]*[1-9][0-9]*)|(0+))$/,
  naturalNumberMsg: '請輸入自然數',
  // 英文
  english: /^.[A-Za-z]+$/,
  englishMsg: '請輸入英文字符',
  // 座機
  telephone: /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/,
  telephoneMsg: '請輸入正確的座機號',
  // 銀行卡號碼
  bankCard: /^[1-9]\d{9,19}$/,
  bankCardMsg: '請輸入正確的銀行卡號碼',
  // 證件號碼
  IDNumber: /^[a-z0-9A-Z]{0,50}$/,
  IDNumberMsg: '請輸入正確的證件號碼',
  // 身份證號碼,包括15位和18位的
  IDCard: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{7}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/,
  IDCardMsg: '請輸入正確的身份證號碼',
  // QQ號碼
  qq: /^[1-9]\d{4,11}$/,
  qqMsg: '請輸入正確的QQ號碼',
  // 網址, 僅支持http和https開頭的
  url: /^(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/,
  urlMsg: '請輸入以http和https開頭的網址',
  // 0到20位的英文字符和数字
  enNum0to20: /^[a-z0-9A-Z]{0,20}$/,
  enNum0to20Msg: '請輸入20位以內的英文字符和数字',
  // 2到100位的中英文字符和空格
  cnEnSpace2to100: /^[a-zA-Z\u4E00-\u9FA5\s*]{2,100}$/,
  cnEnSpace2to100Msg: '請輸入2到100位的中英文字符和空格',
  // 数字和換行符
  numLinefeed: /^[0-9\n*]+$/,
  numLinefeedMsg: '請輸入数字和換行符',
  // 255位以內的字符
  char0to255: /^.{0,255}$/,
  char0to255Msg: '請輸入255位以內的字符',
  required: function(min, max) {
    let rule = [{ required: true, message: '', trigger: 'blur' }]
    if (min) {
      let r = { min: min, message: '最小長度' + min + '位字符' }
      rule.push(r)
    }
    if (max) {
      let m = { max: max, message: '最大長度' + max + '位字符' }
      rule.push(m)
    }
    return rule
  },
  select: function() {
    let rule = [{ required: true, message: '', trigger: 'change' }]
    return rule
  },
  checked: function(min, max) {
    let rule = [{ required: true, type: 'array', message: '', trigger: 'change' }]
    if (min) {
      let r = { type: 'array', min: min, message: '最少選擇' + min + '項' }
      rule.push(r)
    }
    if (max) {
      let m = { type: 'array', max: max, message: '最多選擇' + max + '項' }
      rule.push(m)
    }
    return rule
  }
}
/**
 * @description 排序值驗證，排序值不可以大於255
 */
export const validateOrder = function(rule, value, callback) {
  if (parseInt(value) > 255) {
    return callback(new Error('排序值不可以大於255'))
  } else {
    callback()
  }
}



