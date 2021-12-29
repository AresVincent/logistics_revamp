<template>
  <j-vxe-table
    ref="vTable"
    toolbar
    row-number
    row-selection
    keep-source
    :height="484"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :pagination="pagination"
    style="margin-top: 8px;"
    @pageChange="handlePageChange"
  >

    <template v-slot:toolbarSuffix>
      <a-button @click="handleTableGet">獲取值</a-button>
    </template>

  </j-vxe-table>
</template>

<script>
  import moment from 'moment'
  import { randomNumber, randomUUID } from '@/utils/util'
  import { JVXETypes } from '@/components/jeecg/JVxeTable'

  export default {
    name: 'JVxeDemo2',
    data() {
      return {
        loading: false,
        columns: [
          {
            title: '下拉框_字典表搜索',
            key: 'select_dict_search',
            type: JVXETypes.selectDictSearch,
            width: '200px',
            // 【字典表配置信息】：數據庫表名,显示字段名,存儲字段名
            dict: 'sys_user,realname,username',
          },
          {
            title: 'JPopup',
            key: 'popup',
            type: JVXETypes.popup,
            width: '180px',
            popupCode: 'demo',
            field: 'name,sex,age',
            orgFields: 'name,sex,age',
            destFields: 'popup,popup_sex,popup_age'
          },
          {
            title: 'JP-性別',
            key: 'popup_sex',
            type: JVXETypes.select,
            dictCode: 'sex',
            disabled: true,
            width: '100px',
          },
          {
            title: 'JP-年齡',
            key: 'popup_age',
            type: JVXETypes.normal,
            width: '80px',
          },
          {
            title: '進度條',
            key: 'progress',
            type: JVXETypes.progress,
            minWidth: '120px'
          },
          {
            title: '單選',
            key: 'radio',
            type: JVXETypes.radio,
            width: '130px',
            options: [
              {text: '男', value: '1'},
              {text: '女', value: '2'},
            ],
            // 允許清除選擇（再點一次取消選擇）
            allowClear: true
          },
          {
            title: '上傳',
            key: 'upload',
            type: JVXETypes.upload,
            width: '180px',
            btnText: '點擊上傳',
            token: true,
            responseName: 'message',
            action: window._CONFIG['domianURL'] + '/sys/common/upload'
          },
          {
            title: '圖片上傳',
            key: 'image',
            type: JVXETypes.image,
            width: '180px',
            token: true,
          },
          {
            title: '文件上傳',
            key: 'file',
            type: JVXETypes.file,
            width: '180px',
            token: true,
          },
        ],
        dataSource: [],
        pagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30', '100', '200'],
          total: 1000,
        },
      }

    },

    created() {
      this.randomPage(this.pagination.current, this.pagination.pageSize, true)
    },
    methods: {

      // 當分頁參數變化時觸發的事件
      handlePageChange(event) {
        // 重新賦值
        this.pagination.current = event.current
        this.pagination.pageSize = event.pageSize
        // 查詢數據
        this.randomPage(event.current, event.pageSize, true)
      },

      /** 獲取值，忽略表單驗證 */
      handleTableGet() {
        const values = this.$refs.vTable.getTableData()
        console.log('獲取值:', {values})
        this.$message.success('獲取值成功，請看控制台輸出')
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

        let begin = Date.now()
        let values = []
        for (let i = 0; i < pageSize; i++) {
          let radio = randomNumber(0, 2)
          values.push({
            id: randomUUID(),
            select_dict_search: ['', 'admin', '', 'jeecg', ''][randomNumber(0, 4)],
            progress: randomNumber(0, 100),
            radio: radio ? radio.toString() : null
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