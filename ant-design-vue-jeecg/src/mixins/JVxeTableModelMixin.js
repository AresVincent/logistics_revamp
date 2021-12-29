import { VALIDATE_FAILED, getRefPromise, validateFormAndTables,validateFormModelAndTables} from '@/components/jeecg/JVxeTable/utils/vxeUtils.js'
import { httpAction, getAction } from '@/api/manage'

export const JVxeTableModelMixin = {
  data() {
    return {
      title: '操作',
      visible: false,
      confirmLoading: false,
      scrolling: true,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
  },
  methods: {

    /** 獲取所有的JVxeTable實例 */
    getAllTable() {
      if (!(this.refKeys instanceof Array)) {
        throw this.throwNotArray('refKeys')
      }
      let values = this.refKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },

    /** 遍歷所有的JVxeTable實例 */
    eachAllTable(callback) {
      // 開始遍歷
      this.getAllTable().then(tables => {
        console.log("tables",tables)
        tables.forEach((item, index) => {
          if (typeof callback === 'function') {
            callback(item, index)
          }
        })
      })
    },

    /** 當點擊新增按鈕時調用此方法 */
    add() {
      if (typeof this.addBefore === 'function') this.addBefore()
      // 默認新增空數據
      let rowNum = this.addDefaultRowNum
      if (typeof rowNum !== 'number') {
        rowNum = 1
        console.warn('由於你沒有在 data 中定義 addDefaultRowNum 或 addDefaultRowNum 不是数字，所以默認添加一條空數據，如果不想默認添加空數據，請將定義 addDefaultRowNum 為 0')
      }
      this.eachAllTable((item) => {
        //update-begin-author:taoyan date:20210315 for: 一對多jvex 默認幾行不好使了 LOWCOD-1349
        setTimeout(()=>{
          item.addRows()
        }, 30)
        //update-end-author:taoyan date:20210315 for: 一對多jvex 默認幾行不好使了 LOWCOD-1349
      })
      if (typeof this.addAfter === 'function') this.addAfter(this.model)
      this.edit(this.model)
    },
    /** 當點擊了編輯（修改）按鈕時調用此方法 */
    edit(record) {
      if (typeof this.editBefore === 'function') this.editBefore(record)
      this.visible = true
      this.activeKey = this.refKeys[0]
      this.$refs.form.resetFields()
      this.model = Object.assign({}, record)
      if (typeof this.editAfter === 'function') this.editAfter(this.model)
    },
    /** 關閉彈窗，並將所有JVxeTable實例回歸到初始狀態 */
    close() {
      this.visible = false
      this.eachAllTable((item) => {
        item._remove()
      })
      this.$emit('close')
    },

    /** 查詢某個tab的數據 */
    requestSubTableData(url, params, tab, success) {
      tab.loading = true
      getAction(url, params).then(res => {
        let { result } = res
        let dataSource = []
        if (result) {
          if (Array.isArray(result)) {
            dataSource = result
          } else if (Array.isArray(result.records)) {
            dataSource = result.records
          }
        }
        tab.dataSource = dataSource
        typeof success === 'function' ? success(res) : ''
      }).finally(() => {
        tab.loading = false
      })
    },
    /** 發起請求，自動判斷是執行新增還是修改操作 */
    request(formData) {
      let url = this.url.add, method = 'post'
      if (this.model.id) {
        url = this.url.edit
        method = 'put'
      }
      this.confirmLoading = true
      console.log("formData===>",formData);
      httpAction(url, formData, method).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },

    /* --- handle 事件 --- */

    /** ATab 選項卡切換事件 */
    handleChangeTabs(key) {
      // 自動重置scrollTop狀態，防止出現白屏
      getRefPromise(this, key).then(vxeTable => {
        vxeTable.resetScrollTop()
      })
    },
    /** 關閉按鈕點擊事件 */
    handleCancel() {
      this.close()
    },
    /** 確定按鈕點擊事件 */
    handleOk() {
      /** 觸發表單驗證 */
      this.getAllTable().then(tables => {
        /** 一次性驗證主表和所有的次表 */
        return validateFormModelAndTables(this.$refs.form,this.model, tables)
      }).then(allValues => {
        /** 一次性驗證一對一的所有子表 */
        return this.validateSubForm(allValues)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)
        // 發起請求
        return this.request(formData)
      }).catch(e => {
        if (e.error === VALIDATE_FAILED) {
          // 如果有未通過表單驗證的子表，就自動跳轉到它所在的tab
          this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
        } else {
          console.error(e)
        }
      })
    },
//校驗所有子表表單
    validateSubForm(allValues){
      return new Promise((resolve) => {
        resolve(allValues)
      })
    },
    /* --- throw --- */

    /** not a function */
    throwNotFunction(name) {
      return `${name} 未定義或不是一個函數`
    },

    /** not a array */
    throwNotArray(name) {
      return `${name} 未定義或不是一個數組`
    }

  }
}