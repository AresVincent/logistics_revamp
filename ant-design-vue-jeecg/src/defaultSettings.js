/**
 * 項目默認配置項
 * primaryColor - 默認主題色
 * navTheme - sidebar theme ['dark', 'light'] 兩種主題
 * colorWeak - 色盲模式
 * layout - 整體布局方式 ['sidemenu', 'topmenu'] 兩種布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左側菜單欄 ： boolean
 * autoHideHeader - 向下滾動時，隱藏 Header : boolean
 * contentWidth - 內容區布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置項 (localStorage/sessionStorage)
 *
 */

export default {
  primaryColor: '#1890FF', // primary color of ant design
  navTheme: 'light', // theme for nav menu
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fixed', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  autoHideHeader: false, //  auto hide header
  colorWeak: false,
  multipage: true, //默認多頁簽模式
  // vue-ls options
  storageOptions: {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
  }
}