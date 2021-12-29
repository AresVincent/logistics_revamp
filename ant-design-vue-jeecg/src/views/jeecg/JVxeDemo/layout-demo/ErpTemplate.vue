<template>

  <a-card :bordered="false">
    <j-vxe-table
      toolbar
      :toolbarConfig="toolbarConfig"

      row-number
      row-selection
      row-selection-type="radio"
      highlight-current-row
      click-select-row
      :height="tableHeight"
      :loading="table1.loading"
      :columns="table1.columns"
      :dataSource="table1.dataSource"
      :pagination="table1.pagination"
      :expand-config="expandConfig"
      style="margin-bottom: 8px"

      @pageChange="handleTable1PageChange"
      @selectRowChange="handleTable1SelectRowChange"
    ></j-vxe-table>

    <a-tabs v-show="subTabs.show" :class="{'sub-tabs':true, 'un-expand': !subTabs.expand}">
      <a-tab-pane tab="子表1" key="1">
        <j-vxe-table
          toolbar
          row-number
          row-selection
          height="auto"
          :maxHeight="350"
          :loading="table2.loading"
          :columns="table2.columns"
          :dataSource="table2.dataSource"
          :pagination="table2.pagination"
          @pageChange="handleTable2PageChange"
          @selectRowChange="handleTable2SelectRowChange"
        />
      </a-tab-pane>
      <a-tab-pane tab="子表2" key="2">
        <h1>這裡是子表2</h1>
        <h1>這裡是子表2</h1>
        <h1>這裡是子表2</h1>
        <h1>這裡是子表2</h1>
        <h1>這裡是子表2</h1>
        <h1>這裡是子表2</h1>
      </a-tab-pane>
    </a-tabs>

  </a-card>
</template>

