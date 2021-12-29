<template>
  <a-card title="樹形結構圖片翻頁查看" style="min-width: 800px;overflow-x:auto ">
    <a-row>
      <!-- 左側文件樹 -->
      <a-col :span="5">
        <a-tree
          showLine
          :treeData="treeData"
          :expandedKeys="[expandedKeys[0]]"
          :selectedKeys="selectedKeys"
          :style="{'height':'500px','border-right':'2px solid #c1c1c1','overflow-y':'auto'}"
          @expand="onExpand"
          @select="this.onSelect"
        >
        </a-tree>
      </a-col>

      <!--右側縮略圖-->
      <a-col :span="19">
        <a-row style="margin-top: 10px">
          <a-col :span="24" style="padding-left: 2%;margin-bottom: 10px">
            <a-button @click="prev" type="primary"><a-icon type="left" />上一頁</a-button>
            <a-button @click="next" type="primary" style="margin-left: 8px">下一頁<a-icon type="right" /></a-button>
            <span style="margin-left: 15%;font-weight: bolder">{{ navName }}</span>
          </a-col>
          <a-col :span="24" style="padding-left: 2%;">
            <img :src="imgUrl" preview>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
  import draggable from 'vuedraggable'

  export default {
    name: 'ImgTurnPage',
    components:{
      draggable
    },
    data() {
      return {
        description: '圖片翻頁',
        //數據集
        treeData: [{
          title: '第一頁',
          key: '0-0',
          children: [{
            title: '1頁',
            key: '0-0-0',
            imgUrl:'https://static.jeecg.com/upload/test/1_1588149743473.jpg'
          }, {
            title: '2頁',
            key: '0-0-1',
            imgUrl:'https://static.jeecg.com/upload/test/u27356337152749454924fm27gp0_1588149731821.jpg'
          }]
        },{
          title: '第二頁',
          key: '0-1',
          children: [{
            title: '1頁',
            key: '0-1-0',
            imgUrl:'https://static.jeecg.com/upload/test/u24454681402491956848fm27gp0_1588149712663.jpg'
          }, {
            title: '2頁',
            key: '0-1-1',
            imgUrl:'https://static.jeecg.com/upload/test/u8891206113801177793fm27gp0_1588149704459.jpg'
          }]
        },{
          title: '第三頁',
          key: '0-2',
          children: [{
            title: '1頁',
            key: '0-2-0',
            imgUrl:'https://static.jeecg.com/upload/test/1374962_1587621329085.jpg'
          }]
        }],
        selectedKeys:[],
        expandedKeys:[],
        sort:0,
        imgUrl:'',
        navName:'',
        imgList:[],
      }
    },
    created(){
      this.getImgList();
    },
    methods: {
      getImgList(){
        var count = 0;
        for(var i=0;i<this.treeData.length;i++){
          for(var j=0;j<this.treeData[i].children.length;j++){
            this.imgList.push({key:this.treeData[i].children[j].key,pkey:this.treeData[i].key,sort:count++,
              imgUrl:this.treeData[i].children[j].imgUrl,navName:this.treeData[i].title+"/"+this.treeData[i].children[j].title})
          }
        }
        this.setValue(this.imgList[this.sort]);
      },
      onSelect (selectedKeys, info) {
        for(var i=0;i<this.imgList.length;i++){
          if(this.imgList[i].key === selectedKeys[0]){
            this.sort = this.imgList[i].sort;
            this.setValue(this.imgList[i]);
            break;
          }
        }
      },
      onExpand (expandedKeys) {
        this.expandedKeys = [];
        if(expandedKeys !== null && expandedKeys !== ''){
          this.expandedKeys[0] = expandedKeys[1];
        }
      },
      prev(){
        if(this.sort === 0){
          this.sort = this.imgList.length-1;
        }else{
          this.sort = this.sort - 1;
        }
        this.setValue(this.imgList[this.sort]);
      },
      next(){
        if(this.sort === this.imgList.length-1){
          this.sort = 0;
        }else{
          this.sort = this.sort + 1;
        }
        this.setValue(this.imgList[this.sort]);
      },
      // 設置受控節點值
      setValue(value){
        this.selectedKeys = [];
        this.imgUrl = value.imgUrl;
        this.selectedKeys[0] = value.key;
        this.expandedKeys[0] = value.pkey;
        this.navName = value.navName;
      }
    }
  }
</script>

<style scoped>

</style>