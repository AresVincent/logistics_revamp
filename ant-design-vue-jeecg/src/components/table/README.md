Table 重封裝組件說明
====


封裝說明
----

>  基礎的使用方式與 API 與 [官方版(Table)](https://vuecomponent.github.io/ant-design-vue/components/table-cn/) 本一致，在其基礎上，封裝了加載數據的方法。
>
> 你無需在你是用表格的頁面進行分頁邏輯處理，僅需向 Table 組件傳遞綁定 `:data="Promise"` 對象即可



例子1
----
（基礎使用）

```vue

<template>
  <s-table
    ref="table"
    :rowKey="(record) => record.data.id"
    size="default"
    :columns="columns"
    :data="loadData"
  >
  </s-table>
</template>

<script>
  import STable from '@/components/table/'

  export default {
    components: {
      STable
    },
    data() {
      return {
        columns: [
          {
            title: '規則編號',
            dataIndex: 'no'
          },
          {
            title: '描述',
            dataIndex: 'description'
          },
          {
            title: '服務調用次數',
            dataIndex: 'callNo',
            sorter: true,
            needTotal: true,
            customRender: (text) => text + ' 次'
          },
          {
            title: '狀態',
            dataIndex: 'status',
            needTotal: true
          },
          {
            title: '更新時間',
            dataIndex: 'updatedAt',
            sorter: true
          }
        ],
        // 查詢條件參數
        queryParam: {},
        // 加載數據方法 必須為 Promise 對象
        loadData: parameter => {
          return this.$http.get('/service', {
            params: Object.assign(parameter, this.queryParam)
          }).then(res => {
            return res.result
          })
        },
      }
    }
  }
</script>

```



例子2
----

（簡單的表格，最後一列是各種操作）

```vue
<template>
  <s-table
    ref="table"
    size="default"
    :columns="columns"
    :data="loadData"
  >
    <span slot="action" slot-scope="text, record">
      <a>編輯</a>
      <a-divider type="vertical"/>
      <a-dropdown>
        <a class="ant-dropdown-link">
          更多 <a-icon type="down"/>
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="javascript:;">1st menu item</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;">2nd menu item</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;">3rd menu item</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </span>
  </s-table>
</template>

<script>
  import STable from '@/components/table/'

  export default {
    components: {
      STable
    },
    data() {
      return {
        columns: [
          {
            title: '規則編號',
            dataIndex: 'no'
          },
          {
            title: '描述',
            dataIndex: 'description'
          },
          {
            title: '服務調用次數',
            dataIndex: 'callNo',
          },
          {
            title: '狀態',
            dataIndex: 'status',
          },
          {
            title: '更新時間',
            dataIndex: 'updatedAt',
          },
          {
            table: '操作',
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
          }
        ],
        // 查詢條件參數
        queryParam: {},
        // 加載數據方法 必須為 Promise 對象
        loadData: parameter => {
          return this.$http.get('/service', {
            params: Object.assign(parameter, this.queryParam)
          }).then(res => {
            return res.result
          })
        },
      }
    },
    methods: {
      edit(row) {
        // axios 發送數據到後端 修改數據成功后
        // 調用 refresh() 重新加載列表數據
        // 這裏 setTimeout 模擬發起請求的網絡延遲..
        setTimeout(() => {
          this.$refs.table.refresh()
        }, 1500)

      }
    }
  }
</script>
```



內置方法
----

通過 `this.$refs.table` 調用

`this.$refs.table.refresh()` 刷新列表 (用戶新增/修改數據后，重載列表數據)

> 注意：要調用 `refresh()` 需要給表格組件設定 `ref` 值



注意事項
----

> 你可能需要為了與後端提供的接口返回結果一致而去修改以下代碼：
(需要注意的是，這裏的修改是全局性的，意味着整個項目所有使用該 table 組件都需要遵守這個返回結果定義的字段。)

修改 `@/components/table/index.js`  第 106 行起



```javascript
result.then(r => {
  this.localPagination = Object.assign({}, this.localPagination, {
    current: r.pageNo,  // 返回結果中的當前分頁數
    total: r.totalCount, // 返回結果中的總記錄數
    showSizeChanger: this.showSizeChanger,
    pageSize: (pagination && pagination.pageSize) ||
      this.localPagination.pageSize
  });

  !r.totalCount && ['auto', false].includes(this.showPagination) && (this.localPagination = false)
  this.localDataSource = r.data; // 返回結果中的數組數據
  this.localLoading = false
});
```
返回 JSON 例子：
```json
{
  "message": "",
  "result": {
    "data": [{
        id: 1,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        title: 'Alipay',
        description: '那是一種內在的東西， 他們到達不了，也無法觸及的',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 2,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
        title: 'Angular',
        description: '希望是一個好東西，也許是最好的，好東西是不會消亡的',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 3,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        title: 'Ant Design',
        description: '城鎮中有那麼多的酒館，她卻偏偏走進了我的酒館',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 4,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
        title: 'Ant Design Pro',
        description: '那時候我只會想自己想要什麼，從不想自己擁有什麼',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 5,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
        title: 'Bootstrap',
        description: '凜冬將至',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 6,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
        title: 'Vue',
        description: '生命就像一盒巧克力，結果往往出人意料',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      }
    ],
    "pageSize": 10,
    "pageNo": 0,
    "totalPage": 6,
    "totalCount": 57
  },
  "status": 200,
  "timestamp": 1534955098193
}
```



更新時間
----

該文檔最後更新於： 2018-10-31 PM 08:15