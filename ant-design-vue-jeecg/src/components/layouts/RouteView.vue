<template>
  <div class="main">
  <keep-alive :include="includedComponents">
    <router-view v-if="keepAlive" />
  </keep-alive>
  <router-view v-if="!keepAlive" />
  </div>
</template>

<script>
  import Vue from 'vue'
  import { CACHE_INCLUDED_ROUTES } from "@/store/mutation-types"

  export default {
    name: "RouteView",
    computed: {
      //update-begin--Author:scott  Date:20201015 for：路由緩存問題，關閉了tab頁時再打開就不刷新 #842
      includedComponents() {
        const includedRouters = Vue.ls.get(CACHE_INCLUDED_ROUTES)
        console.log("includedRouters：" + includedRouters)

        //如果是緩存路由，則加入到 cache_included_routes
        if (this.$route.meta.keepAlive && this.$route.meta.componentName) {
          let cacheRouterArray = Vue.ls.get(CACHE_INCLUDED_ROUTES) || []
          if(!cacheRouterArray.includes(this.$route.meta.componentName)){
            cacheRouterArray.push(this.$route.meta.componentName)
            // cacheRouterArray.push("OnlCgformHeadList")
            console.log("Vue ls set componentName ：" + this.$route.meta.componentName)
            Vue.ls.set(CACHE_INCLUDED_ROUTES, cacheRouterArray)
            console.log("Vue ls includedRouterArrays ：" + Vue.ls.get(CACHE_INCLUDED_ROUTES))
            return cacheRouterArray;
          }
        }
        return includedRouters;
      },
      //update-end--Author:scott  Date:20201015 for：路由緩存問題，關閉了tab頁時再打開就不刷新 #842
      keepAlive () {
        return this.$route.meta.keepAlive
      }
    },
  }
</script>