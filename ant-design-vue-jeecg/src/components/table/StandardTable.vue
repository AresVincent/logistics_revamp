<template>
  <div class="standard-table">
    <div class="alert">
      <a-alert type="info" :show-icon="true">
        <div slot="message">
          已選擇&nbsp;<a style="font-weight: 600">{{ selectedRows.length }}</a>&nbsp;&nbsp;
          <template v-for="(item, index) in needTotalList" v-if="item.needTotal">
            {{ item.title }} 總計&nbsp;
            <a :key="index" style="font-weight: 600">
              {{ item.customRender ? item.customRender(item.total) : item.total }}
            </a>&nbsp;&nbsp;
          </template>
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </div>
      </a-alert>
    </div>
    <a-table
      :size="size"
      :bordered="bordered"
      :loading="loading"
      :columns="columns"
      :dataSource="current"
      :rowKey="rowKey"
      :pagination="pagination"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: updateSelect }"
    >
    </a-table>
  </div>
</template>

<script>
  export default {
    name: "StandardTable",
    // props: ['bordered', 'loading', 'columns', 'data', 'rowKey', 'pagination', 'selectedRows'],
    props: {

      /**
       * 數據加載函數，返回值必須是 Promise
       * 默認情況下必須傳遞 data 參數；
       *    如果使用本地數據渲染表格，業務代碼中將獲取本地數據包裝為 Promise 即可。
       *
       * currentData 用於向外暴露表格當前渲染的數據，
       * 業務開發中也可以直接修改 currentData，從而重新渲染表格（僅推薦用於客戶端排序、數據過濾等場景）
       */
      data: {
        type: Function,
        required: true
      },
      dataSource: {
        type: Array,
        default () {
          return []
        }
      },
      columns: {
        type: Array,
        required: true
      },
/*      pagination: {
        type: Object,
        default () {
          return {}
        }
      },*/
      pageSize: {
        type: Number,
        default: 10
      },
      pageNum: {
        type: Number,
        default: 1
      },
      pageSizeOptions: {
        type: Array,
        default () {
          return ['10', '20', '30', '40', '50']
        }
      },
      responseParamsName: {
        type: Object,
        default () {
          return {}
        }
      },
      bordered: {
        type: Boolean,
        default: false
      },
      /**
       * 表格大小風格，default, middle, small
       */
      size: {
        type: String,
        default: 'default'
      },
      rowKey: {
        type: String,
        default: ''
      },
      selectedRows: {
        type: Array,
        default: null
      }
    },
    data () {
      return {
        needTotalList: [],
        selectedRowKeys: [],

        loading: true,

        total: 0,
        pageNumber: this.pageNum,
        currentPageSize: this.pageSize,
        defaultCurrent: 1,
        sortParams: {},

        current: [],
        pagination: {},
        paramsName: {},
      }
    },
    created () {
      //數據請求參數配置
      this.paramsName = Object.assign(
        {},
        {
          pageNumber: "pageNo",
          pageSize: "pageSize",
          total: "totalCount",
          results: "data",
          sortColumns: "sortColumns"
        },
        this.responseParamsName
      );

      this.needTotalList = this.initTotalList(this.columns)

      // load data
      this.loadData( { pageNum: this.pageNumber } )
    },
    methods: {
      updateSelect (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        let list = this.needTotalList
        this.needTotalList = list.map(item => {
          return {
            ...item,
            total: selectedRows.reduce((sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
        this.$emit('change', selectedRowKeys, selectedRows)
      },
      initTotalList (columns) {
        const totalList = []
        columns.forEach(column => {
          if (column.needTotal) {
            totalList.push({ ...column, total: 0 })
          }
        })
        return totalList
      },

      loadData (params) {
        let that = this
        that.loading = true
        params = Object.assign({}, params)
        const remoteParams = Object.assign({}, that.sortParams)
        remoteParams[that.paramsName.pageNumber] = params.pageNum || that.pageNumber
        remoteParams[that.paramsName.pageSize] = params.pageSize || that.currentPageSize

        if (params.pageNum) {
          that.pageNumber = params.pageNum
        }
        if (params.pageSize) {
          that.currentPageSize = params.pageSize
        }

        let dataPromise = that.data(remoteParams)

        dataPromise.then( response => {
          if (!response) {
            that.loading = false
            return
          }
          let results = response[that.paramsName.results]
          results = (results instanceof Array && results) || []

          that.current = results

          that.$emit("update:currentData", that.current.slice())
          that.$emit("dataloaded", that.current.slice())

          that.total = response[that.paramsName.total] * 1
          that.pagination = that.pager()
          that.loading = false
        }, () => {
          // error callback
          that.loading = false
        })
      },
      // eslint-disable-next-line
      onPagerChange (page, pageSize) {
        this.pageNumber = page
        this.loadData({ pageNum: page })
      },
      onPagerSizeChange (current, size) {
        this.currentPageSize = size
        /*
        if (current === this.pageNumber) this.loadData()
        console.log('page-size-change', current, size)
        */
      },
      onClearSelected () {
        this.selectedRowKeys = []
        this.updateSelect([], [])
      },
      pager () {
        return {
          total: this.total,
          showTotal: total => `共有 ${total} 條`,
          showSizeChanger: true,
          pageSizeOptions: this.pageSizeOptions,
          pageSize: this.pageSize,
          defaultCurrent: this.defaultCurrent,
          onChange: this.onPagerChange,
          onShowSizeChange: this.onPagerSizeChange
        }
      }
    },
    watch: {
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
    }
  }
</script>

<style scoped>
    .alert {
        margin-bottom: 16px;
    }
</style>