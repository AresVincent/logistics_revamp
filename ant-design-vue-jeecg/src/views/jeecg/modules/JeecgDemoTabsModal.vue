<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="關閉">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-card class="card"  :bordered="false">
          <a-row class="form-row" :gutter="16">
            <a-col :lg="8">
              <a-form-item label="任務名">
                <a-input placeholder="請輸入任務名稱"  v-decorator="[ 'task.name', {rules: [{ required: true, message: '請輸入任務名稱', whitespace: true}]} ]"/>
              </a-form-item>
            </a-col>
            <a-col :lg="8">
              <a-form-item label="任務描述">
                <a-input placeholder="請輸入任務描述"  v-decorator="['task.description', {rules: [{ required: true, message: '請輸入任務描述', whitespace: true}]} ]"/>
              </a-form-item>
            </a-col>
            <a-col :lg="8">
              <a-form-item label="執行人">
                <a-select placeholder="請選擇執行人" v-decorator="['task.executor',{rules: [{ required: true, message: '請選擇執行人'}]}  ]">
                  <a-select-option value="黃麗麗">黃麗麗</a-select-option>
                  <a-select-option value="李大刀">李大刀</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :lg="8">
              <a-form-item label="責任人">
                <a-select placeholder="請選擇責任人" v-decorator="['task.manager',  {rules: [{ required: true, message: '請選擇責任人'}]} ]">
                  <a-select-option value="王偉">王偉</a-select-option>
                  <a-select-option value="李紅軍">李紅軍</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :lg="8">
              <a-form-item label="提醒時間">
                <a-time-picker style="width: 100%" v-decorator="['task.time', {rules: [{ required: true, message: '請選擇提醒時間'}]} ]"/>
              </a-form-item>
            </a-col>
            <a-col :lg="8">
              <a-form-item
                label="任務類型">
                <a-select placeholder="請選擇任務類型" v-decorator="['task.type', {rules: [{ required: true, message: '請選擇任務類型'}]} ]">
                  <a-select-option value="定時執行">定時執行</a-select-option>
                  <a-select-option value="周期執行">周期執行</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>

        <a-tabs defaultActiveKey="1" >
          <a-tab-pane tab="Tab 1" key="1">

            <a-table :columns="columns" :dataSource="data" :pagination="false" size="middle">
              <template v-for="(col, i) in ['name', 'workId', 'department']" :slot="col" slot-scope="text, record, index">
                <a-tooltip  title="必填項" :defaultVisible="false" :overlayStyle="{ color: 'red' }">
                  <a-input :key="col" v-if="record.editable" style="margin: -5px 0"  :value="text" :placeholder="columns[i].title" @change="e => handlerRowChange(e.target.value, record.key, col)"/>
                <template v-else>{{ text }}</template>
                </a-tooltip>
              </template>
              <template slot="operation" slot-scope="text, record, index">
                <template v-if="record.editable">
                  <span v-if="record.isNew">
                    <a @click="saveRow(record.key)">添加</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm title="是否要刪除此行？" @confirm="removeRow(record.key)"><a>刪除</a></a-popconfirm>
                  </span>
                  <span v-else>
                    <a @click="saveRow(record.key)">保存</a>
                    <a-divider type="vertical"/>
                    <a @click="cancelEditRow(record.key)">取消</a>
                  </span>
                </template>
                <span v-else>
                  <a @click="editRow(record.key)">編輯</a>
                  <a-divider type="vertical"/>
                  <a-popconfirm title="是否要刪除此行？" @confirm="removeRow(record.key)"><a>刪除</a></a-popconfirm>
                </span>
              </template>
            </a-table>

            <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newRow">新增成員</a-button>
          </a-tab-pane>
          <a-tab-pane tab="Tab 2" key="2" forceRender>
            Content of Tab Pane 2
          </a-tab-pane>
          <a-tab-pane tab="Tab 3" key="3">Content of Tab Pane 3</a-tab-pane>
        </a-tabs>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "JeecgDemoTabsModal",
    data() {
      return {
        title: "操作",
        visible: false,
        model: {},
        // table
        columns: [
          {
            title: '成員姓名',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            scopedSlots: {customRender: 'name'}
          },
          {
            title: '工號',
            dataIndex: 'workId',
            key: 'workId',
            width: '20%',
            scopedSlots: {customRender: 'workId'}
          },
          {
            title: '所屬部門',
            dataIndex: 'department',
            key: 'department',
            width: '40%',
            scopedSlots: {customRender: 'department'}
          },
          {
            title: '操作',
            key: 'action',
            scopedSlots: {customRender: 'operation'}
          }
        ],
        data: [
          {
            key: '1',
            name: '小明',
            workId: '001',
            editable: false,
            department: '行政部'
          },
          {
            key: '2',
            name: '李莉',
            workId: '002',
            editable: false,
            department: 'IT部'
          },
          {
            key: '3',
            name: '王小帥',
            workId: '003',
            editable: false,
            department: '財務部'
          }
        ],

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {},
        url: {
          add: "/test/jeecgDemo/add",
          edit: "/test/jeecgDemo/edit",
        },
      }
    },
    created() {
    },
    methods: {
      add() {
        this.edit({});
      },
      edit(record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'name', 'keyWord', 'sex', 'age', 'email', 'content'))
          //時間格式化
          this.form.setFieldsValue({punchTime: this.model.punchTime ? moment(this.model.punchTime, 'YYYY-MM-DD HH:mm:ss') : null})
          this.form.setFieldsValue({birthday: this.model.birthday ? moment(this.model.birthday) : null})
        });

      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
      handleOk() {
        const that = this;
        // 觸發表單驗證
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //時間格式化
            formData.punchTime = formData.punchTime ? formData.punchTime.format('YYYY-MM-DD HH:mm:ss') : null;
            formData.birthday = formData.birthday ? formData.birthday.format() : null;

            console.log(formData)
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      handleCancel() {
        this.close()
      },
      newRow () {
        // 通過時間戳生成 UUID
        let uuid = Math.round(new Date().getTime()).toString();
        console.log('uuid: '+ uuid)
        this.data.push({
          key: uuid,
          name: '',
          workId: '',
          department: '',
          editable: true,
          isNew: true
        })
      },
      removeRow (key) {
        const newData = this.data.filter(item => item.key !== key)
        this.data = newData
      },
      saveRow (key) {
        let target = this.data.filter(item => item.key === key)[0]
        target.editable = false
        target.isNew = false
      },
      handlerRowChange (value, key, column) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
      },
      editRow (key) {
        let target = this.data.filter(item => item.key === key)[0]
        target.editable = !target.editable
      },
      cancelEditRow (key) {
        let target = this.data.filter(item => item.key === key)[0]
        target.editable = false
      },
    }
  }
</script>

<style scoped>
  .ant-modal-body {
    padding: 8px!important;
  }
</style>