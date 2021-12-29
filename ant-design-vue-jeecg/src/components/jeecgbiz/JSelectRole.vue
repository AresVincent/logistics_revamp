<template>
  <j-select-biz-component
    :value="value"

    name="角色"
    displayKey="roleName"

    :returnKeys="returnKeys"
    :listUrl="url.list"
    :columns="columns"
    queryParamText="角色編碼"

    v-on="$listeners"
    v-bind="$attrs"
  />
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectRole',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        returnKeys: ['id', 'roleCode'],
        url: { list: '/sys/role/list' },
        columns: [
          { title: '角色名稱', dataIndex: 'roleName', align: 'center', width: 120 },
          { title: '角色編碼', dataIndex: 'roleCode', align: 'center', width: 120 }
        ]
      }
    }
  }
</script>

<style lang="less" scoped></style>