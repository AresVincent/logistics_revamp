<template>
  <j-modal
    :width="modalWidth"
    :visible="visible"
    :title="title"
    switchFullscreen
    wrapClassName="j-user-select-modal"
    @ok="handleSubmit"
    @cancel="close"
    style="top:50px"
    cancelText="關閉"
  >
    <a-row :gutter="10" style="background-color: #ececec; padding: 10px; margin: -10px">
      <a-col :md="6" :sm="24">
        <a-card :bordered="false">
          <!--組織機構-->
          <a-directory-tree
            selectable
            :selectedKeys="selectedDepIds"
            :checkStrictly="true"
            :dropdownStyle="{maxHeight:'200px',overflow:'auto'}"
            :treeData="departTree"
            :expandAction="false"
            @select="onDepSelect"
            :load-data="onLoadDepartment"
          />
        </a-card>
      </a-col>
      <a-col :md="18" :sm="24">
        <a-card :bordered="false">
          用戶賬號:
          <a-input-search
            :style="{width:'150px',marginBottom:'15px'}"
            placeholder="請輸入賬號"
            v-model="queryParam.username"
            @search="onSearch"
          ></a-input-search>
          <a-button @click="searchReset(1)" style="margin-left: 20px" icon="redo">重置</a-button>
          <!--用戶列表-->
          <a-table
            ref="table"
            :scroll="scrollTrigger"
            size="middle"
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type: getType}"
            :loading="loading"
            @change="handleTableChange">
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </j-modal>
</template>

