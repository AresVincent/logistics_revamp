<template>
  <a-card :bordered="false">
    <result :is-success="false" :title="title" :description="description">
      <template slot="action">
        <a-button type="primary" >返回修改</a-button>
      </template>
      <div>
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 16px">
          您提交的內容有如下錯誤：
        </div>
        <div style="margin-bottom: 16px">
          <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          您的賬戶已被凍結
          <a style="margin-left: 16px">立即解凍 <a-icon type="right" /></a>
        </div>
        <div>
          <a-icon type="close-circle-o" style="color: #f5222d; margin-right: 8px"/>
          您的賬戶還不具備申請資格
          <a style="margin-left: 16px">立即升級 <a-icon type="right" /></a>
        </div>
      </div>
    </result>
  </a-card>
</template>

<script>
  import Result from './Result'

  export default {
    name: "Error",
    components: {
      Result
    },
    data () {
      return {
        title: '提交失敗',
        description: '請核對並修改以下信息后，再重新提交。'
      }
    }
  }
</script>

<style scoped>

</style>