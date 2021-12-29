<template>
  <a-input
    ref="input"
    :value="innerValue"
    v-bind="cellProps"
    @blur="handleBlur"
    @change="handleChange"
  />
</template>

<script>
  import { JVXETypes } from '@/components/jeecg/JVxeTable'
  import JVxeCellMixins from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

  const NumberRegExp = /^-?\d+\.?\d*$/
  export default {
    name: 'JVxeInputCell',
    mixins: [JVxeCellMixins],
    methods: {

      /** 處理change事件 */
      handleChange(event) {
        let {$type} = this
        let {target} = event
        let {value, selectionStart} = target
        let change = true
        if ($type === JVXETypes.inputNumber) {
          // 判斷輸入的值是否匹配数字正則表達式，不匹配就還原
          if (!NumberRegExp.test(value) && (value !== '' && value !== '-')) {
            change = false
            value = this.innerValue
            target.value = value || ''
            if (typeof selectionStart === 'number') {
              target.selectionStart = selectionStart - 1
              target.selectionEnd = selectionStart - 1
            }
          }
        }
        // 觸發事件，存儲輸入的值
        if (change) {
          this.handleChangeCommon(value)
        }

        if ($type === JVXETypes.inputNumber) {
          // this.recalcOneStatisticsColumn(col.key)
        }
      },

      /** 處理blur失去焦點事件 */
      handleBlur(event) {
        let {$type} = this
        let {target} = event
        // 判斷輸入的值是否匹配数字正則表達式，不匹配就置空
        if ($type === JVXETypes.inputNumber) {
          if (!NumberRegExp.test(target.value)) {
            target.value = ''
          } else {
            target.value = Number.parseFloat(target.value)
          }
          this.handleChangeCommon(target.value)
        }

        this.handleBlurCommon(target.value)
      },

    },
    // 【組件增強】註釋詳見：JVxeCellMixins.js
    enhanced: {
      installOptions: {
        // 自動聚焦的 class 類名
        autofocus: '.ant-input',
      },
      getValue(value) {
        if (this.$type === JVXETypes.inputNumber && typeof value === 'string') {
          if (NumberRegExp.test(value)) {
            return Number.parseFloat(value)
          }
        }
        return value
      },
    }
  }
</script>

<style scoped>

</style>