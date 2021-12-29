<template>
  <a-modal
    :title="title"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="關閉">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">

        <a-form-model-item :labelCol="labelCol"  :wrapperCol="wrapperCol" label="規則名稱" prop="ruleName" >
          <a-input placeholder="請輸入規則名稱" v-model="model.ruleName"/>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="規則Code" prop="ruleCode">
          <a-input placeholder="請輸入規則Code" v-model="model.ruleCode"/>
        </a-form-model-item>
        <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="規則描述" prop="ruleDescription">
          <a-textarea placeholder="請輸入規則描述" v-model="model.ruleDescription"/>
        </a-form-model-item>

      </a-form-model>
      <!-- 規則設計 -->
      <a-tabs v-model="tabs.activeKey">
        <a-tab-pane tab="局部規則" :key="tabs.design.key" forceRender>
          <a-alert type="info" showIcon message="局部規則按照你輸入的位數有序的校驗。"/>
          <j-editable-table ref="designTable" dragSort rowNumber  :maxHeight="240" :columns="tabs.design.columns" :dataSource="tabs.design.dataSource" style="margin-top: 8px;">

            <template #action="props">
              <my-action-button :rowEvent="props"/>
            </template>

          </j-editable-table>
        </a-tab-pane>

        <a-tab-pane tab="全局規則" :key="tabs.global.key" forceRender>
          <j-editable-table ref="globalTable" dragSort rowNumber actionButton :maxHeight="240" :columns="tabs.global.columns"  :dataSource="tabs.global.dataSource">

            <template #actionButtonAfter>
              <a-alert type="info" showIcon message="全局規則可校驗用戶輸入的所有字符；全局規則的優先級比局部規則的要高。" style="margin-bottom: 8px;"/>
            </template>

            <template #action="props">
              <my-action-button :rowEvent="props" allowEmpty/>
            </template>

          </j-editable-table>
        </a-tab-pane>
      </a-tabs>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction } from '@/api/manage'
  import { validateDuplicateValue, alwaysResolve, failedSymbol } from '@/utils/util'
  import { FormTypes } from '@/utils/JEditableTableUtil'
  import JEditableTable from '@comp/jeecg/JEditableTable'

  export default {
    name: 'SysCheckRuleModal',
    components: {
      JEditableTable,
      'my-action-button': {
        props: { rowEvent: Object, allowEmpty: Boolean },
        methods: {
          confirmIsShow() {
            const { index, allValues: { inputValues } } = this.rowEvent
            let value = inputValues[index]
            return value.digits || value.pattern
          },
          handleLineAdd() {
            const { target } = this.rowEvent
            target.add()
          },
          handleLineDelete() {
            const { rowId, target } = this.rowEvent
            target.removeRows(rowId)
          },
          renderDeleteButton() {
            if (this.allowEmpty || this.rowEvent.index > 0) {
              if (this.confirmIsShow()) {
                return (
                  <a-popconfirm title="確定要刪除嗎？" onConfirm={this.handleLineDelete}>
                    <a-button icon="minus"/>
                  </a-popconfirm>
                )
              } else {
                return (
                  <a-button icon="minus" onClick={this.handleLineDelete}/>
                )
              }
            }
            return ''
          },
        },
        render() {
          return (
            <div>
              <a-button onClick={this.handleLineAdd} icon="plus"/>
              &nbsp;
              {this.renderDeleteButton()}
            </div>
          )
        }
      }
    },
    data() {
      return {
        title: '操作',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
          ruleName: [{required: true, message: '請輸入規則名稱!'}],
          ruleCode: [
            {required: true, message: '請輸入規則Code!'},
            {validator: (rule, value, callback) => validateDuplicateValue('sys_check_rule', 'rule_code', value, this.model.id, callback)}
          ],
        },
        tabs: {
          activeKey: 'design',
          global: {
            key: 'global',
            columns: [
              {
                title: '優先級',
                key: 'priority',
                width: '15%',
                type: FormTypes.select,
                defaultValue: '1',
                options: [
                  { title: '優先運行', value: '1' },
                  { title: '最後運行', value: '0' },
                ],
                validateRules: []
              },
              {
                title: '規則（正則表達式）',
                key: 'pattern',
                width: '50%',
                type: FormTypes.input,
                validateRules: [
                  { required: true, message: '規則不能為空' },
                  { handler: this.validatePatternHandler },
                ]
              },
              {
                title: '提示文本',
                key: 'message',
                width: '20%',
                type: FormTypes.input,
                validateRules: [
                  { required: true, message: '${title}不能為空' },
                ]
              },
              {
                title: '操作',
                key: 'action',
                width: '15%',
                slotName: 'action',
                type: FormTypes.slot
              }
            ],
            dataSource: [],
          },
          design: {
            key: 'design',
            columns: [
              {
                title: '位數',
                key: 'digits',
                width: '15%',
                type: FormTypes.inputNumber,
                validateRules: [
                  { required: true, message: '${title}不能為空' },
                  { pattern: /^[1-9]\d*$/, message: '請輸入零以上的正整數' },
                ]
              },
              {
                title: '規則（正則表達式）',
                key: 'pattern',
                width: '50%',
                type: FormTypes.input,
                validateRules: [
                  { required: true, message: '規則不能為空' },
                  { handler: this.validatePatternHandler }
                ]
              },
              {
                title: '提示文本',
                key: 'message',
                width: '20%',
                type: FormTypes.input,
                validateRules: [
                  { required: true, message: '${title}不能為空' },
                ]
              },
              {
                title: '操作',
                key: 'action',
                width: '15%',
                slotName: 'action',
                type: FormTypes.slot
              },
            ],
            dataSource: [],
          }
        },
        url: {
          add: '/sys/checkRule/add',
          edit: '/sys/checkRule/edit',
        },
      }
    },
    created() {
    },
    methods: {

      validatePatternHandler(type, value, row, column, callback, target) {
        if (type === 'blur' || type === 'getValues') {
          try {
            new RegExp(value)
            callback(true)
          } catch (e) {
            callback(false, '請輸入正確的正則表達式')
          }
        } else {
          callback(true) // 不填寫或者填寫 null 代表不進行任何操作
        }
      },

      add() {
        this.edit({})
      },
      edit(record) {
        this.tabs.activeKey = this.tabs.design.key
        this.tabs.global.dataSource = []
        this.tabs.design.dataSource = [{ digits: '', pattern: '', message: '' }]
        this.visible = true
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.model = Object.assign({}, record)

          // 子表數據
          let ruleJson = this.model.ruleJson
          if (ruleJson) {
            let ruleList = JSON.parse(ruleJson)
            // 篩選出全局規則和局部規則
            let global = [], design = [], priority = '1'
            ruleList.forEach(rule => {
              if (rule.digits === '*') {
                global.push(Object.assign(rule, { priority }))
              } else {
                priority = '0'
                design.push(rule)
              }
            })
            this.tabs.global.dataSource = global
            this.tabs.design.dataSource = design
          }
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        Promise.all([
          // 主表單校驗
          alwaysResolve(new Promise((resolve, reject) => {
            this.$refs.form.validate((ok, err) => ok ? resolve(this.model) : reject(err))
          })),
          // 局部規則子表校驗
          alwaysResolve(this.$refs.designTable.getValuesPromise),
          // 全局規則子表校驗
          alwaysResolve(this.$refs.globalTable.getValuesPromise),
        ]).then(results => {
          let [mainResult, designResult, globalResult] = results

          if (mainResult.type === failedSymbol) {
            return Promise.reject('主表校驗未通過')
          } else if (designResult.type === failedSymbol) {
            this.tabs.activeKey = this.tabs.design.key
            return Promise.reject('局部規則子表校驗未通過')
          } else if (globalResult.type === failedSymbol) {
            this.tabs.activeKey = this.tabs.global.key
            return Promise.reject('全局規則子表校驗未通過')
          } else {
            // 所有校驗已通過，這一步是整合數據
            let mainValues = mainResult.data, globalValues = globalResult.data, designValues = designResult.data

            // 整合兩個子表的數據
            let firstGlobal = [], afterGlobal = []
            globalValues.forEach(v => {
              v.digits = '*'
              if (v.priority === '1') {
                firstGlobal.push(v)
              } else {
                afterGlobal.push(v)
              }
            })
            let concatValues = firstGlobal.concat(designValues).concat(afterGlobal)
            let subValues = concatValues.map(i => pick(i, 'digits', 'pattern', 'message'))

            // 生成 formData，用於傳入後台
            let ruleJson = JSON.stringify(subValues)
            let formData = Object.assign(this.model, mainValues, { ruleJson })

            // 判斷請求方式和請求地址，併發送請求
            let method = 'post', httpUrl = this.url.add
            if (this.model.id) {
              method = 'put'
              httpUrl = this.url.edit
            }
            this.confirmLoading = true
            return httpAction(httpUrl, formData, method)
          }
        }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.warning(res.message)
          }
        }).catch(e => {
          console.error(e)
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      handleCancel() {
        this.close()
      },

    }
  }
</script>

<style lang="less" scoped></style>