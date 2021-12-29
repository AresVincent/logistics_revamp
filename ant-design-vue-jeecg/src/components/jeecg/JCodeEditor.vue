<template>
  <div v-bind="fullScreenParentProps">
    <a-icon v-if="fullScreen" class="full-screen-icon" :type="iconType" @click="()=>fullCoder=!fullCoder"/>

    <div class="code-editor-cust full-screen-child">
      <textarea ref="textarea"></textarea>
      <span @click="nullTipClick" class="null-tip" :class="{'null-tip-hidden':hasCode}" :style="nullTipStyle">{{ placeholderShow }}</span>
      <template v-if="languageChange">
        <a-select v-model="mode" size="small" class="code-mode-select" @change="changeMode" placeholder="請選擇主題">
          <a-select-option
            v-for="mode in modes"
            :key="mode.value"
            :value="mode.value">
            {{ mode.label }}
          </a-select-option>
        </a-select>
      </template>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 引入全局實例
  import _CodeMirror from 'codemirror'

  // 核心樣式
  import 'codemirror/lib/codemirror.css'
  // 引入主題后還需要在 options 中指定主題才會生效 darcula  gruvbox-dark hopscotch  monokai
  import 'codemirror/theme/panda-syntax.css'
  //提示css
  import "codemirror/addon/hint/show-hint.css";

  // 需要引入具體的語法高亮庫才會有對應的語法高亮效果
  // codemirror 官方其實支持通過 /addon/mode/loadmode.js 和 /mode/meta.js 來實現動態加載對應語法高亮庫
  // 但 vue 貌似沒有無法在實例初始化后再動態加載對應 JS ，所以此處才把對應的 JS 提前引入
  import 'codemirror/mode/javascript/javascript.js'
  import 'codemirror/mode/css/css.js'
  import 'codemirror/mode/xml/xml.js'
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/markdown/markdown.js'
  import 'codemirror/mode/python/python.js'
  import 'codemirror/mode/r/r.js'
  import 'codemirror/mode/shell/shell.js'
  import 'codemirror/mode/sql/sql.js'
  import 'codemirror/mode/swift/swift.js'
  import 'codemirror/mode/vue/vue.js'

  import { isIE11, isIE } from '@/utils/browser'

  // 嘗試獲取全局實例
  const CodeMirror = window.CodeMirror || _CodeMirror

  export default {
    name: 'JCodeEditor',
    props: {
      // 外部傳入的內容，用於實現雙向綁定
      value: {
        type: String,
        default: ''
      },
      // 外部傳入的語法類型
      language: {
        type: String,
        default: null
      },
     languageChange:{
       type: Boolean,
       default:false,
       required:false
     },
      placeholder: {
        type: String,
        default: null
      },
      // 显示行號
      lineNumbers: {
        type: Boolean,
        default: true
      },
      // 是否显示全屏按鈕
      fullScreen: {
        type: Boolean,
        default: false
      },
      // 全屏以後的z-index
      zIndex: {
        type: [Number, String],
        default: 999
      },
      // 是否自適應高度，可以傳String或Boolean
      // 傳 String 類型只能寫"!ie" ，
      // 填寫這個字符串，代表其他瀏覽器自適應高度
      // 唯獨IE下不自適應高度，因為IE下不支持min、max-height樣式
      // 如果填寫的不是"!ie"就視為true
      autoHeight: {
        type: [String, Boolean],
        default: true
      },
      // 不自適應高度的情況下生效的固定高度
      height: {
        type: [String, Number],
        default: '240px'
      },
    },
    data () {
      return {
        // 內部真實的內容
        code: '',
        iconType: 'fullscreen',
        hasCode:false,
        // 默認的語法類型
        mode: 'javascript',
        // 編輯器實例
        coder: null,
        // 默認配置
        options: {
          // 縮進格式
          tabSize: 2,
          // 主題，對應主題庫 JS 需要提前引入
          theme: 'panda-syntax',
          line: true,
         // extraKeys: {'Ctrl': 'autocomplete'},//自定義快捷鍵
          hintOptions: {
            tables: {
              users: ['name', 'score', 'birthDate'],
              countries: ['name', 'population', 'size']
            }
          },
        },
        // 支持切換的語法高亮類型，對應 JS 已經提前引入
        // 使用的是 MIME-TYPE ，不過作為前綴的 text/ 在後面指定時寫死了
        modes: [{
          value: 'css',
          label: 'CSS'
        }, {
          value: 'javascript',
          label: 'Javascript'
        }, {
          value: 'html',
          label: 'XML/HTML'
        }, {
          value: 'x-java',
          label: 'Java'
        }, {
          value: 'x-objectivec',
          label: 'Objective-C'
        }, {
          value: 'x-python',
          label: 'Python'
        }, {
          value: 'x-rsrc',
          label: 'R'
        }, {
          value: 'x-sh',
          label: 'Shell'
        }, {
          value: 'x-sql',
          label: 'SQL'
        }, {
          value: 'x-swift',
          label: 'Swift'
        }, {
          value: 'x-vue',
          label: 'Vue'
        }, {
          value: 'markdown',
          label: 'Markdown'
        }],
        // code 編輯器 是否全屏
        fullCoder: false
      }
    },
    watch: {
      fullCoder:{
        handler(value) {
          if(value){
            this.iconType="fullscreen-exit"
          }else{
            this.iconType="fullscreen"
          }
        }
      },
      // value: {
      //   immediate: false,
      //   handler(value) {
      //     this._getCoder().then(() => {
      //       this.coder.setValue(value)
      //     })
      //   }
      // },
      language: {
        immediate: true,
        handler(language) {
          this._getCoder().then(() => {
            // 嘗試從父容器獲取語法類型
            if (language) {
              // 獲取具體的語法類型對象
              let modeObj = this._getLanguage(language)

              // 判斷父容器傳入的語法是否被支持
              if (modeObj) {
                this.mode = modeObj.label
                this.coder.setOption('mode', `text/${modeObj.value}`)
              }
            }
          })
        }
      }
    },
    computed: {
      placeholderShow() {
        if (this.placeholder == null) {
          return `請在此輸入${this.language}代碼`
        } else {
          return this.placeholder
        }
      },
      nullTipStyle(){
        if (this.lineNumbers) {
          return { left: '36px' }
        } else {
          return { left: '12px' }
        }
      },
      // coder 配置
      coderOptions() {
        return {
          tabSize: this.options.tabSize,
          theme: this.options.theme,
          lineNumbers: this.lineNumbers,
          line: true,
          hintOptions: this.options.hintOptions
        }
      },
      isAutoHeight() {
        let {autoHeight} = this
        if (typeof autoHeight === 'string' && autoHeight.toLowerCase().trim() === '!ie') {
          autoHeight = !(isIE() || isIE11())
        } else {
          autoHeight = true
        }
        return autoHeight
      },
      fullScreenParentProps() {
        let props = {
          class: {
            'full-screen-parent': true,
            'full-screen': this.fullCoder,
            'auto-height': this.isAutoHeight
          },
          style: {}
        }
        if(isIE() || isIE11()){
          props.style['height'] = '240px'
        }
        if (this.fullCoder) {
          props.style['z-index'] = this.zIndex
        }
        if (!this.isAutoHeight) {
          props.style['height'] = (typeof this.height === 'number' ? this.height + 'px' : this.height)
        }
        return props
      }
    },
    mounted () {
      // 初始化
      this._initialize()
    },
    methods: {
      // 初始化
      _initialize () {
        // 初始化編輯器實例，傳入需要被實例化的文本域對象和默認配置
        this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.coderOptions)
        // 編輯器賦值
        if(this.value||this.code){
          this.hasCode=true
          //this.coder.setValue(this.value || this.code)
          this.setCodeContent(this.value || this.code)
        }else{
          this.coder.setValue('')
          this.hasCode=false
        }
        // 支持雙向綁定
        this.coder.on('change', (coder) => {
          this.code = coder.getValue()
          if(this.code){
            this.hasCode=true
          }else{
            this.hasCode=false
          }
          if (this.$emit) {
            this.$emit('input', this.code)
          }
        })
        this.coder.on('focus', () => {
          this.hasCode=true
        })
        this.coder.on('blur', () => {
          if(this.code){
            this.hasCode=true
          }else{
            this.hasCode=false
          }
        })

       /* this.coder.on('cursorActivity',()=>{
          this.coder.showHint()
        })*/

      },
      getCodeContent(){
        return this.code
      },
      setCodeContent(val){
        setTimeout(()=>{
          if(!val){
            this.coder.setValue('')
          }else{
            this.coder.setValue(val)
          }
        },300)
      },
      // 獲取當前語法類型
      _getLanguage (language) {
        // 在支持的語法類型列表中尋找傳入的語法類型
        return this.modes.find((mode) => {
          // 所有的值都忽略大小寫，方便比較
          let currentLanguage = language.toLowerCase()
          let currentLabel = mode.label.toLowerCase()
          let currentValue = mode.value.toLowerCase()

          // 由於真實值可能不規範，例如 java 的真實值是 x-java ，所以講 value 和 label 同時和傳入語法進行比較
          return currentLabel === currentLanguage || currentValue === currentLanguage
        })
      },
      _getCoder() {
        let _this = this
        return new Promise((resolve) => {
          (function get() {
            if (_this.coder) {
              resolve(_this.coder)
            } else {
              setTimeout(get, 10)
            }
          })()
        })
      },
      // 更改模式
      changeMode (val) {
        // 修改編輯器的語法配置
        this.coder.setOption('mode', `text/${val}`)

        // 獲取修改后的語法
        let label = this._getLanguage(val).label.toLowerCase()

        // 允許父容器通過以下函數監聽當前的語法值
        this.$emit('language-change', label)
      },
      nullTipClick(){
        this.coder.focus()
      }
    }
  }
