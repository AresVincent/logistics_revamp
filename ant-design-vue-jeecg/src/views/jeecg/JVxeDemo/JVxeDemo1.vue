<template>
  <j-vxe-table
    ref="vTable"
    toolbar
    row-number
    row-selection
    drag-sort
    keep-source
    :height="580"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    style="margin-top: 8px;"
    @valueChange="handleValueChange"
  >

    <template v-slot:toolbarSuffix>
      <a-button @click="handleTableCheck">表單驗證</a-button>
      <a-tooltip placement="top" title="獲取值，忽略表單驗證" :autoAdjustOverflow="true">
        <a-button @click="handleTableGet">獲取值</a-button>
      </a-tooltip>
      <a-tooltip placement="top" title="模擬加載1000條數據" :autoAdjustOverflow="true">
        <a-button @click="handleTableSet">設置值</a-button>
      </a-tooltip>
    </template>

    <template v-slot:action="props">
      <a @click="handleCK(props)">查看</a>
      <a-divider type="vertical"/>
      <a-popconfirm title="確定刪除嗎？" @confirm="handleDL(props)">
        <a>刪除</a>
      </a-popconfirm>
    </template>

  </j-vxe-table>
</template>

<script>
  import moment from 'moment'
  import { pushIfNotExist, randomNumber, randomUUID } from '@/utils/util'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  export default {
    name: 'JVxeDemo1',
    data() {
      return {
        loading: false,
        columns: [
          {
            title: '不可編輯',
            key: 'normal',
            type: JVXETypes.normal,
            width: '180px',
            fixed: 'left',
            defaultValue: 'normal-new',
          },
          {
            title: '單行文本',
            key: 'input',
            type: JVXETypes.input,
            width: '180px',
            defaultValue: '',
            placeholder: '請輸入${title}',
            validateRules: [
              {
                required: true, // 必填
                message: '請輸入${title}' // 显示的文本
              },
              {
                pattern: /^[a-z|A-Z][a-z|A-Z\d_-]*$/, // 正則
                message: '${title}必須以字母開頭，可包含数字、下劃線、橫杠'
              },
              {
                unique: true,
                message: '${title}不能重複'
              },
              {
                handler({cellValue, row, column}, callback, target) {
                  // cellValue 當前校驗的值
                  // callback(flag, message) 方法必須執行且只能執行一次
                  //          flag = 是否通過了校驗，不填寫或者填寫 null 代表不進行任何操作
                  //          message = 提示的類型，默認使用配置的 message
                  // target 行編輯的實例對象
                  if (cellValue === 'abc') {
                    callback(false, '${title}不能是abc')  // false = 未通過校驗
                  } else {
                    callback(true) // true = 通過驗證
                  }
                },
                message: '${title}默認提示'
              }
            ]
          },
          {
            title: '多行文本',
            key: 'textarea',
            type: JVXETypes.textarea,
            width: '200px',
          },
          {
            title: '数字',
            key: 'number',
            type: JVXETypes.inputNumber,
            width: '80px',
            defaultValue: 32,
            // 【統計列】sum = 求和、average = 平均值
            statistics: ['sum', 'average'],
          },
          {
            title: '下拉框',
            key: 'select',
            type: JVXETypes.select,
            width: '180px',
            // 下拉選項
            options: [
              {title: 'String', value: 'string'},
              {title: 'Integer', value: 'int'},
              {title: 'Double', value: 'double'},
              {title: 'Boolean', value: 'boolean'}
            ],
            allowInput: true,
            placeholder: '請選擇'
          },
          {
            title: '下拉框_字典',
            key: 'select_dict',
            type: JVXETypes.select,
            width: '180px',
            options: [],
            dictCode: 'sex',
            placeholder: '請選擇',
          },
          {
            title: '下拉框_多選',
            key: 'select_multiple',
            type: JVXETypes.selectMultiple,
            width: '205px',
            options: [
              {title: 'String', value: 'string'},
              {title: 'Integer', value: 'int'},
              {title: 'Double', value: 'double'},
              {title: 'Boolean', value: 'boolean'}
            ],
            defaultValue: ['int', 'boolean'], // 多個默認項
            // defaultValue: 'string,double,int', // 也可使用這種方式
            placeholder: '多選',
          },

          {
            title: '下拉框_搜索',
            key: 'select_search',
            type: JVXETypes.selectSearch,
            width: '180px',
            options: [
              {title: 'String', value: 'string'},
              {title: 'Integer', value: 'int'},
              {title: 'Double', value: 'double'},
              {title: 'Boolean', value: 'boolean'}
            ],
          },
          {
            title: '日期時間',
            key: 'datetime',
            type: JVXETypes.datetime,
            width: '200px',
            defaultValue: '2019-4-30 14:52:22',
            placeholder: '請選擇',
          },
          {
            title: '複選框',
            key: 'checkbox',
            type: JVXETypes.checkbox,
            width: '100px',
            customValue: ['Y', 'N'], // true ,false
            defaultChecked: false,
          },
          {
            title: '操作',
            key: 'action',
            type: JVXETypes.slot,
            fixed: 'right',
            minWidth: '100px',
            align: 'center',
            slotName: 'action',
          }
        ],
        dataSource: [],
      }

    },

    created() {
      this.randomPage(0, 20, true)
    },
    methods: {

      handleCK(props) {
        this.$message.success('請在控制台查看輸出')
        // 參數介紹：
        // props.value          當前單元格的值
        // props.row            當前行的數據
        // props.rowId          當前行ID
        // props.rowIndex       當前行下標
        // props.column         當前列的配置
        // props.columnIndex    當前列下標
        // props.$table         vxe實例，可以調用vxe內置方法
        // props.target         JVXE實例，可以調用JVXE內置方法
        // props.caseId         JVXE實例唯一ID
        // props.scrolling      是否正在滾動
        // props.triggerChange  觸發change事件，用於更改slot的值
        console.log('查看: ', {props})
      },

      handleDL(props) {
        // 調用刪除方法
        props.target.removeRows(props.row)
      },

      handleValueChange(event) {
        console.log('handleValueChange.event: ', event)
      },

      /** 表單驗證 */
      handleTableCheck() {
        this.$refs.vTable.validateTable().then(errMap => {
          if (errMap) {
            console.log('表單驗證未通過：', {errMap})
            this.$message.error('驗證未通過，請在控制台查看詳細')
          } else {
            this.$message.success('驗證通過')
          }
        })
      },

      /** 獲取值，忽略表單驗證 */
      handleTableGet() {
        const values = this.$refs.vTable.getTableData()
        console.log('獲取值:', {values})
        this.$message.success('獲取值成功，請看控制台輸出')
      },

      /** 模擬加載1000條數據 */
      handleTableSet() {
        this.randomPage(1, 1000, true)
      },

      /* 隨機生成數據 */
      randomPage(current, pageSize, loading = false) {
        if (loading) {
          this.loading = true
        }

        let randomDatetime = () => {
          let time = randomNumber(1000, 9999999999999)
          return moment(new Date(time)).format('YYYY-MM-DD HH:mm:ss')
        }

        let limit = (current - 1) * pageSize

        let options = ['string', 'int', 'double', 'boolean']

        let begin = Date.now()
        let values = []
        for (let i = 0; i < pageSize; i++) {
          values.push({
            id: randomUUID(),
            normal: `normal-${(limit + i) + 1}`,
            input: `text-${(limit + i) + 1}`,
            textarea: `textarea-${(limit + i) + 1}`,
            number: randomNumber(0, 233),
            select: options[randomNumber(0, 3)],
            select_dict: randomNumber(1, 2).toString(),
            select_multiple: (() => {
              let length = randomNumber(1, 4)
              let arr = []
              for (let j = 0; j < length; j++) {
                pushIfNotExist(arr, options[randomNumber(0, 3)])
              }
              return arr
            })(),
            select_search: options[randomNumber(0, 3)],
            datetime: randomDatetime(),
            checkbox: ['Y', 'N'][randomNumber(0, 1)]
          })
        }

        this.dataSource = values
        let end = Date.now()
        let diff = end - begin

        if (loading && diff < pageSize) {
          setTimeout(() => {
            this.loading = false
          }, pageSize - diff)
        }

      }
    }
  }
</script>

<style scoped>

</style>