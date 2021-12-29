<template>
  <global-layout @dynamicRouterShow="dynamicRouterShow">
    <!-- update-begin- author:sunjianlei --- date:20191009 --- for: 提升右鍵菜單的層級 -->
    <contextmenu :itemList="menuItemList" :visible.sync="menuVisible" style="z-index: 9999;" @select="onMenuSelect"/>
    <!-- update-end- author:sunjianlei --- date:20191009 --- for: 提升右鍵菜單的層級 -->
    <a-tabs
      @contextmenu.native="e => onContextmenu(e)"
      v-if="multipage"
      :active-key="activePage"
      class="tab-layout-tabs"
      style="height:52px"
      :hide-add="true"
      type="editable-card"
      @change="changePage"
      @tabClick="tabCallBack"
      @edit="editPage">
      <a-tab-pane :id="page.fullPath" :key="page.fullPath" v-for="page in pageList" :closable="!(page.meta.title=='首頁')">
        <span slot="tab" :pagekey="page.fullPath">{{ page.meta.title }}</span>
      </a-tab-pane>
    </a-tabs>
    <div style="margin: 12px 12px 0;">
      <!-- update-begin-author:taoyan date:20201221 for:此處刪掉transition標籤 不知道為什麼加上後 頁面路由切換的時候即1及菜單切到2及菜單的時候 兩個菜單頁面會同時出現300-500秒左右 -->
      <keep-alive v-if="multipage">
        <router-view v-if="reloadFlag"/>
      </keep-alive>
      <template v-else>
        <router-view v-if="reloadFlag"/>
      </template>
      <!-- update-end-author:taoyan date:20201221 for:此處刪掉transition標籤 不知道為什麼加上後 頁面路由切換的時候即1及菜單切到2及菜單的時候 兩個菜單頁面會同時出現300-500秒左右 -->
    </div>
  </global-layout>
</template>

