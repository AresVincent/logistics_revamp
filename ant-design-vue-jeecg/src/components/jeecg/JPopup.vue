<template>
  <div class="components-input-demo-presuffix" v-if="avalid">
    <!---->
    <a-input @click="openModal" :placeholder="placeholder" v-model="showText" readOnly :disabled="disabled">
      <a-icon slot="prefix" type="cluster" :title="title"/>
      <a-icon v-if="showText" slot="suffix" type="close-circle" @click="handleEmpty" title="清空"/>
    </a-input>

    <j-popup-onl-report
      ref="jPopupOnlReport"
      :code="code"
      :multi="multi"
      :sorter="sorter"
      :groupId="uniqGroupId"
      :param="param"
      @ok="callBack"
    />

  </div>
</template>

<script>
  import JPopupOnlReport from './modal/JPopupOnlReport'

  export default {
    name: 'JPopup',
    components: {
      JPopupOnlReport
    },
    props: {
      code: {
        type: String,
        default: '',
        required: false
      },
      field: {
        type: String,
        default: '',
        required: false
      },
      orgFields: {
        type: String,
        default: '',
        required: false
      },
      destFields: {
        type: String,
        default: '',
        required: false
      },
      /** 排序列，指定要排序的列，使用方式：列名=desc|asc */
      sorter: {
        type: String,
        default: ''
      },
      width: {
        type: Number,
        default: 1200,
        required: false
      },
      placeholder: {
        type: String,
        default: '請選擇',
        required: false
      },
      value: {
        type: String,
        required: false
      },
      triggerChange: {
        type: Boolean,
        required: false,
        default: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      multi: {
        type: Boolean,
        required: false,
        default: false
      },
      //popup動態參數 支持系統變量語法
      param:{
        type: Object,
        required: false,
        default: ()=>{}
      },
      spliter:{
        type: String,
        required: false,
        default: ','
      },
      /** 分組ID，用於將多個popup的請求合併到一起，不傳不分組 */
      groupId: String

    },
    data() {
      return {
        showText: '',
        title: '',
        avalid: true
      }
    },
    computed: {
      uniqGroupId() {
        if (this.groupId) {
          let { groupId, code, field, orgFields, destFields } = this
          return `${groupId}_${code}_${field}_${orgFields}_${destFields}`
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler: function(val) {
          if (!val) {
            this.showText = ''
          } else {
            this.showText = val.split(this.spliter).join(',')
          }
        }
      }
    },
    created() {
    },
    mounted() {
      if (!this.orgFields || !this.destFields || !this.code) {
        this.$message.error('popup參數未正確配置!')
        this.avalid = false
      }
      if (this.destFields.split(',').length != this.orgFields.split(',').length) {
        this.$message.error('popup參數未正確配置,原始值和目標值數量不一致!')
        this.avalid = false
      }
    },
    methods: {
      openModal() {
        if (this.disabled === false) {
          this.$refs.jPopupOnlReport.show()
        }
      },
      handleEmpty() {
        this.showText = ''
        let destFieldsArr = this.destFields.split(',')
        if (destFieldsArr.length === 0) {
          return
        }
        let res = {}
        for (let i = 0; i < destFieldsArr.length; i++) {
          res[destFieldsArr[i]] = ''
        }
        if (this.triggerChange) {
          this.$emit('callback', res)
        } else {
          this.$emit('input', '', res)
        }
      },
      callBack(rows) {
        // update--begin--autor:lvdandan-----date:20200630------for：多選時未帶回多個值------
        let orgFieldsArr = this.orgFields.split(',')
        let destFieldsArr = this.destFields.split(',')
        let resetText = false
        if (this.field && this.field.length > 0) {
          this.showText = ''
          resetText = true
        }
        let res = {}
        if (orgFieldsArr.length > 0) {
          for (let i = 0; i < orgFieldsArr.length; i++) {
            let tempDestArr = []
            for(let rw of rows){
              let val = rw[orgFieldsArr[i]]
              // update--begin--autor:liusq-----date:20210713------for：處理val等於0的情況issues/I3ZL4T------
              if(typeof val=='undefined'|| val==null || val.toString()==""){
                val = ""
              }
              // update--end--autor:liusq-----date:20210713------for：處理val等於0的情況issues/I3ZL4T------
              tempDestArr.push(val)
            }
            res[destFieldsArr[i]] = tempDestArr.join(",")
          }
          if (resetText === true) {
            let tempText = []
            for(let rw of rows){
              let val = rw[orgFieldsArr[destFieldsArr.indexOf(this.field)]]
              if(!val){
                val = ""
              }
              tempText.push(val)
            }
            this.showText = tempText.join(",")
          }
          // update--end--autor:lvdandan-----date:20200630------for：多選時未帶回多個值------
        }
        if (this.triggerChange) {
          //v-dec時即triggerChange為true時 將整個對象給form頁面 讓他自己setFieldsValue
          this.$emit('callback', res)
        } else {
          //v-model時 需要傳一個參數field 表示當前這個字段 從而根據這個字段的順序找到原始值
          // this.$emit("input",row[orgFieldsArr[destFieldsArr.indexOf(this.field)]])
          let str = ''
          if(this.showText){
            str = this.showText.split(',').join(this.spliter)
          }
          this.$emit('input', str, res)
        }
      }
    }
  }
</script>
<style scoped>
  .components-input-demo-presuffix .anticon-close-circle {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
    font-size: 12px;
  }

  .components-input-demo-presuffix .anticon-close-circle:hover {
    color: #f5222d;
  }

  .components-input-demo-presuffix .anticon-close-circle:active {
    color: #666;
  }
</style>