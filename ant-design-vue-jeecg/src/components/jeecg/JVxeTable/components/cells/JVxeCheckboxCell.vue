<template>
  <div :class="clazz" :style="boxStyle">
    <a-checkbox
      ref="checkbox"
      :checked="innerValue"
      v-bind="cellProps"
      @change="handleChange"
    />
  </div>
</template>

<script>
  import { neverNull } from '@/utils/util'
  import JVxeCellMixins from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

  export default {
    name: 'JVxeCheckboxCell',
    mixins: [JVxeCellMixins],
    props: {},
    computed: {
      bordered() {
        return !!this.renderOptions.bordered
      },
      scrolling() {
        return !!this.renderOptions.scrolling
      },
      clazz() {
        return {
          'j-vxe-checkbox': true,
          'no-animation': this.scrolling
        }
      },
      boxStyle() {
        const style = {}
        // 如果有邊框且未設置align屬性，就強制居中
        if (this.bordered && !this.originColumn.align) {
          style['text-align'] = 'center'
        }
        return style
      },
    },
    methods: {
      handleChange(event) {
        this.handleChangeCommon(event.target.checked)
      },
    },
    // 【組件增強】註釋詳見：JVxeCellMixins.js
    enhanced: {
      switches: {
        visible: true,
      },
      getValue(value) {
        let {own: col} = this.column
        // 處理 customValue
        if (Array.isArray(col.customValue)) {
          let customValue = getCustomValue(col)
          if (typeof value === 'boolean') {
            return value ? customValue[0] : customValue[1]
          } else {
            return value
          }
        } else {
          return value
        }
      },
      setValue(value) {
        let {own: col} = this.column
        // 判斷是否設定了customValue（自定義值）
        if (Array.isArray(col.customValue)) {
          let customValue = getCustomValue(col)
          return neverNull(value).toString() === customValue[0].toString()
        } else {
          return !!value
        }
      },
      createValue({column}) {
        let {own: col} = column
        if (Array.isArray(col.customValue)) {
          let customValue = getCustomValue(col)
          return col.defaultChecked ? customValue[0] : customValue[1]
        } else {
          return !!col.defaultChecked
        }
      },
    }
  }

  function getCustomValue(col) {
    let customTrue = neverNull(col.customValue[0], true)
    let customFalse = neverNull(col.customValue[1], false)
    return [customTrue, customFalse]
  }
</script>

<style lang="less">
  // 關閉動畫，防止滾動時動態賦值出現問題
  .j-vxe-checkbox.no-animation {
    .ant-checkbox-inner,
    .ant-checkbox-inner::after {
      transition: none !important;
    }
  }
</style>