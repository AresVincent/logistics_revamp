<template>
  <page-layout :title="title">
    <a-card :bordered="false">
      <detail-list title="退款申請">
        <detail-list-item term="取貨單號">1000000000</detail-list-item>
        <detail-list-item term="狀態">已取貨</detail-list-item>
        <detail-list-item term="銷售單號">1234123421</detail-list-item>
        <detail-list-item term="子訂單">3214321432</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>
      <detail-list title="用戶信息">
        <detail-list-item term="用戶姓名">付小小</detail-list-item>
        <detail-list-item term="聯繫電話">18100000000</detail-list-item>
        <detail-list-item term="常用快遞">菜鳥倉儲</detail-list-item>
        <detail-list-item term="取貨地址">浙江省杭州市西湖區萬塘路18號</detail-list-item>
        <detail-list-item term="備註">	無</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>

      <div class="title">退貨商品</div>
      <s-table
        style="margin-bottom: 24px"
        :columns="goodsColumns"
        :data="loadGoodsData">

      </s-table>

      <div class="title">退貨進度</div>
      <s-table
        style="margin-bottom: 24px"
        :columns="scheduleColumns"
        :data="loadScheduleData">

        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status" :text="status | statusFilter"/>
        </template>

      </s-table>
    </a-card>
  </page-layout>
</template>

<script>
  import PageLayout from '@/components/page/PageLayout'
  import STable from '@/components/table/'
  import DetailList from '@/components/tools/DetailList'
  import ABadge from "ant-design-vue/es/badge/Badge"
  const DetailListItem = DetailList.Item

  export default {
    components: {
      PageLayout,
      ABadge,
      DetailList,
      DetailListItem,
      STable
    },
    data () {
      return {
        goodsColumns: [
          {
            title: '商品編號',
            dataIndex: 'id',
            key: 'id'
          },
          {
            title: '商品名稱',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '商品條碼',
            dataIndex: 'barcode',
            key: 'barcode'
          },
          {
            title: '單價',
            dataIndex: 'price',
            key: 'price',
            align: 'right'
          },
          {
            title: '數量（件）',
            dataIndex: 'num',
            key: 'num',
            align: 'right'
          },
          {
            title: '金額',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right'
          }
        ],
        // 加載數據方法 必須為 Promise 對象
        loadGoodsData: () => {
          return new Promise((resolve => {
            resolve({
              data: [
                {
                  id: '1234561',
                  name: '礦泉水 550ml',
                  barcode: '12421432143214321',
                  price: '2.00',
                  num: '1',
                  amount: '2.00'
                },
                {
                  id: '1234562',
                  name: '涼茶 300ml',
                  barcode: '12421432143214322',
                  price: '3.00',
                  num: '2',
                  amount: '6.00'
                },
                {
                  id: '1234563',
                  name: '好吃的薯片',
                  barcode: '12421432143214323',
                  price: '7.00',
                  num: '4',
                  amount: '28.00'
                },
                {
                  id: '1234564',
                  name: '特別好吃的蛋卷',
                  barcode: '12421432143214324',
                  price: '8.50',
                  num: '3',
                  amount: '25.50'
                }
              ],
              pageSize: 10,
              pageNo: 1,
              totalPage: 1,
              totalCount: 10
            })
          })).then(res => {
            return res
          })
        },

        scheduleColumns: [
          {
            title: '時間',
            dataIndex: 'time',
            key: 'time'
          },
          {
            title: '當前進度',
            dataIndex: 'rate',
            key: 'rate'
          },
          {
            title: '狀態',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '操作員ID',
            dataIndex: 'operator',
            key: 'operator'
          },
          {
            title: '耗時',
            dataIndex: 'cost',
            key: 'cost'
          }
        ],
        loadScheduleData: () => {
          return new Promise((resolve => {
            resolve({
              data: [
                {
                  key: '1',
                  time: '2017-10-01 14:10',
                  rate: '聯繫客戶',
                  status: 'processing',
                  operator: '取貨員 ID1234',
                  cost: '5mins'
                },
                {
                  key: '2',
                  time: '2017-10-01 14:05',
                  rate: '取貨員出發',
                  status: 'success',
                  operator: '取貨員 ID1234',
                  cost: '1h'
                },
                {
                  key: '3',
                  time: '2017-10-01 13:05',
                  rate: '取貨員接單',
                  status: 'success',
                  operator: '取貨員 ID1234',
                  cost: '5mins'
                },
                {
                  key: '4',
                  time: '2017-10-01 13:00',
                  rate: '申請審批通過',
                  status: 'success',
                  operator: '系統',
                  cost: '1h'
                },
                {
                  key: '5',
                  time: '2017-10-01 12:00',
                  rate: '發起退貨申請',
                  status: 'success',
                  operator: '用戶',
                  cost: '5mins'
                }
              ],
              pageSize: 10,
              pageNo: 1,
              totalPage: 1,
              totalCount: 10
            })
          })).then(res => {
            return res
          })
        },
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          'processing': '進行中',
          'success': '完成',
          'failed': '失敗'
        }
        return statusMap[status]
      }
    },
    computed: {
      title () {
        return this.$route.meta.title
      }
    },

  }
</script>

<style lang="less" scoped>
  .title {
    color: rgba(0,0,0,.85);
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
  }
</style>