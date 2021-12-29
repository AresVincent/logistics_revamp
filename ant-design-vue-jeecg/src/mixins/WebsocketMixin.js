import store from '@/store/'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

export const WebsocketMixin = {
  mounted() {
    this.initWebSocket();
  },
  destroyed: function () {
    // 離開頁面生命周期函數
    this.websocketOnclose();
  },
  methods:{
    initWebSocket: function () {
      let token = Vue.ls.get(ACCESS_TOKEN)
      console.log("------------WebSocket連接成功");
      // WebSocket與普通的請求所用協議有所不同，ws等同於http，wss等同於https
      var userId = store.getters.userInfo.id;
      if(!this.socketUrl.startsWith('/')){
        this.socketUrl = '/' + this.socketUrl
      }
      if(!this.socketUrl.endsWith('/')){
        this.socketUrl = this.socketUrl + '/'
      }
      var url = window._CONFIG['domianURL'].replace("https://","wss://").replace("http://","ws://") + this.socketUrl + userId + "/" + token;
      this.websock = new WebSocket(url);
      this.websock.onopen = this.websocketOnopen;
      this.websock.onerror = this.websocketOnerror;
      this.websock.onmessage = this.websocketOnmessage;
      this.websock.onclose = this.websocketOnclose;
    },
    websocketOnopen: function () {
      console.log("WebSocket連接成功");
    },
    websocketOnerror: function (e) {
      console.log("WebSocket連接發生錯誤");
      this.reconnect();
    },
    websocketOnclose: function (e) {
      this.reconnect();
    },
    websocketSend(text) {
      // 數據發送
      try {
        this.websock.send(text);
      } catch (err) {
        console.log("send failed (" + err.code + ")");
      }
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
  }

}