</script>

<style lang="less">
  .code-editor-cust{
    flex-grow:1;
    display:flex;
    position:relative;
    height:100%;
    .CodeMirror{
      flex-grow:1;
      z-index:1;
      .CodeMirror-code{
        line-height:19px;
      }

    }
    .code-mode-select{
      position:absolute;
      z-index:2;
      right:10px;
      top:10px;
      max-width:130px;
    }
    .CodeMirror{
      height: auto;
      min-height:100%;
    }
    .null-tip{
      position: absolute;
      top: 4px;
      left: 36px;
      z-index: 10;
      color: #ffffffc9;
      line-height: initial;
    }
    .null-tip-hidden{
      display: none;
    }
    /**選中樣式偶然出現高度不夠的情況*/
    .CodeMirror-selected{
      min-height: 19px !important;
    }
  }

  /* 全屏樣式 */
  .full-screen-parent {
    position: relative;

    .full-screen-icon {
      opacity: 0;
      color: black;
      width: 20px;
      height: 20px;
      line-height: 24px;
      background-color: white;
      position: absolute;
      top: 2px;
      right: 2px;
      z-index: 9;
      cursor: pointer;
      transition: opacity 0.3s;
    }

    &:hover {
      .full-screen-icon {
        opacity: 1;

        &:hover {
          background-color: rgba(255, 255, 255, 0.88);
        }
      }
    }

    &.full-screen {
      position: fixed;
      top: 10px;
      left: 10px;
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      padding: 10px;
      background-color: #f5f5f5;

      .full-screen-icon {
        top: 12px;
        right: 12px;
      }

      .full-screen-child {
        height: 100%;
        max-height: 100%;
        min-height: 100%;
      }
    }

    .full-screen-child {
      height: 100%;
    }

    &.auto-height {
      .full-screen-child {
        min-height: 120px;
        max-height: 320px;
        height: unset;
        overflow: hidden;
      }

      &.full-screen .full-screen-child {
        height: 100%;
        max-height: 100%;
        min-height: 100%;
      }
    }

  }

.CodeMirror-cursor{
  height:18.4px !important;
}
</style>