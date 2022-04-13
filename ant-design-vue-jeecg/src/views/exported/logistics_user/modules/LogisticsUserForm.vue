<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <!-- 主表單區域 -->
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24" >
            <a-form-model-item label="登錄令牌" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="token">
              <a-input v-model="model.token" placeholder="請輸入登錄令牌" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="公司名稱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="請輸入公司名稱" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="登錄名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="username">
              <a-input v-model="model.username" placeholder="請輸入登錄名" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="電郵地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="email">
              <a-input v-model="model.email" placeholder="請輸入電郵地址" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="密碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="password">
              <a-row :gutter="10">
                <a-col :xs='24' :sm='18'><a-input v-model="model.password" placeholder="請輸入密碼" ></a-input></a-col>
                <a-col :xs='24' :sm='6'><a-button type='primary' @click="pwGenerator(4,8)">生成隨機密碼</a-button></a-col>
              </a-row>
            </a-form-model-item>
            
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="鹽" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="salt">
              <a-input v-model="model.salt" placeholder="請輸入鹽" disabled></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="聯絡人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactPerson">
              <a-input v-model="model.contactPerson" placeholder="請輸入聯絡人" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="電話號碼" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="phone">
              <a-input v-model="model.phone" placeholder="請輸入電話號碼" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="公司區域ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyRegionId">
              <j-dict-select-tag type="list" v-model="model.companyRegionId" dictCode="district" placeholder="請選擇公司區域ID" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="公司地區ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyAreaId">
              <j-dict-select-tag type="list" v-model="model.companyAreaId" dictCode="area" placeholder="請選擇公司地區ID" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="街道名稱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyStreet">
              <a-input v-model="model.companyStreet" placeholder="請輸入街道名稱" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="大廈名稱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyBuilding">
              <a-input v-model="model.companyBuilding" placeholder="請輸入大廈名稱" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="公司地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="companyAddress">
              <a-input v-model="model.companyAddress" placeholder="請輸入公司地址" ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24" >
            <a-form-model-item label="應用密鑰" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="appKey">
              <a-input v-model="model.appKey" placeholder="請輸入應用密鑰" disabled></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
      <!-- 子表單區域 -->
    <a-tabs v-model="activeKey" @change="handleChangeTabs">
      <a-tab-pane tab="物流計費規則表" :key="refKeys[0]" :forceRender="true">
        <j-editable-table
          :ref="refKeys[0]"
          :loading="logisticsMoneyTable.loading"
          :columns="logisticsMoneyTable.columns"
          :dataSource="logisticsMoneyTable.dataSource"
          :maxHeight="300"
          :disabled="formDisabled"
          :rowNumber="true"
          :rowSelection="true"
          :actionButton="true"/>
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script>
  import JEditableTable from '@/components/jeecg/JEditableTable'
  import { getAction } from '@/api/manage'
  import { FormTypes,getRefPromise,VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
  import { JEditableTableModelMixin } from '@/mixins/JEditableTableModelMixin'
  import { validateDuplicateValue } from '@/utils/util'



  export default {
    name: 'LogisticsUserForm',
    mixins: [JEditableTableModelMixin],
    components: {
      JEditableTable 
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
           token: [
              { required: false},
              { validator: (rule, value, callback) => validateDuplicateValue('logistics_user', 'token', value, this.model.id, callback)},
           ],
           username: [
              { required: true, message: '請輸入登錄名!'},
              { validator: (rule, value, callback) => validateDuplicateValue('logistics_user', 'username', value, this.model.id, callback)},
           ],
           password: [
              { required: true, message: '請輸入密碼!'},
              {min:4,max:20,message:'長度不符合要求！'}
           ],
           phone: [
              { required: false},
              { pattern: /^\d{6,16}$/, message: '請輸入6到16位数字!'},
           ],
           appKey: [
              { required: false},
              { validator: (rule, value, callback) => validateDuplicateValue('logistics_user', 'app_key', value, this.model.id, callback)},
           ],
        },
        refKeys: ['logisticsMoney', ],
        tableKeys:['logisticsMoney', ],
        activeKey: 'logisticsMoney',
        // 物流計費規則表
        logisticsMoneyTable: {
          loading: false,
          dataSource: [],
          columns: [
            {
              title: '計費類型',
              key: 'type',
              type: FormTypes.sel_search,
              dictCode:"price_rule",
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
            },
            {
              title: '首重',
              key: 'firstWeight',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
            {
              title: '首重金额',
              key: 'firstMoney',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
            {
              title: '續重金額',
              key: 'money',
              type: FormTypes.inputNumber,
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
            {
              title: '地區id',
              key: 'areaIds',
              type: FormTypes.list_multi,
              dictCode:"common_area,area,id",
              width:"250px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
            {
              title: '所屬快遞公司',
              key: 'companyId',
              type: FormTypes.select,
              dictCode:"logistics_company,name,id",
              width:"200px",
              placeholder: '請輸入${title}',
              defaultValue:'',
              validateRules: [{ required: true, message: '${title}不能為空' }],
            },
          ]
        },
        url: {
          add: "/logistics/user/add",
          edit: "/logistics/user/edit",
          queryById: "/logistics/user/queryById",
          logisticsMoney: {
            list: '/logistics/user/queryLogisticsMoneyByMainId'
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
        const rawArray=[
          {type:'SELF_SERVICE_STATION',},
          {type:'SELF_PICKUP_STATION_3'},
          {type:'SELF_PICKUP_STATION_20'},
          {type:'HOME_DELIVERY_SMALL_20'},
          {type:'HOME_DELIVERY_SMALL_30'},
          {type:'HOME_DELIVERY_BIG_50'},
          {type:'HOME_DELIVERY_BIG_75'},
          {type:'HOME_DELIVERY_BIG_100'},
        ];
        // firstWeight:1,firstMoney:1,money:1,,
        let dataArray=rawArray.map(element => {
          element=Object.assign({},element,{areaIds:'17,16,15,14,13,12,11,10,9,8,7,6,5,4,3',companyId:'7'})
          switch(element.type){
            case 'SELF_SERVICE_STATION':
              element=Object.assign({},element,{firstWeight:'3.00',firstMoney:'15.00',money:'0.00'})
            break;
            case 'SELF_PICKUP_STATION_3':
              element=Object.assign({},element,{firstWeight:'1.00',firstMoney:'8',money:'3.50'})
            break;
            case 'SELF_PICKUP_STATION_20':
              element=Object.assign({},element,{firstWeight:'4.00',firstMoney:'20.00',money:'5.00'})
            break;
            case 'HOME_DELIVERY_SMALL_20':
              element=Object.assign({},element,{firstWeight:'5.00',firstMoney:'35.00',money:'3.00'})
            break;
            case 'HOME_DELIVERY_SMALL_30':
              element=Object.assign({},element,{firstWeight:'21.00',firstMoney:'85.00',money:'5.00'})
            break;
            case 'HOME_DELIVERY_BIG_50':
              element=Object.assign({},element,{firstWeight:'20.00',firstMoney:'120.00',money:'0.00'})
            break;
            case 'HOME_DELIVERY_BIG_75':
              element=Object.assign({},element,{firstWeight:'51.00',firstMoney:'120.00',money:'0.00'})
            break;
            case 'HOME_DELIVERY_BIG_100':
              element=Object.assign({},element,{firstWeight:'76.00',firstMoney:'120.00',money:'0.00'})
            break;
            default:break;
          }
          return element
        });
        this.logisticsMoneyTable.dataSource=dataArray.slice(0);
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
        if (this.model.id) {
          let params = { id: this.model.id }
          this.requestSubTableData(this.url.logisticsMoney.list, params, this.logisticsMoneyTable)
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
        console.log('數據詳情',allValues);
        let main = Object.assign(this.model, allValues.formValue)
        let dataArray=allValues.tablesValue[0].values.slice(0);
        dataArray.map(item=>{
          if(typeof(item.id)!='number'){
            item.id=parseInt(item.id);
          }
          return item;
        })
        return {
          ...main, // 展開
          logisticsMoneyList: allValues.tablesValue[0].values,
        }
      },
      validateError(msg){
        this.$message.error(msg)
      },
      pwGenerator(min,max){
        const lowerCaseStr='abcdefghijklmnopqrstuvwxyz';
        const upperCaseStr=lowerCaseStr.toUpperCase();
        const numberStr='1234567890';
        let sourceStr=lowerCaseStr+upperCaseStr+numberStr;
        let pw='';
        let length=Math.floor(Math.random() * (max - min + 1) + min)
        for(let i=0;i<length;i++){
          pw+=sourceStr.charAt(Math.floor(Math.random()*sourceStr.length));
        }
        this.model.password=pw;
      }
    }
  }
</script>

<style scoped>
</style>