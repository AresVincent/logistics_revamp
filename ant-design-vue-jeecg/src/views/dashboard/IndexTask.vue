<template>
  <div class="index-container-ty">
    <a-spin :spinning="loading">
      <a-row type="flex" justify="start" :gutter="3">
        <a-col :sm="24" :lg="12">
          <a-card>
            <div slot="title" class="index-md-title">
              <img src="../../assets/daiban.png"/>
              我的待辦【{{ dataSource1.length }}】
            </div>
            <div slot="extra">
              <a v-if="dataSource1 && dataSource1.length>0" slot="footer" @click="goPage">更多 <a-icon type="double-right" /></a>
            </div>
            <a-table
              :class="'my-index-table tytable1'"
              ref="table1"
              size="small"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource1"
              :pagination="false">
              <template slot="ellipsisText" slot-scope="text">
                <j-ellipsis :value="text" :length="textMaxLength"></j-ellipsis>
              </template>

              <template slot="dayWarnning" slot-scope="text,record">
                <a-icon type="bulb" theme="twoTone" style="font-size:22px" :twoToneColor="getTipColor(record)"/>
              </template>

              <span slot="action" slot-scope="text, record">
                <a @click="handleData">辦理</a>
              </span>

            </a-table>
          </a-card>
        </a-col>

        <a-col :sm="24" :lg="12">
          <a-card>
            <div slot="title" class="index-md-title">
              <img src="../../assets/zaiban.png"/>
              我的在辦【{{ dataSource2.length }}】
            </div>
            <div slot="extra">
              <a v-if="dataSource2 && dataSource2.length>0" slot="footer" @click="goPage">更多 <a-icon type="double-right" /></a>
            </div>
            <a-table
              :class="'my-index-table tytable2'"
              ref="table2"
              size="small"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource2"
              :pagination="false">
              <template slot="ellipsisText" slot-scope="text">
                <j-ellipsis :value="text" :length="textMaxLength"></j-ellipsis>
              </template>

              <template slot="dayWarnning" slot-scope="text,record">
                <a-icon type="bulb" theme="twoTone" style="font-size:22px" :twoToneColor="getTipColor(record)"/>
              </template>

              <span slot="action" slot-scope="text, record">
                <a @click="handleData">辦理</a>
              </span>

            </a-table>
          </a-card>
        </a-col>

        <a-col :span="24">
          <div style="height: 5px;"></div>
        </a-col>

        <a-col :sm="24" :lg="12">
          <a-card>
            <div slot="title" class="index-md-title">
              <img src="../../assets/guaz.png"/>
              我的掛賬【{{ dataSource4.length }}】
            </div>
            <a-table
              :class="'my-index-table tytable4'"
              ref="table4"
              size="small"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource4"
              :pagination="false">
              <template slot="ellipsisText" slot-scope="text">
                <j-ellipsis :value="text" :length="textMaxLength"></j-ellipsis>
              </template>

              <template slot="dayWarnning" slot-scope="text,record">
                <a-icon type="bulb" theme="twoTone" style="font-size:22px" :twoToneColor="getTipColor(record)"/>
              </template>

              <span slot="action" slot-scope="text, record">
                <a @click="handleData">辦理</a>
              </span>

            </a-table>
          </a-card>
        </a-col>

        <a-col :sm="24" :lg="12">
          <a-card>
            <div slot="title" class="index-md-title">
              <img src="../../assets/duban.png"/>
              我的督辦【{{ dataSource3.length }}】
            </div>
            <a-table
              :class="'my-index-table tytable3'"
              ref="table3"
              size="small"
              rowKey="id"
              :columns="columns"
              :dataSource="dataSource3"
              :pagination="false">
              <template slot="ellipsisText" slot-scope="text">
                <j-ellipsis :value="text" :length="textMaxLength"></j-ellipsis>
              </template>

              <template slot="dayWarnning" slot-scope="text,record">
                <a-icon type="bulb" theme="twoTone" style="font-size:22px" :twoToneColor="getTipColor(record)"/>
              </template>

              <span slot="action" slot-scope="text, record">
                <a @click="handleData">辦理</a>
              </span>

            </a-table>
          </a-card>
        </a-col>

      </a-row>
    </a-spin>

  </div>
</template>

