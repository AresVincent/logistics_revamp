<template>
  <a-popover
    trigger="click"
    placement="bottomRight"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-wrapper"
    @visibleChange="handleHoverChange"
    :overlayStyle="{ width: '300px', top: '50px' }">
    <template slot="content">
      <a-spin :spinning="loadding">
        <a-tabs>
          <a-tab-pane :tab="msg1Title" key="1">
            <!--<a-list>
              <a-list-item>
                <a-list-item-meta title="你收到了 14 份新周報" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="你推薦的 IT大牛 已通過第三輪面試" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="這種模板可以區分多種通知類型" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>-->
            <a-list>
              <a-list-item :key="index" v-for="(record, index) in announcement1">
                <div style="margin-left: 5%;width: 80%">
                  <p><a @click="showAnnouncement(record)">{{ record.titile }}</a></p>
                  <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }} 發布</p>
                </div>
                <div style="text-align: right">
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'" color="blue">一般消息</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'" color="orange">重要消息</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'" color="red">緊急消息</a-tag>
                </div>
              </a-list-item>
              <div style="margin-top: 5px;text-align: center">
                <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
              </div>
            </a-list>
          </a-tab-pane>
          <a-tab-pane :tab="msg2Title" key="2">
            <a-list>
              <a-list-item :key="index" v-for="(record, index) in announcement2">
                <div style="margin-left: 5%;width: 80%">
                  <p><a @click="showAnnouncement(record)">{{ record.titile }}</a></p>
                  <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }} 發布</p>
                </div>
                <div style="text-align: right">
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'" color="blue">一般消息</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'" color="orange">重要消息</a-tag>
                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'" color="red">緊急消息</a-tag>
                </div>
              </a-list-item>
              <div style="margin-top: 5px;text-align: center">
                <a-button @click="toMyAnnouncement()" type="dashed" block>查看更多</a-button>
              </div>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice">
      <a-badge :count="msgTotal">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
    <show-announcement ref="ShowAnnouncement" @ok="modalFormOk"></show-announcement>
    <dynamic-notice ref="showDynamNotice" :path="openPath" :formData="formData"/>
  </a-popover>
</template>

