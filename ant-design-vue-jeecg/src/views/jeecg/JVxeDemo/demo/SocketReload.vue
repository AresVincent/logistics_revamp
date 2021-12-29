<template>
  <a-card title="無痕刷新示例" :bordered="false">

    <div style="margin-bottom: 8px;">
      <span>啟用數據變動特效：</span>
      <a-switch v-model="reloadEffect"/>
    </div>

    <!--
      【即時保存大體思路】：
      1. 該功能依賴於【即時保存】功能，請先看即時保存示例
      2. 必須要有 socket-reload 屬性，且設為 true
      3. 必須要有 socket-key 屬性，該屬性為當前表格的唯一標識，
         系統會自動更新所有 socket-key 相同的表格
      4. 在局部保存 edit-closed 事件中，
         保存成功后調用 socketSendUpdateRow 方法，將當前 row 傳遞過去即可 （見第 108 行）
    -->
    <j-vxe-table
      ref="table"
      row-number
      row-selection

      keep-source
      socket-reload
      socket-key="demo-socket-reload"
      :reload-effect="reloadEffect"

      :height="340"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      @edit-closed="handleEditClosed"
    />
  </a-card>
</template>

<script>
  import { getAction } from '@api/manage'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  // 無痕刷新示例
  export default {
    name: 'SocketReload',
    data() {
      return {
        loading: false,
        dataSource: [],
        columns: [
          {key: 'num', title: '序號', width: '80px'},
          {key: 'ship_name', title: '船名', width: '180px', type: JVXETypes.input},
          {key: 'call', title: '呼叫', width: '80px', type: JVXETypes.input},
          {key: 'len', title: '長', width: '80px', type: JVXETypes.input},
          {key: 'ton', title: '噸', width: '120px', type: JVXETypes.input},
          {key: 'payer', title: '付款方', width: '120px', type: JVXETypes.input},
          {key: 'count', title: '數', width: '40px'},
          {key: 'company', title: '公司', minWidth: '180px', type: JVXETypes.input},
          {key: 'trend', title: '動向', width: '120px', type: JVXETypes.input},
        ],
        // 查詢url地址
        url: {
          getData: '/mock/vxe/getData',
        },
        // 是否啟用日曆刷新效果
        reloadEffect: false,
      }
    },
    created() {
      this.loadData()
    },
    methods: {
      // 加載數據
      loadData() {
        let formData = {pageNo: 1, pageSize: 200}
        this.loading = true
        getAction(this.url.getData, formData).then(res => {
          if (res.success) {
            this.dataSource = res.result.records
          } else {
            this.$error({title: '主表查詢失敗', content: res.message})
          }
        }).finally(() => {
          this.loading = false
        })
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
              // 【模擬保存】（此處需要替換成真實的請求）
              let hideLoading = this.$message.loading(`正在保存"${column.title}"`, 0)
              setTimeout(() => {
                hideLoading()
                this.$message.success(`"${column.title}"保存成功！`)
                // 局部更新單元格為已保存狀態
                $table.reloadRow(row, null, field)
                // 發送更新消息
                this.$refs.table.socketSendUpdateRow(row)
              }, 555)
            }
          })
        }
      },

    },
  }
</script>

<style scoped>

</style>