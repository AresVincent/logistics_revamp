<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表單區域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="運單號" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="waybillNo">
              <a-input v-model="model.waybillNo" placeholder="請輸入運單號" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="訂單狀態" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">
              <j-search-select-tag v-model="model.status" placeholder="請選擇訂單狀態"  dict="logistics_status"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="派送類型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <j-search-select-tag v-model="model.type" placeholder="請選擇派送類型" dict="logistics_send_type"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="物流用戶ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="userId">
              <j-search-select-tag v-model="model.userId" dict="logistics_user,name,id"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="寄件人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendName">
              <a-input v-model="model.sendName" placeholder="請輸入寄件人姓名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="寄件人電話" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendPhone">
              <a-input v-model="model.sendPhone" placeholder="請輸入寄件人電話" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="攬收地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendAddress">
              <a-input v-model="model.sendAddress" placeholder="請輸入攬收地址" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="收件人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="getName">
              <a-input v-model="model.getName" placeholder="請輸入收件人姓名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="收件人電話" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="getPhone">
              <a-input v-model="model.getPhone" placeholder="請輸入收件人電話" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="收件人地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="getAddress">
              <a-input v-model="model.getAddress" placeholder="請輸入收件人地址" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="自提點/自提櫃代碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="getPickuppoint">
              <j-search-select-tag v-model="model.getPickuppoint" placeholder="請選擇自提點/自提櫃代碼" dict="logistics_outlets,store_name,store_code"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="重量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="weight">
              <a-input-number v-model="model.weight" placeholder="請輸入重量" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="體積" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="volume">
              <a-input v-model="model.volume" placeholder="請輸入體積" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" v-has="'testdemo:price'">
            <a-form-model-item label="運費" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="price">
              <a-input-number v-model="model.price" placeholder="請輸入運費" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="下單時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sendTime">
              <j-date placeholder="請選擇下單時間" v-model="model.sendTime" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="寬度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="width">
              <a-input-number v-model="model.width" placeholder="請輸入寬度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="長度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="length">
              <a-input-number v-model="model.length" placeholder="請輸入長度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="高度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="height">
              <a-input-number v-model="model.height" placeholder="請輸入高度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="是否包含電池?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="includeBattery">
              <j-search-select-tag v-model="model.includeBattery" placeholder="請選擇是否包含電池" dict="yn"  />              
            </a-form-model-item>
          </a-col>
           <a-col :span="24">
            <a-form-model-item label="運單創建時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status1Time">
              <j-date placeholder="請選擇運單創建時間" v-model="model.status1Time"  style="width: 100%"  date-format="YYYY-MM-DD hh:mm:ss"  />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="倉庫簽入時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status2Time">
              <j-date placeholder="請選擇簽入時間" v-model="model.status2Time"  :show-time="true" date-format="YYYY-MM-DD hh:mm:ss"   style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="轉運時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status3Time">
              <j-date placeholder="請選擇轉運時間" v-model="model.status3Time"  :show-time="true" date-format="YYYY-MM-DD hh:mm:ss"   style="width: 100%" />
            </a-form-model-item>
          </a-col>
            <a-col :span="24">
            <a-form-model-item label="派送時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status4Time">
              <j-date placeholder="請選擇派送時間" v-model="model.status4Time"   :show-time="true" date-format="YYYY-MM-DD hh:mm:ss"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
            <a-col :span="24">
            <a-form-model-item label="上架時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status5Time">
              <j-date placeholder="請選擇上架時間" v-model="model.status5Time"  :show-time="true" date-format="YYYY-MM-DD hh:mm:ss"   style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="簽收時間" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status6Time">
              <j-date placeholder="請選擇簽收時間"  v-model="model.status6Time" :show-time="true" date-format="YYYY-MM-DD hh:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="派送异常时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status7Time">
              <j-date placeholder="請選擇派送異常時間"  v-model="model.status7Time" :show-time="true" date-format="YYYY-MM-DD" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="是否上門取件?" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pickupTag">
              <j-search-select-tag v-model="model.pickupTag" placeholder="請選擇是否上門取件" dict="logistics_pickupTag" /> 
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="攬收日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="pickupDate">
              <j-date placeholder="請選擇攬收日期" v-model="model.pickupDate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="備註" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="remarks">
              <a-input v-model="model.remarks" placeholder="請輸入備註" ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表單區域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="物流貨物表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="logisticsProductListTable.loading"
          :columns="logisticsProductListTable.columns"
          :dataSource="logisticsProductListTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true">
            <template v-slot:qty="props">
              <a-input :value="props.text" name='qty' type="number" />
            </template>
          </j-editable-table>
      </a-tab-pane>
    </a-tabs>


  </a-spin>

