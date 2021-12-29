import JVxeCellMixins from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

// 插槽
export default {
  name: 'JVxeSlotCell',
  mixins: [JVxeCellMixins],
  computed: {
    slotProps() {
      return {
        value: this.innerValue,
        row: this.row,
        column: this.originColumn,

        params: this.params,
        $table: this.params.$table,
        rowId: this.params.rowid,
        index: this.params.rowIndex,
        rowIndex: this.params.rowIndex,
        columnIndex: this.params.columnIndex,

        target: this.renderOptions.target,
        caseId: this.renderOptions.target.caseId,
        scrolling: this.renderOptions.scrolling,
        reloadEffect: this.renderOptions.reloadEffect,

        triggerChange: (v) => this.handleChangeCommon(v),
      }
    },
  },
  render(h) {
    let {slot} = this.renderOptions
    if (slot) {
      return h('div', {}, slot(this.slotProps))
    } else {
      return h('div')
    }
  },
  // 【組件增強】註釋詳見：JVxeCellMixins.js
  enhanced: {
    switches: {
      editRender: false
    },
  }
}

// :isNotPass="notPassedIds.includes(col.key+row.id)"
