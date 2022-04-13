<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24" v-has="'testdemo:showChart'">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="總收入" :total="'HKD$'+(chartData.totalRevenue==null ? 0:chartData.totalRevenue)">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <mini-bar :height="40" />
          </div>
          <template slot="footer">轉化率 <span>60%</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="總訂單量" :total="chartData.totalAmount+'件'">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">週同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <template slot="footer">日均銷售額<span>HKD $ 234.56</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="已入倉" :total="chartData.totalInAmount+'件'">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <mini-area />
          </div>
          <template slot="footer">日訂單量<span> {{ '1234' | NumberFormat }}</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="轉運中" :total="chartData.totalTransferAmount+'件'">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <mini-bar :height="40" />
          </div>
          <template slot="footer">轉化率 <span>60%</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="派送中" :total="chartData.totalDeliveringAmount+'件'">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" :height="8" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日環比</span>
              80%
            </trend>
          </template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="已上架" :total="chartData.totalOnShelfAmount+'件'">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <trend flag="up" style="margin-right: 16px;">
              <span slot="term">週同比</span>
              12%
            </trend>
            <trend flag="down">
              <span slot="term">日同比</span>
              11%
            </trend>
          </div>
          <template slot="footer">日均銷售額<span>HKD $ 234.56</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="派送完成" :total="chartData.totalSuccessAmount+'件'">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <mini-area />
          </div>
          <template slot="footer">日訂單量<span> {{ '1234' | NumberFormat }}</span></template> -->
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="異常件" :total="chartData.totalExceptionAmount+'件'">
          <a-tooltip title="指標說明" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <!-- <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" :height="8" />
          </div>
          <template slot="footer">
            <trend flag="down" style="margin-right: 16px;">
              <span slot="term">同周比</span>
              12%
            </trend>
            <trend flag="up">
              <span slot="term">日環比</span>
              80%
            </trend>
          </template> -->
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}"  v-has="'testdemo:showChart'">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <!-- <a>今日</a> -->
              <a @click="getLogisticsChartDate(2)">本週</a>
              <a @click="getLogisticsChartDate(3)">本月</a>
              <a @click="getLogisticsChartDate(4)">本年</a>
            </div>
            <!-- <a-range-picker :style="{width: '256px'}" /> -->
          </div>
          <a-tab-pane loading="true" tab="銷售額" key="1">
            <a-row>
              <a-col :xl="24" :lg="24" :md="24" :sm="24" :xs="24">
                <bar v-if="isDataLoad==false" title="銷售額排行" :dataSource="chartInfo"/>
                <div v-else class="loadBg">
                  <a-spin :indicator="indicator" tip="正在獲取中" class="loadSpin" ></a-spin>
                </div>
              </a-col>
              <!-- <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="門店銷售排行榜" :list="rankList"/>
              </a-col> -->
            </a-row>
          </a-tab-pane>
          <!-- <a-tab-pane tab="銷售趨勢" key="2">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar title="銷售額趨勢" :dataSource="barData"/>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="門店銷售排行榜" :list="rankList"/>
              </a-col>
            </a-row>
          </a-tab-pane> -->
        </a-tabs>
      </div>
    </a-card>

    <a-row  v-has="'testdemo:showChart'">
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="最近一週訪問量統計" :style="{ marginTop: '24px' }">
          <a-row>
            <a-col :span="6">
              <head-info title="今日IP" :content="loginfo.todayIp"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="environment" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="今日訪問" :content="loginfo.todayVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="team" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="總訪問量" :content="loginfo.totalVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="rise" style="font-size: 24px"  />
              </a-spin>
            </a-col>
          </a-row>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
        </a-card>
      </a-col>
    </a-row>
    
  </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import HeadInfo from '@/components/tools/HeadInfo.vue'
  import { colAuthFilter } from "@/utils/authFilter"

  import Trend from '@/components/Trend'
  import { getLoginfo,getVisitInfo } from '@/api/api'
  import { getAction } from '@/api/manage'
  const barData = []
  for (let i = 0; i < 7; i += 1) {
    barData.push({
      x: `${i + 1}日`,
      y: Math.floor(Math.random() * 1000) + 200
    })
  }
  export default {
    name: "IndexChart",
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
      HeadInfo
    },
    data() {
      return {
        loading: true,
        center: null,
        barData,
        loginfo:{},
        visitFields:['ip','visit'],
        visitInfo:[],
        indicator: <a-icon type="loading" style="font-size: 24px" spin />,
        chartData:{
          totalAmount:'0',
          totalDeliveringAmount:'0',
          totalExceptionAmount:'0',
          totalInAmount:'0',
          totalOnShelfAmount:'0',
          totalRevenue:'0',
          totalSuccessAmount:'0',
          totalTransferAmount:'0',
          record:[]
        },
        logisticsParams:{
          date:this.YMD(new Date()),
          type:1
        },
        chartInfo:[],
        indicator:<a-icon type="loading" style="font-size: 24px" spin />,
       isDataLoad:true,
      }
    },
    methods: {
      initLogInfo () {
        getLoginfo(null).then((res)=>{
          if(res.success){
            Object.keys(res.result).forEach(key=>{
              res.result[key] =res.result[key]+""
            })
            this.loginfo = res.result;
          }
        })
        getVisitInfo().then(res=>{
          if(res.success){
             this.visitInfo = res.result;
           }
         })
      },
      getLogisticsData(params){
        // type 1,2,3,4 equal daily weekly monthly annual,params is an object{date,type,....}
         getAction("/logistics/order/getOrderRecord",params).then(res=>{
           if(res.code==200){
             let data=res.result;
             this.chartData=data;
             console.log(res.result)
           }
         }).catch(err=>{
           console.log(err)
         });
      },
      getLogisticsChartDate(type){
        this.isDataLoad=true;
        getAction("/logistics/order/getOrderRecord",{"date":this.YMD(new Date()),"type":type}).then(res=>{
           if(res.code==200){
             let data=res.result;
             this.chartData=data;
             let infoArray=[];
             for(let i=0;i<data.detail.length;i++){
               infoArray.push({x:data.detail[i].date+' ',y:data.detail[i].amount})
             }
             this.chartInfo=infoArray.slice(0);
             this.isDataLoad=false;
           }
         }).catch(err=>{
            this.isDataLoad=false;
            console.log(err)
         });
      },
      YMD(date){
        return (
          date.getFullYear()+'-'
          +(date.getMonth()+1>=10 ? date.getMonth()+1:'0'+(date.getMonth()+1))+'-'
          +(date.getDate()>=10 ? date.getDate():'0'+date.getDate())
        )
      }
    },
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
      this.initLogInfo();
      this.disableMixinCreated=true;
      this.columns= colAuthFilter(this.columns,'testdemo:');
    },
    beforeMount(){
      //get today
      this.getLogisticsData(this.logisticsParams);
      this.getLogisticsChartDate(2);
    }
  }
</script>

<style lang="less" scoped>
  .circle-cust{
    position: relative;
    top: 28px;
    left: -100%;
  }
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

  /* 首頁訪問量統計 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }
    p {
      line-height: 42px;
      margin: 0;
      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
  .loadBg{
    display: flex;
    width: 100%;
    height: 300px;
    justify-content: center;
    align-items: center;
  }
</style>