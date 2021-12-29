<template xmlns:background-color="http://www.w3.org/1999/xhtml">
  <a-row :gutter="10">
    <a-col :md="12" :sm="24">
      <a-card :bordered="false">

        <!-- 按鈕操作區域 -->
        <a-row style="margin-left: 14px">
          <a-button @click="handleAdd(1)" type="primary">添加部門</a-button>
          <a-button @click="handleAdd(2)" type="primary">添加下級</a-button>
          <a-button type="primary" icon="download" @click="handleExportXls('部門信息')">導出</a-button>
          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
            <a-button type="primary" icon="import">導入</a-button>
          </a-upload>
          <a-button title="刪除多條數據" @click="batchDel" type="default">批量刪除</a-button>
          <!--<a-button @click="refresh" type="default" icon="reload" :loading="loading">刷新</a-button>-->
        </a-row>
        <div style="background: #fff;padding-left:16px;height: 100%; margin-top: 5px">
          <a-alert type="info" :showIcon="true">
            <div slot="message">
              當前選擇：<span v-if="this.currSelected.title">{{ getCurrSelectedTitle() }}</span>
              <a v-if="this.currSelected.title" style="margin-left: 10px" @click="onClearSelected">取消選擇</a>
            </div>
          </a-alert>
          <a-input-search @search="onSearch" style="width:100%;margin-top: 10px" placeholder="請輸入部門名稱"/>
          <!-- 樹-->
          <a-col :md="10" :sm="24">
            <template>
              <a-dropdown :trigger="[this.dropTrigger]" @visibleChange="dropStatus">
               <span style="user-select: none">
            <a-tree
              checkable
              multiple
              @select="onSelect"
              @check="onCheck"
              @rightClick="rightHandle"
              :selectedKeys="selectedKeys"
              :checkedKeys="checkedKeys"
              :treeData="departTree"
              :checkStrictly="checkStrictly"
              :expandedKeys="iExpandedKeys"
              :autoExpandParent="autoExpandParent"
              @expand="onExpand"/>
                </span>
                <!--新增右鍵點擊事件,和增加添加和刪除功能-->
                <a-menu slot="overlay">
                  <a-menu-item @click="handleAdd(3)" key="1">添加</a-menu-item>
                  <a-menu-item @click="handleDelete" key="2">刪除</a-menu-item>
                  <a-menu-item @click="closeDrop" key="3">取消</a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </a-col>
        </div>
      </a-card>
      <!---- author:os_chengtgen -- date:20190827 --  for:切換父子勾選模式 =======------>
      <div class="drawer-bootom-button">
        <a-dropdown :trigger="['click']" placement="topCenter">
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="switchCheckStrictly(1)">父子關聯</a-menu-item>
            <a-menu-item key="2" @click="switchCheckStrictly(2)">取消關聯</a-menu-item>
            <a-menu-item key="3" @click="checkALL">全部勾選</a-menu-item>
            <a-menu-item key="4" @click="cancelCheckALL">取消全選</a-menu-item>
            <a-menu-item key="5" @click="expandAll">展開所有</a-menu-item>
            <a-menu-item key="6" @click="closeAll">合併所有</a-menu-item>
          </a-menu>
          <a-button>
            樹操作 <a-icon type="up" />
          </a-button>
        </a-dropdown>
      </div>
      <!---- author:os_chengtgen -- date:20190827 --  for:切換父子勾選模式 =======------>
    </a-col>
    <a-col :md="12" :sm="24">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="基本信息" key="1" >
          <a-card :bordered="false" v-if="selectedKeys.length>0">
            <a-form-model ref="form" :model="model" :rules="validatorRules">
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="departName" label="機構名稱">
                <a-input placeholder="請輸入機構/部門名稱" v-model="model.departName" />
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="上級部門">
                <a-tree-select
                  style="width:100%"
                  :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
                  :treeData="treeData"
                  :disabled="disable"
                  v-model="model.parentId"
                  placeholder="無">
                </a-tree-select>
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orgCode" label="機構編碼">
                <a-input disabled placeholder="請輸入機構編碼" v-model="model.orgCode" />
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="orgCategory" label="機構類型">
                <template v-if="orgCategoryDisabled">
                  <a-radio-group v-model="model.orgCategory" placeholder="請選擇機構類型">
                    <a-radio value="1">
                      公司
                    </a-radio>
                  </a-radio-group>
                </template>
                <template v-else>
                  <a-radio-group v-model="model.orgCategory" placeholder="請選擇機構類型">
                    <a-radio value="2">
                      部門
                    </a-radio>
                    <a-radio value="3">
                      崗位
                    </a-radio>
                  </a-radio-group>
                </template>
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
                <a-input-number v-model="model.departOrder" />
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手機號">
                <a-input placeholder="請輸入手機號" v-model="model.mobile" />
              </a-form-model-item>
              <a-form-model-item  :labelCol="labelCol" :wrapperCol="wrapperCol"  label="地址">
                <a-input placeholder="請輸入地址" v-model="model.address"/>
              </a-form-model-item>
              <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="備註">
                <a-textarea placeholder="請輸入備註" v-model="model.memo"/>
              </a-form-model-item>
            </a-form-model>
            <div class="anty-form-btn">
              <a-button @click="emptyCurrForm" type="default" htmlType="button" icon="sync">重置</a-button>
              <a-button @click="submitCurrForm" type="primary" htmlType="button" icon="form">保存</a-button>
            </div>
          </a-card>
          <a-card v-else >
            <a-empty>
              <span slot="description"> 請先選擇一個部門! </span>
            </a-empty>
          </a-card>
        </a-tab-pane>
        <a-tab-pane tab="部門權限" key="2" forceRender>
          <depart-auth-modal ref="departAuth"/>
        </a-tab-pane>
      </a-tabs>

    </a-col>
    <depart-modal ref="departModal" @ok="loadTree"></depart-modal>
  </a-row>
