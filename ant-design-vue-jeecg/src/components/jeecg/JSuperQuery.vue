<template>
<div class="j-super-query-box">

  <slot name="button" :isActive="superQueryFlag" :isMobile="izMobile" :open="handleOpen" :reset="handleReset">
    <a-tooltip v-if="superQueryFlag" v-bind="tooltipProps" :mouseLeaveDelay="0.2">
      <!-- begin 不知道為什麼不加上這段代碼就無法生效 -->
      <span v-show="false">{{tooltipProps}}</span>
      <!-- end 不知道為什麼不加上這段代碼就無法生效 -->
      <template slot="title">
        <span>已有高級查詢條件生效</span>
        <a-divider type="vertical"/>
        <a @click="handleReset">清空</a>
      </template>
      <a-button-group>
        <a-button type="primary" @click="handleOpen">
          <a-icon type="appstore" theme="twoTone" spin/>
          <span>高級查詢</span>
        </a-button>
        <a-button v-if="izMobile" type="primary" icon="delete" @click="handleReset"/>
      </a-button-group>
    </a-tooltip>
    <a-button v-else type="primary" icon="filter" @click="handleOpen">高級查詢</a-button>
  </slot>

  <j-modal
    title="高級查詢構造器"
    :width="1000"
    :visible="visible"
    @cancel="handleCancel"
    :mask="false"
    :fullscreen="izMobile"
    class="j-super-query-modal"
    style="top:5%;max-height: 95%;"
  >

    <template slot="footer">
      <div style="float: left">
        <a-button :loading="loading" @click="handleReset">重置</a-button>
        <a-button :loading="loading" @click="handleSave">保存查詢條件</a-button>
      </div>
      <a-button :loading="loading" @click="handleCancel">關閉</a-button>
      <a-button :loading="loading" type="primary" @click="handleOk">查詢</a-button>
    </template>

    <a-spin :spinning="loading">
      <a-row>
        <a-col :sm="24" :md="24-5">

          <a-empty v-if="queryParamsModel.length === 0" style="margin-bottom: 12px;">
            <div slot="description">
              <span>沒有任何查詢條件</span>
              <a-divider type="vertical"/>
              <a @click="handleAdd">點擊新增</a>
            </div>
          </a-empty>

          <a-form v-else layout="inline">

            <a-row style="margin-bottom: 12px;">
              <a-col :md="12" :xs="24">
                <a-form-item label="過濾條件匹配" :labelCol="{md: 6,xs:24}" :wrapperCol="{md: 18,xs:24}" style="width: 100%;">
                  <a-select v-model="matchType" :getPopupContainer="node=>node.parentNode" style="width: 100%;">
                    <a-select-option value="and">AND（所有條件都要求匹配）</a-select-option>
                    <a-select-option value="or">OR（條件中的任意一個匹配）</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>

            <a-row type="flex" style="margin-bottom:10px" :gutter="16" v-for="(item, index) in queryParamsModel" :key="index">

              <a-col :md="8" :xs="24" style="margin-bottom: 12px;">
                <a-tree-select
                  showSearch
                  v-model="item.field"
                  :treeData="fieldTreeData"
                  :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                  placeholder="選擇查詢字段"
                  allowClear
                  treeDefaultExpandAll
                  :getPopupContainer="node=>node.parentNode"
                  style="width: 100%"
                  @select="(val,option)=>handleSelected(option,item)"
                >
                </a-tree-select>
              </a-col>

              <a-col :md="4" :xs="24" style="margin-bottom: 12px;">
                <a-select placeholder="匹配規則" :value="item.rule" :getPopupContainer="node=>node.parentNode" @change="handleRuleChange(item,$event)">
                  <a-select-option value="eq">等於</a-select-option>
                  <a-select-option value="like">包含</a-select-option>
                  <a-select-option value="right_like">以..開始</a-select-option>
                  <a-select-option value="left_like">以..結尾</a-select-option>
                  <a-select-option value="in">在...中</a-select-option>
                  <a-select-option value="ne">不等於</a-select-option>
                  <a-select-option value="gt">大於</a-select-option>
                  <a-select-option value="ge">大於等於</a-select-option>
                  <a-select-option value="lt">小於</a-select-option>
                  <a-select-option value="le">小於等於</a-select-option>
                </a-select>
              </a-col>

              <a-col :md="8" :xs="24" style="margin-bottom: 12px;">
                <!-- 下拉搜索 -->
                <j-search-select-tag v-if="item.type==='sel_search'" v-model="item.val" :dict="getDictInfo(item)" placeholder="請選擇"/>
                <!-- 下拉多選 -->
                <template v-else-if="item.type==='list_multi'">
                  <j-multi-select-tag v-if="item.options" v-model="item.val" :options="item.options" placeholder="請選擇"/>
                  <j-multi-select-tag v-else v-model="item.val" :dictCode="getDictInfo(item)" placeholder="請選擇"/>
                </template>

                <template v-else-if="item.dictCode">
                  <template v-if="item.type === 'table-dict'">
                    <j-popup
                      v-model="item.val"
                      :code="item.dictTable"
                      :field="item.dictCode"
                      :orgFields="item.dictCode"
                      :destFields="item.dictCode"
                      :multi="true"
                    ></j-popup>
                  </template>
                  <template v-else>
                    <j-multi-select-tag v-show="allowMultiple(item)" v-model="item.val" :dictCode="item.dictCode" placeholder="請選擇"/>
                    <j-dict-select-tag v-show="!allowMultiple(item)" v-model="item.val" :dictCode="item.dictCode" placeholder="請選擇"/>
                  </template>
                </template>
                <j-popup
                  v-else-if="item.type === 'popup'"
                  :value="item.val"
                  v-bind="item.popup"
                  group-id="superQuery"
                  @input="(e,v)=>handleChangeJPopup(item,e,v)"
                  :multi="true"/>
                <j-select-multi-user
                  v-else-if="item.type === 'select-user' || item.type === 'sel_user'"
                  v-model="item.val"
                  :buttons="false"
                  :multiple="false"
                  placeholder="請選擇用戶"
                  :returnKeys="['id', item.customReturnField || 'username']"
                />
                <j-select-depart
                  v-else-if="item.type === 'select-depart' || item.type === 'sel_depart'"
                  v-model="item.val"
                  :multi="false"
                  placeholder="請選擇部門"
                  :customReturnField="item.customReturnField || 'id'"
                />
                <a-select
                  v-else-if="item.options instanceof Array"
                  v-model="item.val"
                  :options="item.options"
                  allowClear
                  placeholder="請選擇"
                  :mode="allowMultiple(item)?'multiple':''"
                />
                <j-area-linkage v-model="item.val" v-else-if="item.type==='area-linkage' || item.type==='pca'" style="width: 100%"/>
                <j-date v-else-if=" item.type=='date' " v-model="item.val" placeholder="請選擇日期" style="width: 100%"></j-date>
                <j-date v-else-if=" item.type=='datetime' " v-model="item.val" placeholder="請選擇時間" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%"></j-date>
                <a-time-picker v-else-if="item.type==='time'" :value="item.val ? moment(item.val,'HH:mm:ss') : null" format="HH:mm:ss" style="width: 100%" @change="(time,value)=>item.val=value"/>
                <a-input-number v-else-if=" item.type=='int'||item.type=='number' " style="width: 100%" placeholder="請輸入數值" v-model="item.val"/>
                <a-select v-else-if="item.type=='switch'" placeholder="請選擇" v-model="item.val">
                  <a-select-option value="Y">是</a-select-option>
                  <a-select-option value="N">否</a-select-option>
                </a-select>
                <a-input v-else v-model="item.val" placeholder="請輸入值"/>
              </a-col>

              <a-col :md="4" :xs="0" style="margin-bottom: 12px;">
                <a-button @click="handleAdd" icon="plus"></a-button>&nbsp;
                <a-button @click="handleDel( index )" icon="minus"></a-button>
              </a-col>

              <a-col :md="0" :xs="24" style="margin-bottom: 12px;text-align: right;">
                <a-button @click="handleAdd" icon="plus"></a-button>&nbsp;
                <a-button @click="handleDel( index )" icon="minus"></a-button>
              </a-col>

            </a-row>

          </a-form>
        </a-col>
        <a-col :sm="24" :md="5">
          <!-- 查詢記錄 -->

          <a-card class="j-super-query-history-card" :bordered="true">
            <div slot="title">
              保存的查詢
            </div>

            <a-empty v-if="saveTreeData.length === 0" class="j-super-query-history-empty" description="沒有保存任何查詢"/>
            <a-tree
              v-else
              class="j-super-query-history-tree"
              showIcon
              :treeData="saveTreeData"
              :selectedKeys="[]"
              @select="handleTreeSelect"
            >
            </a-tree>
          </a-card>


        </a-col>
      </a-row>


    </a-spin>

    <a-modal title="請輸入保存的名稱" :visible="prompt.visible" @cancel="prompt.visible=false" @ok="handlePromptOk">
      <a-input v-model="prompt.value"></a-input>
    </a-modal>

  </j-modal>