</template>


<script>

  import { getAction } from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'LogisticsOrderForm',
    mixins: [JEditableTableModelMixin],
    components: {
    },
    data() {
      return {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol2: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
        model:{
        },
        // 新增時子表默認添加幾行空數據
        addDefaultRowNum: 1,
        validatorRules: {
           userId: [
              { required: true, message: '請輸入物流用戶ID!'},
           ],
           sendName: [
              { required: true, message: '請輸入寄件人姓名!'},
           ],
           sendPhone: [
              { required: true, message: '請輸入寄件人電話!'},
           ],
           sendAddress: [
              { required: true, message: '請輸入攬收地址!'},
           ],
           getName: [
              { required: true, message: '請輸入收件人姓名!'},
           ],
           getPhone: [
              { required: true, message: '請輸入收件人電話!'},
           ],
           getAddress: [
              { required: true, message: '請輸入收件人地址!'},
           ],
        },
        refKeys: ['logisticsProductList', ],
        tableKeys:['logisticsProductList', ],
        activeKey: 'logisticsProductList',
        // 物流貨物表
        logisticsProductListTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '訂單號',
              key: 'orderNo',
              type: FormTypes.hidden,
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
            {
              title: '貨物名稱',
              key: 'productName',
              type: FormTypes.input,
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
            {
              title: '貨物單價',
              key: 'productUnitPrice',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
            {
              title: '貨物數量',
              key: 'qty',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
              // slotName:'qty'
            },
            {
              title: '貨幣單位',
              key: 'currency',
              type: FormTypes.select,
              dictCode:"currency",
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
          ]
        },
        url: {
          add: "/logistics/order/add",
          edit: "/logistics/order/edit",
          queryById: "/order/logisticsOrder/queryById",
          logisticsProductList: {
            list: '/logistics/order/queryLogisticsProductListByMainId'
          },
        },
        isDelId:true
      }
    },
    props: {
      //表單禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
    },
    methods: {
      addBefore(){
        this.logisticsProductListTable.dataSource=[]
      },
      getAllTable() {
        let values = this.tableKeys.map(key => getRefPromise(this, key))
        return Promise.all(values)
      },
      /** 調用完edit()方法之後會自動調用此方法 */
      editAfter() {
        this.$nextTick(() => {
        })
        // 加載子表數據
        if (this.model.orderNo) {
          let params = { id:this.model.orderNo}
          this.requestSubTableData(this.url.logisticsProductList.list, params, this.logisticsProductListTable)
        }
      },
      //校驗所有一對一子表表單
      validateSubForm(allValues){
          return new Promise((resolve,reject)=>{
            Promise.all([
            ]).then(() => {
              resolve(allValues)
            }).catch(e => {
              if (e.error === VALIDATE_NO_PASSED) {
                // 如果有未通過表單驗證的子表，就自動跳轉到它所在的tab
                this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
              } else {
                console.error(e)
              }
            })
          })
      },
      /** 整理成formData */
      classifyIntoFormData(allValues) {
        console.log("allValues:",allValues)
        let main = Object.assign(this.model, allValues.formValue)
        return {
          ...main, // 展開
          logisticsProductsList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
          /** 查詢某個tab的數據 */
      requestSubTableData(url, params, tab, success) {
      tab.loading = true
      getAction(url, params).then(res => {
        let { result } = res;
        let dataSource = []
        if (result) {
          if (Array.isArray(result)) {
            dataSource = result
          } else if (Array.isArray(result.records)) {
            dataSource = result.records
          }
        }
        // delete dataSource["id"];
        dataSource.map((item)=>{
          delete item["id"];
        })
        console.log('dataSource',dataSource)
        tab.dataSource = dataSource
        typeof success === 'function' ? success(res) : ''
      }).finally(() => {
        tab.loading = false
      })
    },
    }
  }
</script>

<style scoped>
</style>