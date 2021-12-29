<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners"/>
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectPosition',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        settings: {
          name: '職務',
          displayKey: 'name',
          returnKeys: ['id', 'code'],
          listUrl: '/sys/position/list',
          queryParamCode: 'name',
          queryParamText: '職務名稱',
          columns: [
            { title: '職務名稱', dataIndex: 'name', align: 'center', width: '30%', widthRight: '70%' },
            { title: '職務編碼', dataIndex: 'code', align: 'center', width: '35%' },
            { title: '職級', dataIndex: 'rank_dictText', align: 'center', width: '25%' }
          ]
        }
      }
    },
    computed: {
      configs() {
        return Object.assign({ value: this.value }, this.settings, this.$attrs)
      }
    }
  }
</script>

<style lang="less" scoped></style>