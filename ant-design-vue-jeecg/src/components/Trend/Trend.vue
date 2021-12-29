<template>
  <div :class="[prefixCls, reverseColor && 'reverse-color' ]">
    <span>
      <slot name="term"></slot>
      <span class="item-text">
        <slot></slot>
      </span>
    </span>
    <span :class="[flag]"><a-icon :type="`caret-${flag}`"/></span>
  </div>
</template>

<script>
  export default {
    name: "Trend",
    props: {
      prefixCls: {
        type: String,
        default: 'ant-pro-trend'
      },
      /**
       * 上升下降標識：up|down
       */
      flag: {
        type: String,
        required: true
      },
      /**
       * 顏色反轉
       */
      reverseColor: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "index";
</style>