<template>
  <div>
    <index-chart v-if="indexStyle==1"></index-chart>
    <index-bdc v-if="indexStyle==2"></index-bdc>
    <index-task v-if="indexStyle==3"></index-task>
    <!-- <div style="width: 100%;text-align: right;margin-top: 20px">
      請選擇首頁樣式：
      <a-radio-group v-model="indexStyle">
        <a-radio :value="1">統計圖表</a-radio>
        <a-radio :value="2">統計圖表2</a-radio>
        <a-radio :value="3">任務表格</a-radio>
      </a-radio-group>
    </div> -->
  </div>
</template>

<script>
  import IndexChart from './IndexChart'
  import IndexTask from "./IndexTask"
  import IndexBdc from './IndexBdc'

  export default {
    name: "Analysis",
    components: {
      IndexChart,
      IndexTask,
      IndexBdc
    },
    data() {
      return {
        indexStyle:1
      }
    },
    created() {

    },
    methods: {

    }
  }
</script>