</div>
</template>

<script>
  import moment from 'moment'
  import * as utils from '@/utils/util'
  import { mixinDevice } from '@/utils/mixin'
  import JDate from '@/components/jeecg/JDate.vue'
  import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
  import JSelectMultiUser from '@/components/jeecgbiz/JSelectMultiUser'
  import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
  import JAreaLinkage from '@comp/jeecg/JAreaLinkage'

  export default {
    name: 'JSuperQuery',
    mixins: [mixinDevice],
    components: { JAreaLinkage, JMultiSelectTag, JDate, JSelectDepart, JSelectMultiUser },
    props: {
      /*
       fieldList: [{
          value:'',
          text:'',
          type:'',
          dictCode:'' // 只要 dictCode 有值，無論 type 是什麼，都显示為字典下拉框
       }]
       type:date datetime int number string
      * */
      fieldList: {
        type: Array,
        required: true
      },
      /*
      * 這個回調函數接收一個數組參數 即查詢條件
      * */
      callback: {
        type: String,
        required: false,
        default: 'handleSuperQuery'
      },

      // 當前是否在加載中
      loading: {
        type: Boolean,
        default: false
      },

      // 保存查詢條件的唯一 code，通過該 code 區分
      // 默認為 null，代表以當前路由全路徑為區分Code
      saveCode: {
        type: String,
        default: null
      }

    },
    data() {
      return {
        moment,
        fieldTreeData: [],

        prompt: {
          visible: false,
          value: ''
        },

        visible: false,
        queryParamsModel: [],
        treeIcon: <a-icon type="file-text"/>,
        // 保存查詢條件的treeData
        saveTreeData: [],
        // 保存查詢條件的前綴名
        saveCodeBefore: 'JSuperQuerySaved_',
        // 查詢類型，過濾條件匹配（and、or）
        matchType: 'and',
        superQueryFlag: false,
      }
    },
    computed: {
      izMobile() {
        return this.device === 'mobile'
      },
      tooltipProps() {
        return this.izMobile ? { visible: false } : {}
      },
      fullSaveCode() {
        let saveCode = this.saveCode
        if (saveCode == null || saveCode === '') {
          saveCode = this.$route.fullPath
        }
        return this.saveCodeBefore + saveCode
      },
    },
    watch: {
      // 當 saveCode 變化時，重新查詢已保存的條件
      fullSaveCode: {
        immediate: true,
        handler() {
          let list = this.$ls.get(this.fullSaveCode)
          if (list instanceof Array) {
            this.saveTreeData = list.map(i => this.renderSaveTreeData(i))
          }
        }
      },
      fieldList: {
        deep: true,
        immediate: true,
        handler(val) {
          let mainData = [], subData = []
          val.forEach(item => {
            let data = { ...item }
            data.label = data.label || data.text
            let hasChildren = (data.children instanceof Array)
            data.disabled = hasChildren
            data.selectable = !hasChildren
            if (hasChildren) {
              data.children = data.children.map(item2 => {
                let child = { ...item2 }
                child.label = child.label || child.text
                child.label = data.label + '-' + child.label
                child.value = data.value + ',' + child.value
                child.val = ''
                return child
              })
              data.val = ''
              subData.push(data)
            } else {
              mainData.push(data)
            }
          })
          this.fieldTreeData = mainData.concat(subData)
        }
      }
    },

    methods: {
      show() {
        if (!this.queryParamsModel || this.queryParamsModel.length === 0) {
          this.resetLine()
        }
        this.visible = true
      },

      getDictInfo(item) {
        let str = ''
        if(!item.dictTable){
          str = item.dictCode
        }else{
          str = item.dictTable+','+item.dictText+','+item.dictCode
        }
        console.log('高級查詢字典信息',str)
        return str
      },
      handleOk() {
        if (!this.isNullArray(this.queryParamsModel)) {
          let event = {
            matchType: this.matchType,
            params: this.removeEmptyObject(this.queryParamsModel)
          }
          // 移動端模式下關閉彈窗
          if (this.izMobile) {
            this.visible = false
          }
          this.emitCallback(event)
        } else {
          this.$message.warn("不能查詢空條件")
        }
      },
      emitCallback(event = {}, loadStatus = true) {
        let { params = [], matchType = this.matchType } = event
        this.superQueryFlag = (params && params.length > 0)
        for (let param of params) {
          if (Array.isArray(param.val)) {
            param.val = param.val.join(',')
          }
        }
        console.debug('---高級查詢參數--->', { params, matchType })
        this.$emit(this.callback, params, matchType, loadStatus)
      },
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleAdd() {
        this.addNewLine()
      },
      addNewLine() {
        this.queryParamsModel.push({ rule: 'eq' })
      },
      resetLine() {
        this.superQueryFlag = false
        this.queryParamsModel = []
        this.addNewLine()
      },
      handleDel(index) {
        this.queryParamsModel.splice(index, 1)
      },
      handleSelected(node, item) {
        let { type, dbType, options, dictCode, dictTable, dictText, customReturnField, popup } = node.dataRef
        item['type'] = type
        item['dbType'] = dbType
        item['options'] = options
        item['dictCode'] = dictCode
        item['dictTable'] = dictTable
        item['dictText'] = dictText
        item['customReturnField'] = customReturnField
        if (popup) {
          item['popup'] = popup
        }
        this.$set(item, 'val', undefined)
      },
      handleOpen() {
        this.show()
      },
      handleOutReset(loadStaus=true) {
        this.resetLine()
        this.emitCallback({}, loadStaus)
      },
      handleReset() {
        this.resetLine()
        this.emitCallback({}, true)
      },
      handleSave() {
        let queryParams = this.removeEmptyObject(this.queryParamsModel)
        if (this.isNullArray(queryParams)) {
          this.$message.warning('空條件不能保存')
        } else {
          this.prompt.value = ''
          this.prompt.visible = true
        }
      },
      handlePromptOk() {
        let { value } = this.prompt
        if(!value){
          this.$message.warning('保存名稱不能為空')
          return
        }
        // 取出查詢條件
        let records = this.removeEmptyObject(this.queryParamsModel)
        // 判斷有沒有重名的
        let filterList = this.saveTreeData.filter(i => i.originTitle === value)
        if (filterList.length > 0) {
          this.$confirm({
            content: `${value} 已存在，是否覆蓋？`,
            onOk: () => {
              this.prompt.visible = false
              filterList[0].records = records
              this.saveToLocalStore()
              this.$message.success('保存成功')
            }
          })
        } else {
          // 沒有重名的，直接添加
          this.prompt.visible = false
          // 添加到樹列表中
          this.saveTreeData.push(this.renderSaveTreeData({
            title: value,
            matchType: this.matchType,
            records: records
          }))
          // 保存到 LocalStore
          this.saveToLocalStore()
          this.$message.success('保存成功')
        }
      },
      handleTreeSelect(idx, event) {
        if (event.selectedNodes[0]) {
          let { matchType, records } = event.selectedNodes[0].data.props
          // 將保存的matchType取出，兼容舊數據，如果沒有保存就還是使用原來的
          this.matchType = matchType || this.matchType
          this.queryParamsModel = utils.cloneObject(records)
        }
      },
      handleRemoveSaveTreeItem(event, vNode) {
        // 阻止事件冒泡
        event.stopPropagation()

        this.$confirm({
          content: '是否刪除當前查詢？',
          onOk: () => {
            let { eventKey } = vNode
            this.saveTreeData.splice(Number.parseInt(eventKey.substring(2)), 1)
            this.saveToLocalStore()
          },
        })
      },

      // 將查詢保存到 LocalStore 里
      saveToLocalStore() {
        let saveValue = this.saveTreeData.map(({ originTitle, matchType, records }) => ({ title: originTitle, matchType, records }))
        this.$ls.set(this.fullSaveCode, saveValue)
      },

      isNullArray(array) {
        //判斷是不是空數組對象
        if (!array || array.length === 0) {
          return true
        }
        if (array.length === 1) {
          let obj = array[0]
          if (!obj.field || (obj.val == null || obj.val === '') || !obj.rule) {
            return true
          }
        }
        return false
      },
      // 去掉數組中的空對象
      removeEmptyObject(arr) {
        let array = utils.cloneObject(arr)
        for (let i = 0; i < array.length; i++) {
          let item = array[i]
          if (item == null || Object.keys(item).length <= 0) {
            array.splice(i--, 1)
          } else {
            if (Array.isArray(item.options)) {
              // 如果有字典屬性，就不需要保存 options 了
              //update-begin-author:taoyan date:20200819 for:【開源問題】 高級查詢 下拉框作為並且選項很多多多 LOWCOD-779
              delete item.options
              //update-end-author:taoyan date:20200819 for:【開源問題】 高級查詢 下拉框作為並且選項很多多多 LOWCOD-779
            }
          }
        }
        return array
      },

      /** 渲染保存查詢條件的 title（加個刪除按鈕） */
      renderSaveTreeData(item) {
        item.icon = this.treeIcon
        item.originTitle = item['title']
        item.title = (arg1, arg2) => {
          let vNode
          // 兼容舊版的Antdv
          if (arg1.dataRef) {
            vNode = arg1
          } else if (arg2.dataRef) {
            vNode = arg2
          } else {
            return <span style="color:red;">Antdv版本不支持</span>
          }
          let {originTitle} = vNode.dataRef
          return (
            <div class="j-history-tree-title">
              <span>{originTitle}</span>

              <div class="j-history-tree-title-closer" onClick={e => this.handleRemoveSaveTreeItem(e, vNode)}>
                <a-icon type="close-circle"/>
              </div>
            </div>
          )
        }
        return item
      },

      /** 判斷是否允許多選 */
      allowMultiple(item) {
        return item.rule === 'in'
      },

      handleRuleChange(item, newValue) {
        let oldValue = item.rule
        this.$set(item, 'rule', newValue)
        // 上一個規則是否是 in，且type是字典或下拉
        if (oldValue === 'in') {
          if (item.dictCode || item.options instanceof Array) {
            let value = item.val
            if (typeof item.val === 'string') {
              value = item.val.split(',')[0]
            } else if (Array.isArray(item.val)) {
              value = item.val[0]
            }
            this.$set(item, 'val', value)
          }
        }
      },

      handleChangeJPopup(item, e, values) {
        item.val = values[item.popup['destFields']]
      },

    }
  }