<script>
  import GlobalLayout from '@/components/page/GlobalLayout'
  import Contextmenu from '@/components/menu/Contextmenu'
  import { mixin, mixinDevice } from '@/utils/mixin.js'
  import { triggerWindowResizeEvent } from '@/utils/util'
  import Vue from 'vue'
  import { CACHE_INCLUDED_ROUTES } from '@/store/mutation-types'

  const indexKey = '/dashboard/analysis'

  export default {
    name: 'TabLayout',
    components: {
      GlobalLayout,
      Contextmenu
    },
    mixins: [mixin, mixinDevice],
    data() {
      return {
        pageList: [],
        linkList: [],
        activePage: '',
        menuVisible: false,
        menuItemList: [
          { key: '4', icon: 'reload', text: '刷 新' },
          { key: '1', icon: 'arrow-left', text: '關閉左側' },
          { key: '2', icon: 'arrow-right', text: '關閉右側' },
          { key: '3', icon: 'close', text: '關閉其它' }
        ],
        reloadFlag:true
      }
    },
    /* update_begin author:wuxianquan date:20190828 for: 關閉當前tab頁，供子頁面調用 ->望菜單能配置外鏈，直接彈出新頁面而不是嵌入iframe #428 */
    provide(){
      return{
        closeCurrent:this.closeCurrent
      }
    },
    /* update_end author:wuxianquan date:20190828 for: 關閉當前tab頁，供子頁面調用->望菜單能配置外鏈，直接彈出新頁面而不是嵌入iframe #428 */
    computed: {
      multipage() {
        //判斷如果是手機模式，自動切換為單頁面模式
        if (this.isMobile()) {
          return false
        } else {
          return this.$store.state.app.multipage
        }
      }
    },
    created() {
      if (this.$route.path != indexKey) {
        this.addIndexToFirst()
      }
      // 複製一個route對像出來，不能影響原route
      let currentRoute = Object.assign({}, this.$route)
      currentRoute.meta = Object.assign({}, currentRoute.meta)
      this.pageList.push(currentRoute)
      this.linkList.push(currentRoute.fullPath)
      this.activePage = currentRoute.fullPath
    },
    mounted() {
    },
    watch: {
      '$route': function(newRoute) {
        //console.log("新的路由",newRoute)
        this.activePage = newRoute.fullPath
        if (!this.multipage) {
          this.linkList = [newRoute.fullPath]
          this.pageList = [Object.assign({},newRoute)]
        // update-begin-author:taoyan date:20200211 for: TASK #3368 【路由緩存】首頁的緩存設置有問題，需要根據後台的路由配置來實現是否緩存
        } else if(indexKey==newRoute.fullPath) {
          //首頁時 判斷是否緩存 沒有緩存 刷新之
          if (newRoute.meta.keepAlive === false) {
            this.routeReload()
          }
        // update-end-author:taoyan date:20200211 for: TASK #3368 【路由緩存】首頁的緩存設置有問題，需要根據後台的路由配置來實現是否緩存
        }else if (this.linkList.indexOf(newRoute.fullPath) < 0) {
          this.linkList.push(newRoute.fullPath)
          this.pageList.push(Object.assign({},newRoute))
          //// update-begin-author:sunjianlei date:20200103 for: 如果新增的頁面配置了緩存路由，那麼就強制刷新一遍 #842
          // if (newRoute.meta.keepAlive) {
          //   this.routeReload()
          // }
          //// update-end-author:sunjianlei date:20200103 for: 如果新增的頁面配置了緩存路由，那麼就強制刷新一遍 #842
        } else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
          let oldIndex = this.linkList.indexOf(newRoute.fullPath)
          let oldPositionRoute = this.pageList[oldIndex]
          this.pageList.splice(oldIndex, 1, Object.assign({},newRoute,{meta:oldPositionRoute.meta}))
        }
      },
      'activePage': function(key) {
        let index = this.linkList.lastIndexOf(key)
        let waitRouter = this.pageList[index]
        // 【TESTA-523】修復：不允許重複跳轉路由異常
        if (waitRouter.fullPath !== this.$route.fullPath) {
          this.$router.push(Object.assign({}, waitRouter))
        }
        this.changeTitle(waitRouter.meta.title)
      },
      'multipage': function(newVal) {
        if(this.reloadFlag){
          if (!newVal) {
            this.linkList = [this.$route.fullPath]
            this.pageList = [this.$route]
          }
        }
      },
      // update-begin-author:sunjianlei date:20191223 for: 修復從單頁模式切換回多頁模式後首頁不居第一位的 BUG
      device() {
        if (this.multipage && this.linkList.indexOf(indexKey) === -1) {
          this.addIndexToFirst()
        }
      },
      // update-end-author:sunjianlei date:20191223 for: 修復從單頁模式切換回多頁模式後首頁不居第一位的 BUG
    },
    methods: {
      // update-begin-author:sunjianlei date:20191223 for: 修復從單頁模式切換回多頁模式後首頁不居第一位的 BUG
      // 將首頁添加到第一位
      addIndexToFirst() {
        this.pageList.splice(0, 0, {
          name: 'dashboard-analysis',
          path: indexKey,
          fullPath: indexKey,
          meta: {
            icon: 'dashboard',
            title: '首頁'
          }
        })
        this.linkList.splice(0, 0, indexKey)
      },
      // update-end-author:sunjianlei date:20191223 for: 修復從單頁模式切換回多頁模式後首頁不居第一位的 BUG

      // update-begin-author:sunjianlei date:20200120 for: 動態更改頁面標題
      changeTitle(title) {
        let projectTitle = "King's 管理系統"
        // 首頁特殊處理
        if (this.$route.path === indexKey) {
          document.title = projectTitle
        } else {
          document.title = title + ' · ' + projectTitle
        }
      },
      // update-end-author:sunjianlei date:20200120 for: 動態更改頁面標題

      changePage(key) {
        this.activePage = key
      },
      tabCallBack() {
        this.$nextTick(() => {
          //update-begin-author:taoyan date: 20201211 for:【新版】online報錯 JT-100
         setTimeout(()=>{
           //省市區組件裡面給window綁定了個resize事件 導致切換頁面的時候觸發了他的resize，但是切換頁面，省市區組件還沒被銷毀前就觸發了該事件，導致控制台報錯，加個延遲
           triggerWindowResizeEvent()
         },20)
          //update-end-author:taoyan date: 20201211 for:【新版】online報錯 JT-100
        })
      },
      editPage(key, action) {
        this[action](key)
      },
      remove(key) {
        if (key == indexKey) {
          this.$message.warning('首頁不能關閉!')
          return
        }
        if (this.pageList.length === 1) {
          this.$message.warning('這是最後一頁，不能再關閉了啦')
          return
        }
        console.log("this.pageList ",this.pageList );
        let removeRoute = this.pageList.filter(item => item.fullPath == key)
        this.pageList = this.pageList.filter(item => item.fullPath !== key)
        let index = this.linkList.indexOf(key)
        this.linkList = this.linkList.filter(item => item !== key)
        index = index >= this.linkList.length ? this.linkList.length - 1 : index
        this.activePage = this.linkList[index]

        //update-begin--Author:scott  Date:20201015 for：路由緩存問題，關閉了tab頁時再打開就不刷新 #842
        //關閉頁面則從緩存cache_included_routes中刪除路由，下次點擊菜單會重新加載頁面
        let cacheRouterArray = Vue.ls.get(CACHE_INCLUDED_ROUTES) || []
        if (removeRoute && removeRoute[0]) {
          let componentName = removeRoute[0].meta.componentName
          console.log("key: ", key);
          console.log("componentName: ", componentName);
          if(cacheRouterArray.includes(componentName)){
            cacheRouterArray.splice(cacheRouterArray.findIndex(item => item === componentName), 1)
            Vue.ls.set(CACHE_INCLUDED_ROUTES, cacheRouterArray)
          }
          this.emitPageClosed(removeRoute[0])
        }
        //update-end--Author:scott  Date:20201015 for：路由緩存問題，關閉了tab頁時再打開就不刷新 #842

      },
      // 觸發 page-closed （頁面關閉）全局事件
      emitPageClosed(closedRoute) {
        this.$root.$emit('page-closed', {
          closedRoute,
          pageList: this.pageList,
          linkList: this.linkList,
          activePage: this.activePage
        })
      },
      onContextmenu(e) {
        const pagekey = this.getPageKey(e.target)
        if (pagekey !== null) {
          e.preventDefault()
          this.menuVisible = true
        }
      },
      getPageKey(target, depth) {
        depth = depth || 0
        if (depth > 2) {
          return null
        }
        let pageKey = target.getAttribute('pagekey')
        pageKey = pageKey || (target.previousElementSibling ? target.previousElementSibling.getAttribute('pagekey') : null)
        return pageKey || (target.firstElementChild ? this.getPageKey(target.firstElementChild, ++depth) : null)
      },
      onMenuSelect(key, target) {
        let pageKey = this.getPageKey(target)
        switch (key) {
          case '1':
            this.closeLeft(pageKey)
            break
          case '2':
            this.closeRight(pageKey)
            break
          case '3':
            this.closeOthers(pageKey)
            break
          case '4':
            this.routeReload()
            break
          default:
            break
        }
      },
      /* update_begin author:wuxianquan date:20190828 for: 關閉當前tab頁，供子頁面調用->望菜單能配置外鏈，直接彈出新頁面而不是嵌入iframe #428 */
      closeCurrent(){
        this.remove(this.activePage);
      },
      /* update_end author:wuxianquan date:20190828 for: 關閉當前tab頁，供子頁面調用->望菜單能配置外鏈，直接彈出新頁面而不是嵌入iframe #428 */
      closeOthers(pageKey) {
        let index = this.linkList.indexOf(pageKey)
        if (pageKey == indexKey || pageKey.indexOf('?ticke=')>=0) {
          this.linkList = this.linkList.slice(index, index + 1)
          this.pageList = this.pageList.slice(index, index + 1)
          this.activePage = this.linkList[0]
        } else {
          let indexContent = this.pageList.slice(0, 1)[0]
          this.linkList = this.linkList.slice(index, index + 1)
          this.pageList = this.pageList.slice(index, index + 1)
          this.linkList.unshift(indexContent.fullPath)
          this.pageList.unshift(indexContent)
          this.activePage = this.linkList[1]
        }
      },
      closeLeft(pageKey) {
        if (pageKey == indexKey) {
          return
        }
        let tempList = [...this.pageList]
        let indexContent = tempList.slice(0, 1)[0]
        let index = this.linkList.indexOf(pageKey)
        this.linkList = this.linkList.slice(index)
        this.pageList = this.pageList.slice(index)
        this.linkList.unshift(indexContent.fullPath)
        this.pageList.unshift(indexContent)
        if (this.linkList.indexOf(this.activePage) < 0) {
          this.activePage = this.linkList[0]
        }
      },
      closeRight(pageKey) {
        let index = this.linkList.indexOf(pageKey)
        this.linkList = this.linkList.slice(0, index + 1)
        this.pageList = this.pageList.slice(0, index + 1)
        if (this.linkList.indexOf(this.activePage < 0)) {
          this.activePage = this.linkList[this.linkList.length - 1]
        }
      },
      //update-begin-author:taoyan date:20190430 for:動態路由title顯示配置的菜單title而不是其對應路由的title
      dynamicRouterShow(key,title){
        let keyIndex = this.linkList.indexOf(key)
        if(keyIndex>=0){
          let currRouter = this.pageList[keyIndex]
          let meta = Object.assign({},currRouter.meta,{title:title})
          this.pageList.splice(keyIndex, 1, Object.assign({},currRouter,{meta:meta}))
          if (key === this.activePage) {
            this.changeTitle(title)
          }
        }
      },
      //update-end-author:taoyan date:20190430 for:動態路由title顯示配置的菜單title而不是其對應路由的title

      //update-begin-author:taoyan date:20191008 for:路由刷新
      routeReload(){
        this.reloadFlag = false
        let ToggleMultipage = "ToggleMultipage"
        this.$store.dispatch(ToggleMultipage,false)
        this.$nextTick(()=>{
          this.$store.dispatch(ToggleMultipage,true)
          this.reloadFlag = true
        })
      },
      //update-end-author:taoyan date:20191008 for:路由刷新
      //新增一個返回方法
      excuteCallback(callback){
        callback()
      },
    }
  }
