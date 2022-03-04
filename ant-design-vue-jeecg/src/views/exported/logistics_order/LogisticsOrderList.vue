<template>
  <a-card :bordered="false">
    <!-- 查詢區域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="訂單號">
              <a-input placeholder="請輸入訂單號" v-model="queryParam.orderNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="運單號">
              <a-input placeholder="請輸入運單號" v-model="queryParam.waybillNo"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="物流用戶ID">
                <j-search-select-tag placeholder="請選擇物流用戶ID" v-model="queryParam.userId" dict="logistics_user,name,id"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="攬收地區ID">
                <a-input placeholder="請輸入攬收地區ID" v-model="queryParam.sendAreaId"></a-input>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="8" :sm="24">
              <a-form-item label="收件人地區ID">
                <a-input placeholder="請輸入收件人地區ID" v-model="queryParam.getAreaId"></a-input>
              </a-form-item>
            </a-col>
          </template>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查詢</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展開' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查詢區域-END -->

    <!-- 操作按鈕區域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'user:addNew'">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('物流訂單表')">導出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">導入</a-button>
      </a-upload>
      <!-- 高級查詢區域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>刪除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table區域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已選擇 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>項
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">無圖片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">無文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下載
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">編輯</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">詳情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="確定刪除嗎?" @confirm="() => handleDelete(record.id)">
                  <a>刪除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <logistics-order-modal ref="modalForm" @ok="modalFormOk"></logistics-order-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import LogisticsOrderModal from './modules/LogisticsOrderModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'

  export default {
    name: 'LogisticsOrderList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      LogisticsOrderModal
    },
    data () {
      return {
        description: '物流訂單表管理頁面',
        // 表頭
        columns: [
          {
            title:'運單號',
            align:"center",
            dataIndex: 'waybillNo'
          },
          {
            title:'訂單狀態',
            align:"center",
            dataIndex: 'status'
          },
          {
            title:'派送類型',
            align:"center",
            dataIndex: 'type'
          },
          {
            title:'物流用戶ID',
            align:"center",
            dataIndex: 'userId_dictText'
          },
          {
            title:'寄件人姓名',
            align:"center",
            dataIndex: 'sendName'
          },
          {
            title:'寄件人電話',
            align:"center",
            dataIndex: 'sendPhone'
          },
          {
            title:'收件人姓名',
            align:"center",
            dataIndex: 'getName'
          },
          {
            title:'收件人電話',
            align:"center",
            dataIndex: 'getPhone'
          },
          {
            title:'收件人地址',
            align:"center",
            dataIndex: 'getAddress'
          },
          {
            title:'自提點/自提櫃代碼',
            align:"center",
            dataIndex: 'getPickuppoint'
          },
          {
            title:'重量',
            align:"center",
            dataIndex: 'weight'
          },
          {
            title:'體積',
            align:"center",
            dataIndex: 'volume'
          },
          {
            title:'運費',
            align:"center",
            dataIndex: 'price'
          },
          {
            title:'下單時間',
            align:"center",
            sorter: true,
            dataIndex: 'sendTime',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'寬度',
            align:"center",
            dataIndex: 'width'
          },
          {
            title:'長度',
            align:"center",
            dataIndex: 'length'
          },
          {
            title:'高度',
            align:"center",
            dataIndex: 'height'
          },
          {
            title:'是否包含電池?',
            align:"center",
            dataIndex: 'includeBattery'
          },
          {
            title:'運單創建時間',
            align:"center",
            dataIndex: 'status1Time'
          },
          {
            title:'倉庫簽入時間',
            align:"center",
            dataIndex: 'status2Time'
          },
          {
            title:'轉運時間',
            align:"center",
            dataIndex: 'status3Time'
          },
          {
            title:'派送时间',
            align:"center",
            dataIndex: 'status4Time'
          },
          {
            title:'自提件上架时间',
            align:"center",
            dataIndex: 'status5Time'
          },
          {
            title:'簽收時間',
            align:"center",
            dataIndex: 'status6Time'
          },
          {
            title:'派送异常时间',
            align:"center",
            dataIndex: 'status7Time'
          },
          {
            title:'是否上門取件?',
            align:"center",
            dataIndex: 'pickupTag'
          },
          {
            title:'攬收日期',
            align:"center",
            dataIndex: 'pickupDate',
            customRender:function (text) {
              return !text?"":(text.length>10?text.substr(0,10):text)
            }
          },
          {
            title:'備註',
            align:"center",
            dataIndex: 'remarks'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/order/logisticsOrder/list",
          delete: "/order/logisticsOrder/delete",
          deleteBatch: "/order/logisticsOrder/deleteBatch",
          exportXlsUrl: "/order/logisticsOrder/exportXls",
          importExcelUrl: "order/logisticsOrder/importExcel",
          
        },
        isorter:{
          column:"sendTime",
          order:'desc'
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'orderNo',text:'訂單號',dictCode:''})
        fieldList.push({type:'string',value:'waybillNo',text:'運單號',dictCode:''})
        fieldList.push({type:'string',value:'status',text:'訂單狀態',dictCode:'logistics_status'})
        fieldList.push({type:'string',value:'type',text:'派送類型',dictCode:'logistics_send_type'})
        fieldList.push({type:'sel_search',value:'userId',text:'物流用戶ID',dictTable:'logistics_user', dictText:'name', dictCode:'id'})
        fieldList.push({type:'string',value:'sendName',text:'寄件人姓名',dictCode:''})
        fieldList.push({type:'string',value:'sendPhone',text:'寄件人電話',dictCode:''})
        fieldList.push({type:'int',value:'sendAreaId',text:'攬收地區ID',dictCode:'common_area,area,id'})
        fieldList.push({type:'string',value:'sendAddress',text:'攬收地址',dictCode:''})
        fieldList.push({type:'string',value:'getName',text:'收件人姓名',dictCode:''})
        fieldList.push({type:'string',value:'getPhone',text:'收件人電話',dictCode:''})
        fieldList.push({type:'int',value:'getAreaId',text:'收件人地區ID',dictCode:'common_area,area,id'})
        fieldList.push({type:'string',value:'getAddress',text:'收件人地址',dictCode:''})
        fieldList.push({type:'string',value:'getPickuppoint',text:'自提點/自提櫃代碼',dictCode:'logistics_outlets,store_name,store_code'})
        fieldList.push({type:'double',value:'weight',text:'重量',dictCode:''})
        fieldList.push({type:'string',value:'volume',text:'體積',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'price',text:'運費',dictCode:''})
        fieldList.push({type:'date',value:'sendTime',text:'下單時間'})
        fieldList.push({type:'double',value:'width',text:'寬度',dictCode:''})
        fieldList.push({type:'double',value:'length',text:'長度',dictCode:''})
        fieldList.push({type:'double',value:'height',text:'高度',dictCode:''})
        fieldList.push({type:'string',value:'includeBattery',text:'是否包含電池?',dictCode:''})
        fieldList.push({type:'datetime',value:'status1Time',text:'運單創建時間'})
        fieldList.push({type:'datetime',value:'status2Time',text:'倉庫簽入時間'})
        fieldList.push({type:'datetime',value:'status3Time',text:'轉運時間'})
        fieldList.push({type:'datetime',value:'status4Time',text:'派送时间'})
        fieldList.push({type:'datetime',value:'status5Time',text:'自提件上架时间'})
        fieldList.push({type:'datetime',value:'status6Time',text:'簽收時間'})
        fieldList.push({type:'string',value:'status7Time',text:'派送异常时间',dictCode:''})
        fieldList.push({type:'string',value:'pickupTag',text:'是否上門取件?',dictCode:'yn'})
        fieldList.push({type:'date',value:'pickupDate',text:'攬收日期'})
        fieldList.push({type:'string',value:'remarks',text:'備註',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>