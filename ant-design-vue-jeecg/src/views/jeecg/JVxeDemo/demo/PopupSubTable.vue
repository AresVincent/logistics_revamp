<template>
  <a-card title="彈齣子表示例" :bordered="false">

    <!--
      【彈齣子表大體思路】
      1. 必須要有 click-row-show-sub-form 屬性，如果該屬性設為false，那麼就不會彈齣子表
      2. 必須要有 sub-form 插槽，用於規定彈齣子表的內容
      3. highlight-current-row 屬性可有可無，如果有則點擊一行的時候，該行會背景色會常亮
    -->

    <!--
      【彈出詳細信息（既有主表的數據也有子表的）大體思路】
      1. 必須要有 click-row-show-main-form 屬性，如果該屬性設為false，那麼就不會彈出詳細信息
      2. 必須要有 main-form 插槽，用於規定彈齣子表的內容
      3. 可選 click-row-show-sub-form 屬性，如果有該屬性，就會显示子表，否者不显示
    -->

    <j-vxe-table
      toolbar
      row-number
      row-selection

      highlight-current-row
      click-row-show-sub-form
      click-row-show-main-form

      :height="750"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      @detailsConfirm="handleDetailsConfirm"
    >

      <!-- 主表單 -->
      <template v-slot:mainForm="{row}">
        <template v-if="row">
          <a-form-model
            ref="form2"
            :model="row"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row :gutter="8">
              <a-col :span="8">
                <a-form-model-item label="ID" prop="id">
                  <a-input v-model="row.id" disabled/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="序號" prop="num">
                  <a-input v-model="row.num"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="船名" prop="ship_name">
                  <a-input v-model="row.ship_name"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="呼叫" prop="call">
                  <a-input v-model="row.call"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="長" prop="len">
                  <a-input v-model="row.len"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="噸" prop="ton">
                  <a-input v-model="row.ton"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="付款方" prop="payer">
                  <a-input v-model="row.payer"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="數" prop="count">
                  <a-input v-model="row.count"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="公司" prop="company">
                  <a-input v-model="row.company"/>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="動向" prop="trend">
                  <a-input v-model="row.trend"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </template>

      </template>

      <!-- 子表單 -->
      <template v-slot:subForm="{row}">
        <template v-if="loadSubData(row)">
          <j-vxe-table
            ref="subFormTable"
            height="auto"
            :max-height="350"
            :loading="subTable.loading"
            :columns="subTable.columns"
            :dataSource="subTable.dataSource"
          />
        </template>
      </template>

    </j-vxe-table>

  </a-card>
</template>

<script>
  import { getAction } from '@api/manage'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  // 彈齣子表示例
  export default {
    name: 'PopupSubTable',
    data() {
      return {
        loading: false,
        dataSource: [],
        columns: [
          {key: 'num', title: '序號', width: '80px'},
          {key: 'ship_name', title: '船名', width: '180px', type: JVXETypes.input},
          {key: 'call', title: '呼叫', width: '80px'},
          {key: 'len', title: '長', width: '80px'},
          {key: 'ton', title: '噸', width: '120px'},
          {key: 'payer', title: '付款方', width: '120px'},
          {key: 'count', title: '數', width: '40px'},
          {
            key: 'company',
            title: '公司',
            minWidth: '180px',
            // 是否點擊显示詳細信息
            // 只有當前單元格不能編輯的時候才能生效
            // 如果不設的話，點擊就只彈齣子表，不會彈出主表的詳細信息
            showDetails: true
          },
          {key: 'trend', title: '動向', width: '120px'},
        ],
        // 子表的信息
        subTable: {
          currentRowId: null,
          loading: false,
          pagination: {current: 1, pageSize: 200, pageSizeOptions: ['100', '200'], total: 0},
          selectedRows: [],
          dataSource: [],
          columns: [
            {key: 'dd_num', title: '調度序號', width: '120px'},
            {key: 'tug', title: '拖輪', width: '180px', type: JVXETypes.input},
            {key: 'work_start_time', title: '作業開始時間', width: '180px', type: JVXETypes.input},
            {key: 'work_stop_time', title: '作業結束時間', width: '180px', type: JVXETypes.input},
            {key: 'type', title: '船舶分類', width: '120px', type: JVXETypes.input},
            {key: 'port_area', title: '所屬港區', minWidth: '120px', type: JVXETypes.input},
          ],
        },
        // 查詢url地址
        url: {
          getData: '/mock/vxe/getData',
        },
        // 主表form表單字段
        mainForm: {
          id: '',
          num: '',
          ship_name: '',
          call: '',
          len: '',
          ton: '',
          payer: '',
          count: '',
          company: '',
          trend: '',
        },
        // form表單 col
        labelCol: {span: 4},
        wrapperCol: {span: 20},
        rules: {
          num: [
            {required: true, message: '必須輸入序號'},
          ],
        },
      }
    },

    created() {
      this.loadData()
    },
    methods: {

      log: console.log,

      // 加載數據
      loadData() {
        // 封裝查詢條件
        let formData = {pageNo: 1, pageSize: 30}
        // 調用查詢數據接口
        this.loading = true
        getAction(this.url.getData, formData).then(res => {
          if (res.success) {
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

      // 查詢子表數據
      loadSubData(row) {
        if (row) {
          // 這裏一定要做限制，限制不能重複查詢，否者會出現死循環
          if (this.subTable.currentRowId === row.id) {
            return true
          }
          this.subTable.currentRowId = row.id
          let formData = {pageNo: 1, pageSize: 30, parentId: row.id}
          this.subTable.loading = true
          getAction(this.url.getData, formData).then(res => {
            if (res.success) {
              // 將查詢的數據賦值給 dataSource
              this.subTable.dataSource = res.result.records
            } else {
              this.$error({title: '主表查詢失敗', content: res.message})
            }
          }).finally(() => {
            // 這裡是無論成功或失敗都會執行的方法，在這裏關閉loading
            this.subTable.loading = false
          })
          return true
        } else {
          return false
        }
      },

      // 詳細信息里點了確認按鈕
      handleDetailsConfirm({row, $table, callback}) {
        console.log('保存的數據：', row)
        // 校驗當前行
        $table.validate(row).then((errMap) => {
          // 校驗通過
          if (!errMap) {
            // 校驗子表，如果需要的話，可以操作下面這個對象：
            // this.$refs.subFormTable

            callback(true)
            this.loading = true
            setTimeout(() => {
              this.loading = false
              this.$message.success('保存成功')
            }, 1000)
          } else {
            callback(false)
            this.$message.warn('校驗失敗')
          }
        })
      },

    },
  }
</script>

<style scoped>

</style>