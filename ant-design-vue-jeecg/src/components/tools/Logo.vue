<template>
  <div class="logo">
    <router-link :to="routerLinkTo">

      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo顏色根據主題顏色變化 -->
      <img v-if="navTheme === 'dark'" src="~@/assets/Kings_logo_white.png" alt="logo">
      <img v-else src="~@/assets/Kings_logo_colour.png" alt="logo">
      <!-- update-begin- author:sunjianlei --- date:20190814 --- for: logo顏色根據主題顏色變化 -->

      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: "King's Cargo",
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      },
      // 點擊Logo跳轉地址
      routerLinkTo: {
        type: Object,
        default: () => ({name: 'dashboard'}),
      },
    }
  }
</script>
<style lang="less" scoped>
  /*縮小首頁布 局頂部的高度*/
  @height: 59px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: @height !important;
      line-height: @height !important;
      box-shadow: none !important;
      transition: background 300ms;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: @primary-color;
    }
  }
</style>