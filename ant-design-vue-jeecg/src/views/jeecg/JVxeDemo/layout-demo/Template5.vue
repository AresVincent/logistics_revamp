<template>
  <a-card :bordered="false">

    <a-row :gutter="8">
      <a-col :span="6">
        <!-- 加上 show-line 屬性后，展開收起圖標自動變成 +- 樣式 -->
        <a-tree
          class="template-5-tree"
          :tree-data="treeData"
          show-icon
          show-line
          :expandedKeys="treeExpandedKeys"
          :selectedKeys="[pagination.current]"
          @expand="handleTreeExpand"
          @select="handleTreeSelect"
        >
          <!-- 自定義子節點圖標 -->
          <a-icon slot="myIcon" type="unordered-list" style="color:#0c8fcf;"/>
        </a-tree>
      </a-col>
      <a-col :span="18">
        <j-vxe-table
          row-number
          row-selection
          :height="750"
          :loading="loading"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="pagination"
          @pageChange="handleTablePageChange"
        />
      </a-col>
    </a-row>


  </a-card>
</template>

<script>
  import { getAction } from '@api/manage'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  // 【多種布局模板】左側為樹，右側為行編輯
  export default {
    name: 'Template5',
    data() {
      return {
        // 是否正在加載
        loading: false,
        // 分頁器參數
        pagination: {
          // 當前頁碼
          current: 1,
          // 每頁的條數
          pageSize: 50,
          // 可切換的條數
          pageSizeOptions: ['50'],
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
          {key: 'ton', title: '噸', width: '120px', type: JVXETypes.input},
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
        // 樹的數據，這裏模擬分頁固定數據，實際情況應該是後台查出來的數據
        treeData: [
          // 第1級數據
          {
            title: '1-10頁',
            key: '1-10',
            // 第2級數據
            children: [
              {title: '第 1 頁', key: 1, slots: {icon: 'myIcon'}},
              {title: '第 2 頁', key: 2, slots: {icon: 'myIcon'}},
              {
                title: '第 3 頁',
                key: 3,
                slots: {icon: 'myIcon'},
                // 第3級數據
                children: [
                  {title: '第 333 頁', key: 333, slots: {icon: 'myIcon'}},
                  {title: '第 444 頁', key: 444, slots: {icon: 'myIcon'}},
                  {title: '第 555 頁', key: 555, slots: {icon: 'myIcon'}},
                  // 第4第5級以此類推，加上 children 屬性即可
                ],
              },
              {title: '第 4 頁', key: 4, slots: {icon: 'myIcon'}},
              {title: '第 5 頁', key: 5, slots: {icon: 'myIcon'}},
              {title: '第 6 頁', key: 6, slots: {icon: 'myIcon'}},
              {title: '第 7 頁', key: 7, slots: {icon: 'myIcon'}},
              {title: '第 8 頁', key: 8, slots: {icon: 'myIcon'}},
              {title: '第 9 頁', key: 9, slots: {icon: 'myIcon'}},
              {title: '第 10 頁', key: 10, slots: {icon: 'myIcon'}},
            ],
            slots: {icon: 'myIcon'},
          },
          {
            title: '11-20頁',
            key: '11-20',
            children: [
              {title: '第 11 頁', key: 11, slots: {icon: 'myIcon'}},
              {title: '第 12 頁', key: 12, slots: {icon: 'myIcon'}},
              {title: '第 13 頁', key: 13, slots: {icon: 'myIcon'}},
              {title: '第 14 頁', key: 14, slots: {icon: 'myIcon'}},
              {title: '第 15 頁', key: 15, slots: {icon: 'myIcon'}},
              {title: '第 16 頁', key: 16, slots: {icon: 'myIcon'}},
              {title: '第 17 頁', key: 17, slots: {icon: 'myIcon'}},
              {title: '第 18 頁', key: 18, slots: {icon: 'myIcon'}},
              {title: '第 19 頁', key: 19, slots: {icon: 'myIcon'}},
              {title: '第 20 頁', key: 20, slots: {icon: 'myIcon'}},
            ],
            slots: {icon: 'myIcon'},
          },
        ],
        // 樹展開的列，默認 1-10
        treeExpandedKeys: ['1-10'],
        // 查詢url地址
        url: {
          getData: '/mock/vxe/getData',
        },
      }
    },
    created() {
      this.loadData()
    },
    methods: {

      // 加載行編輯的數據
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

      handleTablePageChange(event) {
        // 重新賦值
        this.pagination.current = event.current
        this.pagination.pageSize = event.pageSize
        // 查詢數據
        this.loadData()
        // 判斷樹展開的key
        if (event.current <= 10) {
          this.treeExpandedKeys = ['1-10']
        } else {
          this.treeExpandedKeys = ['11-20']
        }
      },

      // 樹被選擇觸發的事件
      handleTreeSelect(selectedKeys) {
        let key = selectedKeys[0]
        if (typeof key === 'string') {
          // 控制樹展開為當前選擇的列
          this.treeExpandedKeys = selectedKeys
        } else {
          this.pagination.current = key
          this.loadData()
        }
      },

      // 樹被選擇觸發的事件
      handleTreeExpand(expandedKeys) {
        this.treeExpandedKeys = expandedKeys
      },

    },
  }
</script>

<style lang="less">
  /** 隱藏文件小圖標 */
  .template-5-tree.ant-tree {
    li span.ant-tree-switcher.ant-tree-switcher-noop {
      display: none;
    }
  }
</style>