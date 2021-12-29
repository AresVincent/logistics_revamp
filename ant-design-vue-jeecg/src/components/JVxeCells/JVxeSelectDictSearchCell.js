import debounce from 'lodash/debounce'
import { getAction } from '@/api/manage'
import { cloneObject } from '@/utils/util'
import { filterDictText } from '@/components/dict/JDictSelectUtil'
import { ajaxGetDictItems, getDictItemsFromCache } from '@/api/api'
import JVxeCellMixins, { dispatchEvent } from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'

/** 公共資源 */
const common = {
  /** value - label map，防止重複查詢（刷新清空緩存） */
  labelMap: new Map(),

  /** 公共data */
  data() {
    return {
      loading: false,
      innerSelectValue: null,
      innerOptions: [],
    }
  },
  /** 公共計算屬性 */
  computed: {
    dict() {
      return this.originColumn.dict
    },
    options() {
      if (this.isAsync) {
        return this.innerOptions
      } else {
        return this.originColumn.options || []
      }
    },
    // 是否是異步模式
    isAsync() {
      let isAsync = this.originColumn.async
      return (isAsync != null && isAsync !== '') ? !!isAsync : true
    },
  },
  /** 公共屬性監聽 */
  watch: {
    innerValue: {
      immediate: true,
      handler(value) {
        if (value == null || value === '') {
          this.innerSelectValue = null
        } else {
          this.loadDataByValue(value)
        }
      }
    },
    dict() {
      this.loadDataByDict()
    }
  },
  /** 公共方法 */
  methods: {

    // 根據 value 查詢數據，用於回顯
    async loadDataByValue(value) {
      if (this.isAsync) {
        if (this.innerSelectValue !== value) {
          if (common.labelMap.has(value)) {
            this.innerOptions = cloneObject(common.labelMap.get(value))
          } else {
            let {success, result} = await getAction(`/sys/dict/loadDictItem/${this.dict}`, {key: value})
            if (success && result && result.length > 0) {
              this.innerOptions = [{value: value, text: result[0]}]
              common.labelMap.set(value, cloneObject(this.innerOptions))
            }
          }
        }
      }
      this.innerSelectValue = (value || '').toString()
    },

    // 初始化字典
    async loadDataByDict() {
      if (!this.isAsync) {
        // 如果字典項集合有數據
        if (!this.originColumn.options || this.originColumn.options.length === 0) {
          // 根據字典Code, 初始化字典數組
          let dictStr = ''
          if (this.dict) {
            let arr = this.dict.split(',')
            if (arr[0].indexOf('where') > 0) {
              let tbInfo = arr[0].split('where')
              dictStr = tbInfo[0].trim() + ',' + arr[1] + ',' + arr[2] + ',' + encodeURIComponent(tbInfo[1])
            } else {
              dictStr = this.dict
            }
            if (this.dict.indexOf(',') === -1) {
              //優先從緩存中讀取字典配置
              let cache = getDictItemsFromCache(this.dict)
              if (cache) {
                this.innerOptions = cache
                return
              }
            }
            let {success, result} = await ajaxGetDictItems(dictStr, null)
            if (success) {
              this.innerOptions = result
            }
          }
        }
      }
    },

  },

}

// 显示組件，自帶翻譯
export const DictSearchSpanCell = {
  name: 'JVxeSelectSearchSpanCell',
  mixins: [JVxeCellMixins],
  data() {
    return {
      ...common.data.apply(this),
    }
  },
  computed: {
    ...common.computed,
  },
  watch: {
    ...common.watch,
  },
  methods: {
    ...common.methods,
  },
  render(h) {
    return h('span', {}, [
      filterDictText(this.innerOptions, this.innerSelectValue || this.innerValue)
    ])
  },
}

// 請求id
let requestId = 0

// 輸入選擇組件
export const DictSearchInputCell = {
  name: 'JVxeSelectSearchInputCell',
  mixins: [JVxeCellMixins],
  data() {
    return {
      ...common.data.apply(this),

      hasRequest: false,
      scopedSlots: {
        notFoundContent: () => {
          if (this.loading) {
            return <a-spin size="small"/>
          } else if (this.hasRequest) {
            return <div>沒有查詢到任何數據</div>
          } else {
            return <div>{this.tipsContent}</div>
          }
        }
      }
    }
  },
  computed: {
    ...common.computed,
    tipsContent() {
      return this.originColumn.tipsContent || '請輸入搜索內容'
    },
    filterOption() {
      if (this.isAsync) {
        return null
      }
      return (input, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  },
  watch: {
    ...common.watch,
  },
  created() {
    this.loadData = debounce(this.loadData, 300)//消抖
  },
  methods: {
    ...common.methods,

    loadData(value) {
      const currentRequestId = ++requestId
      this.loading = true
      this.innerOptions = []
      if (value == null || value.trim() === '') {
        this.loading = false
        this.hasRequest = false
        return
      }
      // 字典code格式：table,text,code
      this.hasRequest = true
      getAction(`/sys/dict/loadDict/${this.dict}`, {keyword: value}).then(res => {
        if (currentRequestId !== requestId) {
          return
        }
        let {success, result, message} = res
        if (success) {
          this.innerOptions = result
          result.forEach((item) => {
            common.labelMap.set(item.value, [item])
          })
        } else {
          this.$message.warning(message)
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleChange(selectedValue) {
      this.innerSelectValue = selectedValue
      this.handleChangeCommon(this.innerSelectValue)
    },
    handleSearch(value) {
      if (this.isAsync) {
        // 在輸入時也應該開啟加載，因為loadData加了消抖，所以會有800ms的用戶主觀上認為的卡頓時間
        this.loading = true
        if (this.innerOptions.length > 0) {
          this.innerOptions = []
        }
        this.loadData(value)
      }
    },

    renderOptionItem() {
      let options = []
      this.options.forEach(({value, text, label, title, disabled}) => {
        options.push(
          <a-select-option key={value} value={value} disabled={disabled}>{text || label || title}</a-select-option>
        )
      })
      return options
    },
  },
  render() {
    return (
      <a-select
        showSearch
        allowClear
        value={this.innerSelectValue}
        filterOption={this.filterOption}
        style="width: 100%"
        {...this.cellProps}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        scopedSlots={this.scopedSlots}
      >
        {this.renderOptionItem()}
      </a-select>
    )
  },
  // 【組件增強】註釋詳見：JVxeCellMixins.js
  enhanced: {
    aopEvents: {
      editActived(event) {
        dispatchEvent.call(this, event, 'ant-select')
      },
    },
  }
}