<script>
  import noDataPng from '@/assets/nodata.png'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  const tempSs1=[{
    id:"001",
    orderNo:"電[1]1267102",
    orderTitle:"藥品出問題了",
    restDay:1
  },{
    id:"002",
    orderNo:"電[4]5967102",
    orderTitle:"吃了xxx醫院的葯，病情越來越嚴重",
    restDay:0
  },{
    id:"003",
    orderNo:"電[3]5988987",
    orderTitle:"今天去超市買雞蛋，雞蛋都是壞的",
    restDay:7
  },{
    id:"004",
    orderNo:"電[2]5213491",
    orderTitle:"xx寶實體店高價售賣xx",
    restDay:5
  },{
    id:"005",
    orderNo:"電[1]1603491",
    orderTitle:"以紅利相誘，答應退保后扣一年費用",
    restDay:0
  }]

  const tempSs2=[{
    id:"001",
    orderTitle:"我要投訴這個大超市",
    orderNo:"電[1]10299456",
    restDay:6
  },{
    id:"002",
    orderTitle:"xxx醫院亂開藥方,售賣假藥",
    orderNo:"電[2]20235691",
    restDay:0
  },{
    id:"003",
    orderTitle:"我想問問這家店是幹啥的",
    orderNo:"電[3]495867322",
    restDay:7
  },{
    id:"004",
    orderTitle:"我要舉報朝陽區奧森公園酒店",
    orderNo:"電[2]1193849",
    restDay:3
  },{
    id:"005",
    orderTitle:"我今天吃飯吃到一個石頭子",
    orderNo:"電[4]56782344",
    restDay:9
  }]

  //4-7天
  const tip_green = "rgba(0, 255, 0, 1)"
  //1-3天
  const tip_yellow = "rgba(255, 255, 0, 1)"
  //超期
  const tip_red = "rgba(255, 0, 0, 1)"

  export default {
    name: "IndexTask",
    components:{ JEllipsis },
    data() {
      return {
        loading:false,
        textMaxLength:8,
        dataSource1:[],
        dataSource2:[],
        dataSource3:[],
        dataSource4:[],
        columns: [
          {
            title: '',
            dataIndex: '',
            key:'rowIndex',
            width:50,
            fixed:'left',
            align:"center",
            scopedSlots: {customRender: "dayWarnning"}
          },
          {
            title:'剩餘天數',
            align:"center",
            dataIndex: 'restDay',
            width:80
          },
          {
            title:'工單標題',
            align:"center",
            dataIndex: 'orderTitle',
            scopedSlots: {customRender: "ellipsisText"}
          },
          {
            title:'工單編號',
            align:"center",
            dataIndex: 'orderNo',
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' }
          }
        ]

      }
    },
    created() {
      this.mock();
    },
    mounted(){

    },
    methods: {
      getTipColor(rd){
        let num = rd.restDay
        if(num<=0){
          return tip_red
        }else if(num>=1 && num<4){
          return tip_yellow
        }else if(num>=4){
          return tip_green
        }
      },
      goPage(){
        this.$message.success("請根據具體業務跳轉頁面")
        //this.$router.push({ path: '/comp/mytask' })
      },
      mock(){
        this.dataSource1=tempSs1
        this.dataSource2=tempSs2
        this.dataSource3=tempSs1
        this.dataSource4=[]
        this.ifNullDataSource(this.dataSource4,'.tytable4')
      },

      ifNullDataSource(ds,tb){
        this.$nextTick(()=>{
          if(!ds || ds.length==0){
            var tmp = document.createElement('img');
            tmp.src=noDataPng
            tmp.width=300
            let tbclass=`${tb} .ant-table-placeholder`
            document.querySelector(tbclass).innerHTML=""
            document.querySelector(tbclass).appendChild(tmp)
          }
        })
      },
      handleData(){
        this.$message.success("辦理完成")
      }




    }
  }
</script>

<style>
  .my-index-table{height:270px}
  .my-index-table table{font-size: 14px !important;}

  .index-container-ty .ant-card-head-title{padding-top: 6px;padding-bottom: 6px;}
  .index-container-ty .ant-card-extra{padding:0}
  .index-container-ty .ant-card-extra a{color:#fff}
  .index-container-ty .ant-card-extra a:hover{color:#152ede}
  .index-container-ty .ant-card-head-wrapper,.index-container-ty .ant-card-head{
    line-height:24px;
    min-height:24px;
    /*background: #90aeff;*/
    background: #7196fb;
  }
  .index-container-ty .ant-card-body{padding: 10px 12px 0px 12px}

  /* .index-container-ty .ant-card-actions{background: #fff}
   .index-container-ty .ant-card-actions li {margin:2px 0;}
   .index-container-ty .ant-card-actions > li > span{width: 100%}*/


  .index-container-ty .ant-table-footer{text-align: right;padding:6px 12px 6px 6px;background: #fff;border-top: 2px solid #f7f1f1;}

  .index-md-title{
    postion:relative;
    padding-left:24px;
    width: 100%;
    color: #fff;
    font-size: 21px;
    font-family: cursive;
  }
  .index-md-title img{
    position: absolute;
    height:32px;
    top: 2px;
    left:14px;
  }

  .index-container-ty .ant-card-body{
    /*border-left:1px solid #90aeff;
    /*border-right:1px solid #90aeff;
    border-bottom:1px solid #90aeff;*/
  }


  .index-container-ty .ant-table-thead > tr > th,
  .index-container-ty .ant-table-tbody > tr > td{
    border-bottom: 1px solid #90aeff;
  }

  .index-container-ty .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th,
  .index-container-ty .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th{
    border-bottom: 1px solid #90aeff;
  }

  .index-container-ty  .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th{
    border-bottom: 1px solid #90aeff;
  }

  .index-container-ty .ant-table-small{
    border: 1px solid #90aeff;
  }

  .index-container-ty .ant-table-placeholder {
    padding: 0
  }
</style>