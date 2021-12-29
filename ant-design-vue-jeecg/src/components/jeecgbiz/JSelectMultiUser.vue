<template>
  <!-- 定義在這裏的參數都是不可在外部覆蓋的，防止出現問題 -->
  <j-select-biz-component
    :value="value"
    :ellipsisLength="25"
    :listUrl="url.list"
    :columns="columns"
    v-on="$listeners"
    v-bind="attrs"
  />
</template>

<script>
  import JDate from '@comp/jeecg/JDate'
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectMultiUser',
    components: {JDate, JSelectBizComponent},
    props: {
      value: null, // any type
      queryConfig: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        url: { list: '/sys/user/list' },
        columns: [
          { title: '姓名', align: 'center', width: '25%', widthRight: '70%', dataIndex: 'realname' },
          { title: '賬號', align: 'center', width: '25%', dataIndex: 'username' },
          { title: '電話', align: 'center', width: '20%', dataIndex: 'phone' },
          { title: '出生日期', align: 'center', width: '20%', dataIndex: 'birthday' }
        ],
        // 定義在這裏的參數都是可以在外部傳遞覆蓋的，可以更靈活的定製化使用的組件
        default: {
          name: '用戶',
          width: 1200,
          displayKey: 'realname',
          returnKeys: ['id', 'username'],
          queryParamText: '賬號',
        },
        // 多條件查詢配置
        queryConfigDefault: [
          {
            key: 'sex',
            label: '性別',
            // 如果包含 dictCode，那麼就會显示成下拉框
            dictCode: 'sex',
          },
          {
            key: 'birthday',
            label: '生日',
            placeholder: '請選擇出生日期',
            // 如果想要使用局部註冊的組件，就必須要使用箭頭函數
            customRender: ({key, queryParam, options}) => {
              return <j-date {...options} vModel={queryParam[key]} style="width:180px;"/>
            },
          },
        ],
      }
    },
    computed: {
      attrs() {
        return Object.assign(this.default, this.$attrs, {
          queryConfig: this.queryConfigDefault.concat(this.queryConfig)
        })
      }
    }
  }
</script>

<style lang="less" scoped></style>