<script>
  import { getAction,putAction } from '@/api/manage'
  import ShowAnnouncement from './ShowAnnouncement'
  import store from '@/store/'
  import DynamicNotice from './DynamicNotice'
  import { message,Icon } from 'ant-design-vue'


  export default {
    name: "HeaderNotice",
    components: {
      DynamicNotice,
      ShowAnnouncement,
    },
    data () {
      return {
        loadding: false,
        url:{
          listCementByUser:"/sys/annountCement/listByUser",
          editCementSend:"/sys/sysAnnouncementSend/editByAnntIdAndUserId",
          queryById:"/sys/annountCement/queryById",
        },
        hovered: false,
        announcement1:[],
        announcement2:[],
        msg1Count:"0",
        msg2Count:"0",
        msg1Title:"通知(0)",
        msg2Title:"",
        stopTimer:false,
        websock: null,
        lockReconnect:false,
        heartCheck:null,
        formData:{},
        openPath:''
      }
    },
    computed:{
      msgTotal () {
        return parseInt(this.msg1Count)+parseInt(this.msg2Count);
      }
    },
    mounted() {
      this.loadData();
      //this.timerFun();
      this.initWebSocket();
     // this.heartCheckFun();
    },
    destroyed: function () { // 離開頁面生命周期函數
      this.websocketOnclose();
    },
    methods: {
      timerFun() {
        this.stopTimer = false;
        let myTimer = setInterval(()=>{
          // 停止定時器
          if (this.stopTimer == true) {
            clearInterval(myTimer);
            return;
          }
          this.loadData()
        },6000)
      },
      testLoad(data){
          var time =0;
          this.$notification.open({
            message:data.msgTitle,
            duration:time,
            description: data.msgTxt,
          });      
        },
      loadData (){
        try {
          // 獲取系統消息
          getAction(this.url.listCementByUser).then((res) => {
            if (res.success) {
              this.announcement1 = res.result.anntMsgList;
              this.msg1Count = res.result.anntMsgTotal;
              this.msg1Title = "通知(" + res.result.anntMsgTotal + ")";
              this.announcement2 = res.result.sysMsgList;
              this.msg2Count = res.result.sysMsgTotal;
              this.msg2Title = "系統消息(" + res.result.sysMsgTotal + ")";
            }
          }).catch(error => {
            console.log("系統消息通知異常",error);//這行打印permissionName is undefined
            this.stopTimer = true;
            console.log("清理timer");
          });
        } catch (err) {
          this.stopTimer = true;
          console.log("通知異常",err);
        }
      },
      fetchNotice () {
        if (this.loadding) {
          this.loadding = false
          return
        }
        this.loadding = true
        setTimeout(() => {
          this.loadding = false
        }, 200)
      },
      showAnnouncement(record){
        putAction(this.url.editCementSend,{anntId:record.id}).then((res)=>{
          if(res.success){
            this.loadData();
          }
        });
        this.hovered = false;
        if(record.openType==='component'){
          this.openPath = record.openPage;
          this.formData = {id:record.busId};
          this.$refs.showDynamNotice.detail(record.openPage);
        }else{
          this.$refs.ShowAnnouncement.detail(record);
        }
      },
      toMyAnnouncement(){
        this.$router.push({
          path: '/isps/userAnnouncement'
        });
      },
      modalFormOk(){
      },
      handleHoverChange (visible) {
        this.hovered = visible;
      },

      initWebSocket: function () {
        // WebSocket與普通的請求所用協議有所不同，ws等同於http，wss等同於https
        var userId = store.getters.userInfo.id;
        var url = window._CONFIG['domianURL'].replace("https://","wss://").replace("http://","ws://")+"/websocket/"+userId;
        //console.log(url);
        this.websock = new WebSocket(url);
        this.websock.onopen = this.websocketOnopen;
        this.websock.onerror = this.websocketOnerror;
        this.websock.onmessage = this.websocketOnmessage;
        this.websock.onclose = this.websocketOnclose;
      },
      websocketOnopen: function () {
        console.log("WebSocket連接成功");
        //心跳檢測重置
        //this.heartCheck.reset().start();
      },
      websocketOnerror: function (e) {
        console.log("WebSocket連接發生錯誤");
        this.reconnect();
      },
      websocketOnmessage: function (e) {
        console.log("-----接收消息-------",e.data);
        var data = eval("(" + e.data + ")"); //解析對象
        if(data.cmd=='alert'){
          this.testLoad(data);
        }
        if(data.cmd == "topic"){
            //系統通知
          this.loadData();
        }else if(data.cmd == "user"){
            //用戶消息
          this.loadData();
        }
        //心跳檢測重置
        //this.heartCheck.reset().start();
      },
      websocketOnclose: function (e) {
        console.log("connection closed (" + e + ")");
        if(e){
          console.log("connection closed (" + e.code + ")");
        }
        this.reconnect();
      },
      websocketSend(text) { // 數據發送
        try {
          this.websock.send(text);
        } catch (err) {
          console.log("send failed (" + err.code + ")");
        }
      },

      openNotification (data) {
        var text = data.msgTxt;
        const key = `open${Date.now()}`;
        this.$notification.open({
          message: '消息提醒',
          placement:'bottomRight',
          description: text,
          key,
          btn: (h)=>{
            return h('a-button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => this.showDetail(key,data)
              }
            }, '查看詳情')
          },
        });
      },

      reconnect() {
        var that = this;
        if(that.lockReconnect) return;
        that.lockReconnect = true;
        //沒連接上會一直重連，設置延遲避免請求過多
        setTimeout(function () {
          console.info("嘗試重連...");
          that.initWebSocket();
          that.lockReconnect = false;
        }, 5000);
      },
      heartCheckFun(){
        var that = this;
        //心跳檢測,每20s心跳一次
        that.heartCheck = {
          timeout: 20000,
          timeoutObj: null,
          serverTimeoutObj: null,
          reset: function(){
            clearTimeout(this.timeoutObj);
            //clearTimeout(this.serverTimeoutObj);
            return this;
          },
          start: function(){
            var self = this;
            this.timeoutObj = setTimeout(function(){
              //這裏發送一個心跳，後端收到后，返回一個心跳消息，
              //onmessage拿到返回的心跳就說明連接正常
              that.websocketSend("HeartBeat");
              console.info("客戶端發送心跳");
              //self.serverTimeoutObj = setTimeout(function(){//如果超過一定時間還沒重置，說明後端主動斷開了
              //  that.websock.close();//如果onclose會執行reconnect，我們執行ws.close()就行了.如果直接執行reconnect 會觸發onclose導致重連兩次
              //}, self.timeout)
            }, this.timeout)
          }
        }
      },


      showDetail(key,data){
        this.$notification.close(key);
        var id = data.msgId;
        getAction(this.url.queryById,{id:id}).then((res) => {
          if (res.success) {
            var record = res.result;
            this.showAnnouncement(record);
          }
        })

      },
    }
  }
</script>

<style lang="css">
  .header-notice-wrapper {
    top: 50px !important;
  }
</style>
<style lang="less" scoped>
  .header-notice{
    display: inline-block;
    transition: all 0.3s;

    span {
      vertical-align: initial;
    }
  }
</style>