</script>

<style lang="less">

  /*
 * The following styles are auto-applied to elements with
 * transition="page-transition" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the page transition by editing
 * these styles.
 */

  .page-transition-enter {
    opacity: 0;
  }

  .page-transition-leave-active {
    opacity: 0;
  }

  .page-transition-enter .page-transition-container,
  .page-transition-leave-active .page-transition-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  /*美化彈出Tab樣式*/
  .ant-tabs-nav-container {
    margin-top: 4px;
  }

  /* 修改 ant-tabs 樣式 */
  .tab-layout-tabs.ant-tabs {
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    background-color: white;
    padding: 0 20px;

    .ant-tabs-bar {
      margin: 4px 0 0;
      border: none;
    }

  }

  .tab-layout-tabs.ant-tabs {

    &.ant-tabs-card .ant-tabs-tab {

      padding: 0 24px !important;
      background-color: white !important;
      margin-right: 10px !important;

      .ant-tabs-close-x {
        width: 12px !important;
        height: 12px !important;
        opacity: 0 !important;
        cursor: pointer !important;
        font-size: 12px !important;
        margin: 0 !important;
        position: absolute;
        top: 36%;
        right: 6px;
      }

      &:hover .ant-tabs-close-x {
        opacity: 1 !important;
      }

    }

  }

  .tab-layout-tabs.ant-tabs.ant-tabs-card > .ant-tabs-bar {
    .ant-tabs-tab {
      border: none !important;
      border-bottom: 1px solid transparent !important;
    }
    .ant-tabs-tab-active {
      border-color: @primary-color!important;
    }
  }


</style>
