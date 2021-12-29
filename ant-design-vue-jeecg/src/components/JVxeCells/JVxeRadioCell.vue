<template>
  <a-radio-group
    :class="clazz"
    :value="innerValue"
    v-bind="cellProps"
    @change="(e)=>handleChangeCommon(e.target.value)"
  >
    <a-radio
      v-for="item of originColumn.options"
      :key="item.value"
      :value="item.value"
      @click="$event=>handleRadioClick(item,$event)"
    >{{ item.text }}
    </a-radio>
  </a-radio-group>
</template>

<script>
  import JVxeCellMixins from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

  export default {
    name: 'JVxeRadioCell',
    mixins: [JVxeCellMixins],
    computed: {
      scrolling() {
        return !!this.renderOptions.scrolling
      },
      clazz() {
        return {
          'j-vxe-radio': true,
          'no-animation': this.scrolling
        }
      },
    },
    methods: {
      handleRadioClick(item) {
        if (this.originColumn.allowClear === true) {
          // 取消選擇
          if (item.value === this.innerValue) {
            this.handleChangeCommon(null)
          }
        }
      },
    },
    // 【組件增強】註釋詳見：JVxeCellMixins.js
    enhanced: {
      switches: {visible: true},
    }
  }
</script>

<style lang="less">
  // 關閉動畫，防止滾動時動態賦值出現問題
  .j-vxe-radio.no-animation {
    .ant-radio-inner,
    .ant-radio-inner::after {
      transition: none !important;
    }
  }
</style>