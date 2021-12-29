import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN,INDEX_MAIN_PAGE_PATH, OAUTH2_LOGIN_PAGE_PATH } from '@/store/mutation-types'
import { generateIndexRouter, isOAuth2AppEnv } from '@/utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/user/login', '/user/register', '/user/register-result','/user/alteration'] // no redirect whitelist
whiteList.push(OAUTH2_LOGIN_PAGE_PATH)

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar

  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login' || to.path === OAUTH2_LOGIN_PAGE_PATH) {
      next({ path: INDEX_MAIN_PAGE_PATH })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length === 0) {
        store.dispatch('GetPermissionList').then(res => {
              const menuData = res.result.menu;
              //console.log(res.message)
              if (menuData === null || menuData === "" || menuData === undefined) {
                return;
              }
              let constRoutes = [];
              constRoutes = generateIndexRouter(menuData);
              // 添加主界面路由
              store.dispatch('UpdateAppRouter',  { constRoutes }).then(() => {
                // 根據roles權限生成可訪問的路由表
                // 動態添加可訪問路由表
                router.addRoutes(store.getters.addRouters)
                const redirect = decodeURIComponent(from.query.redirect || to.path)
                if (to.path === redirect) {
                  // hack方法 確保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                  next({ ...to, replace: true })
                } else {
                  // 跳轉到目的路由
                  next({ path: redirect })
                }
              })
            })
          .catch(() => {
           /* notification.error({
              message: '系統提示',
              description: '請求用戶信息失敗，請重試！'
            })*/
            store.dispatch('Logout').then(() => {
              next({ path: '/user/login', query: { redirect: to.fullPath } })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登錄白名單，如果進入的頁面是login頁面並且當前是OAuth2app環境，就進入OAuth2登錄頁面
      if (to.path === '/user/login' && isOAuth2AppEnv()) {
        next({path: OAUTH2_LOGIN_PAGE_PATH})
      } else {
        // 在免登錄白名單，直接進入
        next()
      }
      NProgress.done()
    } else {
      // 如果當前是在OAuth2APP環境，就跳轉到OAuth2登錄頁面
      let path = isOAuth2AppEnv() ? OAUTH2_LOGIN_PAGE_PATH : '/user/login'
      next({ path: path, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
