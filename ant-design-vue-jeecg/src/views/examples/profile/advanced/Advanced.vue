<template>
  <page-layout title="單號：234231029431" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">

    <detail-list slot="headerContent" size="small" :col="2" class="detail-layout">
      <detail-list-item term="創建人">曲麗麗</detail-list-item>
      <detail-list-item term="訂購產品">XX服務</detail-list-item>
      <detail-list-item term="創建時間">2018-08-07</detail-list-item>
      <detail-list-item term="關聯單據"><a>12421</a></detail-list-item>
      <detail-list-item term="生效日期">2018-08-07 ~ 2018-12-11</detail-list-item>
      <detail-list-item term="備註">請於兩個工作日內確認</detail-list-item>
    </detail-list>
    <a-row slot="extra" class="status-list">
      <a-col :xs="12" :sm="12">
        <div class="text">狀態</div>
        <div class="heading">待審理</div>
      </a-col>
      <a-col :xs="12" :sm="12">
        <div class="text">訂單金額</div>
        <div class="heading">¥ 568.08</div>
      </a-col>
    </a-row>
    <!-- actions -->
    <template slot="action">
      <a-button-group style="margin-right: 4px;">
        <a-button>操作</a-button>
        <a-button>操作</a-button>
        <a-button><a-icon type="ellipsis"/></a-button>
      </a-button-group>
      <a-button type="primary" >主操作</a-button>
    </template>

    <a-card :bordered="false" title="流程進度">
      <a-steps :direction="isMobile() && 'vertical' || 'horizontal'" :current="1" progressDot>
        <a-step title="創建項目">
        </a-step>
        <a-step title="部門初審">
        </a-step>
        <a-step title="財務複核">
        </a-step>
        <a-step title="完成">
        </a-step>
      </a-steps>
    </a-card>

    <a-card style="margin-top: 24px" :bordered="false" title="用戶信息">
      <detail-list>
        <detail-list-item term="用戶姓名">付曉曉</detail-list-item>
        <detail-list-item term="會員卡號">32943898021309809423</detail-list-item>
        <detail-list-item term="身份證">3321944288191034921</detail-list-item>
        <detail-list-item term="聯繫方式">18112345678</detail-list-item>
        <detail-list-item term="聯繫地址">浙江省杭州市西湖區黃姑山路工專路交叉路口</detail-list-item>
      </detail-list>
      <detail-list title="信息組">
        <detail-list-item term="某某數據">725</detail-list-item>
        <detail-list-item term="該數據更新時間">2018-08-08</detail-list-item>
        <detail-list-item >&nbsp;</detail-list-item>
        <detail-list-item term="某某數據">725</detail-list-item>
        <detail-list-item term="該數據更新時間">2018-08-08</detail-list-item>
        <detail-list-item >&nbsp;</detail-list-item>
      </detail-list>
      <a-card type="inner" title="多層信息組">
        <detail-list title="組名稱" size="small">
          <detail-list-item term="負責人">林東東</detail-list-item>
          <detail-list-item term="角色碼">1234567</detail-list-item>
          <detail-list-item term="所屬部門">XX公司-YY部</detail-list-item>
          <detail-list-item term="過期時間">2018-08-08</detail-list-item>
          <detail-list-item term="描述">這段描述很長很長很長很長很長很長很長很長很長很長很長很長很長很長...</detail-list-item>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list title="組名稱" size="small" :col="1">
          <detail-list-item term="學名">	Citrullus lanatus (Thunb.) Matsum. et Nakai一年生蔓生藤本；莖、枝粗壯，具明顯的棱。卷鬚較粗..</detail-list-item>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list title="組名稱" size="small" :col="2">
          <detail-list-item term="負責人">付小小</detail-list-item>
          <detail-list-item term="角色碼">1234567</detail-list-item>
        </detail-list>
      </a-card>

    </a-card>

    <a-card style="margin-top: 24px" :bordered="false" title="用戶近半年來電記錄">
      <div class="no-data"><a-icon type="frown-o"/>暫無數據</div>
    </a-card>

    <!-- 操作 -->
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <a-table
        v-if="activeTabKey === '1'"
        :columns="operationColumns"
        :dataSource="operation1"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
      </a-table>
      <a-table
        v-if="activeTabKey === '2'"
        :columns="operationColumns"
        :dataSource="operation2"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
      </a-table>
      <a-table
        v-if="activeTabKey === '3'"
        :columns="operationColumns"
        :dataSource="operation3"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status">
          <a-badge :status="status | statusTypeFilter" :text="status | statusFilter"/>
        </template>
      </a-table>
    </a-card>

  </page-layout>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin.js'
  import PageLayout from '@/components/page/PageLayout'
  import DetailList from '@/components/tools/DetailList'

  const DetailListItem = DetailList.Item

  export default {
    name: "Advanced",
    components: {
      PageLayout,
      DetailList,
      DetailListItem
    },
    mixins: [mixinDevice],
    data () {
      return {
        tabList: [
          {
            key: '1',
            tab: '操作日誌一'
          },
          {
            key: '2',
            tab: '操作日誌二'
          },
          {
            key: '3',
            tab: '操作日誌三'
          }
        ],
        activeTabKey: '1',

        operationColumns: [
          {
            title: '操作類型',
            dataIndex: 'type',
            key: 'type'
          },
          {
            title: '操作人',
            dataIndex: 'name',
            key: 'name'
          },
          {
            title: '執行結果',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: { customRender: 'status' },
          },
          {
            title: '操作時間',
            dataIndex: 'updatedAt',
            key: 'updatedAt'
          },
          {
            title: '備註',
            dataIndex: 'remark',
            key: 'remark'
          }
        ],
        operation1: [
          {
            key: 'op1',
            type: '訂購關係生效',
            name: '曲麗麗',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '-'
          },
          {
            key: 'op2',
            type: '財務複審',
            name: '付小小',
            status: 'reject',
            updatedAt: '2017-10-03  19:23:12',
            remark: '不通過原因'
          },
          {
            key: 'op3',
            type: '部門初審',
            name: '周毛毛',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '-'
          },
          {
            key: 'op4',
            type: '提交訂單',
            name: '林東東',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '很棒'
          },
          {
            key: 'op5',
            type: '創建訂單',
            name: '汗牙牙',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '-'
          }
        ],
        operation2: [
          {
            key: 'op2',
            type: '財務複審',
            name: '付小小',
            status: 'reject',
            updatedAt: '2017-10-03  19:23:12',
            remark: '不通過原因'
          },
          {
            key: 'op3',
            type: '部門初審',
            name: '周毛毛',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '-'
          },
          {
            key: 'op4',
            type: '提交訂單',
            name: '林東東',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '很棒'
          }
        ],
        operation3: [
          {
            key: 'op2',
            type: '財務複審',
            name: '付小小',
            status: 'reject',
            updatedAt: '2017-10-03  19:23:12',
            remark: '不通過原因'
          },
          {
            key: 'op3',
            type: '部門初審',
            name: '周毛毛',
            status: 'agree',
            updatedAt: '2017-10-03  19:23:12',
            remark: '-'
          }
        ],
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          'agree': '成功',
          'reject': '駁回'
        }
        return statusMap[status]
      },
      statusTypeFilter(type) {
        const statusTypeMap = {
          'agree': 'success',
          'reject': 'error'
        }
        return statusTypeMap[type]
      }
    }
  }
</script>

<style lang="less" scoped>

  .detail-layout {
    margin-left: 44px;
  }
  .text {
    color: rgba(0, 0, 0, .45);
  }

  .heading {
    color: rgba(0, 0, 0, .85);
    font-size: 20px;
  }

  .no-data {
    color: rgba(0, 0, 0, .25);
    text-align: center;
    line-height: 64px;
    font-size: 16px;

    i {
      font-size: 24px;
      margin-right: 16px;
      position: relative;
      top: 3px;
    }
  }

  .mobile {
    .detail-layout {
      margin-left: unset;
    }
    .text {

    }
    .status-list {
      text-align: left;
    }
  }
</style>