# JDate 日期組件 使用文檔
  
###### 說明: antd-vue日期組件需要用moment中轉一下，用起來不是很方便，特二次封裝，使用時只需要傳字符串即可
## 參數配置
| 參數           | 類型      | 必填 |說明|
|--------------|---------|----|---------|
| placeholder      |string   | | placeholder      |
| readOnly   | boolean   | | true/false 默認false                 |
| value      | string | | 綁定v-model或是v-decorator后不需要設置    |
| showTime | boolean | | 是否展示時間true/false 默認false  |
| dateFormat    | string | |日期格式 默認'YYYY-MM-DD' 若showTime設置為true則需要將其設置成對應的時間格式(如:YYYY-MM-DD HH:mm:ss)               |
| triggerChange | string | |觸發組件值改變的事件是否是change,當使用v-decorator時且沒有設置decorator的option.trigger為input需要設置該值為true               |
使用示例
----
1.組件帶有v-model的使用方法
```vue
<j-date v-model="dateStr"></j-date>
```

2.組件帶有v-decorator的使用方法  
  a).設置trigger-change屬性為true
  ```vue
    <j-date :trigger-change="true" v-decorator="['dateStr',{}]"></j-date>
  ```
    
  b).設置decorator的option.trigger為input
   ```vue
    <j-date v-decorator="['dateStr',{trigger:'input'}]"></j-date>
   ```

3.其他使用
添加style
```vue
<j-date v-model="dateStr" style="width:100%"></j-date>
```
添加placeholder
```vue
<j-date v-model="dateStr" placeholder="請輸入dateStr"></j-date>
```
添加readOnly
```vue
<j-date v-model="dateStr" :read-only="true"></j-date>
```

備註:
script內需引入jdate
```vue
<script>
  import JDate from '@/components/jeecg/JDate'
  export default {
    name: "demo",
    components: {
      JDate
    }
    //...
  }
</script>
```


 ---


# JSuperQuery 高級查詢 使用文檔
## 參數配置
| 參數           | 類型      | 必填 | 說明                   |
|--------------|---------|----|----------------------|
| fieldList      | array   |✔| 需要查詢的列集合示例如下，type類型有:date/datetime/string/int/number      |
| callback   | array   |  | 回調函數名稱(非必須)默認handleSuperQuery                |

fieldList結構示例：
```vue
  const superQueryFieldList=[{
    type:"date",
    value:"birthday",
    text:"生日"
  },{
    type:"string",
    value:"name",
    text:"用戶名"
  },{
    type:"int",
    value:"age",
    text:"年齡"
  }]
```
頁面代碼概述:  
----
1.import之後再components之內聲明
```vue
import JSuperQuery from '@/components/jeecg/JSuperQuery.vue';
  export default {
    name: "JeecgDemoList",
    components: {
      JSuperQuery
    },

```
2.頁面引用
```vue
  <!-- 高級查詢區域 -->
  <j-super-query :fieldList="fieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
```
3.list頁面data中需要定義三個屬性：
```vue
  fieldList:superQueryFieldList,
  superQueryFlag:false,
  superQueryParams:""
```
4.list頁面聲明回調事件handleSuperQuery(與組件的callback對應即可)
```vue
//高級查詢方法
handleSuperQuery(arg) {
  if(!arg){
    this.superQueryParams=''
    this.superQueryFlag = false
  }else{
    this.superQueryFlag = true
    this.superQueryParams=JSON.stringify(arg)
  }
  this.loadData()
},
```
5.改造list頁面方法
```vue
  // 獲取查詢條件
  getQueryParams() {
    let sqp = {}
    if(this.superQueryParams){
      sqp['superQueryParams']=encodeURI(this.superQueryParams)
    }
    var param = Object.assign(sqp, this.queryParam, this.isorter);
    param.field = this.getQueryField();
    param.pageNo = this.ipagination.current;
    param.pageSize = this.ipagination.pageSize;
    return filterObj(param);
  },
```
6.打開彈框調用show方法：
```vue
this.$refs.superQueryModal.show();
```

# JEllipsis 字符串超長截取省略號显示
  
###### 說明: 遇到超長文本展示，通過此標籤可以截取省略號显示，鼠標放置會提示全文本
## 參數配置
| 參數  | 類型     | 必填 |    說明      |
|--------|---------|----|----------------|
| value  |string   | 必填   |  字符串文本|
| length | number  | 非必填 |  默認25    |
使用示例
----
1.組件帶有v-model的使用方法
```vue
<j-ellipsis :value="text"/>


# Modal彈框實現最大化功能  

1.定義modal的寬度：
```vue
  <a-modal
    :width="modalWidth"
    
    
    />
