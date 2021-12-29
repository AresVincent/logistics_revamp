# JDictSelectTag 組件用法
----
- 從字典表獲取數據,dictCode格式說明: 字典code
```html
<j-dict-select-tag  v-model="queryParam.sex" placeholder="請輸入用戶性別"
                  dictCode="sex"/>
```

v-decorator用法：
```html
<j-dict-select-tag  v-decorator="['sex', {}]" :triggerChange="true" placeholder="請輸入用戶性別"
                  dictCode="sex"/>
```

- 從數據庫表獲取字典數據，dictCode格式說明: 表名,文本字段,取值字段
```html
<j-dict-select-tag v-model="queryParam.username" placeholder="請選擇用戶名稱" 
                   dictCode="sys_user,realname,id"/>
```



# JDictSelectUtil.js 列表字典函數用法
----

- 第一步: 引入依賴方法
```html
       import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
```

- 第二步: 在created()初始化方法執行字典配置方法
```html
      //初始化字典配置
      this.initDictConfig();
```
      
- 第三步: 實現initDictConfig方法，加載列表所需要的字典(列表上有多個字典項，就執行多次initDictOptions方法)
      
```html
      initDictConfig() {
        //初始化字典 - 性別
        initDictOptions('sex').then((res) => {
          if (res.success) {
            this.sexDictOptions = res.result;
          }
        });
      },
```
      
- 第四步: 實現字段的customRender方法
```html
     customRender: (text, record, index) => {
       //字典值替換通用方法
       return filterDictText(this.sexDictOptions, text);
     }
```


# JMultiSelectTag 多選組件
下拉/checkbox

## 參數配置
| 參數           | 類型   | 必填 |說明|
|--------------|---------|----|---------|
| placeholder      |string   | | placeholder |
| disabled      |Boolean   | | 是否禁用 |
| type      |string   | | 多選類型 select/checkbox 默認是select |
| dictCode      |string   | | 數據字典編碼或者表名,显示字段名,存儲字段名拼接而成的字符串,如果提供了options參數 則此參數可不填|
| options      |Array   | | 多選項,如果dictCode參數未提供,可以設置此參數加載多選項 |

使用示例
----
```vue
<template>
  <a-form>
    <a-form-item label="下拉多選" style="width: 300px">
      <j-multi-select-tag
        v-model="selectValue"
        :options="dictOptions"
        placeholder="請做出你的選擇">
      </j-multi-select-tag>
      {{ selectValue }}
    </a-form-item>

    <a-form-item label="checkbox">
      <j-multi-select-tag
        v-model="checkboxValue"
        :options="dictOptions"
        type="checkbox">
      </j-multi-select-tag>
      {{ checkboxValue }}
    </a-form-item>
  </a-form >
</template>

<script>
  import JMultiSelectTag from '@/components/dict/JMultiSelectTag'
  export default {
    components: {JMultiSelectTag},
    data() {
      return {
        selectValue:"",
        checkboxValue:"",
        dictOptions:[{
          label:"選項一",
          value:"1"
        },{
          label:"選項二",
          value:"2"
        },{
          label:"選項三",
          value:"3"
        }]
      }
    }
  }
</script>
```

# JSearchSelectTag 字典表的搜索組件
下拉搜索組件,支持異步加載,異步加載用於大數據量的字典表

## 參數配置
| 參數           | 類型   | 必填 |說明|
|--------------|---------|----|---------|
| placeholder      |string   | | placeholder |
| disabled      |Boolean   | | 是否禁用 |
| dict      |string   | | 表名,显示字段名,存儲字段名拼接而成的字符串,如果提供了dictOptions參數 則此參數可不填|
| dictOptions      |Array   | | 多選項,如果dict參數未提供,可以設置此參數加載多選項 |
| async      |Boolean   | | 是否支持異步加載,設置成true,則通過輸入的內容加載遠程數據,否則在本地過濾數據,默認false|

使用示例
----
```vue
<template>
  <a-form>
    <a-form-item label="下拉搜索" style="width: 300px">
      <j-search-select-tag
        placeholder="請做出你的選擇"
        v-model="selectValue"
        :dictOptions="dictOptions">
      </j-search-select-tag>
      {{ selectValue }}
    </a-form-item>

    <a-form-item label="異步加載" style="width: 300px">
      <j-search-select-tag
        placeholder="請做出你的選擇"
        v-model="asyncSelectValue"
        dict="sys_depart,depart_name,id"
        :async="true">
      </j-search-select-tag>
      {{ asyncSelectValue }}
    </a-form-item>
  </a-form >
</template>

<script>
  import JSearchSelectTag from '@/components/dict/JSearchSelectTag'
  export default {
    components: {JSearchSelectTag},
    data() {
      return {
        selectValue:"",
        asyncSelectValue:"",
        dictOptions:[{
          text:"選項一",
          value:"1"
        },{
          text:"選項二",
          value:"2"
        },{
          text:"選項三",
          value:"3"
        }]
      }
    }
  }
</script>
```