</template>
<script>
  import DepartModal from './modules/DepartModal'
  import {queryDepartTreeList, searchByKeywords, deleteByDepartId} from '@/api/api'
  import {httpAction, deleteAction} from '@/api/manage'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import DepartAuthModal from './modules/DepartAuthModal'
  // 表頭
  const columns = [
    {
      title: '機構名稱',
      dataIndex: 'departName'
    },
    {
      title: '機構類型',
      align: 'center',
      dataIndex: 'orgType'
    },
    {
      title: '機構編碼',
      dataIndex: 'orgCode',
    },
    {
      title: '手機號',
      dataIndex: 'mobile'
    },
    {
      title: '傳真',
      dataIndex: 'fax'
    },
    {
      title: '地址',
      dataIndex: 'address'
    },
    {
      title: '排序',
      align: 'center',
      dataIndex: 'departOrder'
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'action',
      scopedSlots: {customRender: 'action'}
    }
  ]
  export default {
    name: 'DepartList',
    mixins: [JeecgListMixin],
    components: {
      DepartAuthModal,
      DepartModal
    },
    data() {
      return {
        iExpandedKeys: [],
        loading: false,
        autoExpandParent: true,
        currFlowId: '',
        currFlowName: '',
        disable: true,
        treeData: [],
        visible: false,
        departTree: [],
        rightClickSelectedKey: '',
        rightClickSelectedOrgCode: '',
        hiding: true,
        model: {},
        dropTrigger: '',
        depart: {},
        columns: columns,
        disableSubmit: false,
        checkedKeys: [],
        selectedKeys: [],
        autoIncr: 1,
        currSelected: {},
        allTreeKeys:[],
        checkStrictly: true,
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16}
        },
        graphDatasource: {
          nodes: [],
          edges: []
        },
        validatorRules: {
          departName: [{required: true, message: '請輸入機構/部門名稱!'}],
          orgCode: [{required: true, message: '請輸入機構編碼!'}],
          orgCategory:[{required: true, message: '請輸入機構類型!'}],
          mobile:[{validator: this.validateMobile}]
        },
        url: {
          delete: '/sys/sysDepart/delete',
          edit: '/sys/sysDepart/edit',
          deleteBatch: '/sys/sysDepart/deleteBatch',
          exportXlsUrl: "sys/sysDepart/exportXls",
          importExcelUrl: "sys/sysDepart/importExcel",
        },
        orgCategoryDisabled:false,
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      loadData() {
        this.refresh();
      },
      loadTree() {
        var that = this
        that.treeData = []
        that.departTree = []
        queryDepartTreeList().then((res) => {
          if (res.success) {
            //部門全選后，再添加部門，選中數量增多
            this.allTreeKeys = [];
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              that.treeData.push(temp)
              that.departTree.push(temp)
              that.setThisExpandedKeys(temp)
              that.getAllKeys(temp);
              // console.log(temp.id)
            }
            this.loading = false
          }
        })
      },
      setThisExpandedKeys(node) {
        if (node.children && node.children.length > 0) {
          this.iExpandedKeys.push(node.key)
          for (let a = 0; a < node.children.length; a++) {
            this.setThisExpandedKeys(node.children[a])
          }
        }
      },
      refresh() {
        this.loading = true
        this.loadTree()
      },
      // 右鍵操作方法
      rightHandle(node) {
        this.dropTrigger = 'contextmenu'
        console.log(node.node.eventKey)
        this.rightClickSelectedKey = node.node.eventKey
        this.rightClickSelectedOrgCode = node.node.dataRef.orgCode
      },
      onExpand(expandedKeys) {
        console.log('onExpand', expandedKeys)
        this.iExpandedKeys = expandedKeys
        this.autoExpandParent = false
      },
      backFlowList() {
        this.$router.back(-1)
      },
      // 右鍵點擊下拉框改變事件
      dropStatus(visible) {
        if (visible == false) {
          this.dropTrigger = ''
        }
      },
      // 右鍵下拉關閉下拉框
      closeDrop() {
        this.dropTrigger = ''
      },
      addRootNode() {
        this.$refs.nodeModal.add(this.currFlowId, '')
      },
      batchDel: function () {
        console.log(this.checkedKeys)
        if (this.checkedKeys.length <= 0) {
          this.$message.warning('請選擇一條記錄！')
        } else {
          var ids = ''
          for (var a = 0; a < this.checkedKeys.length; a++) {
            ids += this.checkedKeys[a] + ','
          }
          var that = this
          this.$confirm({
            title: '確認刪除',
            content: '確定要刪除所選中的 ' + this.checkedKeys.length + ' 條數據，以及子節點數據嗎?',
            onOk: function () {
              deleteAction(that.url.deleteBatch, {ids: ids}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.loadTree()
                  that.onClearSelected()
                } else {
                  that.$message.warning(res.message)
                }
              })
            }
          })
        }
      },
      onSearch(value) {
        let that = this
        if (value) {
          searchByKeywords({keyWord: value}).then((res) => {
            if (res.success) {
              that.departTree = []
              for (let i = 0; i < res.result.length; i++) {
                let temp = res.result[i]
                that.departTree.push(temp)
              }
            } else {
              that.$message.warning(res.message)
            }
          })
        } else {
          that.loadTree()
        }

      },
      nodeModalOk() {
        this.loadTree()
      },
      nodeModalClose() {
      },
      hide() {
        console.log(111)
        this.visible = false
      },
      onCheck(checkedKeys, info) {
        console.log('onCheck', checkedKeys, info)
        this.hiding = false
        //---- author:os_chengtgen -- date:20190827 --  for:切換父子勾選模式 =======------
        if(this.checkStrictly){
          this.checkedKeys = checkedKeys.checked;
        }else{
          this.checkedKeys = checkedKeys
        }
        //---- author:os_chengtgen -- date:20190827 --  for:切換父子勾選模式 =======------
      },
      onSelect(selectedKeys, e) {
        console.log('selected', selectedKeys, e)
        this.hiding = false
        let record = e.node.dataRef
        console.log('onSelect-record', record)
        this.currSelected = Object.assign({}, record)
        this.model = this.currSelected
        this.selectedKeys = [record.key]
        this.model.parentId = record.parentId
        this.setValuesToForm(record)
        this.$refs.departAuth.show(record.id);

      },
      // 觸發onSelect事件時,為部門樹右側的form表單賦值
      setValuesToForm(record) {
        if(record.orgCategory == '1'){
          this.orgCategoryDisabled = true;
        }else{
          this.orgCategoryDisabled = false;
        }
      },
      getCurrSelectedTitle() {
        return !this.currSelected.title ? '' : this.currSelected.title
      },
      onClearSelected() {
        this.hiding = true
        this.checkedKeys = []
        this.currSelected = {}
        this.selectedKeys = []
        this.$refs.departAuth.departId = ''
      },
      handleNodeTypeChange(val) {
        this.currSelected.nodeType = val
      },
      notifyTriggerTypeChange(value) {
        this.currSelected.notifyTriggerType = value
      },
      receiptTriggerTypeChange(value) {
        this.currSelected.receiptTriggerType = value
      },
      submitCurrForm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (!this.currSelected.id) {
              this.$message.warning('請點擊選擇要修改部門!')
              return
            }

            httpAction(this.url.edit, this.currSelected, 'put').then((res) => {
              if (res.success) {
                this.$message.success('保存成功!')
                this.loadTree()
              } else {
                this.$message.error(res.message)
              }
            })
          }
        })
      },
      emptyCurrForm() {
        this.$refs.form.resetFields();
        this.model={}
      },
      nodeSettingFormSubmit() {
        this.$refs.form.validate(valid => {
          if (valid) {
            console.log('Received values of form: ', this.model)
          }
        })
      },
      openSelect() {
        this.$refs.sysDirectiveModal.show()
      },
      handleAdd(num) {
        if (num == 1) {
          this.$refs.departModal.add()
          this.$refs.departModal.title = '新增'
        } else if (num == 2) {
          let key = this.currSelected.key
          if (!key) {
            this.$message.warning('請先點擊選中上級部門！')
            return false
          }
          this.$refs.departModal.add(this.selectedKeys)
          this.$refs.departModal.title = '新增'
        } else {
          this.$refs.departModal.add(this.rightClickSelectedKey)
          this.$refs.departModal.title = '新增'
        }
      },
      handleDelete() {
        var that = this
        this.$confirm({
          title: '確認刪除',
          content: '確定要刪除此部門以及子節點數據嗎?',
          onOk: function () {
            deleteByDepartId({id: that.rightClickSelectedKey}).then((resp) => {
              if (resp.success) {
                //刪除成功后，去除已選中中的數據
                that.checkedKeys.splice(that.checkedKeys.findIndex(key => key === that.rightClickSelectedKey), 1);
                that.$message.success('刪除成功!')
                that.loadTree()
                //刪除后同步清空右側基本信息內容
                let orgCode=that.model.orgCode;
                if(orgCode && orgCode === that.rightClickSelectedOrgCode){
                  that.onClearSelected()
                }
              } else {
                that.$message.warning('刪除失敗!')
              }
            })
          }
        })
      },
      selectDirectiveOk(record) {
        console.log('選中指令數據', record)
        this.nodeSettingForm.setFieldsValue({directiveCode: record.directiveCode})
        this.currSelected.sysCode = record.sysCode
      },
      getFlowGraphData(node) {
        this.graphDatasource.nodes.push({
          id: node.id,
          text: node.flowNodeName
        })
        if (node.children.length > 0) {
          for (let a = 0; a < node.children.length; a++) {
            let temp = node.children[a]
            this.graphDatasource.edges.push({
              source: node.id,
              target: temp.id
            })
            this.getFlowGraphData(temp)
          }
        }
      },
     //---- author:os_chengtgen -- date:20190827 --  for:切換父子勾選模式 =======------
      expandAll () {
        this.iExpandedKeys = this.allTreeKeys
      },
      closeAll () {
        this.iExpandedKeys = []
      },
      checkALL () {
        this.checkStriccheckStrictlytly = false
        this.checkedKeys = this.allTreeKeys
      },
      cancelCheckALL () {
        //this.checkedKeys = this.defaultCheckedKeys
        this.checkedKeys = []
      },
      switchCheckStrictly (v) {
        if(v==1){
          this.checkStrictly = false
        }else if(v==2){
          this.checkStrictly = true
        }
      },
      getAllKeys(node) {
        // console.log('node',node);
        this.allTreeKeys.push(node.key)
        if (node.children && node.children.length > 0) {
          for (let a = 0; a < node.children.length; a++) {
            this.getAllKeys(node.children[a])
          }
        }
      }
      //---- author:os_chengtgen -- date:20190827 --  for:切換父子勾選模式 =======------

    },
    created() {
      this.currFlowId = this.$route.params.id
      this.currFlowName = this.$route.params.name
      // this.loadTree()
    },

  }
</script>
<style scoped>
  .ant-card-body .table-operator {
    margin: 15px;
  }

  .anty-form-btn {
    width: 100%;
    text-align: center;
  }

  .anty-form-btn button {
    margin: 0 5px;
  }

  .anty-node-layout .ant-layout-header {
    padding-right: 0
  }

  .header {
    padding: 0 8px;
  }

  .header button {
    margin: 0 3px
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }

  #app .desktop {
    height: auto !important;
  }

  /** Button按鈕間距 */
  .ant-btn {
    margin-left: 3px
  }

  .drawer-bootom-button {
    /*position: absolute;*/
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: left;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
</style>