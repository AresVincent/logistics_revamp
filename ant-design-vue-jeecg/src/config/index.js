/** init domain config */
import Vue from 'vue'
//設置全局API_BASE_URL
Vue.prototype.API_BASE_URL = process.env.VUE_APP_API_BASE_URL
window._CONFIG['domianURL'] = Vue.prototype.API_BASE_URL
//單點登錄地址
window._CONFIG['casPrefixUrl'] = process.env.VUE_APP_CAS_BASE_URL
window._CONFIG['onlinePreviewDomainURL'] =  process.env.VUE_APP_ONLINE_BASE_URL
window._CONFIG['staticDomainURL'] = Vue.prototype.API_BASE_URL + '/sys/common/static'
window._CONFIG['pdfDomainURL'] = Vue.prototype.API_BASE_URL+ '/sys/common/pdf/pdfPreviewIframe'