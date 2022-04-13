<template>
    <a-card>
            <!-- 查詢區域 -->
        <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter='24'>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="地區">
                    <j-search-select-tag placeholder="請選擇地區ID" v-model="queryParam.areaId" dict="common_area,area,id"/>              
                </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                <a-form-item label="門市類型">
                    <j-search-select-tag placeholder="請選擇門市類型" v-model="queryParam.type" dict="self_station"/>              
                </a-form-item>
                </a-col>
                <a-col :xl="6" :lg="7" :md="8" :sm="24">
                    <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                    <a-button type="primary" @click="searchQuery" icon="search">查詢</a-button>
                    <a-button type="primary" @click="resetQuery" icon="reload" style="margin-left: 8px">重置</a-button>
                    </span>
                </a-col>
            </a-row>
        </a-form>
        </div>
        <a-row gutter='24'>
            <a-col :xs='24' :md='8'>
                <p>網點信息</p>
                <div style="height:500px;overflow:auto">
                    <ul v-for="(marker,index) in markers" :key='index'>
                        <li>{{marker.mTitle}}</li>
                    </ul>
                </div>
            </a-col>
            <a-col :xs='24' :md='16'>
                 <div class="bmap-page-container">
                    <el-bmap class="bmap-box bmap-logistics" ref="logisticsMap" :min-zoom="10" :max-zoom="30" :tilt="tilt" :center="center" :zoom="zoom" :vid="'bmap-vue'">
                        <el-bmap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events='marker.event' :title="marker.mTitle">
                        </el-bmap-marker>
                        <el-bmap-info-window :visible="windowInfo.visible" :position="windowInfo.position" :title="windowInfo.title" :content='windowInfo.content' :events='windowInfo.event'></el-bmap-info-window>
                    </el-bmap>
                </div>
            </a-col>
        </a-row>
    </a-card>
</template>
<script>
import { getAction } from '@/api/manage'


    export default ({
        name:"LogisticsMap",
        data(){
            return{
                // 地圖的角度
                tilt:0,
                zoom:13,
                center:[114.2,22.3],
                markers:[],
                windowInfo:{
                    visible:false,position:[0,0]
                },
                queryParam: {
                    areaId:'',
                    type:''
                },
                url: {
                    list: "/outlets/logisticsOutlets/list",
                },

            }
        },
        methods:{
            //加載網點的數據
            loadData(){
                this.windowInfo.visible=false;
                //SELF_SERVICE_STATION
                // {areaId:39,type:'SELF_PICKUP_STATION'}
                var params = this.getQueryParams();//查詢條件
                params=Object.assign({},params,{pageSize:9999});
                getAction(this.url.list,params).then(res=>{
                    if(res.code=='200'){
                        let data=res.result;
                        let tempArray=[];
                        data.records.forEach((item,index) => {
                            tempArray.push(
                                {
                                    position:[item.longitude,item.latitude],
                                    visible:false,
                                    title:'網點信息',
                                    mTitle:item.storeName,
                                    content:'<div><p>門市名稱:'+item.storeName+'</p><p>地址:'+item.address+'</p>'+'<p>營業時間:'+item.storeOperationHr+'</p></div>',
                                    event:{
                                        click:(target)=>{this.showWindow(target,index)},
                                    }
                                }
                            )
                        });
                        this.markers=tempArray.slice(0);
                    }
                })
            },
            searchQuery() {
                this.loadData()
            },
            resetQuery(){
                this.queryParam=[];
                this.loadData()
            },
            getQueryParams(){
                console.log(this.queryParam)
                return Object.assign({},this.queryParam)
            },
            showWindow(e,index){
                this.windowInfo=Object.assign({},this.markers[index],{visible:true,});
                this.windowInfo.event={clickclose:()=>{this.closeWindow()},}
                console.log('info',this.windowInfo);
            },
            closeWindow(){
                this.windowInfo.visible=false;
                console.log('close',this.windowInfo);
            }
        },
        beforeMount(){

        },
        created(){
            this.loadData();
        },
        mounted(){
            
        }
        
    })
</script>
<style scoped>

</style>
