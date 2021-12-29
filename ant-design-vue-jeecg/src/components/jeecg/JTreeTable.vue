<template>
  <a-table
    :rowKey="rowKey"
    :columns="columns"
    :dataSource="dataSource"
    :expandedRowKeys="expandedRowKeys"
    v-bind="tableAttrs"
    v-on="$listeners"
    @expand="handleExpand"
    @expandedRowsChange="expandedRowKeys=$event">

    <template v-for="(slotItem) of slots" :slot="slotItem" slot-scope="text, record, index">
      <slot :name="slotItem" v-bind="{text,record,index}"></slot>
    </template>

  </a-table>
</template>

<script>
  import { getAction } from '@/api/manage'

  export default {
    name: 'JTreeTable',
    props: {
      rowKey: {
        type: String,
        default: 'id'
      },
      // 根據什麼查詢，如果傳遞 id 就根據 id 查詢
      queryKey: {
        type: String,
        default: 'parentId'
      },
      queryParams: {
        type: Object,
        default: () => ({})
      },
      // 查詢頂級時的值，如果頂級為0，則傳0
      topValue: {
        type: String,
        default: null
      },
      columns: {
        type: Array,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      childrenUrl: {
        type: String,
        default: null
      },
      tableProps: {
        type: Object,
        default: () => ({})
      },
      /** 是否在創建組件的時候就查詢數據 */
      immediateRequest: {
        type: Boolean,
        default: true
      },
      condition:{
        type:String,
        default:'',
        required:false
      }
    },
    data() {
      return {
        dataSource: [],
        expandedRowKeys: []
      }
    },
    computed: {
      getChildrenUrl() {
        if (this.childrenUrl) {
          return this.childrenUrl
        } else {
          return this.url
        }
      },
      slots() {
        let slots = []
        for (let column of this.columns) {
          if (column.scopedSlots && column.scopedSlots.customRender) {
            slots.push(column.scopedSlots.customRender)
          }
        }
        return slots
      },
      tableAttrs() {
        return Object.assign(this.$attrs, this.tableProps)
      }
    },
    watch: {
      queryParams: {
        deep: true,
        handler() {
          this.loadData()
        }
      }
    },
    created() {
      if (this.immediateRequest) this.loadData()
    },
    methods: {

      /** 加載數據*/
      loadData(id = this.topValue, first = true, url = this.url) {
        this.$emit('requestBefore', { first })

        if (first) {
          this.expandedRowKeys = []
        }

        let params = Object.assign({}, this.queryParams || {})
        params[this.queryKey] = id
        if(this.condition && this.condition.length>0){
          params['condition'] = this.condition
        }

        return getAction(url, params).then(res => {
          let list = []
          if (res.result instanceof Array) {
            list = res.result
          } else if (res.result.records instanceof Array) {
            list = res.result.records
          } else {
            throw '返回數據類型不識別'
          }
          let dataSource = list.map(item => {
            // 判斷是否標記了帶有子級
            if (item.hasChildren === true) {
              // 查找第一個帶有dataIndex的值的列
              let firstColumn
              for (let column of this.columns) {
                firstColumn = column.dataIndex
                if (firstColumn) break
              }
              // 定義默認展開時显示的loading子級，實際子級數據只在展開時加載
              let loadChild = { id: `${item.id}_loadChild`, [firstColumn]: 'loading...', isLoading: true }
              item.children = [loadChild]
            }
            return item
          })
          if (first) {
            this.dataSource = dataSource
          }
          this.$emit('requestSuccess', { first, dataSource, res })
          return Promise.resolve(dataSource)
        }).finally(() => this.$emit('requestFinally', { first }))
      },

      /** 點擊展開圖標時觸發 */
      handleExpand(expanded, record) {
        // 判斷是否是展開狀態
        if (expanded) {
          // 判斷子級的首個項的標記是否是“正在加載中”，如果是就加載數據
          if (record.children[0].isLoading === true) {
            this.loadData(record.id, false, this.getChildrenUrl).then(dataSource => {
              // 處理好的數據可直接賦值給children
              if (dataSource.length === 0) {
                record.children = null
              } else {
                record.children = dataSource
              }
            })
          }
        }
      }

    }
  }
</script>

<style scoped>

</style>