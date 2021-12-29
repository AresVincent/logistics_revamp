import JVxeCellMixins from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

// tags 組件的显示組件
export const TagsSpanCell = {
  name: 'JVxeTagsCell',
  mixins: [JVxeCellMixins],
  data() {
    return {
      innerTags: [],
    }
  },
  watch: {
    innerValue: {
      immediate: true,
      handler(value) {
        if (value !== this.innerTags.join(';')) {
          let rv = replaceValue(value)
          this.innerTags = rv.split(';')
          this.handleChangeCommon(rv)
        }
      },
    },
  },
  methods: {
    renderTags(h) {
      let tags = []
      for (let tag of this.innerTags) {
        if (tag) {
          let tagProps = {}
          let tagStyle = {}
          let setTagColor = this.originColumn.setTagColor
          if (typeof setTagColor === 'function') {
            /**
             * 設置 tag 顏色
             *
             * @param event 包含的字段：
             * event.tagValue 當前tag的值
             * event.value 當前原始值
             * event.row 當前行的所有值
             * event.column 當前列的配置
             * event.column.own 當前列的原始配置
             * @return Array | String 可以返回一個數組，數據第一項是tag背景顏色，第二項是字體顏色。也可以返回一個字符串，即tag背景顏色
             */
            let color = setTagColor({
              tagValue: tag,
              value: this.innerValue,
              row: this.row,
              column: this.column,
            })
            if (Array.isArray(color)) {
              tagProps.color = color[0]
              tagStyle.color = color[1]
            } else if (color && typeof color === 'string') {
              tagProps.color = color
            }
          }
          tags.push(h('a-tag', {
            props: tagProps,
            style: tagStyle,
          }, [tag]))
        }
      }
      return tags
    },
  },
  render(h) {
    return h('div', {}, [
      this.renderTags(h)
    ])
  },
}

// tags 組件的輸入框
export const TagsInputCell = {
  name: 'JVxeTagsInputCell',
  mixins: [JVxeCellMixins],
  data() {
    return {
      innerTagValue: '',
    }
  },
  watch: {
    innerValue: {
      immediate: true,
      handler(value) {
        if (value !== this.innerTagValue) {
          this.handleInputChange(value)
        }
      },
    },
  },
  methods: {

    handleInputChange(value, event) {
      this.innerTagValue = replaceValue(value, event)
      this.handleChangeCommon(this.innerTagValue)
      return this.innerTagValue
    },

  },
  render(h) {
    return h('a-input', {
      props: {
        value: this.innerValue,
        ...this.cellProps
      },
      on: {
        change: (event) => {
          let {target, target: {value}} = event
          let newValue = this.handleInputChange(value, event)
          if (newValue !== value) {
            target.value = newValue
          }
        }
      },
    })
  },
}

// 將值每隔兩位加上一個分號
function replaceValue(value, event) {
  if (value) {
    // 首先去掉現有的分號
    value = value.replace(/;/g, '')
    // 然後再遍歷添加分號
    let rv = ''
    let splitArr = value.split('')
    let count = 0
    splitArr.forEach((val, index) => {
      rv += val
      let position = index + 1
      if (position % 2 === 0 && position < splitArr.length) {
        count++
        rv += ';'
      }
    })
    if (event && count > 0) {
      let {target, target: {selectionStart}} = event
      target.selectionStart = selectionStart + count
      target.selectionEnd = selectionStart + count
    }
    return rv
  }
  return ''
}