```
2.自定義modal的title,居右显示切換圖標
```vue
  <template slot="title">
    <div style="width: 100%;">
      <span>{{ title }}</span>
      <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
        <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
      </span>
    </div>
  </template>
```
3.定義toggleScreen事件,用於切換modal寬度
```vue
  toggleScreen(){
      if(this.modaltoggleFlag){
        this.modalWidth = window.innerWidth;
      }else{
        this.modalWidth = 800;
      }
      this.modaltoggleFlag = !this.modaltoggleFlag;
    },
```
4.data中聲明上述用到的屬性
```vue
    data () {
      return {
        modalWidth:800,
        modaltoggleFlag:true,
```

# <a-select/> 下拉選項滾動錯位的解決方法

## 問題描述

當使用了 `a-modal` 或其他帶有滾動條的組件時，使用`a-select`組件並打開下拉框時滾動滾動條，就會導致錯位的問題產生。

## 解決方法

大多數情況下，在 `a-select` 上添加一個 `getPopupContainer` 屬性，值為`node => node.parentNode`即可解決。
但是如果遇到 `a-select` 標籤層級過深的情況，可能仍然會显示異常，只需要多加幾個`.parentNode` （例：node => node.parentNode.parentNode.parentNode）多嘗試幾次直到解決問題即可。

### 代碼示例

```html
<a-select
    placeholder="請選擇展示模板"
    :options="dicts.displayTemplate"
    :getPopupContainer="node => node.parentNode"
/>
```

# JAsyncTreeList 異步數列表組件使用說明

## 引入組件

```js
import JTreeTable from '@/components/jeecg/JTreeTable'
export default {
  components: { JTreeTable }
}
```

## 所需參數

| 參數        | 類型   | 必填   | 說明                                                         |
|-------------|--------|--------|--------------------------------------------------------------|
| rowKey      | String | 非必填 | 表格行 key 的取值，默認為"id"                                |
| columns     | Array  | 必填   | 表格列的配置描述，具體見Antd官方文檔                         |
| url         | String | 必填   | 數據查詢url                                                  |
| childrenUrl | String | 非必填 | 查詢子級時的url，若不填則使用url參數查詢子級                 |
| queryKey    | String | 非必填 | 根據某個字段查詢，如果傳遞 id 就根據 id 查詢，默認為parentId |
| queryParams | Object | 非必填 | 查詢參數，當查詢參數改變的時候會自動重新查詢，默認為{}       |
| topValue    | String | 非必填 | 查詢頂級時的值，如果頂級為0，則傳0，默認為null               |
| tableProps  | Object | 非必填 | 自定義給內部table綁定的props                                 |

## 代碼示例

```html
<template>
  <a-card :bordered="false">
    <j-tree-table :url="url" :columns="columns" :tableProps="tableProps"/>
  </a-card>
</template>

<script>
  import JTreeTable from '@/components/jeecg/JTreeTable'

  export default {
    name: 'AsyncTreeTable',
    components: { JTreeTable },
    data() {
      return {
        url: '/mock/api/asynTreeList',
        columns: [
          { title: '菜單名稱', dataIndex: 'name' },
          { title: '組件', dataIndex: 'component' },
          { title: '排序', dataIndex: 'orderNum' }
        ],
        selectedRowKeys: []
      }
    },
     computed: {
       tableProps() {
         let _this = this
         return {
           // 列表項是否可選擇
           // 配置項見：https://vue.ant.design/components/table-cn/#rowSelection
           rowSelection: {
             selectedRowKeys: _this.selectedRowKeys,
             onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
           }
         }
       }
     }
  }
</script>
```

# JCheckbox 使用文檔
  
###### 說明: antd-vue checkbox組件處理的是數組，用起來不是很方便，特二次封裝，使用時只需處理字符串即可
## 參數配置
| 參數           | 類型   | 必填 |說明|
|--------------|---------|----|---------|
| options      |array   |✔| checkbox需要配置的項，是個數組，數組中每個對象包含兩個屬性:label(用於显示)和value(用於存儲) |

使用示例
----
```vue
<template>
  <a-form :form="form">
    <a-form-item label="v-model式用法">
      <j-checkbox v-model="sport" :options="sportOptions"></j-checkbox><span>{{ sport }}</span>
    </a-form-item>

    <a-form-item label="v-decorator式用法">
      <j-checkbox v-decorator="['sport']" :options="sportOptions"></j-checkbox><span>{{ getFormFieldValue('sport') }}</span>
    </a-form-item>
  </a-form>
</template>

<script>
  import JCheckbox from '@/components/jeecg/JCheckbox'
  export default {
    components: {JCheckbox},
    data() {
      return {
        form: this.$form.createForm(this),
        sport:'',
        sportOptions:[
          {
            label:"足球",
            value:"1"
          },{
            label:"籃球",
            value:"2"
          },{
            label:"乒乓球",
            value:"3"
          }]
      }
    },
    methods: {
     getFormFieldValue(field){
       return this.form.getFieldValue(field)
     }
    }
  }
</script>
```

# JCodeEditor 使用文檔
  
###### 說明: 一個簡易版的代碼編輯器，支持語法高亮
## 參數配置
| 參數           | 類型   | 必填 |說明|
|--------------|---------|----|---------|
| language      |string   | | 表示當前編寫代碼的類型 javascript/html/css/sql |
| placeholder      |string   | | placeholder |
| lineNumbers      |Boolean   | | 是否显示行號 |
| fullScreen      |Boolean   | | 是否显示全屏按鈕 |
| zIndex      |string   | | 全屏以後的z-index |

使用示例
----
```vue
<template>
  <div>
    <j-code-editor
      language="javascript"
      v-model="editorValue"
      :fullScreen="true"
      style="min-height: 100px"/>
    {{ editorValue }}
  </div>
</template>

<script>
  import JCodeEditor from '@/components/jeecg/JCodeEditor'
  export default {
    components: {JCodeEditor},
    data() {
      return {
        form: this.$form.createForm(this),
        editorValue:'',
      }
    }
  }
</script>
```

# JFormContainer 使用文檔
  
###### 說明: 暫用於表單禁用

使用示例
----
```vue
<!-- 在form下直接寫這個組件，設置disabled為true就能將此form中的控件禁用 -->
  <a-form layout="inline" :form="form" >
    <j-form-container disabled>
      <!-- 表單內容省略..... -->
    </j-form-container>
  </a-form>
```

# JImportModal 使用文檔
  
###### 說明: 用於列表頁面導入excel功能

使用示例
----
```vue

<template>
  <!--  此處省略部分代碼...... -->
  <a-button @click="handleImportXls" type="primary" icon="upload">導入</a-button>
  <!--  此處省略部分代碼...... -->
  <j-import-modal ref="importModal" :url="getImportUrl()" @ok="importOk"></j-import-modal>
  <!--  此處省略部分代碼...... -->
</template>

<script>
  import JCodeEditor from '@/components/jeecg/JCodeEditor'
  export default {
    components: {JCodeEditor},
    data() {
      return {
        //省略代碼......
      }
    },
    methods:{
      //省略部分代碼......
      handleImportXls(){
        this.$refs.importModal.show()
      },
      getImportUrl(){
         return '你自己處理上傳業務的後台地址'
      },
      importOk(){
        this.loadData(1)
      }
    }
  }
</script>
```

# JSelectMultiple 多選下拉組件
online用 實際開發請使用components/dict/JMultiSelectTag

# JSlider 滑塊驗證碼

使用示例
----
```vue
<template>
  <div style="width: 300px">
    <j-slider @onSuccess="sliderSuccess"></j-slider>
  </div>
</template>

<script>
  import JSlider from '@/components/jeecg/JSlider'
  export default {
    components: {JSlider},
    data() {
      return {
        form: this.$form.createForm(this),
        editorValue:'',
      }
    },
    methods:{
      sliderSuccess(){
        console.log("驗證完成")
      }
    }
  }
</script>
```


# JTreeSelect 樹形下拉組件
異步加載的樹形下拉組件

## 參數配置
| 參數           | 類型   | 必填 |說明|
|--------------|---------|----|---------|
| placeholder      |string   | | placeholder |
| dict      |string   | ✔| 表名,显示字段名,存儲字段名拼接的字符串 |
| pidField      |string   | ✔| 父ID的字段名 |
| pidValue      |string   | | 根節點父ID的值 默認'0' 不可以設置為空,如果想使用此組件，而數據庫根節點父ID為空，請修改之 |
| multiple      |boolean   | |是否支持多選 |

使用示例
----
```vue
<template>
  <a-form>
    <a-form-item label="樹形下拉測試" style="width: 300px">
      <j-tree-select
        v-model="departId"
        placeholder="請選擇部門"
        dict="sys_depart,depart_name,id"
        pidField="parent_id">
      </j-tree-select>
      {{ departId }}
    </a-form-item>
  </a-form >
</template>

<script>
  import JTreeSelect from '@/components/jeecg/JTreeSelect'
  export default {
    components: {JTreeSelect},
    data() {
      return {
        departId:""
      }
    }
  }
</script>
```


