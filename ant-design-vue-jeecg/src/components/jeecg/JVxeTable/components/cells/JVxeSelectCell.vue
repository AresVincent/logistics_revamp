<template>
  <a-select
    ref="select"
    :value="innerValue"
    allowClear
    :filterOption="handleSelectFilterOption"
    v-bind="selectProps"
    style="width: 100%;"
    @blur="handleBlur"
    @change="handleChange"
    @search="handleSearchSelect"
  >

    <div v-if="loading" slot="notFoundContent">
      <a-icon type="loading"  />
      <span>&nbsp;加載中…</span>
    </div>

    <template v-for="option of selectOptions">
      <a-select-option :key="option.value" :value="option.value" :disabled="option.disabled">
        <span>{{option.text || option.label || option.title|| option.value}}</span>
      </a-select-option>
    </template>

  </a-select>
</template>

<script>
  import JVxeCellMixins, { dispatchEvent } from '@/components/jeecg/JVxeTable/mixins/JVxeCellMixins'
  import { JVXETypes } from '@comp/jeecg/JVxeTable/index'
  import { filterDictText } from '@comp/dict/JDictSelectUtil'

  export default {
    name: 'JVxeSelectCell',
    mixins: [JVxeCellMixins],
    data(){
      return {
        loading: false,
        // 異步加載的options（用於多級聯動）
        asyncOptions: null,
      }
    },
    computed: {
      selectProps() {
        let props = {...this.cellProps}
        // 判斷select是否允許輸入
        let {allowSearch, allowInput} = this.originColumn
        if (allowInput === true || allowSearch === true) {
          props['showSearch'] = true
        }
        return props
      },
      // 下拉選項
      selectOptions() {
        if (this.asyncOptions) {
          return this.asyncOptions
        }
        let {linkage} = this.renderOptions
        if (linkage) {
          let {getLinkageOptionsSibling, config} = linkage
          let res = getLinkageOptionsSibling(this.row, this.originColumn, config, true)
          // 當返回Promise時，說明是多級聯動
          if (res instanceof Promise) {
            this.loading = true
            res.then(opt => {
              this.asyncOptions = opt
              this.loading = false
            }).catch(e => {
              console.error(e)
              this.loading = false
            })
          } else {
            this.asyncOptions = null
            return res
          }
        }
        return this.originColumn.options
      },
    },
    created() {
      let multiple = [JVXETypes.selectMultiple, JVXETypes.list_multi]
      let search = [JVXETypes.selectSearch, JVXETypes.sel_search]
      if (multiple.includes(this.$type)) {
        // 處理多選
        let props = this.originColumn.props || {}
        props['mode'] = 'multiple'
        props['maxTagCount'] = 1
        this.$set(this.originColumn, 'props', props)
      } else if (search.includes(this.$type)) {
        // 處理搜索
        this.$set(this.originColumn, 'allowSearch', true)
      }
    },
    methods: {

      handleChange(value) {
        // 處理下級聯動
        let linkage = this.renderOptions.linkage
        if (linkage) {
          linkage.linkageSelectChange(this.row, this.originColumn, linkage.config, value)
        }
        this.handleChangeCommon(value)
      },

      /** 處理blur失去焦點事件 */
      handleBlur(value) {
        let {allowInput, options} = this.originColumn

        if (allowInput === true) {
          // 刪除無用的因搜索（用戶輸入）而創建的項
          if (typeof value === 'string') {
            let indexes = []
            options.forEach((option, index) => {
              if (option.value.toLocaleString() === value.toLocaleString()) {
                delete option.searchAdd
              } else if (option.searchAdd === true) {
                indexes.push(index)
              }
            })
            // 翻轉刪除數組中的項
            for (let index of indexes.reverse()) {
              options.splice(index, 1)
            }
          }
        }

        this.handleBlurCommon(value)
      },

      /** 用於搜索下拉框中的內容 */
      handleSelectFilterOption(input, option) {
        let {allowSearch, allowInput} = this.originColumn
        if (allowSearch === true || allowInput === true) {
          //update-begin-author:taoyan date:20200820 for:【專項任務】大連項目反饋行編輯問題處理 下拉框搜索
          return option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
          //update-end-author:taoyan date:20200820 for:【專項任務】大連項目反饋行編輯問題處理 下拉框搜索
        }
        return true
      },

      /** select 搜索時的事件，用於動態添加options */
      handleSearchSelect(value) {
        let {allowSearch, allowInput, options} = this.originColumn

        if (allowSearch !== true && allowInput === true) {
          // 是否找到了對應的項，找不到則添加這一項
          let flag = false
          for (let option of options) {
            if (option.value.toLocaleString() === value.toLocaleString()) {
              flag = true
              break
            }
          }
          // !!value ：不添加空值
          if (!flag && !!value) {
            // searchAdd 是否是通過搜索添加的
            options.push({title: value, value: value, searchAdd: true})
          }

        }
      },

    },
    // 【組件增強】註釋詳見：JVxeCellMixins.js
    enhanced: {
      aopEvents: {
        editActived(event) {
          dispatchEvent.call(this, event, 'ant-select')
        },
      },
      translate: {
        enabled: true,
        async handler(value,) {
          let options
          let {linkage} = this.renderOptions
          // 判斷是否是多級聯動，如果是就通過接口異步翻譯
          if (linkage) {
            let {getLinkageOptionsSibling, config} = linkage
            options = getLinkageOptionsSibling(this.row, this.originColumn, config, true)
            if (options instanceof Promise) {
              return new Promise(resolve => {
                options.then(opt => {
                  resolve(filterDictText(opt, value))
                })
              })
            }
          } else {
            options = this.column.own.options
          }
          return filterDictText(options, value)
        },
      },
      getValue(value) {
        if (Array.isArray(value)) {
          return value.join(',')
        } else {
          return value
        }
      },
      setValue(value) {
        let {column: {own: col}, params: {$table}} = this
        // 判斷是否是多選
        if ((col.props || {})['mode'] === 'multiple') {
          $table.$set(col.props, 'maxTagCount', 1)
        }
        if (value != null && value !== '') {
          if (typeof value === 'string') {
            return value === '' ? [] : value.split(',')
          }
          return value
        } else {
          return undefined
        }
      }
    }
  }
</script>

<style scoped>

</style>