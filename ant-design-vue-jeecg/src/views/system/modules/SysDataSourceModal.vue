<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="關閉">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="數據源編碼">
          <a-input placeholder="請輸入數據源編碼" :disabled="!!model.id" v-decorator="['code', validatorRules.code]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="數據源名稱">
          <a-input placeholder="請輸入數據源名稱" v-decorator="['name', validatorRules.name]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="數據庫類型">
          <j-dict-select-tag placeholder="請選擇數據庫類型" dict-code="database_type" triggerChange v-decorator="['dbType', validatorRules.dbType]" @change="handleDbTypeChange"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="驅動類">
          <a-input placeholder="請輸入驅動類" v-decorator="['dbDriver', validatorRules.dbDriver]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="數據源地址">
          <a-input placeholder="請輸入數據源地址" v-decorator="['dbUrl', validatorRules.dbUrl]"/>
        </a-form-item>
       <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="數據庫名稱">
          <a-input placeholder="請輸入數據庫名稱" v-decorator="['dbName', validatorRules.dbName]"/>
        </a-form-item>-->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用戶名">
          <a-input placeholder="請輸入用戶名" v-decorator="['dbUsername', validatorRules.dbUsername]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密碼">
          <a-row :gutter="8">
            <a-col :span="21">
              <a-input-password placeholder="請輸入密碼" v-decorator="['dbPassword', validatorRules.dbPassword]"/>
            </a-col>
            <a-col :span="3">
              <a-button type="primary" size="small" style="width: 100%" @click="handleTest">測試</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="備註">
          <a-textarea placeholder="請輸入備註" v-decorator="['remark', {}]"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction, postAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'SysDataSourceModal',
    components: {},
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
        form: this.$form.createForm(this),
        validatorRules: {
          code: {
            validateFirst: true,
            rules: [
              { required: true, message: '請輸入數據源編碼!' },
              {
                validator: (rule, value, callback) => {
                  let pattern = /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/
                  if (!pattern.test(value)) {
                    callback('編碼必須以字母開頭，可包含数字、下劃線、橫杠')
                  } else {
                    validateDuplicateValue('sys_data_source', 'code', value, this.model.id, callback)
                  }
                }
              }
            ]
          },
          name: { rules: [{ required: true, message: '請輸入數據源名稱!' }] },
          dbType: { rules: [{ required: true, message: '請選擇數據庫類型!' }] },
          dbDriver: { rules: [{ required: true, message: '請輸入驅動類!' }] },
          dbUrl: { rules: [{ required: true, message: '請輸入數據源地址!' }] },
          dbName: { rules: [{ required: true, message: '請輸入數據庫名稱!' }] },
          dbUsername: { rules: [{ required: true, message: '請輸入用戶名!' }] },
          dbPassword: { rules: [{ required: false, message: '請輸入密碼!' }] }
        },
        url: {
          add: '/sys/dataSource/add',
          edit: '/sys/dataSource/edit',
        },
        dbDriverMap: {
          // MySQL 數據庫
          '1': { dbDriver: 'com.mysql.jdbc.Driver' },
          //MySQL5.7+ 數據庫
          '4': { dbDriver: 'com.mysql.cj.jdbc.Driver' },
          // Oracle
          '2': { dbDriver: 'oracle.jdbc.OracleDriver' },
          // SQLServer 數據庫
          '3': { dbDriver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver' },
          // marialDB 數據庫
          '5': { dbDriver: 'org.mariadb.jdbc.Driver' },
          // postgresql 數據庫
          '6': { dbDriver: 'org.postgresql.Driver' },
          // 達夢 數據庫
          '7': { dbDriver: 'dm.jdbc.driver.DmDriver' },
          // 人大金倉 數據庫
          '8': { dbDriver: 'com.kingbase8.Driver' },
          // 神通 數據庫
          '9': { dbDriver: 'com.oscar.Driver' },
          // SQLite 數據庫
          '10': { dbDriver: 'org.sqlite.JDBC' },
          // DB2 數據庫
          '11': { dbDriver: 'com.ibm.db2.jcc.DB2Driver' },
          // Hsqldb 數據庫
          '12': { dbDriver: 'org.hsqldb.jdbc.JDBCDriver' },
          // Derby 數據庫
          '13': { dbDriver: 'org.apache.derby.jdbc.ClientDriver' },
          // H2 數據庫
          '14': { dbDriver: 'org.h2.Driver' },
          // 其他數據庫
          '15': { dbDriver: '' }
        },
        dbUrlMap: {
          // MySQL 數據庫
          '1': { dbUrl: 'jdbc:mysql://127.0.0.1:3306/jeecg-boot?characterEncoding=UTF-8&useUnicode=true&useSSL=false' },
          //MySQL5.7+ 數據庫
          '4': { dbUrl: 'jdbc:mysql://127.0.0.1:3306/jeecg-boot?characterEncoding=UTF-8&useUnicode=true&useSSL=false&tinyInt1isBit=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai' },
          // Oracle
          '2': { dbUrl: 'jdbc:oracle:thin:@127.0.0.1:1521:ORCL' },
          // SQLServer 數據庫
          '3': { dbUrl: 'jdbc:sqlserver://127.0.0.1:1433;SelectMethod=cursor;DatabaseName=jeecgboot' },
          // Mariadb 數據庫
          '5': { dbUrl: 'jdbc:mariadb://127.0.0.1:3306/jeecg-boot?characterEncoding=UTF-8&useSSL=false' },
          // Postgresql 數據庫
          '6': { dbUrl: 'jdbc:postgresql://127.0.0.1:5432/jeecg-boot' },
          // 達夢 數據庫
          '7': { dbUrl: 'jdbc:dm://127.0.0.1:5236/?jeecg-boot&zeroDateTimeBehavior=convertToNull&useUnicode=true&characterEncoding=utf-8' },
          // 人大金倉 數據庫
          '8': { dbUrl: 'jdbc:kingbase8://127.0.0.1:54321/jeecg-boot' },
          // 神通 數據庫
          '9': { dbUrl: 'jdbc:oscar://192.168.1.125:2003/jeecg-boot' },
          // SQLite 數據庫
          '10': { dbUrl: 'jdbc:sqlite://opt/test.db' },
          // DB2 數據庫
          '11': { dbUrl: 'jdbc:db2://127.0.0.1:50000/jeecg-boot' },
          // Hsqldb 數據庫
          '12': { dbUrl: 'jdbc:hsqldb:hsql://127.0.0.1/jeecg-boot' },
          // Derby 數據庫
          '13': { dbUrl: 'jdbc:derby://127.0.0.1:1527/jeecg-boot' },
          // H2 數據庫
          '14': { dbUrl: 'jdbc:h2:tcp://127.0.0.1:8082/jeecg-boot' },
          // 其他數據庫
          '15': { dbUrl: '' }
        }
      }
    },
    created() {
    },
    methods: {
      add() {
        this.edit({})
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'code', 'name', 'remark', 'dbType', 'dbDriver', 'dbUrl', 'dbName', 'dbUsername', 'dbPassword'))
        })
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        // 觸發表單驗證
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true
            let formData = Object.assign(this.model, values)
            let httpUrl = this.url.add, method = 'post'
            if (this.model.id) {
              httpUrl = this.url.edit
              method = 'put'
              // 由於編碼的特殊性，所以不能更改
              formData['code'] = undefined
            }
            httpAction(httpUrl, formData, method).then((res) => {
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
        })
      },
      handleCancel() {
        this.close()
      },
      // 測試數據源配置是否可以正常連接
      handleTest() {
        let keys = ['dbType', 'dbDriver', 'dbUrl', 'dbName', 'dbUsername', 'dbPassword']
        // 獲取以上字段的值，並清除校驗狀態
        let fieldsValues = this.form.getFieldsValue(keys)
        let setFields = {}
        keys.forEach(key => setFields[key] = { value: fieldsValues[key], errors: null })
        // 清除校驗狀態，目的是可以讓錯誤文字閃爍
        this.form.setFields(setFields)
        // 重新校驗
        this.$nextTick(() => {
          this.form.validateFields(keys, (errors, values) => {
            if (!errors) {
              let loading = this.$message.loading('連接中……', 0)
              postAction('/online/cgreport/api/testConnection', fieldsValues).then(res => {
                if (res.success) {
                  this.$message.success('連接成功')
                } else throw new Error(res.message)
              }).catch(error => {
                this.$warning({ title: '連接失敗', content: error.message || error })
              }).finally(() => loading())
            }
          })
        })
      },
      // 數據庫類型更改時，聯動更改數據庫驅動
      handleDbTypeChange(val) {
        let dbDriver = this.dbDriverMap[val]
        let dbUrl = this.dbUrlMap[val]
        if (dbDriver) {
          this.form.setFieldsValue(dbDriver)
        }
        if (dbUrl) {
          this.form.setFieldsValue(dbUrl)
        }
      },
    }
  }
</script>

<style lang="less" scoped></style>