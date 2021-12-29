<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :sm="8" :xs="24">
          <head-info title="我的待辦" content="8個任務" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="本周任務平均處理時間" content="32分鐘" :bordered="true"/>
        </a-col>
        <a-col :sm="8" :xs="24">
          <head-info title="本周完成任務數" content="24個"/>
        </a-col>
      </a-row>
    </a-card>

    <a-card
      style="margin-top: 24px"
      :bordered="false"
      title="標準列表">

      <div slot="extra">
        <a-radio-group>
          <a-radio-button>全部</a-radio-button>
          <a-radio-button>進行中</a-radio-button>
          <a-radio-button>等待中</a-radio-button>
        </a-radio-group>
        <a-input-search style="margin-left: 16px; width: 272px;" />
      </div>

      <div class="operate">
        <a-button type="dashed" style="width: 100%" icon="plus">添加</a-button>
      </div>

      <a-list size="large" :pagination="{showSizeChanger: true, showQuickJumper: true, pageSize: 5, total: 50}">
        <a-list-item :key="index" v-for="(item, index) in data">
          <a-list-item-meta :description="item.description">
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title">{{ item.title }}</a>
          </a-list-item-meta>
          <div slot="actions">
            <a>編輯</a>
          </div>
          <div slot="actions">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item><a>編輯</a></a-menu-item>
                <a-menu-item><a>刪除</a></a-menu-item>
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </div>
          <div class="list-content">
            <div class="list-content-item">
              <span>Owner</span>
              <p>{{ item.owner }}</p>
            </div>
            <div class="list-content-item">
              <span>開始時間</span>
              <p>{{ item.startAt }}</p>
            </div>
            <div class="list-content-item">
              <a-progress :percent="item.progress.value" :status="!item.progress.status ? null : item.progress.status" style="width: 180px" />
            </div>
          </div>
        </a-list-item>
      </a-list>

    </a-card>
  </div>
</template>

<script>
  import HeadInfo from '@/components/tools/HeadInfo'

  const data = []
  data.push({
    title: 'Alipay',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
    description: '那是一種內在的東西， 他們到達不了，也無法觸及的',
    owner: '付曉曉',
    startAt: '2018-07-26 22:44',
    progress: {
      value: 90
    }
  })
  data.push({
    title: 'Angular',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
    description: '希望是一個好東西，也許是最好的，好東西是不會消亡的',
    owner: '曲麗麗',
    startAt: '2018-07-26 22:44',
    progress: {
      value: 54
    }
  })
  data.push({
    title: 'Ant Design',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    description: '生命就像一盒巧克力，結果往往出人意料',
    owner: '林東東',
    startAt: '2018-07-26 22:44',
    progress: {
      value: 66
    }
  })
  data.push({
    title: 'Ant Design Pro',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
    description: '城鎮中有那麼多的酒館，她卻偏偏走進了我的酒館',
    owner: '周星星',
    startAt: '2018-07-26 22:44',
    progress: {
      value: 30
    }
  })
  data.push({
    title: 'Bootstrap',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
    description: '那時候我只會想自己想要什麼，從不想自己擁有什麼',
    owner: '吳加好',
    startAt: '2018-07-26 22:44',
    progress: {
      status: 'exception',
      value: 100
    }
  })

  export default {
    name: "StandardList",
    components: {
      HeadInfo
    },
    data () {
      return {
        data
      }
    }
  }
</script>

<style lang="less" scoped>
    .ant-avatar-lg {
        width: 48px;
        height: 48px;
        line-height: 48px;
    }

    .list-content-item {
        color: rgba(0, 0, 0, .45);
        display: inline-block;
        vertical-align: middle;
        font-size: 14px;
        margin-left: 40px;
        span {
            line-height: 20px;
        }
        p {
            margin-top: 4px;
            margin-bottom: 0;
            line-height: 22px;
        }
    }
</style>