<template>
  <a-card :bordered="false">
    <j-tree-table
      :url="url"
      topValue="0"
      queryKey="id"
      :columns="columns"
      :tableProps="tableProps">

      <template v-slot:action="props">
        <!-- 可使用的參數： -->
        <!-- props.text -->
        <!-- props.record -->
        <!-- props.index -->
        <a @click="()=>handleEdit(props.record)">編輯</a>
      </template>

    </j-tree-table>
  </a-card>
</template>

<script>
  import JTreeTable from '@/components/jeecg/JTreeTable'

  export default {
    name: 'JeecgTreeTable',
    components: { JTreeTable },
    data() {
      return {
        url: '/mock/api/asynTreeList',
        columns: [
          {
            title: '菜單名稱',
            dataIndex: 'name'
          },
          {
            title: '組件',
            dataIndex: 'component'
          },
          {
            title: '排序',
            dataIndex: 'orderNum'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        selectedRowKeys: []
      }
    },
    computed: {
      tableProps() {
        let _this = this
        return {
          // 列表項是否可選擇
          // https://vue.ant.design/components/table-cn/#rowSelection
          rowSelection: {
            selectedRowKeys: _this.selectedRowKeys,
            onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
          }
        }
      }
    },
    methods: {
      handleEdit(record) {
        this.$info({
          width: 600,
          title: '編輯',
          content: '編輯ID：' + record.id+"；名稱："+record.name,
          okText: '確定',
          maskClosable: true
        })
      }
    }
  }
</script>

<style scoped></style>
