Ant Design Jeecg Vue
====

當前最新版本： 3.0.0（發布日期：2021-11-01）

Overview
----

基於 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 實現的 Ant Design Pro  Vue 版
Jeecg-boot 的前端UI框架，採用前後端分離方案，提供強大代碼生成器的低代碼平台。
前端頁面代碼和後端功能代碼一鍵生成，不需要寫任何代碼，保持jeecg一貫的強大！！



#### 前端技術
 
- 基礎框架：[ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 實現
- JavaScript框架：Vue
- Webpack
- node
- yarn
- eslint
- @vue/cli 3.2.1
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 頭像裁剪組件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 數據可視化圖表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封裝實現



項目下載和運行
----

- 拉取項目代碼
```bash
git clone https://github.com/zhangdaiscott/jeecg-boot.git
cd  jeecg-boot/ant-design-vue-jeecg
```

- 安裝依賴
```
yarn install
```

- 開發模式運行
```
yarn run serve
```

- 編譯項目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```



其他說明
----

- 項目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 請更新您的 cli

- 關閉 Eslint (不推薦) 移除 `package.json` 中 `eslintConfig` 整個節點代碼

- 修改 Ant Design 配色，在文件 `vue.config.js` 中，其他 less 變量覆蓋參考 [ant design](https://ant.design/docs/react/customize-theme-cn) 官方說明
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 變量覆蓋，用於自定義 ant design 主題 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```



附屬文檔
----
- [Ant Design Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn)

- [報表 viser-vue](https://viserjs.github.io/demo.html#/viser/bar/basic-bar)

- [Vue](https://cn.vuejs.org/v2/guide)

- [路由/菜單說明](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/router/README.md)

- [ANTD 默認配置項](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/defaultSettings.js)

- 其他待補充...


備註
----

> @vue/cli 升級后，eslint 規則更新了。由於影響到全部 .vue 文件，需要逐個驗證。既暫時關閉部分原本不驗證的規則，後期維護時，在逐步修正這些 rules


Docker 鏡像使用
----

 ``` 
# 1.修改前端項目的後台域名
    .env.development
    域名改成： http://jeecg-boot-system:8080/jeecg-boot
   
# 2.先進入打包前端項目
  yarn run build

# 3.構建鏡像
  docker build -t nginx:jeecgboot .

# 4.啟動鏡像
  docker run --name jeecg-boot-nginx -p 80:80 -d nginx:jeecgboot

# 5.配置host

    # jeecgboot
    127.0.0.1   jeecg-boot-redis
    127.0.0.1   jeecg-boot-mysql
    127.0.0.1   jeecg-boot-system
  
# 6.訪問前台項目
  http://localhost:80
``` 