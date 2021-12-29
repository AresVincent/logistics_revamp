<template>
  <a-tree-select
    allowClear
    labelInValue
    :getPopupContainer="(node) => node.parentNode"
    style="width: 100%"
    :disabled="disabled"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    :placeholder="placeholder"
    :loadData="asyncLoadTreeData"
    :value="treeValue"
    :treeData="treeData"
    :multiple="multiple"
    @change="onChange"
    @search="onSearch">
  </a-tree-select>
</template>
<script>

  /*
  * 異步樹加載組件 通過傳入表名 显示字段 存儲字段 加載一個樹控件
  * <j-tree-select dict="aa_tree_test,aad,id" pid-field="pid" ></j-tree-select>
  * */
  import { getAction } from '@/api/manage'

  export default {
    name: 'JTreeSelect',
    props: {
      value:{
        type: String,
        required: false
      },
      placeholder:{
        type: String,
        default: '請選擇',
        required: false
      },
      dict:{
        type: String,
        default: '',
        required: false
      },
      pidField:{
        type: String,
        default: 'pid',
        required: false
      },
      pidValue:{
        type: String,
        default: '',
        required: false
      },
      disabled:{
        type:Boolean,
        default:false,
        required:false
      },
      hasChildField:{
        type: String,
        default: '',
        required: false
      },
      condition:{
        type:String,
        default:'',
        required:false
      },
      // 是否支持多選
      multiple: {
        type: Boolean,
        default: false,
      },
      loadTriggleChange:{
        type: Boolean,
        default: false,
        required:false
      }
    },
    data () {
      return {
        treeValue: null,
        treeData:[],
        url:"/sys/dict/loadTreeData",
        view:'/sys/dict/loadDictItem/',
        tableName:"",
        text:"",
        code:"",

      }
    },
    watch: {
      value () {
        this.loadItemByCode()
      },
      dict(){
        this.initDictInfo()
        this.loadRoot();
      }
    },
    created(){
      this.validateProp().then(()=>{
        this.initDictInfo()
        this.loadRoot()
        this.loadItemByCode()
      })
    },
    methods: {
      loadItemByCode(){
        if(!this.value || this.value=="0"){
          this.treeValue = null
        }else{
          getAction(`${this.view}${this.dict}`,{key:this.value}).then(res=>{
            if(res.success){
              let values = this.value.split(',')
              this.treeValue = res.result.map((item, index) => ({
                key: values[index],
                value: values[index],
                label: item
              }))
              this.onLoadTriggleChange(res.result[0]);
            }
          })
        }
      },
      onLoadTriggleChange(text){
        //只有單選才會觸發
        if(!this.multiple && this.loadTriggleChange){
          this.$emit('change', this.value,text)
        }
      },
      initDictInfo(){
        let arr = this.dict.split(",")
        this.tableName = arr[0]
        this.text = arr[1]
        this.code = arr[2]
      },
      asyncLoadTreeData (treeNode) {
        return new Promise((resolve) => {
          if (treeNode.$vnode.children) {
            resolve()
            return
          }
          let pid = treeNode.$vnode.key
          let param = {
            pid:pid,
            tableName:this.tableName,
            text:this.text,
            code:this.code,
            pidField:this.pidField,
            hasChildField:this.hasChildField,
            condition:this.condition
          }
          getAction(this.url,param).then(res=>{
            if(res.success){
              for(let i of res.result){
                i.value = i.key
                if(i.leaf==false){
                  i.isLeaf=false
                }else if(i.leaf==true){
                  i.isLeaf=true
                }
              }
              this.addChildren(pid,res.result,this.treeData)
              this.treeData = [...this.treeData]
            }
            resolve()
          })
        })
      },
      addChildren(pid,children,treeArray){
        if(treeArray && treeArray.length>0){
          for(let item of treeArray){
            if(item.key == pid){
              if(!children || children.length==0){
                item.isLeaf=true
              }else{
                item.children = children
              }
              break
            }else{
              this.addChildren(pid,children,item.children)
            }
          }
        }
      },
      loadRoot(){
        let param = {
          pid:this.pidValue,
          tableName:this.tableName,
          text:this.text,
          code:this.code,
          pidField:this.pidField,
          hasChildField:this.hasChildField,
          condition:this.condition
        }
        getAction(this.url,param).then(res=>{
          if(res.success && res.result){
            for(let i of res.result){
              i.value = i.key
              if(i.leaf==false){
                i.isLeaf=false
              }else if(i.leaf==true){
                i.isLeaf=true
              }
            }
            this.treeData = [...res.result]
          }else{
            console.log("數根節點查詢結果-else",res)
          }
        })
      },
      onChange(value){
        if(!value){
          this.$emit('change', '');
          this.treeValue = null
        } else if (value instanceof Array) {
          this.$emit('change', value.map(item => item.value).join(','))
          this.treeValue = value
        } else {
          this.$emit('change', value.value,value.label)
          this.treeValue = value
        }

      },
      onSearch(value){
        console.log(value)
      },
      getCurrTreeData(){
        return this.treeData
      },
      validateProp(){
        let mycondition = this.condition
        return new Promise((resolve,reject)=>{
          if(!mycondition){
            resolve();
          }else{
            try {
              let test=JSON.parse(mycondition);
              if(typeof test == 'object' && test){
                resolve()
              }else{
                this.$message.error("組件JTreeSelect-condition傳值有誤，需要一個json字符串!")
                reject()
              }
            } catch(e) {
              this.$message.error("組件JTreeSelect-condition傳值有誤，需要一個json字符串!")
              reject()
            }
          }
        })
      }
    },
    //2.2新增 在組件內定義 指定父組件調用時候的傳值屬性和事件類型 這個牛逼
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>
