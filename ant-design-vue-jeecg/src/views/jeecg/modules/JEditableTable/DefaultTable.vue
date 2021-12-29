<template>

  <div>
    <a-button @click="handleTableCheck" type="primary">表單驗證</a-button>
    <span style="padding-left:8px;"></span>
    <a-tooltip placement="top" title="獲取值，忽略表單驗證" :autoAdjustOverflow="true">
      <a-button @click="handleTableGet" type="primary">獲取值</a-button>
    </a-tooltip>
    <span style="padding-left:8px;"></span>
    <a-tooltip placement="top" title="模擬加載1000條數據" :autoAdjustOverflow="true">
      <a-button @click="handleTableSet" type="primary">設置值</a-button>
    </a-tooltip>


    <j-editable-table
      ref="editableTable"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :rowNumber="true"
      :rowSelection="true"
      :actionButton="true"
      :dragSort="true"
      style="margin-top: 8px;"
      @selectRowChange="handleSelectRowChange">

      <template v-slot:action="props">
        <a @click="handleDelete(props)">刪除</a>
      </template>

    </j-editable-table>
  </div>

</template>

<script>
  import moment from 'moment'
  import { FormTypes } from '@/utils/JEditableTableUtil'
  import { randomUUID, randomNumber } from '@/utils/util'
  import JEditableTable from '@/components/jeecg/JEditableTable'

  export default {
    name: 'DefaultTable',
    components: { JEditableTable },
    data() {
      return {
        loading: false,
        columns: [
          {
            title: '字段名稱',
            key: 'dbFieldName',
            // width: '19%',
            width: '300px',
            type: FormTypes.input,
            defaultValue: '',
            placeholder: '請輸入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '請輸入${title}' // 显示的文本
              },
              {
                pattern: /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/, // 正則
                message: '${title}必須以字母開頭，可包含数字、下劃線、橫杠'
              },
              {
                unique: true,
                message: '${title}不能重複'
              },
              {
                handler(type, value, row, column, callback, target) {
                  // type 觸發校驗的類型（input、change、blur）
                  // value 當前校驗的值
                  // callback(flag, message) 方法必須執行且只能執行一次
                  //          flag = 是否通過了校驗，不填寫或者填寫 null 代表不進行任何操作
                  //          message = 提示的類型，默認使用配置的 message
                  // target 行編輯的實例對象

                  if (type === 'blur') {
                    if (value === 'abc') {
                      callback(false, '${title}不能是abc')  // false = 未通過校驗
                    } else {
                      callback(true) // true = 通過驗證
                    }
                  } else {
                    callback(true) // 不填寫或者填寫 null 代表不進行任何操作
                  }
                },
                message: '${title}默認提示'
              }
            ]
          },
          {
            title: '文件域',
            key: 'upload',
            type: FormTypes.upload,
            // width: '19%',
            width: '300px',
            placeholder: '點擊上傳',
            token: true,
            responseName: 'message',
            action: window._CONFIG['domianURL'] + '/sys/common/upload',
            data: {
              biz: 'temp',
              // 更多擴展參數
            },
          },
          {
            title: '字段類型',
            key: 'dbFieldType',
            // width: '18%',
            width: '300px',
            type: FormTypes.select,
            options: [ // 下拉選項
              { title: 'String', value: 'string' },
              { title: 'Integer', value: 'int' },
              { title: 'Double', value: 'double' },
              { title: 'Boolean', value: 'boolean' }
            ],
            allowInput: true,
            defaultValue: '',
            placeholder: '請選擇${title}',
            validateRules: [{ required: true, message: '請選擇${title}' }]
          },
          {
            title: '性別（字典）',
            key: 'sex_dict',
            width: '300px',
            type: FormTypes.select,
            options: [],
            dictCode: 'sex',
            placeholder: '請選擇${title}',
            validateRules: [{ required: true, message: '請選擇${title}' }]
          },
          {
            title: '多選測試',
            key: 'multipleSelect',
            // width: '18%',
            width: '300px',
            type: FormTypes.select,
            props: { 'mode': 'multiple' }, // 支持多選
            options: [
              { title: 'String', value: 'string' },
              { title: 'Integer', value: 'int' },
              { title: 'Double', value: 'double' },
              { title: 'Boolean', value: 'boolean' }
            ],
            defaultValue: ['int', 'boolean'], // 多個默認項
            // defaultValue: 'string,double,int', // 也可使用這種方式
            placeholder: '這裏可以多選',
            validateRules: [{ required: true, message: '請選擇${title}' }]
          },
          {
            title: '字段長度',
            key: 'dbLength',
            // width: '8%',
            width: '100px',
            type: FormTypes.inputNumber,
            defaultValue: 32,
            placeholder: '${title}',
            // 是否是統計列，只有 inputNumber 才能設置統計列
            statistics: true,
            validateRules: [{ required: true, message: '請輸入${title}' }]
          },
          {
            title: '日期',
            key: 'datetime',
            // width: '22%',
            width: '320px',
            type: FormTypes.datetime,
            defaultValue: '2019-4-30 14:52:22',
            placeholder: '請選擇${title}',
            validateRules: [{ required: true, message: '請選擇${title}' }]
          },
          {
            title: '数字',
            key: 'money',
            width: '320px',
            type: FormTypes.inputNumber,
            defaultValue: '100.32',
            placeholder: '請選擇${title}',
            validateRules: [{ required: true, message: '請選擇${title}' }]
          },
          {
            title: '可以為空',
            key: 'isNull',
            // width: '8%',
            width: '100px',
            type: FormTypes.checkbox,
            customValue: ['Y', 'N'], // true ,false
            defaultChecked: false
          },
          {
            type: FormTypes.popup,
            key: 'popup',
            title: 'JPopup',
            width: '180px',
            popupCode: 'demo',
            field: 'name',
            orgFields: 'name',
            destFields: 'name'
          },
          {
            title: '操作',
            key: 'action',
            // width: '8%',
            width: '100px',
            type: FormTypes.slot,
            slotName: 'action',
          }

        ],
        dataSource: [],
        selectedRowIds: []
      }
    },
    mounted() {
      this.randomData(23, false)
    },
    methods: {

      /** 表單驗證 */
      handleTableCheck() {
        this.$refs.editableTable.getValues((error) => {
          if (error === 0) {
            this.$message.success('驗證通過')
          } else {
            this.$message.error('驗證未通過')
          }
        })
      },
      /** 獲取值，忽略表單驗證 */
      handleTableGet() {
        this.$refs.editableTable.getValues((error, values) => {
          console.log('values:', values)
        }, false)
        console.log('deleteIds:', this.$refs.editableTable.getDeleteIds())

        this.$message.info('獲取值成功，請看控制台輸出')

      },
      /** 模擬加載1000條數據 */
      handleTableSet() {
        this.randomData(1000, true)
      },

      handleSelectRowChange(selectedRowIds) {
        this.selectedRowIds = selectedRowIds
      },

      /* 隨機生成數據 */
      randomData(size, loading = false) {
        if (loading) {
          this.loading = true
        }

        let randomDatetime = () => {
          let time = parseInt(randomNumber(1000, 9999999999999))
          return moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
        }

        let begin = Date.now()
        let values = []
        for (let i = 0; i < size; i++) {
          values.push({
            id: randomUUID(),
            dbFieldName: `name_${i + 1}`,
            // dbFieldTxt: randomString(10),
            multipleSelect: ['string', ['int', 'double', 'boolean'][randomNumber(0, 2)]],
            dbFieldType: ['string', 'int', 'double', 'boolean'][randomNumber(0, 3)],
            dbLength: randomNumber(0, 233),
            datetime: randomDatetime(),
            isNull: ['Y', 'N'][randomNumber(0, 1)]
          })
        }

        this.dataSource = values
        let end = Date.now()
        let diff = end - begin

        if (loading && diff < size) {
          setTimeout(() => {
            this.loading = false
          }, size - diff)
        }

      },

      handleDelete(props) {
        let { rowId, target } = props
        target.removeRows(rowId)
      }
    }
  }
</script>

<style scoped>

</style>