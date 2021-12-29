<template>
  <j-popup
    v-bind="popupProps"
    @input="handlePopupInput"
  />
</template>

<script>
  import JVxeCellMixins, { dispatchEvent, vModel } from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

  export default {
    name: 'JVxePopupCell',
    mixins: [JVxeCellMixins],
    computed: {
      popupProps() {
        const {innerValue, originColumn: col, caseId, cellProps} = this
        return {
          ...cellProps,
          value: innerValue,
          field: col.field || col.key,
          code: col.popupCode,
          orgFields: col.orgFields,
          destFields: col.destFields,
          groupId: caseId,
          param: col.param,
          sorter: col.sorter,
        }
      },
    },
    methods: {
      /** popup回調 */
      handlePopupInput(value, others) {
        const {row, originColumn: col} = this
        // 存儲輸入的值
        let popupValue = value
        if (others && Object.keys(others).length > 0) {
          Object.keys(others).forEach(key => {
            let currentValue = others[key]
            // 當前列直接賦值，其他列通過vModel賦值
            if (key === col.key) {
              popupValue = currentValue
            } else {
              vModel.call(this, currentValue, row, key)
            }
          })
        }
        this.handleChangeCommon(popupValue)
      },
    },
    // 【組件增強】註釋詳見：JVxeCellMixins.js
    enhanced: {
      aopEvents: {
        editActived(event) {
          dispatchEvent.call(this, event, 'ant-input')
        },
      },
    },
  }
</script>

<style scoped>

</style>