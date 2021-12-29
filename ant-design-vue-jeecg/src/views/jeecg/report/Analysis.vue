<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="受理量" :total="cardCount.sll | NumberFormat">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <mini-area :dataSource="chartData.sll" />
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
            <mini-area :dataSource="chartData.bjl"/>
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
            <mini-bar :dataSource="chartData.isll"/>
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
            <mini-bar :dataSource="chartData.ibjl"/>
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
                <bar title="受理量統計" />
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
                <bar-multid :dataSource="jhjgData" :fields="jhjgFields" title="平台與部門交互量統計"></bar-multid>
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

          <a-tab-pane tab="效率監管" key="3">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <line-chart-multid :dataSource="xljgData" :fields="xljgFields" title="平台與部門交互效率統計"></line-chart-multid>
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
                      <dash-chart-demo :title="item.name" :dataSource="item.restPPT"></dash-chart-demo>
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

        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <a-radio-group defaultValue="1">
              <a-radio-button value="1">轉移登記</a-radio-button>
              <a-radio-button value="2">抵押登記</a-radio-button>
            </a-radio-group>
          </div>

          <a-tab-pane loading="true" tab="業務流程限時監管" key="1">

            <a-table :dataSource="dataSource1" size="default" rowKey="id" :columns="columns" :pagination="ipagination">
              <template slot="flowRate" slot-scope="text, record, index">
                <a-progress :percent="getFlowRateNumber(record.flowRate)" style="width:80px" />
              </template>
            </a-table>
          </a-tab-pane>

          <a-tab-pane loading="true" tab="業務節點限時監管" key="2">
            <a-table :dataSource="dataSource2" size="default" rowKey="id" :columns="columns2" :pagination="ipagination">
              <template slot="flowRate" slot-scope="text, record, index">
                <span style="color: red;">{{ record.flowRate }}分鐘</span>
              </template>
            </a-table>
          </a-tab-pane>

        </a-tabs>


      </a-card>
    </a-row>
  </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import AreaChartTy from '@/components/chart/AreaChartTy'
  import DashChartDemo from '@/components/chart/DashChartDemo'
  import BarMultid from '@/components/chart/BarMultid'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import Trend from '@/components/Trend'
  import { getAction } from '@/api/manage'
  import { filterObj } from '@/utils/util'
  import moment from 'dayjs'

  const rankList = []
  for (let i = 0; i < 7; i++) {
    rankList.push({
      name: '白鷺島 ' + (i+1) + ' 號店',
      total: 1234.56 - i * 100
    })
  }

  const dataCol1 = [{
    title: '業務號',
    align:"center",
    dataIndex: 'reBizCode'
  },{
    title: '權利類型',
    align:"center",
    dataIndex: 'droitType'
  },{
    title: '登記類型',
    align:"center",
    dataIndex: 'registeType'
  },{
    title: '座落',
    align:"center",
    dataIndex: 'beLocated'
  },{
    title: '權利人',
    align:"center",
    dataIndex: 'qlr'
  },{
    title: '義務人',
    align:"center",
    dataIndex: 'ywr'
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
    title: '辦理進度',
    align:"center",
    dataIndex: 'flowRate',
    scopedSlots: { customRender: 'flowRate' }
  }];

  const dataCol2 = [{
    title: '業務號',
    align:"center",
    dataIndex: 'reBizCode'
  },{
    title: '權利類型',
    align:"center",
    dataIndex: 'droitType'
  },{
    title: '登記類型',
    align:"center",
    dataIndex: 'registeType'
  },{
    title: '座落',
    align:"center",
    dataIndex: 'beLocated'
  },{
    title: '權利人',
    align:"center",
    dataIndex: 'qlr'
  },{
    title: '義務人',
    align:"center",
    dataIndex: 'ywr'
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

  const jhjgData = [
    { type: '房管', '一月': 900, '二月': 1120, '三月': 1380, '四月': 1480, '五月': 1450, '六月': 1100, '七月':1300, '八月':900,'九月':1000 ,'十月':1200 ,'十一月':600 ,'十二月':900 },
    { type: '稅務', '一月':1200, '二月': 1500, '三月': 1980, '四月': 2000, '五月': 1000, '六月': 600, '七月':900, '八月':1100,'九月':1300 ,'十月':2000 ,'十一月':900 ,'十二月':1100 },
    { type: '不動產', '一月':2000, '二月': 1430, '三月': 1300, '四月': 1400, '五月': 900, '六月': 500, '七月':600, '八月':1000,'九月':600 ,'十月':1000 ,'十一月':1500 ,'十二月':1200 }
  ]
  const jhjgFields=[
    '一月','二月','三月','四月','五月','六月',
    '七月','八月','九月','十月','十一月','十二月'
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
  export default {
    name: "Analysis",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend,
      LineChartMultid,
      AreaChartTy,
      DashChartDemo,
      BarMultid
    },
    data() {
      return {
        xljgData,
        xljgFields,
        jhjgData,
        jhjgFields,
        loading: true,
        rankList,
        zsll:0,
        zbjl:0,
        todaySll:0,
        todayBjl:0,
        todayISll:0,
        todayIBjl:0,
      registerTypeList:[{
          text:"業務受理"
        },{
          text:"業務管理"
        },{
          text:"文件管理"
        },{
          text:"信息查詢"
        }],
        // 分頁參數
        ipagination:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "條"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        //數據集
        dataSource:[],
        dataSource1:[],
        dataSource2:[],
        url:{
          analysis:"/sps/register/analysis",
          list:"sps/register/virtualList",
          countSll:"sps/register/sllTenDaysCount",
          countBjl:"sps/register/bjlTenDaysCount",
          countISll:'sps/register/ISllTenDaysCount',
          countIBjl:'sps/register/IBjlTenDaysCount',
          queryDiskInfo:'sys/actuator/redis/queryDiskInfo'
        },
        chartData:{
          sll:[],
          bjl:[],
          isll:[],
          ibjl:[]
        },
        cardCount:{
          sll:0,
          bjl:0,
          isll:0,
          ibjl:0
        },
        columns:dataCol1,
        columns2:dataCol2,
        diskInfo:[]
      }
    },
    methods:{
      goPage(index){
        if(index==0){
          this.$router.push({
            path: '/isps/registerStepForm',
            name: 'isps-registerStepForm',
          });
        }else if(index==1){
          this.$router.push({
            path: '/isps/registerList',
            name: 'isps-registerList',
          });

        }else if(index==2){
          this.$router.push({
            path: '/isps/fileManage',
            name: 'isps-fileManage',
          });
        }else if(index==3){
          this.$router.push({
            path: '/isps/infoSearch',
            name: 'isps-infoSearch',
          });
        }
      },
      loadList (arg){
        if(arg===1){
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查詢條件
        getAction(this.url.list,params).then((res)=>{
          console.log("dsdsd",res.result)
          this.dataSource1 = res.result.data1;
          this.dataSource2 = res.result.data2;
          this.ipagination.total = 5;
        });
      },
      getQueryParams(){
        var param = {flowStatus:"-3"};
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      formatRespectiveHoldCert(value){
        return (value=="1"||eval(value))?"是":"否"
      },
      formatCertFormat(value){
        if(value=="1"){
          return "單一版"
        }else if(value=="2"){
          return "集成版"
        }else{
          return value;
        }
      },
      getFlowRateNumber(value){
        return Number(value)
      },
      getFlowPercent(record){
        if(record.flowStatus=="3"){
          return 100
        }else if(record.flowStatus=="0"){
          return 0
        }else{
          return record.flowRate
        }
      },
      getFlowStatus(status){
        if(status=="4"){
          return "exception";
        }else if(status=="0"){
          return "normal";
        }else if(status=="3"){
          return "success";
        }else{
          return "active";
        }

      },
      queryCount(){
        getAction(this.url.analysis).then((res)=>{
          if(res.success){
            this.cardCount = res.result
          }
          console.log(res);
        });
      },

      loadDiskInfo(){
        getAction(this.url.queryDiskInfo).then((res)=>{
          if(res.success){
            console.log(res.result)
            let one=0,two="";
            for(let a in res.result){
              let tempNum = Number(res.result[a].max)
              if(tempNum>one){
                one = tempNum
                two = res.result[a].name
              }
            }
            let ontItem = res.result.filter((item)=>{return item.name == two})[0]
            ontItem.restPPT = ontItem.restPPT/10
            this.diskInfo.push(ontItem);

            if(res.result.length>1){
              let one2=0,two2="";
              for(let a in res.result){
                if(res.result[a].name == two){
                  continue;
                }
                let tempNum = Number(res.result[a].max)
                if(tempNum>one2){
                  one2 = tempNum
                  two2 = res.result[a].name
                }
              }
              let one2Item = res.result.filter((item)=>{return item.name == two2})[0]
              one2Item.restPPT = one2Item.restPPT/10
              this.diskInfo.push(one2Item);
            }

          }else{
            console.log(res.message)
          }
        })
      },
      loadChartData(){
        getAction(this.url.countSll).then((res)=>{
          if(res.success){
            let map = res.result;
            for(var key in map){
              let dataStr = key;
              let value = map[key];
              let today = moment(new Date()).format('YYYY-MM-DD');
              if(dataStr == today){
                this.todaySll = map[today];
              }
              this.chartData.sll.push({
                x: dataStr,
                y: value
              });
            }
          }

        }),
          getAction(this.url.countBjl).then((res)=>{
            if(res.success){
              let map = res.result;
              for(var key in map){
                let dataStr = key;
                let value = map[key];
                let today = moment(new Date()).format('YYYY-MM-DD');
                if(dataStr == today){
                  this.todayBjl = map[today];
                }
                this.chartData.bjl.push({
                  x: dataStr,
                  y: value
                });
              }
            }
          }),
          getAction(this.url.countISll).then((res)=>{
            if(res.success){
              let map = res.result;
              for(var key in map){
                let dataStr = key;
                let value = map[key];
                let today = moment(new Date()).format('YYYY-MM-DD');
                if(dataStr == today){
                  this.todayISll = map[today];
                }
                this.chartData.isll.push({
                  x: key,
                  y: value
                });
              }
            }
          }),
          getAction(this.url.countIBjl).then((res)=>{
            if(res.success){
              let map = res.result;
              for(var key in map){
                let dataStr = key;
                let value = map[key];
                let today = moment(new Date()).format('YYYY-MM-DD');
                if(dataStr == today){
                  this.todayIBjl = map[today];
                }
                this.chartData.ibjl.push({
                  x: key,
                  y: value
                });
              }
            }
          })
      }
    },
    created() {
      this.loadDiskInfo()
      this.queryCount();
      this.loadChartData();
      this.loadList(1);
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