<script>
  import { pushIfNotExist, filterObj } from '@/utils/util'
  import {queryDepartTreeList, getUserList, queryUserByDepId, queryDepartTreeSync} from '@/api/api'
  import { getAction } from '@/api/manage'

  export default {
    name: 'JSelectUserByDepModal',
    components: {},
    props: ['modalWidth', 'multi', 'userIds', 'store', 'text'],
    data() {
      return {
        queryParam: {
          username: "",
        },
        columns: [
          {
            title: '用戶賬號',
            align: 'center',
            dataIndex: 'username'
          },
          {
            title: '用戶姓名',
            align: 'center',
            dataIndex: 'realname'
          },
          {
            title: '性別',
            align: 'center',
            dataIndex: 'sex',
            customRender: function (text) {
              if (text === 1) {
                return '男'
              } else if (text === 2) {
                return '女'
              } else {
                return text
              }
            }
          },
          {
            title: '手機',
            align: 'center',
            dataIndex: 'phone'
          },
          {
            title: '部門',
            align: 'center',
            dataIndex: 'orgCodeTxt'
          }
        ],
        scrollTrigger: {},
        dataSource: [],
        selectionRows: [],
        selectedRowKeys: [],
        selectUserRows: [],
        selectUserIds: [],
        title: '根據部門選擇用戶',
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + '-' + range[1] + ' 共' + total + '條'
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter: {
          column: 'createTime',
          order: 'desc'
        },
        selectedDepIds: [],
        departTree: [],
        visible: false,
        form: this.$form.createForm(this),
        loading: false,
        expandedKeys: [],
      }
    },
    computed: {
      // 計算屬性的 getter
      getType: function () {
        return this.multi == true ? 'checkbox' : 'radio';
      }
    },
    watch: {
      userIds: {
        immediate: true,
        handler() {
          this.initUserNames()
        }
      },
    },
    created() {
      // 該方法觸發屏幕自適應
      this.resetScreenSize();
      this.loadData()
    },
    methods: {
      initUserNames() {
        if (this.userIds) {
          // 這裏最後加一個 , 的原因是因為無論如何都要使用 in 查詢，防止後台進行了模糊匹配，導致查詢結果不準確
          let values = this.userIds.split(',') + ','
          let param = {[this.store]: values}
          getAction('/sys/user/getMultiUser', param).then((list)=>{
            this.selectionRows = []
            let selectedRowKeys = []
            let textArray = []
            if(list && list.length>0){
              for(let user of list){
                textArray.push(user[this.text])
                selectedRowKeys.push(user['id'])
                this.selectionRows.push(user)
              }
            }
            this.selectedRowKeys = selectedRowKeys
            this.$emit('initComp', textArray.join(','))
          })

        } else {
          // JSelectUserByDep組件bug issues/I16634
          this.$emit('initComp', '')
          // 前端用戶選擇單選無法置空的問題 #2610
          this.selectedRowKeys = []
        }
      },
      async loadData(arg) {
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams()//查詢條件
        this.loading = true
        getAction('/sys/user/queryUserComponentData', params).then(res=>{
          if (res.success) {
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
        }).finally(() => {
          this.loading = false
        })
      },
      // 觸發屏幕自適應
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 500) {
          this.scrollTrigger = {x: 800};
        } else {
          this.scrollTrigger = {};
        }
      },
      showModal() {
        this.visible = true;
        this.queryDepartTree();
        this.initUserNames()
        this.loadData();
        this.form.resetFields();
      },
      getQueryParams() {
        let param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        param.departId = this.selectedDepIds.join(',')
        return filterObj(param);
      },
      getQueryField() {
        let str = 'id,';
        for (let a = 0; a < this.columns.length; a++) {
          str += ',' + this.columns[a].dataIndex;
        }
        return str;
      },
      searchReset(num) {
        let that = this;
        that.selectedRowKeys = [];
        that.selectUserIds = [];
        that.selectedDepIds = [];
        if (num !== 0) {
          that.queryParam = {};
          that.loadData(1);
        }
      },
      close() {
        this.searchReset(0);
        this.visible = false;
      },
      handleTableChange(pagination, filters, sorter) {
        //TODO 篩選
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = 'ascend' === sorter.order ? 'asc' : 'desc';
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleSubmit() {
        let that = this;
        this.getSelectUserRows();
        that.$emit('ok', that.selectUserRows);
        that.searchReset(0)
        that.close();
      },
      //獲取選擇用戶信息
      getSelectUserRows() {
        this.selectUserRows = []
        for (let row of this.selectionRows) {
          if (this.selectedRowKeys.includes(row.id)) {
            this.selectUserRows.push(row)
          }
        }
        this.selectUserIds = this.selectUserRows.map(row => row.username).join(',')
      },
      // 點擊樹節點,篩選出對應的用戶
      onDepSelect(selectedDepIds) {
        if (selectedDepIds[0] != null) {
          if (this.selectedDepIds[0] !== selectedDepIds[0]) {
            this.selectedDepIds = [selectedDepIds[0]];
          }
          this.loadData(1);
        }
      },
      onSelectChange(selectedRowKeys, selectionRows) {
        this.selectedRowKeys = selectedRowKeys;
        selectionRows.forEach(row => pushIfNotExist(this.selectionRows, row, 'id'))
      },
      onSearch() {
        this.loadData(1);
      },
      // 根據選擇的id來查詢用戶信息
      initQueryUserByDepId(selectedDepIds) {
        this.loading = true
        return queryUserByDepId({id: selectedDepIds.toString()}).then((res) => {
          if (res.success) {
            this.dataSource = res.result;
            this.ipagination.total = res.result.length;
          }
        }).finally(() => {
          this.loading = false
        })
      },
      queryDepartTree() {
        //update-begin-author:taoyan date:20211202 for: 異步加載部門樹 https://github.com/jeecgboot/jeecg-boot/issues/3196
        this.expandedKeys = []
        this.departTree = []
        queryDepartTreeSync().then((res) => {
          if (res.success) {
            for (let i = 0; i < res.result.length; i++) {
              let temp = res.result[i]
              this.departTree.push(temp)
            }
          }
        })
      },
      onLoadDepartment(treeNode){
        return new Promise(resolve => {
          queryDepartTreeSync({pid:treeNode.dataRef.id}).then((res) =>  {
            if (res.success) {
              //判斷chidlren是否為空，並修改isLeaf屬性值
              if(res.result.length == 0){
                treeNode.dataRef['isLeaf']=true
                return;
              }else{
                treeNode.dataRef['children']= res.result;
              }
            }
          })
          resolve();
        });
      },
      //update-end-author:taoyan date:20211202 for: 異步加載部門樹 https://github.com/jeecgboot/jeecg-boot/issues/3196
      modalFormOk() {
        this.loadData();
      }
    }
  }
</script>

<style scoped>
  .ant-table-tbody .ant-table-row td {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  #components-layout-demo-custom-trigger .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color .3s;
  }
</style>
