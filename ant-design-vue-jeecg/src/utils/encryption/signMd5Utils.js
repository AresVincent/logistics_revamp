import md5 from 'md5'
//簽名密鑰串(前後端要一致，正式發布請自行修改)
const signatureSecret = "dd05f1c54d63749eda95f9fa6d49v442a";

export default class signMd5Utils {
  /**
   * json參數升序
   * @param jsonObj 發送參數
   */

  static sortAsc(jsonObj) {
    let arr = new Array();
    let num = 0;
    for (let i in jsonObj) {
      arr[num] = i;
      num++;
    }
    let sortArr = arr.sort();
    let sortObj = {};
    for (let i in sortArr) {
      sortObj[sortArr[i]] = jsonObj[sortArr[i]];
    }
    return sortObj;
  }


  /**
   * @param url 請求的url,應該包含請求參數(url的?後面的參數)
   * @param requestParams 請求參數(POST的JSON參數)
   * @returns {string} 獲取簽名
   */
  static getSign(url, requestParams) {
    let urlParams = this.parseQueryString(url);
    let jsonObj = this.mergeObject(urlParams, requestParams);
    //console.log("sign jsonObj: ",jsonObj)
    let requestBody = this.sortAsc(jsonObj);
    console.log("sign requestBody: ",requestBody)
    return md5(JSON.stringify(requestBody) + signatureSecret).toUpperCase();
  }

  /**
   * @param url 請求的url
   * @returns {{}} 將url中請求參數組裝成json對象(url的?後面的參數)
   */
  static parseQueryString(url) {
    let urlReg = /^[^\?]+\?([\w\W]+)$/,
      paramReg = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
      urlArray = urlReg.exec(url),
      result = {};

    // 獲取URL上最後帶逗號的參數變量 sys/dict/getDictItems/sys_user,realname,username
    //【這邊條件沒有encode】帶條件參數例子：/sys/dict/getDictItems/sys_user,realname,id,username!='admin'%20order%20by%20create_time
    let lastpathVariable = url.substring(url.lastIndexOf('/') + 1);
    if(lastpathVariable.includes(",")){
      if(lastpathVariable.includes("?")){
        lastpathVariable = lastpathVariable.substring(0, lastpathVariable.indexOf("?"));
      }
      //解決Sign 簽名校驗失敗 #2728
      result["x-path-variable"] = decodeURIComponent(lastpathVariable);
    }
    if (urlArray && urlArray[1]) {
      let paramString = urlArray[1], paramResult;
      while ((paramResult = paramReg.exec(paramString)) != null) {
        //数字值轉為string類型，前後端加密規則保持一致
        if(this.myIsNaN(paramResult[2])){
          paramResult[2] = paramResult[2].toString()
        }
        result[paramResult[1]] = paramResult[2];
      }
    }
    return result;
  }

  /**
   * @returns {*} 將兩個對象合併成一個
   */
  static mergeObject(objectOne, objectTwo) {
    if (objectTwo && Object.keys(objectTwo).length > 0) {
      for (let key in objectTwo) {
        if (objectTwo.hasOwnProperty(key) === true) {
          //数字值轉為string類型，前後端加密規則保持一致
          if(this.myIsNaN(objectTwo[key])){
            objectTwo[key] = objectTwo[key].toString()
          }
          objectOne[key] = objectTwo[key];
        }
      }
    }
    return objectOne;
  }

  static urlEncode(param, key, encode) {
    if (param == null) return '';
    let paramStr = '';
    let t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
      for (let i in param) {
        let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += this.urlEncode(param[i], k, encode);
      }
    }
    return paramStr;
  };

  static getDateTimeToString() {
    const date_ = new Date()
    const year = date_.getFullYear()
    let month = date_.getMonth() + 1
    let day = date_.getDate()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    let hours = date_.getHours()
    let mins = date_.getMinutes()
    let secs = date_.getSeconds()
    const msecs = date_.getMilliseconds()
    if (hours < 10) hours = '0' + hours
    if (mins < 10) mins = '0' + mins
    if (secs < 10) secs = '0' + secs
    if (msecs < 10) secs = '0' + msecs
    return year + '' + month + '' + day + '' + hours + '' + mins + '' + secs
  }
    // true:數值型的，false：非數值型
  static myIsNaN(value) {
    return typeof value === 'number' && !isNaN(value);
  }

}