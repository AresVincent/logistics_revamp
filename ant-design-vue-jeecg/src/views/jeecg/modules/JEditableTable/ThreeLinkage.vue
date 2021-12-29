<template>
  <j-editable-table
    :columns="columns"
    :dataSource="dataSource"
    :rowNumber="true"
    :actionButton="true"
    :rowSelection="true"
    :maxHeight="400"
    @valueChange="handleValueChange"
  />
</template>

<script>
  import { FormTypes } from '@/utils/JEditableTableUtil'
  import JEditableTable from '@/components/jeecg/JEditableTable'

  export default {
    name: 'ThreeLinkage',
    components: { JEditableTable },
    data() {
      return {
        columns: [
          {
            title: '省/直轄市/自治區',
            key: 's1',
            type: FormTypes.select,
            width: '240px',
            options: [],
            placeholder: '請選擇${title}'
          },
          {
            title: '市',
            key: 's2',
            type: FormTypes.select,
            width: '240px',
            options: [],
            placeholder: '請選擇${title}'
          },
          {
            title: '縣/區',
            key: 's3',
            type: FormTypes.select,
            width: '240px',
            options: [],
            placeholder: '請選擇${title}'
          }
        ],
        dataSource: [],

        mockData: [
          { label: '北京市', value: '110000', parent: null },
          { label: '天津市', value: '120000', parent: null },
          { label: '河北省', value: '130000', parent: null },
          { label: '上海市', value: '310000', parent: null },

          { label: '北京市', value: '110100', parent: '110000' },
          { label: '天津市市', value: '120100', parent: '120000' },
          { label: '石家莊市', value: '130100', parent: '130000' },
          { label: '唐山市', value: '130200', parent: '130000' },
          { label: '秦皇島市', value: '130300', parent: '130000' },
          { label: '上海市', value: '310100', parent: '310000' },

          { label: '東城區', value: '110101', parent: '110100' },
          { label: '西城區', value: '110102', parent: '110100' },
          { label: '朝陽區', value: '110105', parent: '110100' },
          { label: '和平區', value: '120101', parent: '120000' },
          { label: '河東區', value: '120102', parent: '120000' },
          { label: '河西區', value: '120103', parent: '120000' },
          { label: '黃浦區', value: '310101', parent: '310100' },
          { label: '徐匯區', value: '310104', parent: '310100' },
          { label: '長寧區', value: '310105', parent: '310100' },
          { label: '長安區', value: '130102', parent: '130100' },
          { label: '橋西區', value: '130104', parent: '130100' },
          { label: '新華區', value: '130105', parent: '130100' },
          { label: '路南區', value: '130202', parent: '130200' },
          { label: '路北區', value: '130203', parent: '130200' },
          { label: '古冶區', value: '130204', parent: '130200' },
          { label: '海港區', value: '130302', parent: '130300' },
          { label: '山海關區', value: '130303', parent: '130300' },
          { label: '北戴河區', value: '130304', parent: '130300' },
        ]
      }
    },
    mounted() {
      // 初始化數據
      this.columns[0].options = this.request(null)
    },
    methods: {

      request(parentId) {
        return this.mockData.filter(i => i.parent === parentId)
      },

      /** 當選項被改變時，聯動其他組件 */
      handleValueChange(event) {
        const { type, row, column, value, target } = event

        if (type === FormTypes.select) {

          // 第一列
          if (column.key === 's1') {
            // 設置第二列的 options
            this.columns[1].options = this.request(value)
            // 清空后兩列的數據
            target.setValues([{
              rowKey: row.id,
              values: { s2: '', s3: '' }
            }])
            this.columns[2].options = []
          } else
          // 第二列
          if (column.key === 's2') {
            this.columns[2].options = this.request(value)
            target.setValues([{
              rowKey: row.id,
              values: { s3: '' }
            }])
          }
        }

      }

    }
  }
</script>

<style scoped>

</style>