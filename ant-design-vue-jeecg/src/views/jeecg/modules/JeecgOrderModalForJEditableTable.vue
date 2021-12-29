<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel">

    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :label-col="labelCol" :wrapper-col="wrapperCol"  :model="model" >
        <!-- 主表單區域 -->
        <a-row class="form-row" :gutter="0">
          <a-col :lg="8">
            <a-form-model-item  label="訂單號" prop="orderCode" :rules="[{ required: true, message: '請輸入訂單號!' }]">
              <a-input placeholder="請輸入訂單號" v-model="model.orderCode"/>
            </a-form-model-item>
          </a-col>
          <a-col :lg="8">
            <a-form-model-item  label="訂單類型">
              <a-select placeholder="請選擇訂單類型" v-model="model.ctype">
                <a-select-option value="1">國內訂單</a-select-option>
                <a-select-option value="2">國際訂單</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :lg="8">
            <a-form-model-item  label="訂單日期">
              <a-date-picker showTime valueFormat="YYYY-MM-DD HH:mm:ss" style="width: 100%" v-model="model.orderDate"/>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="0">
          <a-col :lg="8">
            <a-form-model-item  label="訂單金額">
              <a-input-number placeholder="請輸入訂單金額" style="width: 100%" v-model="model.orderMoney"/>
            </a-form-model-item>
          </a-col>
          <a-col :lg="8">
            <a-form-model-item  label="訂單備註">
              <a-input placeholder="請輸入訂單備註" v-model="model.content"/>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <!-- 子表單區域 -->
      <a-tabs v-model="activeKey" @change="handleChangeTabs">
        <a-tab-pane tab="客戶信息" key="1" :forceRender="true">

          <j-editable-table
            ref="editableTable1"
            :loading="table1.loading"
            :columns="table1.columns"
            :dataSource="table1.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>

        </a-tab-pane>

        <a-tab-pane tab="機票信息" key="2" :forceRender="true">

          <j-editable-table
            ref="editableTable2"
            :loading="table2.loading"
            :columns="table2.columns"
            :dataSource="table2.dataSource"
            :maxHeight="300"
            :rowNumber="true"
            :rowSelection="true"
            :actionButton="true"/>

        </a-tab-pane>
      </a-tabs>

    </a-spin>
  </a-modal>
</template>

<script>

  import JEditableTable from '@/components/jeecg/JEditableTable'
  import { FormTypes, VALIDATE_NO_PASSED, getRefPromise, validateFormModelAndTables } from '@/utils/JEditableTableUtil'
  import { httpAction, getAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'

  export default {
    name: 'JeecgOrderModalForJEditableTable',
    components: {
      JDate, JEditableTable
    },
    data() {
      return {
        title: '操作',
        visible: false,
        confirmLoading: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 - 6 }
        },
        activeKey: '1',
        // 客戶信息
        table1: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '客戶名',
              key: 'name',
              width: '24%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '請輸入${title}',
              validateRules: [{ required: true, message: '${title}不能為空' }]
            },
            {
              title: '性別',
              key: 'sex',
              width: '18%',
              type: FormTypes.select,
              options: [ // 下拉選項
                { title: '男', value: '1' },
                { title: '女', value: '2' }
              ],
              defaultValue: '',
              placeholder: '請選擇${title}'
            },
            {
              title: '身份證號',
              key: 'idcard',
              width: '24%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '請輸入${title}',
              validateRules: [{
                pattern: '^\\d{6}(18|19|20)?\\d{2}(0[1-9]|1[012])(0[1-9]|[12]\\d|3[01])\\d{3}(\\d|[xX])$',
                message: '${title}格式不正確'
              }]
            },
            {
              title: '手機號',
              key: 'telphone',
              width: '24%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '請輸入${title}',
              validateRules: [{
                pattern: '^1(3|4|5|7|8)\\d{9}$',
                message: '${title}格式不正確'
              }]
            }
          ]
        },
        // 機票信息
        table2: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '航班號',
              key: 'ticketCode',
              width: '40%',
              type: FormTypes.input,
              defaultValue: '',
              placeholder: '請輸入${title}',
              validateRules: [{ required: true, message: '${title}不能為空' }]
            },
            {
              title: '航班時間',
              key: 'tickectDate',
              width: '30%',
              type: FormTypes.date,
              placeholder: '請選擇${title}',
              defaultValue: ''
            }
          ]
        },
        url: {
          add: '/test/jeecgOrderMain/add',
          edit: '/test/jeecgOrderMain/edit',
          orderCustomerList: '/test/jeecgOrderMain/queryOrderCustomerListByMainId',
          orderTicketList: '/test/jeecgOrderMain/queryOrderTicketListByMainId'
        }
      }
    },
    created() {
    },
    methods: {

      // 獲取所有的editableTable實例
      getAllTable() {
        return Promise.all([
          getRefPromise(this, 'editableTable1'),
          getRefPromise(this, 'editableTable2')
        ])
      },

      add() {
        // 默認新增一條數據
        this.getAllTable().then(editableTables => {
          editableTables[0].add()
          editableTables[1].add()
        })

        this.edit({})
      },
      edit(record) {
        this.visible = true
        this.activeKey = '1'
        this.model = Object.assign({}, record)
        // 加載子表數據
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestTableData(this.url.orderCustomerList, params, this.table1)
          this.requestTableData(this.url.orderTicketList, params, this.table2)
        }

      },
      close() {
        this.visible = false
        this.getAllTable().then(editableTables => {
          editableTables[0].initialize()
          editableTables[1].initialize()
        })
        this.$emit('close')
        this.$refs.form.resetFields();
      },
      /** 查詢某個tab的數據 */
      requestTableData(url, params, tab) {
        tab.loading = true
        getAction(url, params).then(res => {
          tab.dataSource = res.result || []
        }).finally(() => {
          tab.loading = false
        })
      },
      handleOk() {
        this.validateFields()
      },
      handleCancel() {
        this.close()
      },
      /** ATab 選項卡切換事件 */
      handleChangeTabs(key) {
        getRefPromise(this, `editableTable${key}`).then(editableTable => {
          editableTable.resetScrollTop()
        })
      },

      /** 觸發表單驗證 */
      validateFields() {
        this.getAllTable().then(tables => {
          /** 一次性驗證主表和所有的次表 */
          return validateFormModelAndTables(this.$refs.form,this.model, tables)
        }).then(allValues => {
          let formData = this.classifyIntoFormData(allValues)
          // 發起請求
          return this.requestAddOrEdit(formData)
        }).catch(e => {
          if (e.error === VALIDATE_NO_PASSED) {
            // 如果有未通過表單驗證的子表，就自動跳轉到它所在的tab
            this.activeKey = e.index == null ? this.activeKey : (e.index + 1).toString()
          } else {
            console.error(e)
          }
        })
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        let orderMain = Object.assign(this.model, allValues.formValue)
        return {
          ...orderMain, // 展開
          jeecgOrderCustomerList: allValues.tablesValue[0].values,
          jeecgOrderTicketList: allValues.tablesValue[1].values
        }
      },
      /** 發起新增或修改的請求 */
      requestAddOrEdit(formData) {
        let url = this.url.add, method = 'post'
        if (this.model.id) {
          url = this.url.edit
          method = 'put'
        }
        this.confirmLoading = true
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
      }

    }
  }
</script>

<style scoped>
</style>