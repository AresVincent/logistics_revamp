<template>
  <a-progress
    :class="clazz"
    :percent="innerValue"
    size="small"
    v-bind="cellProps"
  />
</template>

<script>
  import JVxeCellMixins from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

  // JVxe 進度條組件
  export default {
    name: 'JVxeProgressCell',
    mixins: [JVxeCellMixins],
    data() {
      return {}
    },
    computed: {
      clazz() {
        return {
          'j-vxe-progress': true,
          'no-animation': this.scrolling
        }
      },
      scrolling() {
        return !!this.renderOptions.scrolling
      },
    },
    methods: {},
    // 【組件增強】註釋詳見：JVxeCellMixins.js
    enhanced: {
      switches: {
        editRender: false,
      },
      setValue(value) {
        try {
          if (typeof value !== 'number') {
            return Number.parseFloat(value)
          } else {
            return value
          }
        } catch {
          return 0
        }
      },
    }
  }
</script>

<style scoped lang="less">
  // 關閉進度條的動畫，防止滾動時動態賦值出現問題
  .j-vxe-progress.no-animation {
    /deep/ .ant-progress-success-bg,
    /deep/ .ant-progress-bg {
      transition: none !important;
    }
  }
</style>