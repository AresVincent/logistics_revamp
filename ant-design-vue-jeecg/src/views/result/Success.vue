<template>
  <a-card :bordered="false">
    <result :is-success="true" :description="description" :title="title">
      <template slot="action">
        <a-button type="primary">返回列表</a-button>
        <a-button style="margin-left: 8px">查看項目</a-button>
        <a-button style="margin-left: 8px">打印</a-button>
      </template>
      <div>
        <div style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 20px;">項目名稱</div>
        <a-row style="margin-bottom: 16px">
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
            <span style="color: rgba(0, 0, 0, 0.85)">項目 ID：</span>
            20180724089
          </a-col>
          <a-col :xs="24" :sm="12" :md="12" :lg="12" :xl="6">
            <span style="color: rgba(0, 0, 0, 0.85)">負責人：</span>
            曲麗麗是誰？
          </a-col>
          <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
            <span style="color: rgba(0, 0, 0, 0.85)">生效時間：</span>
            2016-12-12 ~ 2017-12-12
          </a-col>
        </a-row>
        <a-steps :current="1" :direction="isMobile() && directionType.vertical || directionType.horizontal" progressDot>
          <a-step >
            <span style="font-size: 14px" slot="title">創建項目</span>
            <template slot="description">
              <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;" slot="description" >
                <div style="margin: 8px 0 4px">
                  曲麗麗
                  <a-icon style="margin-left: 8px" type="dingding-o" />
                </div>
                <div>2016-12-12 12:32</div>
              </div>
            </template>
          </a-step>
          <a-step title="部門初審">
            <span style="font-size: 14px" slot="title">部門初審</span>
            <template slot="description">
              <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); position: relative; left: 42px;" slot="description" >
                <div style="margin: 8px 0 4px">
                  周毛毛
                  <a-icon style="margin-left: 8px; color: #00A0E9" type="dingding-o" />
                </div>
                <div><a href="">催一下</a></div>
              </div>
            </template>
          </a-step>
          <a-step title="財務複核">
            <span style="font-size: 14px" slot="title">財務複核</span>
          </a-step>
          <a-step title="完成" >
            <span style="font-size: 14px" slot="title">完成</span>
          </a-step>
        </a-steps>
      </div>
    </result>
  </a-card>
</template>

<script>
  import Result from './Result'
  import { mixinDevice } from '@/utils/mixin.js'

  const directionType = {
    horizontal: 'horizontal',
    vertical: 'vertical'
  }

  export default {
    name: "Success",
    components: {
      Result
    },
    mixins: [mixinDevice],
    data () {
      return {
        title: '提交成功',
        description: '提交結果頁用於反饋一系列操作任務的處理結果，\n' +
          ' 如果僅是簡單操作，使用 Message 全局提示反饋即可。\n' +
          ' 本文字區域可以展示簡單的補充說明，如果有類似展示\n' +
          ' “單據”的需求，下面這個灰色區域可以呈現比較複雜的內容。',
        directionType
      }
    }
  }
</script>

<style scoped>

</style>