<script>
  import { JVXETypes } from '@/components/jeecg/JVxeTable'
  import { getAction } from '@api/manage'

  export default {
    name: 'ErpTemplate',
    data() {
      return {
        toolbarConfig: {
          // prefix 前綴；suffix 後綴
          slot: ['prefix', 'suffix'],
          // add 新增按鈕；remove 刪除按鈕；clearSelection 清空選擇按鈕
          btn: ['add', 'remove', 'clearSelection']
        },

        expandConfig: {
          // 是否只能同時展開一行
          accordion: true
        },

        // 子表 tabs
        subTabs: {
          show: false,
          // 是否展開
          expand: true,
          // 是否自動展開
          autoExpand: true,
        },

        table1: {
          // 是否正在加載
          loading: false,
          // 分頁器參數
          pagination: {
            // 當前頁碼
            current: 1,
            // 每頁的條數
            pageSize: 200,
            // 可切換的條數
            pageSizeOptions: ['10', '20', '30', '100', '200'],
            // 數據總數（目前並不知道真實的總數，所以先填寫0，在後台查出來后再賦值）
            total: 0,
            showTotal: (total, range) => {
              // 此處為 jsx 語法
              let text = <span>{range[0] + '-' + range[1] + ' 共 ' + total + ' 條'}</span>
              // 判斷子表是否显示，如果显示就渲染展開收起按鈕
              if (this.subTabs.show) {
                let expand = (<span>
                <a-button type="link" onClick={this.handleToggleTabs}>
                  <a-icon type={this.subTabs.expand ? 'up' : 'down'}/>
                  <span>{this.subTabs.expand ? '收起' : '展開'}</span>
                </a-button>
                <a-checkbox vModel={this.subTabs.autoExpand}>自動展開</a-checkbox>
              </span>)
                // 返回多個dom用數組
                return [expand, text]
              } else {
                // 直接返回單個dom
                return text
              }
            },
          },
          // 選擇的行
          selectedRows: [],
          // 數據源，控製表格的數據
          dataSource: [],
          // 列配置，控製表格显示的列
          columns: [
            {key: 'num', title: '序號', width: '80px'},
            {
              // 字段key，跟後台數據的字段名匹配
              key: 'ship_name',
              // 列的標題
              title: '船名',
              // 列的寬度
              width: '180px',
              // 如果加上了該屬性，就代表當前單元格是可編輯的，type就是表單的類型，input就是簡單的輸入框
              type: JVXETypes.input
            },
            {key: 'call', title: '呼叫', width: '990px', type: JVXETypes.input},
            {key: 'len', title: '長', width: '80px', type: JVXETypes.inputNumber},
            {key: 'ton', title: '噸', width: '120px', type: JVXETypes.inputNumber},
            {key: 'payer', title: '付款方', width: '120px', type: JVXETypes.input},
            {key: 'count', title: '數', width: '40px'},
            {
              key: 'company',
              title: '公司',
              // 最小寬度，與寬度不同的是，這個不是固定的寬度，如果表格有多餘的空間，會平均分配給設置了 minWidth 的列
              // 如果要做佔滿表格的列可以這麼寫
              minWidth: '180px',
              type: JVXETypes.input
            },
            {key: 'trend', title: '動向', width: '120px', type: JVXETypes.input},
          ],
        },
        // 子級表的配置信息 （配置和主表的完全一致，就不寫冗餘的註釋了）
        table2: {
          currentRowId: null,
          loading: false,
          pagination: {current: 1, pageSize: 10, pageSizeOptions: ['5', '10', '20', '30'], total: 0},
          selectedRows: [],
          dataSource: [],
          columns: [
            {key: 'dd_num', title: '調度序號', width: '120px'},
            {key: 'tug', title: '拖輪', width: '180px', type: JVXETypes.input},
            {key: 'work_start_time', title: '作業開始時間', width: '180px', type: JVXETypes.input},
            {key: 'work_stop_time', title: '作業結束時間', width: '180px', type: JVXETypes.input},
            {key: 'type', title: '船舶分類', width: '120px', type: JVXETypes.input},
            {key: 'port_area', title: '所屬港區', width: '120px', type: JVXETypes.input},
          ],
        },
        currentSubRow: null,
        // 查詢url地址
        url: {
          getData: '/mock/vxe/getData',
        },
      }
    },
    computed: {
      tableHeight() {
        let {show, expand} = this.subTabs
        return show ? (expand ? 350 : 482) : 482
      },
    },
    created() {
      this.loadTable1Data()
    },
    methods: {

      // 加載table1【主表】的數據
      loadTable1Data() {
        // 封裝查詢條件
        let formData = {
          pageNo: this.table1.pagination.current,
          pageSize: this.table1.pagination.pageSize
        }
        // 調用查詢數據接口
        this.table1.loading = true
        getAction(this.url.getData, formData).then(res => {
          if (res.success) {
            // 後台查詢回來的 total，數據總數量
            this.table1.pagination.total = res.result.total
            // 將查詢的數據賦值給 dataSource
            this.table1.dataSource = res.result.records
            // 重置選擇
            this.table1.selectedRows = []
          } else {
            this.$error({title: '主表查詢失敗', content: res.message})
          }
        }).finally(() => {
          // 這裡是無論成功或失敗都會執行的方法，在這裏關閉loading
          this.table1.loading = false
        })
      },

      // 查詢子表數據
      loadSubData(row) {
        if (row) {
          // 這裏一定要做限制，限制不能重複查詢，否者會出現死循環
          if (this.table2.currentRowId === row.id) {
            return true
          }
          this.table2.currentRowId = row.id
          this.loadTable2Data()
          return true
        } else {
          return false
        }
      },
      // 查詢子表數據
      loadTable2Data() {
        let table2 = this.table2
        let formData = {
          parentId: table2.currentRowId,
          pageNo: this.table2.pagination.current,
          pageSize: this.table2.pagination.pageSize
        }
        table2.loading = true
        getAction(this.url.getData, formData).then(res => {
          if (res.success) {
            // 將查詢的數據賦值給 dataSource
            table2.selectedRows = []
            table2.dataSource = res.result.records
            table2.pagination.total = res.result.total
          } else {
            this.$error({title: '子表查詢失敗', content: res.message})
          }
        }).finally(() => {
          // 這裡是無論成功或失敗都會執行的方法，在這裏關閉loading
          table2.loading = false
        })
      },


      // table1【主表】當選擇的行變化時觸發的事件
      handleTable1SelectRowChange(event) {
        this.table1.selectedRows = event.selectedRows
        this.subTabs.show = true
        if (this.subTabs.autoExpand) {
          this.subTabs.expand = true
        }
        this.loadSubData(event.selectedRows[0])
      },
      // table2【子表】當選擇的行變化時觸發的事件
      handleTable2SelectRowChange(event) {
        this.table2.selectedRows = event.selectedRows
      },

      handleTable1PageChange(event) {
        // 重新賦值
        this.table1.pagination.current = event.current
        this.table1.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadTable1Data()
      },
      // 當table2【子表】分頁參數變化時觸發的事件
      handleTable2PageChange(event) {
        // 重新賦值
        this.table2.pagination.current = event.current
        this.table2.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadTable2Data()
      },

      // 展開或收起子表tabs
      handleToggleTabs() {
        this.subTabs.expand = !this.subTabs.expand
      },

    },

  }
</script>

<style lang="less" scoped>
  .sub-tabs {
    &.un-expand {
      /deep/ .ant-tabs-content {
        height: 0 !important;
      }

      /deep/ .ant-tabs-bar {
        border-color: transparent !important;
      }

      /deep/ .ant-tabs-ink-bar {
        background-color: transparent !important;
      }

      /deep/ .ant-tabs-tab {
        display: none !important;
      }
    }
  }
</style>