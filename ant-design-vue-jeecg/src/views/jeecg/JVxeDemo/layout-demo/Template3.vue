<template>

  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="12">
        <!-- 左上父 -->
        <j-vxe-table
          toolbar
          row-number
          row-selection
          click-select-row
          highlight-current-row
          :radio-config="{highlight: false}"
          :checkbox-config="{highlight: false}"
          :height="357"
          :loading="table1.loading"
          :columns="table1.columns"
          :dataSource="table1.dataSource"
          :pagination="table1.pagination"
          style="margin-bottom: 8px;"
          @pageChange="handleTable1PageChange"
          @selectRowChange="handleTable1SelectRowChange"
        />

        <!-- 左下子 -->
        <j-vxe-table
          toolbar
          row-number
          row-selection
          click-select-row
          :height="356"
          :loading="table2.loading"
          :columns="table2.columns"
          :dataSource="table2.dataSource"
          :pagination="table2.pagination"
          @pageChange="handleTable2PageChange"
        />
      </a-col>
      <!-- 左側父選擇的數據展示在這裏 -->
      <a-col :span="12">
        <j-vxe-table
          row-number
          :height="800"
          :columns="table1.columns"
          :dataSource="table1.selectedRows"
          style="margin-top: 40px;"
        />
      </a-col>
    </a-row>

  </a-card>
</template>

<script>
  import { getAction } from '@api/manage'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  // 【多種布局模板】左側上邊是主表、下邊是子表，右側是選中數據
  export default {
    name: 'Template3',
    components: {},
    data() {
      return {
        // 主表的配置信息
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
              type: JVXETypes.input
            },
            {key: 'call', title: '呼叫', width: '80px', type: JVXETypes.input},
            {key: 'len', title: '長', width: '80px', type: JVXETypes.input},
            {key: 'ton', title: '噸', width: '120px', type: JVXETypes.input},
            {key: 'payer', title: '付款方', width: '120px', type: JVXETypes.input},
            {key: 'count', title: '數', width: '40px'},
            {key: 'company', title: '公司', width: '180px', type: JVXETypes.input},
            {key: 'trend', title: '動向', width: '120px', type: JVXETypes.input},
          ],
        },
        // 子表的配置信息 （配置和主表的完全一致，就不寫冗餘的註釋了）
        table2: {
          loading: false,
          pagination: {current: 1, pageSize: 200, pageSizeOptions: ['100', '200'], total: 0},
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
    },
    created() {
      this.loadTable1Data()
    },
    methods: {

      // 加載table1（主表）的數據
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
          } else {
            this.$error({title: '主表查詢失敗', content: res.message})
          }
        }).finally(() => {
          // 這裡是無論成功或失敗都會執行的方法，在這裏關閉loading
          this.table1.loading = false
        })
      },
      // 加載table2（子表）的數據，根據主表的id進行查詢
      loadTable2Data() {
        // 如果主表沒有選擇，則不查詢
        let selectedRows = this.table1.selectedRows
        if (!selectedRows || selectedRows.length === 0) {
          this.table2.pagination.total = 0
          this.table2.dataSource = []
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
          } else {
            this.$error({title: '子表查詢失敗', content: res.message})
          }
        }).finally(() => {
          this.table2.loading = false
        })
      },

      // table1【主表】當分頁參數變化時觸發的事件
      handleTable1PageChange(event) {
        // 重新賦值
        this.table1.pagination.current = event.current
        this.table1.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadTable1Data()
        // 分頁后重置選擇
        this.table1.selectedRows = []
        this.loadTable2Data()
      },

      // table2【子表】當分頁參數變化時觸發的事件
      handleTable2PageChange(event) {
        // 重新賦值
        this.table1.pagination.current = event.current
        this.table1.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadTable2Data()
      },

      // table1【主表】當選擇的行變化時觸發的事件
      handleTable1SelectRowChange(event) {
        this.handleTableSelectRowChange(this.table1, event)
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

    },
  }
</script>

<style scoped>

</style>