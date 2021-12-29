####1._util包:存放自定義函數 詳細見代碼註釋
####2.AvatarList:显示頭像群並支持tip，用法參考src\views\Home.vue（如下圖）
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12181253_O0Xi.png "在這裏輸入圖片標題")
####3.chart包:存放各種圖表相關的組件,條形圖柱形圖折線圖等等 具體用法參考首頁
####4.countDown包:一個倒計時組件，用法參考home頁,簡單描述,該組件有3個屬性,
target(時間/毫秒數)必填，
format(function,該方法接收一個毫秒數的參數,用於格式化显示當前倒計時時間)非必填,
onEnd倒計時結束觸發函數
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12182046_mwqJ.png "在這裏輸入圖片標題")
####5.dict包：數據字典專用，用法參考文件夾下readme文件
####6.Ellipsis包：字符串截取組件,可以指定字符串的显示長度,並將全部內容显示到tip中,簡單使用參考src\views\system\PermissionList.vue
####7.jeecg包：該包下自定義了很多列表/表單中用到的組件 參考包下readme文件
####8.jeecgbiz包：該包下定義了一些業務相關的組件，比如選擇用戶彈框,根據部門選擇用戶等等
####9.layouts+page包：系統頁面布局相關組件，比如登陸進去之後頁面頂部显示什麼，底部显示什麼，菜單點擊觸發多個tab的布局等等 一般情況不需要修改
####10.menun包：菜單組件，倆個，一個摺疊菜單一個正常显示的菜單
####11.NumberInfo:数字信息显示組件 如下圖
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12185858_uvJ5.png "在這裏輸入圖片標題")
####12.online包：該包下封裝了online表單的相關組件,用於展示表單各種控件,驗證表單等等,相關用法參考readme
####13.setting包：該包下封裝了首頁風格切換等功能如下圖
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12190520_jySG.png "在這裏輸入圖片標題")
####14.table包：一個二次封裝的table組件,用於展示列表，參考readme
####15.tools包：
Breadcrumb.vue：麵包屑二次封裝,支持路由跳轉
DetailList.vue：詳情展示用法參考src\views\profile\advanced\Advanced.vue(效果如下圖)
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12193954_Uar6.png "在這裏輸入圖片標題")
````
個人認為該頁面代碼有兩點值得學習：
1.vue provide/inject的使用
2.該頁面css定義方式,只定義一個頂層class,其餘樣式都定義在其下,這樣只要頂層class不和別的頁面衝突,整個頁面的樣式都是唯一生效的
````
FooterToolBar.vue:fixed定位的底部，通過是否定義內部控件的屬性slot="extra"決定是左浮動或是右浮動
HeaderNotice.vue:首頁通知(如下圖)
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12195340_fPe0.png "在這裏輸入圖片標題")
HeaderInfo.vue:上下文字布局（如下圖）
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12195638_dG5o.png "在這裏輸入圖片標題")
Logo.vue:首頁左上側的log圖
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12200908_ihv3.png "在這裏輸入圖片標題")
UserMenu.vue:首頁右上側的內容
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12201226_laQK.png "在這裏輸入圖片標題")
####16.trend包 趨勢显示組件（如下圖）
![輸入圖片說明](https://static.oschina.net/uploads/img/201904/12201600_Wo8K.png "在這裏輸入圖片標題")
![cron表達式](https://oscimg.oschina.net/oscnet/661f9ac09016395f9f49286143af3241623.jpg)
![cron控件添加清除按鈕](https://oscimg.oschina.net/oscnet/15096e49f2e29bd829e304d56770025d03c.jpg)