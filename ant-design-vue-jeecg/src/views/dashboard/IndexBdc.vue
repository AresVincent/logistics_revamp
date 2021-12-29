<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="受理量" :total="cardCount.sll | NumberFormat">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :data-source="chartData.sll" />
          </div>
          <template slot="footer">今日受理量：<span>{{ todaySll }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="辦結量" :total="cardCount.bjl | NumberFormat">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :data-source="chartData.bjl"/>
          </div>
          <template slot="footer">今日辦結量：<span>{{ todayBjl }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="用戶受理量" :total="cardCount.isll | NumberFormat">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar :datasource="chartData.isll" :height="50"/>
          </div>
          <template slot="footer">用戶今日受理量：<span>{{ todayISll }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="用戶辦結量" :total="cardCount.ibjl | NumberFormat">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-bar :datasource="chartData.ibjl" :height="50"/>
          </div>
          <template slot="footer">用戶今日辦結量：<span>{{ todayIBjl }}</span></template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>今日</a>
              <a>本周</a>
              <a>本月</a>
              <a>本年</a>
            </div>
            <a-range-picker :style="{width: '256px'}" />
          </div>

          <a-tab-pane loading="true" tab="受理監管" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <index-bar title="受理量統計" />
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">

                <a-card title="快速開始 / 便捷導航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
                  <div class="item-group">
                    <a-row>
                      <a-col :class="'more-btn'" :span="12" v-for="(item,index) in registerTypeList" :key=" 'registerType'+index ">
                        <a-button @click="goPage(index)" style="margin-bottom:10px" size="small" type="primary" ghost>{{ item.text }}</a-button>
                      </a-col>
                    </a-row>
                  </div>
                </a-card>

              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane tab="交互監管" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar-multid :sourceData="jhjgData" :fields="jhjgFields" title="平台與部門交互量統計"></bar-multid>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">

                <a-card title="快速開始 / 便捷導航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
                  <div class="item-group">
                    <a-row>
                      <a-col :class="'more-btn'" :span="12" v-for="(item,index) in registerTypeList" :key=" 'registerType'+index ">
                        <a-button @click="goPage(index)" style="margin-bottom:10px" size="small" type="primary" ghost>{{ item.text }}</a-button>
                      </a-col>
                    </a-row>
                  </div>
                </a-card>

              </a-col>
            </a-row>
          </a-tab-pane>

          <a-tab-pane tab="存儲監管" key="4">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <a-row>
                  <template v-if="diskInfo && diskInfo.length>0">
                    <a-col :span="12" v-for="(item,index) in diskInfo" :key=" 'diskInfo'+index ">
                      <dash-chart-demo :title="item.name" :datasource="item.restPPT"></dash-chart-demo>
                    </a-col>
                  </template>
                </a-row>
              </a-col>

              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">

                <a-card title="快速開始 / 便捷導航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
                  <div class="item-group">
                    <a-row>
                      <a-col :class="'more-btn'" :span="10" v-for="(item,index) in registerTypeList" :key=" 'registerType'+index ">
                        <a-button @click="goPage(index)" style="margin-bottom:10px" size="small" type="primary" ghost>{{ item.text }}</a-button>
                      </a-col>
                    </a-row>
                  </div>
                </a-card>

              </a-col>
            </a-row>
          </a-tab-pane>

        </a-tabs>

      </div>
    </a-card>

    <a-row :gutter="12">
      <a-card :loading="loading" :class="{ 'anty-list-cust':true }" :bordered="false" :style="{ marginTop: '24px' }">

        <a-tabs v-model="indexBottomTab" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <a-radio-group v-model="indexRegisterType" @change="changeRegisterType">
              <a-radio-button value="轉移登記">轉移登記</a-radio-button>
              <a-radio-button value="抵押登記">抵押登記</a-radio-button>
              <a-radio-button value="">所有</a-radio-button>
            </a-radio-group>
          </div>

          <a-tab-pane loading="true" tab="業務流程限時監管" key="1">

            <a-table :dataSource="dataSource1" size="default" rowKey="id" :columns="columns" :pagination="ipagination1" @change="tableChange1">
              <template slot="flowRate" slot-scope="text, record, index">
                <a-progress :strokeColor="getPercentColor(record.flowRate)" :format="getPercentFormat" :percent="getFlowRateNumber(record.flowRate)" style="width:80px" />
              </template>
            </a-table>
          </a-tab-pane>

          <a-tab-pane loading="true" tab="業務節點限時監管" key="2">
            <a-table :dataSource="dataSource2" size="default" rowKey="id" :columns="columns2" :pagination="ipagination2" @change="tableChange2">
              <template slot="flowRate" slot-scope="text, record, index">
                <span style="color: red;">{{ record.flowRate }}小時</span>
              </template>
            </a-table>
          </a-tab-pane>

        </a-tabs>


      </a-card>
    </a-row>

  </div>
</template>

<script>

  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import ChartCard from '@/components/ChartCard'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniArea from '@/components/chart/MiniArea'
  import IndexBar from '@/components/chart/IndexBar'
  import BarMultid from '@/components/chart/BarMultid'
  import DashChartDemo from '@/components/chart/DashChartDemo'

  const jhjgData = [
    { type: '房管', '1月': 900, '2月': 1120, '3月': 1380, '4月': 1480, '5月': 1450, '6月': 1100, '7月':1300, '8月':900,'9月':1000 ,'10月':1200 ,'11月':600 ,'12月':900 },
    { type: '稅務', '1月':1200, '2月': 1500, '3月': 1980, '4月': 2000, '5月': 1000, '6月': 600, '7月':900, '8月':1100,'9月':1300 ,'10月':2000 ,'11月':900 ,'12月':1100 },
    { type: '不動產', '1月':2000, '2月': 1430, '3月': 1300, '4月': 1400, '5月': 900, '6月': 500, '7月':600, '8月':1000,'9月':600 ,'10月':1000 ,'11月':1500 ,'12月':1200 }
  ]

  const jhjgFields=[
    '1月','2月','3月','4月','5月','6月',
    '7月','8月','9月','10月','11月','12月'
  ]

  const xljgData = [
    {type:'一月',"房管":1.12,"稅務":1.55,"不動產":1.2},
    {type:'二月',"房管":1.65,"稅務":1.32,"不動產":1.42},
    {type:'三月',"房管":1.85,"稅務":1.1,"不動產":1.5},

    {type:'四月',"房管":1.33,"稅務":1.63,"不動產":1.4},
    {type:'五月',"房管":1.63,"稅務":1.8,"不動產":1.7},
    {type:'六月',"房管":1.85,"稅務":1.98,"不動產":1.8},

    {type:'七月',"房管":1.98,"稅務":1.5,"不動產":1.76},
    {type:'八月',"房管":1.48,"稅務":1.2,"不動產":1.3},
    {type:'九月',"房管":1.41,"稅務":1.9,"不動產":1.6},

    {type:'十月',"房管":1.1,"稅務":1.1,"不動產":1.4},
    {type:'十一月',"房管":1.85,"稅務":1.6,"不動產":1.5},
    {type:'十二月',"房管":1.5,"稅務":1.4,"不動產":1.3}
  ]
  const xljgFields=["房管","稅務","不動產"]

  const dataCol1 = [{
    title: '業務號',
    align:"center",
    dataIndex: 'reBizCode'
  },{
    title: '業務類型',
    align:"center",
    dataIndex: 'type'
  },{
    title: '受理人',
    align:"center",
    dataIndex: 'acceptBy'
  },{
    title: '受理時間',
    align:"center",
    dataIndex: 'acceptDate'
  },{
    title: '當前節點',
    align:"center",
    dataIndex: 'curNode'
  },{
    title: '辦理時長',
    align:"center",
    dataIndex: 'flowRate',
    scopedSlots: { customRender: 'flowRate' }
  }];
  const dataSource1=[
    {reBizCode:"1",type:"轉移登記",acceptBy:'張三',acceptDate:"2019-01-22",curNode:"任務分派",flowRate:60},
    {reBizCode:"2",type:"抵押登記",acceptBy:'李四',acceptDate:"2019-01-23",curNode:"領導審核",flowRate:30},
    {reBizCode:"3",type:"轉移登記",acceptBy:'王武',acceptDate:"2019-01-25",curNode:"任務處理",flowRate:20},
    {reBizCode:"4",type:"轉移登記",acceptBy:'趙樓',acceptDate:"2019-11-22",curNode:"部門審核",flowRate:80},
    {reBizCode:"5",type:"轉移登記",acceptBy:'錢就',acceptDate:"2019-12-12",curNode:"任務分派",flowRate:90},
    {reBizCode:"6",type:"轉移登記",acceptBy:'孫吧',acceptDate:"2019-03-06",curNode:"任務處理",flowRate:10},
    {reBizCode:"7",type:"抵押登記",acceptBy:'周大',acceptDate:"2019-04-13",curNode:"任務分派",flowRate:100},
    {reBizCode:"8",type:"抵押登記",acceptBy:'吳二',acceptDate:"2019-05-09",curNode:"任務上報",flowRate:50},
    {reBizCode:"9",type:"抵押登記",acceptBy:'鄭爽',acceptDate:"2019-07-12",curNode:"任務處理",flowRate:63},
    {reBizCode:"20",type:"抵押登記",acceptBy:'林有',acceptDate:"2019-12-12",curNode:"任務打回",flowRate:59},
    {reBizCode:"11",type:"轉移登記",acceptBy:'碼雲',acceptDate:"2019-09-10",curNode:"任務簽收",flowRate:87},
  ]

  const dataCol2 = [{
    title: '業務號',
    align:"center",
    dataIndex: 'reBizCode'
  },{
    title: '受理人',
    align:"center",
    dataIndex: 'acceptBy'
  },{
    title: '發起時間',
    align:"center",
    dataIndex: 'acceptDate'
  },{
    title: '當前節點',
    align:"center",
    dataIndex: 'curNode'
  },{
    title: '超時時間',
    align:"center",
    dataIndex: 'flowRate',
    scopedSlots: { customRender: 'flowRate' }
  }];
  const dataSource2=[
    {reBizCode:"A001",type:"轉移登記",acceptBy:'張四',acceptDate:"2019-01-22",curNode:"任務分派",flowRate:12},
    {reBizCode:"A002",type:"抵押登記",acceptBy:'李吧',acceptDate:"2019-01-23",curNode:"任務簽收",flowRate:3},
    {reBizCode:"A003",type:"轉移登記",acceptBy:'王三',acceptDate:"2019-01-25",curNode:"任務處理",flowRate:24},
    {reBizCode:"A004",type:"轉移登記",acceptBy:'趙二',acceptDate:"2019-11-22",curNode:"部門審核",flowRate:10},
    {reBizCode:"A005",type:"轉移登記",acceptBy:'錢大',acceptDate:"2019-12-12",curNode:"任務簽收",flowRate:8},
    {reBizCode:"A006",type:"轉移登記",acceptBy:'孫就',acceptDate:"2019-03-06",curNode:"任務處理",flowRate:10},
    {reBizCode:"A007",type:"抵押登記",acceptBy:'周暈',acceptDate:"2019-04-13",curNode:"部門審核",flowRate:24},
    {reBizCode:"A008",type:"抵押登記",acceptBy:'吳有',acceptDate:"2019-05-09",curNode:"部門審核",flowRate:30},
    {reBizCode:"A009",type:"抵押登記",acceptBy:'鄭武',acceptDate:"2019-07-12",curNode:"任務分派",flowRate:1},
    {reBizCode:"A0010",type:"抵押登記",acceptBy:'林爽',acceptDate:"2019-12-12",curNode:"部門審核",flowRate:16},
    {reBizCode:"A0011",type:"轉移登記",acceptBy:'碼樓',acceptDate:"2019-09-10",curNode:"部門審核",flowRate:7},
  ]

  export default {
    name: "IndexBdc",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      DashChartDemo,
      BarMultid,
      IndexBar
    },
    data() {
      return {
        loading: true,
        cardCount:{
          sll:100,
          bjl:87,
          isll:15,
          ibjl:9
        },

        todaySll:60,
        todayBjl:54,
        todayISll:13,
        todayIBjl:7,

        chartData:{
          sll:[],
          bjl:[],
          isll:[],
          ibjl:[]
        },
        jhjgFields,
        jhjgData,

        xljgData,
        xljgFields,

        diskInfo:[
          {name:"C盤",restPPT:7},
          {name:"D盤",restPPT:5}
        ],

        registerTypeList:[{
          text:"業務受理"
        },{
          text:"業務管理"
        },{
          text:"文件管理"
        },{
          text:"信息查詢"
        }],

        dataSource1:[],
        dataSource2:[],
        columns:dataCol1,
        columns2:dataCol2,
        ipagination1:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "條"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,

        },
        ipagination2:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "條"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0,
        },
        indexRegisterType:"轉移登記",
        indexBottomTab:"1"

      }
    },
    methods:{
      goPage(){
        this.$message.success("根據業務自行處理跳轉頁面!")
      },
      changeRegisterType(e){
        this.indexRegisterType = e.target.value
        if(this.indexBottomTab=="1"){
          this.loadDataSource1()
        }else{
          this.loadDataSource2()
        }
      },
      tableChange1(pagination){
        this.ipagination1.current = pagination.current
        this.ipagination1.pageSize = pagination.pageSize
        this.queryTimeoutInfo()
      },
      tableChange2(pagination){
        this.ipagination2.current = pagination.current
        this.ipagination2.pageSize = pagination.pageSize
        this.queryNodeTimeoutInfo()
      },
      getFlowRateNumber(value){
        return Number(value)
      },
      getPercentFormat(value){
        if(value==100){
          return "超時"
        }else{
          return value+"%"
        }
      },
      getPercentColor(value){
        let p = Number(value)
        if(p>=90 && p<100){
          return 'rgb(244, 240, 89)'
        }else if(p>=100){
          return 'red'
        }else{
          return 'rgb(16, 142, 233)'
        }
      },

      loadDataSource1(){
        this.dataSource1 = dataSource1.filter(item=>{
          if(!this.indexRegisterType){
            return true
          }
          return item.type==this.indexRegisterType
        })
      },
      loadDataSource2(){
        this.dataSource2 = dataSource2.filter(item=>{
          if(!this.indexRegisterType){
            return true
          }
          return item.type==this.indexRegisterType
        })
      }
    },
    created() {
      this.loadDataSource1()
      this.loadDataSource2()
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
    }
  }
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .item-group {
    .more-btn {
      margin-bottom: 13px;
      text-align: center;
    }
  }

  .list-content-item {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
  }

  @media only screen and (min-width: 1600px) {
    .list-content-item{
      margin-left:60px;
    }
  }

  @media only screen and (max-width: 1300px) {
    .list-content-item{
      margin-left:20px;
    }
    .width-hidden4{
      display:none
    }
  }
  .list-content-item{
    span{line-height: 20px;}
  }
  .list-content-item{
    p{margin-top: 4px;margin-bottom:0;line-height:22px;}
  }
  .anty-list-cust {
    .ant-list-item-meta{flex: 0.3 !important;}
  }
  .anty-list-cust {
    .ant-list-item-content{flex:1 !important; justify-content:flex-start !important;margin-left: 20px;}
  }


</style>