</script>

<style lang="less" scoped>

  .j-super-query-box {
    display: inline-block;
  }

  .j-super-query-modal {

    .j-super-query-history-card {
      /deep/ .ant-card-body,
      /deep/ .ant-card-head-title {
        padding: 0;
      }

      /deep/ .ant-card-head {
        padding: 4px 8px;
        min-height: initial;
      }
    }

    .j-super-query-history-empty {
      /deep/ .ant-empty-image {
        height: 80px;
        line-height: 80px;
        margin-bottom: 0;
      }

      /deep/ img {
        width: 80px;
        height: 65px;
      }

      /deep/ .ant-empty-description {
        color: #afafaf;
        margin: 8px 0;
      }
    }

    .j-super-query-history-tree {

      .j-history-tree-title {
        width: calc(100% - 24px);
        position: relative;
        display: inline-block;

        &-closer {
          color: #999999;
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 24px;
          text-align: center;
          opacity: 0;
          transition: opacity 0.3s, color 0.3s;

          &:hover {
            color: #666666;
          }

          &:active {
            color: #333333;
          }
        }

        &:hover {
          .j-history-tree-title-closer {
            opacity: 1;
          }
        }

      }

      /deep/ .ant-tree-switcher {
        display: none;
      }

      /deep/ .ant-tree-node-content-wrapper {
        width: 100%;
      }
    }

  }

</style>