<template>
  <a-card title="即時保存示例" :bordered="false">
    <!--
      【即時保存大體思路】：
      1. JVxeTable 上必須加 keep-source 屬性
      2. 監聽 edit-closed事件，這個事件是在編輯完成后觸發
      3. 在這個事件裏面判斷數據是否更改，如果更改了就調用接口進行保存操作
    -->
    <j-vxe-table
      toolbar
      :toolbarConfig="toolbarConfig"

      row-number
      row-selection
      keep-source
      async-remove

      :height="340"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"

      @save="handleTableSave"
      @remove="handleTableRemove"
      @edit-closed="handleEditClosed"
      @pageChange="handlePageChange"
      @selectRowChange="handleSelectRowChange"
    />
  </a-card>
</template>

<script>
  import { getAction, postAction, putAction } from '@api/manage'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  // 即時保存示例
  export default {
    name: 'JSBCDemo',
    data() {
      return {
        // 工具欄的按鈕配置
        toolbarConfig: {
          // add 新增按鈕；remove 刪除按鈕；clearSelection 清空選擇按鈕
          btn: ['add', 'save', 'remove', 'clearSelection']
        },
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
          {key: 'ton', title: '噸', width: '120px', defaultValue: 233, type: JVXETypes.input},
          {key: 'payer', title: '付款方', width: '120px', defaultValue: '張三', type: JVXETypes.input},
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
        // 查詢url地址
        url: {
          getData: '/mock/vxe/getData',
          // 模擬保存單行數據（即時保存）
          saveRow: '/mock/vxe/immediateSaveRow',
          // 模擬保存整個表格的數據
          saveAll: '/mock/vxe/immediateSaveAll',
        },
      }
    },
    created() {
      this.loadData()
    },
    methods: {

      // 加載數據
      loadData() {
        // 封裝查詢條件
        let formData = {
          pageNo: this.pagination.current,
          pageSize: this.pagination.pageSize
        }
        // 調用查詢數據接口
        this.loading = true
        getAction(this.url.getData, formData).then(res => {
          if (res.success) {
            // 後台查詢回來的 total，數據總數量
            this.pagination.total = res.result.total
            // 將查詢的數據賦值給 dataSource
            this.dataSource = res.result.records
            // 重置選擇
            this.selectedRows = []
          } else {
            this.$error({title: '主表查詢失敗', content: res.message})
          }
        }).finally(() => {
          // 這裡是無論成功或失敗都會執行的方法，在這裏關閉loading
          this.loading = false
        })
      },

      // 【整體保存】點擊保存按鈕時觸發的事件
      handleTableSave({$table, target}) {
        // 校驗整個表格
        $table.validate().then((errMap) => {
          // 校驗通過
          if (!errMap) {
            // 獲取所有數據
            let tableData = target.getTableData()
            console.log('當前保存的數據是：', tableData)
            // 獲取新增的數據
            let newData = target.getNewData()
            console.log('-- 新增的數據：', newData)
            // 獲取刪除的數據
            let deleteData = target.getDeleteData()
            console.log('-- 刪除的數據：', deleteData)

            // 【模擬保存】
            this.loading = true
            postAction(this.url.saveAll, tableData).then(res => {
              if (res.success) {
                this.$message.success(`保存成功！`)
              } else {
                this.$message.warn(`保存失敗：` + res.message)
              }
            }).finally(() => {
              this.loading = false
            })
          }
        })
      },

      // 觸發單元格刪除事件
      handleTableRemove(event) {

        // 把 event.deleteRows 傳給後台進行刪除（注意：這裏不會傳遞前端邏輯新增的數據，因為不需要請求後台刪除）
        console.log('待刪除的數據: ', event.deleteRows)
        // 也可以只傳ID，因為可以根據ID刪除
        let deleteIds = event.deleteRows.map(row => row.id)
        console.log('待刪除的數據ids: ', deleteIds)

        // 模擬請求後台刪除
        this.loading = true
        window.setTimeout(() => {
          this.loading = false
          this.$message.success('刪除成功')
          // 假設後台返回刪除成功，必須要調用 confirmRemove() 方法，才會真正在表格里移除（會同時刪除選中的邏輯新增的數據）
          event.confirmRemove()
        }, 1000)
      },

      // 單元格編輯完成之後觸發的事件
      handleEditClosed(event) {
        let {$table, row, column} = event

        let field = column.property
        let cellValue = row[field]
        // 判斷單元格值是否被修改
        if ($table.isUpdateByRow(row, field)) {
          // 校驗當前行
          $table.validate(row).then((errMap) => {
            // 校驗通過
            if (!errMap) {
              // 【模擬保存】
              let hideLoading = this.$message.loading(`正在保存"${column.title}"`, 0)
              console.log('即時保存數據：', row)
              putAction(this.url.saveRow, row).then(res => {
                if (res.success) {
                  this.$message.success(`"${column.title}"保存成功！`)
                  // 局部更新單元格為已保存狀態
                  $table.reloadRow(row, null, field)
                } else {
                  this.$message.warn(`"${column.title}"保存失敗：` + res.message)
                }
              }).finally(() => {
                hideLoading()
              })
            }
          })
        }
      },

      // 當分頁參數變化時觸發的事件
      handlePageChange(event) {
        // 重新賦值
        this.pagination.current = event.current
        this.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadData()
      },

      // 當選擇的行變化時觸發的事件
      handleSelectRowChange(event) {
        this.selectedRows = event.selectedRows
      },

    },
  }
</script>

<style scoped>

</style>