<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <!-- 這裡是父級節點 -->
      <a-col :span="24" style="margin-bottom: 4px;">
        <j-vxe-table
          toolbar
          row-number
          row-selection
          click-select-row
          highlight-current-row
          :radio-config="{highlight: false}"
          :checkbox-config="{highlight: false}"
          :height="340"
          :loading="table1.loading"
          :columns="table1.columns"
          :dataSource="table1.dataSource"
          :pagination="table1.pagination"
          @pageChange="handleTable1PageChange"
          @selectRowChange="handleTable1SelectRowChange"
        />
      </a-col>
      <!-- 這裡是子級節點 -->
      <a-col :span="12">
        <j-vxe-table
          toolbar
          row-number
          row-selection
          click-select-row
          highlight-current-row
          :radio-config="{highlight: false}"
          :checkbox-config="{highlight: false}"
          :height="340"
          :loading="table2.loading"
          :columns="table2.columns"
          :dataSource="table2.dataSource"
          :pagination="table2.pagination"
          @pageChange="handleTable2PageChange"
          @selectRowChange="handleTable2SelectRowChange"
        >
        </j-vxe-table>
      </a-col>
      <!-- 這裡是孫級節點 -->
      <a-col :span="12">
        <j-vxe-table
          toolbar
          row-number
          row-selection
          :height="340"
          :loading="table3.loading"
          :columns="table3.columns"
          :dataSource="table3.dataSource"
          :pagination="table3.pagination"
          @pageChange="handleTable3PageChange"
        >
        </j-vxe-table>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
  import { getAction } from '@api/manage'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  // 【多種布局模板】上面父、左下子、右下孫
  export default {
    name: 'Template1',
    data() {
      return {
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
          },
          // 最後選中的行
          lastRow: null,
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
              type: JVXETypes.input,
              formatter({cellValue, row, column}) {
                let foo = ''
                if (row.company === '佧伒侾佯有限公司') {
                  foo += '-233'
                }
                return cellValue + foo
              },
            },
            {key: 'call', title: '呼叫', width: '80px', type: JVXETypes.input},
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
          loading: false,
          pagination: {current: 1, pageSize: 200, pageSizeOptions: ['100', '200'], total: 0},
          // 最後選中的行
          lastRow: null,
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
        // 孫級表的配置信息 （配置和主表的完全一致，就不寫冗餘的註釋了）
        table3: {
          loading: false,
          pagination: {current: 1, pageSize: 200, pageSizeOptions: ['100', '200'], total: 0},
          selectedRows: [],
          dataSource: [],
          columns: [
            {key: 'dd_num', title: '調度序號', width: '120px'},
            {key: 'tug', title: '拖輪', width: '120px', type: JVXETypes.input},
            {key: 'power', title: '馬力', width: '120px', type: JVXETypes.input},
            {key: 'nature', title: '性質', width: '120px', type: JVXETypes.input},
            {key: 'departure_time', title: '發船時間', width: '180px', type: JVXETypes.input},
          ],
        },
        // 查詢url地址
        url: {
          getData: '/mock/vxe/getData',
        },
      }
    },
    // 監聽器
    watch: {
      // 監聽table1 【主表】選擇的數據發生了變化
      ['table1.lastRow'](row) {
        this.loadTable2Data()
      },
      // 監聽table2 【子表】選擇的數據發生了變化
      ['table2.lastRow']() {
        this.loadTable3Data()
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

      // 當table1【主表】分頁參數變化時觸發的事件
      handleTable1PageChange(event) {
        // 重新賦值
        this.table1.pagination.current = event.current
        this.table1.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadTable1Data()
      },

      // table1【主表】當選擇的行變化時觸發的事件
      handleTable1SelectRowChange(event) {
        this.handleTableSelectRowChange(this.table1, event)
      },

      // 加載table2【子表】的數據，根據主表的id進行查詢
      loadTable2Data() {
        // 如果主表沒有選擇，則不查詢
        let selectedRows = this.table1.selectedRows
        if (!selectedRows || selectedRows.length === 0) {
          this.table2.pagination.total = 0
          this.table2.dataSource = []
          this.table2.selectedRows = []
          return
        } else if (this.table1.lastRow == null) {
          this.table1.lastRow = selectedRows[selectedRows.length - 1]
        }
        let formData = {
          parentId: this.table1.lastRow.id,
          pageNo: this.table2.pagination.current,
          pageSize: this.table2.pagination.pageSize
        }
        this.table2.loading = true
        getAction(this.url.getData, formData).then(res => {
          if (res.success) {
            this.table2.pagination.total = res.result.total
            this.table2.dataSource = res.result.records
            this.table2.selectedRows = []
          } else {
            this.$error({title: '子表查詢失敗', content: res.message})
          }
        }).finally(() => {
          this.table2.loading = false
        })
      },

      // table2【子表】當選擇的行變化時觸發的事件
      handleTable2SelectRowChange(event) {
        this.handleTableSelectRowChange(this.table2, event)
      },

      // 當table2【子表】分頁參數變化時觸發的事件
      handleTable2PageChange(event) {
        // 重新賦值
        this.table2.pagination.current = event.current
        this.table2.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadTable2Data()
      },

      // 加載table3【孫表】的數據，根據子表的id進行查詢
      loadTable3Data() {
        // 如果主表沒有選擇，則不查詢
        let selectedRows = this.table2.selectedRows
        if (!selectedRows || selectedRows.length === 0) {
          this.table3.pagination.total = 0
          this.table3.dataSource = []
          this.table3.selectedRows = []
          return
        } else if (this.table2.lastRow == null) {
          this.table2.lastRow = selectedRows[selectedRows.length - 1]
        }
        let formData = {
          parentId: this.table2.lastRow.id,
          pageNo: this.table3.pagination.current,
          pageSize: this.table3.pagination.pageSize
        }
        this.table3.loading = true
        getAction(this.url.getData, formData).then(res => {
          if (res.success) {
            this.table3.pagination.total = res.result.total
            this.table3.dataSource = res.result.records
          } else {
            this.$error({title: '子表查詢失敗', content: res.message})
          }
        }).finally(() => {
          this.table3.loading = false
        })
      },
      // 當table3【孫表】分頁參數變化時觸發的事件
      handleTable3PageChange(event) {
        // 重新賦值
        this.table3.pagination.current = event.current
        this.table3.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadTable3Data()
      },

      /** 公共方法：處理表格選中變化事件 */
      handleTableSelectRowChange(table, event) {
        let {row, action, selectedRows, $table} = event
        // 獲取最後一個選中的
        let lastSelected = selectedRows[selectedRows.length - 1]
        if (action === 'selected') {
          table.lastRow = row
        } else if (action === 'selected-all') {
          // 取消全選
          if (selectedRows.length === 0) {
            table.lastRow = null
          } else if (!table.lastRow) {
            table.lastRow = lastSelected
          }
        } else if (action === 'unselected' && row === table.lastRow) {
          table.lastRow = lastSelected
        }
        $table.setCurrentRow(table.lastRow)
        table.selectedRows = selectedRows
      },

    }
  }
</script>

<style lang="less">

</style>