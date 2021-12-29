路由/菜單說明
====



配置文件路徑
----

`@/config/router.config.js`



格式和說明
----

```javascript
/**
 * 路由配置說明：
 * 建議：sider menu 請不要超過三級菜單，若超過三級菜單，則應該設計為頂部主菜單 配合左側次級菜單
 *
 **/
 {
  redirect: noredirect,
  name: 'router-name',
  hidden: true,
  meta: {
    title: 'title',
    icon: 'a-icon',
    keepAlive: true,
    hiddenHeaderContent: true,
  }
}
```



`{ Route }` 對象

| 參數     | 說明                                      | 類型    | 默認值 |
| -------- | ----------------------------------------- | ------- | ------ |
| hidden   | 控制路由是否显示在 sidebar                | boolean | falase |
| redirect | 重定向地址, 訪問這個路由時,自定進行重定向 | string  | -      |
| name     | 路由名稱, 建議設置,且不能重名             | string  | -      |
| meta     | 路由元信息（路由附帶擴展信息）            | object  | {}     |



`{ Meta }` 路由元信息對象

| 參數                | 說明                                                         | 類型    | 默認值 |
| ------------------- | ------------------------------------------------------------ | ------- | ------ |
| title               | 路由標題, 用於显示麵包屑, 頁面標題 *推薦設置                 | string  | -      |
| icon                | 路由在 menu 上显示的圖標                                     | string  | -      |
| keepAlive           | 緩存該路由                                                   | boolean | false  |
| hiddenHeaderContent | *特殊 隱藏 [PageHeader](https://github.com/sendya/ant-design-pro-vue/blob/master/src/components/layout/PageHeader.vue#L14) 組件中的頁面帶的 麵包屑和頁面標題欄 | boolean | false  |
| permission          | 與項目提供的權限攔截匹配的權限，如果不匹配，則會被禁止訪問該路由頁面 | array   | []     |



路由例子
----

```ecmascript 6
const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首頁' },
    redirect: '/dashboard/analysis',
    children: [
      {
        path: '/dashboard',
        component: Layout,
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        meta: {title: '儀錶盤', icon: 'dashboard', permission: ['dashboard']},
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: {title: '分析頁', permission: ['dashboard']}
          },
          {
            path: '/dashboard/monitor',
            name: 'Monitor',
            hidden: true,
            component: () => import('@/views/dashboard/Monitor'),
            meta: {title: '監控頁', permission: ['dashboard']}
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: {title: '工作台', permission: ['dashboard']}
          }
        ]
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        meta: { title: '結果頁', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            // 該頁面隱藏麵包屑和頁面標題欄
            meta: { title: '成功', hiddenHeaderContent: true, permission: [ 'result' ] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            // 該頁面隱藏麵包屑和頁面標題欄
            meta: { title: '失敗', hiddenHeaderContent: true, permission: [ 'result' ] }
          }
        ]
      },
      ...
    ]
  },
]
```

> 1. 請注意 `component: () => import('..') ` 方式引入路由的頁面組件為 懶加載模式。具體可以看 [Vue 官方文檔](https://router.vuejs.org/zh/guide/advanced/lazy-loading.html)
> 2. 增加新的路由應該增加在 '/' (index) 路由的 `children` 內
> 3. `permission` 可以進行自定義修改，只需要對這個模塊進行自定義修改即可 [src/store/modules/permission.js#L10](https://github.com/sendya/ant-design-pro-vue/blob/master/src/store/modules/permission.js#L10)



附權限路由結構：

![權限結構](https://static-2.loacg.com/open/static/github/permissions.png)