/**
* @date 2021.12.22
 * @author Vincnet
 * @description Customized Calendar
 */
<template>
<a-card>
    <div class="furnitureCal" id="furnitureCal">
  <a-calendar @select="showOrder" :disabledDate="getDisableDate"  >
      <!-- <template slot="dateFullCellRender" slot-scope="value">
        <div :class="getDisableDate(value)==true? 'day disable':'day'">
            <p>{{value.get("date")}}</p>
        </div>
      </template> -->
    <template slot="dateCellRender" slot-scope="value" v-if="!isMobile()">
        <ul  class="events" >
        <li v-for="item in getListData(value)" :key="item.content">
            <a-badge :status="item.type" :text="item.content" />
        </li>
        </ul>
        <a-tag :color="getHoliday(value).publicHoliday==0? 'grey':'red'" v-if="getHoliday(value).length!=0">{{getHoliday(value).holidayName}}</a-tag>
    </template>
    
    <!-- <template slot="monthCellRender" slot-scope="value">
      <div v-if="getMonthData(value)" class="notes-month">
        <section>{{ getMonthData(value) }}</section>
      </div>
    </template> -->
  </a-calendar >
    <a-drawer
        title="订单详情"
        placement="right"
        :closable="false"
        :visible="isShowDetail"
        @close="isShowDetail=false"
        :width="isMobile() ? '300':'600'"
    >
        <a-form rel="furnitureDetail" layout="inline">
            <a-select default-value="all" style="width: 120px" @change="console.log('change')">
                <a-select-option value="all">全部</a-select-option>
                <a-select-option value="jack">已完成</a-select-option>
                <a-select-option value="lucy">未完成</a-select-option>
                <a-select-option value="Yiminghe">异常件</a-select-option>
            </a-select>
            </a-form>
            <order-simple :scrollWidth="{x:300}"></order-simple>
    </a-drawer>
    </div>
</a-card>
</template>
<script>
import OrderSimple from './modules/OrderSimple';
import { mixin,mixinDevice } from '@/utils/mixin.js';
import { getAction } from '@/api/manage'


const dateOrder=[
    {
        date:"2021-11-30",
        list:[
            {type:'warning',content:"未完成：100"},
            {type:'success',content:"已完成：30"},
            {type:"error",content:"异常件：0"},
        ]
    },
    {
        date:"2021-12-01",
        list:[
            {type:'warning',content:"未完成：20"},
            {type:'success',content:"已完成：30"},
            {type:"error",content:"异常件：1"}
        ]
    },
    {
        date:"2021-12-05",
        list:[
            {type:'warning',content:"未完成：600"},
            {type:'success',content:"已完成：50"},
            {type:"error",content:"异常件：2"}
        ]
    },
    {
        date:"2021-12-14",
        list:[
            {type:'warning',content:"未完成：400"},
            {type:'success',content:"已完成：90"},
            {type:"error",content:"异常件：1"}
        ]
    },
    {
        date:"2021-12-20",
        list:[
            {type:'warning',content:"未完成：300"},
            {type:'success',content:"已完成：30"},
            {type:"error",content:"异常件：0"}
        ]
    },
    {
        date:"2021-12-22",
        list:[
            {type:'warning',content:"未完成：500"},
            {type:'success',content:"已完成：60"},
            {type:"error",content:"异常件：10"}
        ]
    },
    {
        date:"2021-12-30",
        list:[
            {type:'warning',content:"未完成：100"},
            {type:'success',content:"已完成：30"},
            {type:"error",content:"异常件：0"}
        ]
    },
];

export default {
    name:'Calendar',
    components:{
        OrderSimple,
    },
    mixins: [mixin,mixinDevice],
    data(){
      return{
          isShowDetail:false,
          dateOrders:dateOrder,
          holiday:[],
      }
    },
    methods: {
        //getOrdeList
        getListData(value) {
        for(var item in this.dateOrders){
            let details=this.dateOrders[item];
            if(details.date==value.format("YYYY-MM-DD")){
                return details.list;
            }
        }
        return [];
        },
        // Generate Date type Tag
        getHoliday(value){
             if(this.holiday.length==0){
                return [];  
            }
            for(let i=0;i<this.holiday.length;i++){
                if(this.holiday[i].occurDate==value.format("YYYY-MM-DD")){
                    return this.holiday[i];
                }
            }
            return [];
        },
        getMonthData(value) {
        if (value.month() === 8) {
            return 1394;
        }
        },
        //show order in that day
        showOrder(){
            this.isShowDetail=true;
        },
        //which day is off duty
        getDisableDate(current){
            if(this.holiday.length==0){
                return false;  
            }
            if(current.get('day')==0){
                return true;
            }
            for(let i=0;i<this.holiday.length;i++){
                if(this.holiday[i].occurDate==current.format("YYYY-MM-DD")&&this.holiday[i].publicHoliday==1&&this.holiday[i].statutoryHoliday==1){
                    return true;
                }
            }
            return false;
        }
    },
    beforeMount(){
        //get all holiday
        getAction("/holiday/commonHoliday/list").then((res)=>{
            if(res.code==200){
            this.holiday=res.result.records;
            }
        }).catch(e=>{
            
        })
    }
};
</script>
<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 56px;
  overflow-y: auto;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}

</style>
<style>
#furnitureCal .ant-fullcalendar-disabled-cell .ant-fullcalendar-value{
    color: red;
}
#furnitureCal .ant-fullcalendar-fullscreen .ant-fullcalendar-value,#furnitureCal .ant-fullcalendar-fullscreen .ant-fullcalendar-column-header{
    text-align: center;
}
#furnitureCal .ant-fullcalendar-fullscreen .ant-fullcalendar-content{
    text-align: center;
    overflow: unset;
}
</style>