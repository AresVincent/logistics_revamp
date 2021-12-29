<template>
  <a-modal
    title="用戶列表"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel">

    <a-table
      ref="table"
      bordered
      size="middle"
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :loading="loading"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"></a-table>
  </a-modal>
</template>

<script>
  import {getUserList} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "SelectUserListModal",
    mixins: [JeecgListMixin],
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        confirmLoading: false,
        url: {
          add: "/act/model/create",
          list: "/sys/user/list"
        },
        columns: [
          {
            title: '用戶賬號',
            align: "center",
            dataIndex: 'username',
            fixed: 'left',
            width: 200
          },
          {
            title: '用戶姓名',
            align: "center",
            dataIndex: 'realname',
          },
          {
            title: '性別',
            align: "center",
            dataIndex: 'sex_dictText'
          },
          {
            title: '手機號碼',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '郵箱',
            align: "center",
            dataIndex: 'email'
          },
          {
            title: '狀態',
            align: "center",
            dataIndex: 'status_dictText'
          }
        ]
      }
    },
    created() {
      //Step.2 加載用戶數據
      getUserList().then((res) => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;
        }
      })
    },
    methods: {
      open() {
        this.visible = true;

        //Step.1 清空選中用戶
        this.selectedRowKeys = []
        this.selectedRows = []
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleChange(info) {
        let file = info.file;
        if (file.response.success) {
          this.$message.success(file.response.message);
          this.$emit('ok');
          this.close()
        } else {
          this.$message.warn(file.response.message);
          this.close()
        }

      },
      handleCancel() {
        this.close()
      },
      handleSubmit() {
        this.$emit('ok', this.selectionRows);
        this.close()
      },
    }
  }
</script>

<style>

</style>
