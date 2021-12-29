# JEditableTable 幫助文檔

## 參數配置

| 參數         | 類型    | 必填 | 說明                                                                            |
|--------------|---------|------|---------------------------------------------------------------------------------|
| columns      | array   | ✔️    | 表格列的配置描述，具體項見下錶                                                  |
| dataSource   | array   | ✔️    | 表格數據                                                                        |
| loading      | boolean |      | 是否正在加載，加載中不會显示任何行，默認false                                   |
| actionButton | boolean |      | 是否显示操作按鈕，包括"新增"、"刪除"，默認false                                 |
| rowNumber    | boolean |      | 是否显示行號，默認false                                                         |
| rowSelection | boolean |      | 是否可選擇行，默認false                                                         |
| dragSort     | boolean |      | 是否可拖動排序，默認false                                                       |
| dragSortKey  | string  |      | 拖動排序存儲的Key，無需定義在columns內也能在getValues()時獲取到值，默認orderNum |
| maxHeight    | number  |      | 設定最大高度(px)，默認400                                                       |
| disabledRows | object  |      | 設定禁用的行，被禁用的行無法被選擇和編輯，配置方法可以查看示例                  |
| disabled     | boolean |      | 是否禁用所有行，默認false                                                       |

### columns 參數詳解

| 參數          | 類型    | 必填 | 說明                                                                                                                                                   |
|---------------|---------|------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| title         | string  | ✔️    | 表格列頭显示的問題                                                                                                                                     |
| key           | string  | ✔️    | 列數據在數據項中對應的 key，必須是唯一的                                                                                                               |
| type          | string  | ✔️    | 表單的類型，可以通過`JEditableTableUtil.FormTypes`賦值                                                                                                 |
| width         | string  |      | 列的寬度，可以是百分比，也可以是`px`或其他單位，建議設置為百分比，且每一列的寬度加起來不應超過100%，否則可能會不能達到預期的效果。留空會自動計算百分比 |
| placeholder   | string  |      | 表單預期值的提示信息，可以使用`${...}`變量替換文本（詳見`${...} 變量使用方式`）                                                                        |
| defaultValue  | string  |      | 默認值，在新增一行時生效                                                                                                                               |
| validateRules | array   |      | 表單驗證規則，配置方式見[validateRules 配置規則](#validaterules-配置規則)                                                                              |
| props         | object  |      | 設置添加給表單元素的自定義屬性，例如:`props:{title: 'show title'}`                                                                                     |
| disabled      | boolean |      | 是否禁用當前列，默認false                                                                                                                              |

#### 當 type=checkbox 時所需的參數

| 參數           | 類型    | 必填 | 說明                                                                                                                                                                                                   |
|----------------|---------|------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| defaultChecked | boolean |      | 默認值是否選中                                                                                                                                                                                         |
| customValue    | array   |      | 自定義值，checkbox需要的是boolean值，如果數據是其他值（例如`'Y' or 'N'`）時，就會導致錯誤，所以提供了該屬性進行轉換，例：`customValue: ['Y','N']`，會將`true`轉換為`'Y'`，`false`轉換為`'N'`，反之亦然 |

#### 當 type=select 時所需的參數

| 參數       | 類型    | 必填 | 說明                                               |
|------------|---------|------|----------------------------------------------------|
| options    | array   | ✔️    | 下拉選項列表，詳見下錶                             |
| allowInput | boolean |      | 是否允許用戶輸入內容，並創建新的內容               |
| dictCode   | String  |      | 數據字典Code，若options也有值，則拼接在options後面 |

##### options 所需參數

| 參數      | 類型       | 必填 | 說明                                                                 |
|-----------|------------|------|----------------------------------------------------------------------|
| text      | string     | ✔️    | 显示標題                                                             |
| value     | string     | ✔️    | 真實值                                                               |
| ~~title~~ | ~~string~~ |      | ~~显示標題（已廢棄，若同時填寫了 title 和 text 那麼優先使用 text）~~ |

#### 當 type=upload 時所需的參數

| 參數         | 類型    | 必填 | 說明                                                                                 |
|--------------|---------|------|--------------------------------------------------------------------------------------|
| action       | string  | ✔️    | 上傳文件路徑                                                                         |
| token        | boolean |      | 上傳的時候是否傳遞token                                                              |
| responseName | string  | ✔️    | 若要從上傳成功后從response中取出返回的文件名，那麼這裏填後台返回的包含文件名的字段名 |

#### 當 type=slot 時所需的參數

| 參數     | 類型   | 必填 | 說明       |
|----------|--------|------|------------|
| slotName | string | ✔️    | slot的名稱 |

### validateRules 配置規則

`validateRules` 需要的是一個數組，數組裡每項都是一個規則，規則是object類型，規則的各個參數如下

- `required` 是否必填，可選值為`true`or`false`
- `pattern` 正則表達式驗證，只有成功匹配該正則的值才能成功通過驗證
- `handler` 自定義函數校驗，使用方法請見[示例五](#示例五)
- `message` 當驗證未通過時显示的提示文本，可以使用`${...}`變量替換文本（詳見`${...} 變量使用方式`）
- 配置示例請看[示例二](#示例二)

## 事件

| 事件名          | 觸發時機                                           | 參數                                             |
|-----------------|----------------------------------------------------|--------------------------------------------------|
| added           | 當添加行操作完成后觸發                             |                                                  |
| deleted         | 當刪除行操作完成后觸發（批量刪除操作只會觸發一次） | `deleteIds` 被邏輯刪除的id                       |
| selectRowChange | 當行被選中或取消選中時觸發                         | `selectedRowIds` 被選中行的id                    |
| valueChange     | 當數據發生改變的時候觸發的事件                     | `{ type, row, column, value, target }` Event對象 |

## 方法

關於方法的如何調用的問題，請在**FAQ**中查看[方法如何調用](#方法如何調用)

### initialize

用於初始化表格（清空表格）

- `參數:` 無
- `返回值:` 無

### resetScrollTop

重置滾動條Top位置

- `參數:`

| 參數名 | 類型   | 必填 | 說明                                                                                                   |
|--------|--------|------|--------------------------------------------------------------------------------------------------------|
| top    | number |      | 新top位置，留空則滾動到上次記錄的位置，用於解決切換tab選項卡時導致白屏以及自動將滾動條滾動到頂部的問題 |

- `返回值:` 無

### add

主動添加行，默認情況下，當用戶的滾動條已經在底部的時候，會將滾動條固定在底部，即添加后無需用戶手動滾動，而會自動滾動到底部

- `參數:`

| 參數名              | 類型    | 必填 | 說明                                                                |
|---------------------|---------|------|---------------------------------------------------------------------|
| num                 | number  |      | 添加幾行，默認為1                                                   |
| forceScrollToBottom | boolean |      | 是否在添加后無論用戶的滾動條在什麼位置都強制滾動到底部，默認為false |

- `返回值:` 無

### removeRows

主動刪除一行或多行

- `參數:`

| 參數名 | 類型            | 必填 | 說明                                                                                       |
|--------|-----------------|------|--------------------------------------------------------------------------------------------|
| id     | string 或 array | ✔️    | 被刪除行的id。如果要刪除一個，可以直接傳id，如果要刪除多個，需要將多個id封裝成一個數組傳入 |

- `返回值:` 無

### removeSelectedRows

主動刪除被選中的行

- `參數:` 無
- `返回值:` 無

### getValues

用於獲取表格里所有表單的值，可進行表單驗證

- `參數:`

| 參數名   | 類型     | 必填 | 說明                                                                                                                                                      |
|----------|----------|------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| callback | function | ✔️    | 獲取值的回調方法，會傳入`error`和`values`兩個參數。`error`：未通過驗證的數量，當等於`0`時代表驗證通過；`values`：獲取的值（即使未通過驗證該字段也有數據） |
| validate | boolean  |      | 是否進行表單驗證，默認為`true`，設為`false`則代表忽略表單驗證                                                                                             |
| rowIds   | array    |      | 默認返回所有行的數據，如果傳入了`rowIds`，那麼就會只返回與該`rowIds`相匹配的數據，如果沒有匹配的數據，就會返回空數組                                      |

- `返回值:` 無


### getValuesSync

`getValues`的同步版，會直接將獲取到的數據返回

- `參數:` 

| 參數名  | 類型   | 必填 | 說明                   |
|---------|--------|------|------------------------|
| options | object |      | 選項，詳見下方所需參數 |

- - `options` 所需參數

| 參數名   | 類型    | 必填 | 說明                                                                                                                 |
|----------|---------|------|----------------------------------------------------------------------------------------------------------------------|
| validate | boolean |      | 是否進行表單驗證，默認為`true`，設為`false`則代表忽略表單驗證                                                        |
| rowIds   | array   |      | 默認返回所有行的數據，如果傳入了`rowIds`，那麼就會只返回與該`rowIds`相匹配的數據，如果沒有匹配的數據，就會返回空數組 |

- `返回值:` object
    - `error` 未通過驗證的數量，當等於`0`時代表驗證通過
    - `values` 獲取的值（即使未通過驗證該字段也有數據）

- `使用示例`

```js
let { error, values } = this.$refs.editableTable.getValuesSync({ validate: true, rowIds: ['rowId1', 'rowId2'] })
if (error === 0) {
    console.log('表單驗證通過，數據：', values);
} else {
    console.log('未通過表單驗證，數據：', values);
}
```

### getValuesPromise

`getValues`的promise版，會在`resolve`中傳入獲取到的值，會在`reject`中傳入失敗原因，例如`VALIDATE_NO_PASSED`

- `參數:`

| 參數名   | 類型    | 必填 | 說明                                                                                                                 |
|----------|---------|------|----------------------------------------------------------------------------------------------------------------------|
| validate | boolean |      | 同`getValues`的`validate`參數                                                                                        |
| rowIds   | array   |      | 默認返回所有行的數據，如果傳入了`rowIds`，那麼就會只返回與該`rowIds`相匹配的數據，如果沒有匹配的數據，就會返回空數組 |

- `返回值:` Promise

### getDeleteIds

用於獲取被邏輯刪除的行的id，返回一個數組，用戶可將該數組傳入後台，並進行批量刪除

- `參數:` 無
- `返回值:` array

### getAll

獲取所有的數據，包括values、deleteIds
會在`resolve`中傳入獲取到的值：`{values, deleteIds}`
會在`reject`中傳入失敗原因，例如`VALIDATE_NO_PASSED`

- `參數:`

| 參數名   | 類型    | 必填 | 說明                          |
|----------|---------|------|-------------------------------|
| validate | boolean |      | 同`getValues`的`validate`參數 |

- `返回值:` Promise

### setValues

主動設置表格中某行某列的值

- `參數:`

| 參數名 | 類型  | 必填 | 說明                                                       |
|--------|-------|------|------------------------------------------------------------|
| values | array |      | 傳入一個數組，數組中的每項都是一行的新值，具體見下面的示例 |

- `返回值:` 無
- `示例：`

```js
setValues([
    {
        rowKey: id1, // 行的id
        values: { // 在這裏 values 中的 name 是你 columns 中配置的 key
            'name': 'zhangsan',
            'age': '20'
        }
    },
    {
        rowKey: id2,
        values: {
            'name': 'lisi',
            'age': '23'
        }
    }
])
```
### clearSelection

主動清空選擇的行

- `參數:` 無
- `返回值:` 無

## 內置插槽

| 插槽名       | 說明                                                 |
|--------------|------------------------------------------------------|
| buttonBefore | 在操作按鈕的**前面**插入插槽，不受`actionButton`屬性的影響 |
| buttonAfter  | 在操作按鈕的**後面**插入插槽，不受`actionButton`屬性的影響 |

## ${...} 變量使用方式

在`placeholder`和`message`這兩個屬性中可以使用`${...}`變量來替換文本
在[示例二](#示例二)中，配置了`title`為`名稱`的一列，而`placeholder`配置成了`請輸入${title}`，那麼最終显示效果為`請輸入名稱`
這就是`${...}`變量的使用方式，在`${}`中可以使用的變量有`title`、`key`、`defaultValue`這三個屬性的值

## JEditableTableUtil 使用說明

在之前配置`columns`時提到過`JEditableTableUtil`這個工具類，那麼如果想要知道詳細的使用說明就請看這裏

### export 的常量

#### FormTypes

這是配置`columns.type`時用到的常量值，其中包括

- `normal` 默認，直接显示值，不渲染表單
- `input` 显示輸入框
- `inputNumber` 显示数字輸入框
- `checkbox` 显示多選框
- `select` 显示選擇器（下拉框）
- `date` 日期選擇器
- `datetime` 日期時間選擇器
- `upload` 上傳組件（文件域）
- `slot` 自定義插槽

### VALIDATE_NO_PASSED

在判斷表單驗證是否通過時使用，如果 reject 的值 === VALIDATE_NO_PASSED 則代表表單驗證未通過，你可以做相應的其他處理，反之則可能是發生了報錯，可以使用 `console.error` 輸出

### 封裝的方法

#### validateTables

當你的頁面中存在多個JEditableTable實例的時候，如果要獲取每個實例的值、判斷表單驗證是否通過，就會讓代碼變得極其冗餘、繁瑣，於是我們就將該操作封裝成了一個函數供你調用，它可以同時獲取並驗證多個JEditableTable實例的值，只有當所有實例的表單驗證都通過後才會返回值，否則將會告訴你具體哪個實例沒有通過驗證。具體使用方法請看下面的示例

- `參數:`

| 參數名 | 類型  | 必填 | 說明                                                   |
|--------|-------|------|--------------------------------------------------------|
| cases  | array |      | 傳入一個數組，數組中的每項都是一個JEditableTable的實例 |

- `返回值:` Promise
- `示例：`

```js
import { validateTables, VALIDATE_NO_PASSED } from '@/utils/JEditableTableUtil'
// 封裝cases
let cases = []
cases.push(this.$refs.editableTable1)
cases.push(this.$refs.editableTable2)
cases.push(this.$refs.editableTable3)
cases.push(this.$refs.editableTable4)
cases.push(this.$refs.editableTable5)
// 同時驗證並獲取多個實例的值
validateTables(cases).then((all) => {
    // all 是一個數組，每項都對應傳入cases的下標，包含values和deleteIds
    console.log('所有實例的值：', all)
}).catch((e = {}) => {
    // 判斷表單驗證是否未通過
    if (e.error === VALIDATE_NO_PASSED) {
        console.log('未通過驗證的實例下標:', e.index)
    } else {
        console.error('發生異常:', e)
    }
})
```

## FAQ

### 方法如何調用？

在[示例一](#示例一)中，設定了一個 `ref="editableTable"` 的屬性，那麼在vue中就可以使用`this.$refs.editableTable`獲取到該表格的實例，並調取其中的方法。
假如我要調取`initialize`方法，就可以這麼寫：`this.$refs.editableTable.initialize()`

### 如何獲取表單的值？

使用`getValue`方法進行獲取，詳見[示例三](#示例三)

### 如何進行表單驗證？

在獲取值的時候默認會進行表單驗證操作，用戶在輸入的時候也會對正在輸入的表單進行驗證，只要配置好規則就可以了

### 如何添加或刪除一行？

該功能已封裝到組件中，你只需要將 `actionButton` 設置為 `true` 即可，當然你也可以在代碼中主動調用新增方法或修改，具體見上方的方法介紹。

### 為什麼使用了ATab組件后，切換選項卡會導致白屏或滾動條位置會歸零？

在ATab組件中確實會導致滾動條位置歸零，且不會觸發`onscroll`方法，所以無法動態加載行，導致白屏的問題出現。
解決方法是在ATab組件的`onChange`事件觸發時執行實例提供的`resetScrollTop()`方法即可，但是需要注意的是：代碼主動改變ATab的`activeKey`不會觸發`onChange`事件，還需要你手動調用下。

- `示例`

```html
<template>
    <a-tabs @change="handleChangeTab">
        <a-tab-pane tab="表格1" :forceRender="true" key="1">
            <j-editable-table
                ref="editableTable1"
                :loading="tab1.loading"
                :columns="tab1.columns"
                :dataSource="tab1.dataSource"/>
        </a-tab-pane>
        <a-tab-pane tab="表格2" :forceRender="true" key="2">
            <j-editable-table
                ref="editableTable2"
                :loading="tab2.loading"
                :columns="tab2.columns"
                :dataSource="tab2.dataSource"/>
        </a-tab-pane>
    </a-tabs>
</template>
```

```js
/*--- 忽略部分代碼片段 ---*/
methods: {

      /** 切換tab選項卡的時候重置editableTable的滾動條狀態 */
      handleChangeTab(key) {
        this.$refs[`editableTable${key}`].resetScrollTop()
      }

}
/*--- 忽略部分代碼片段 ---*/
```

### slot(自定義插槽)如何使用？

代碼示例請看：[示例四(slot)](#示例四(slot))

----------------------------------------------------------------------------------------

## 示例一

```html
<j-editable-table
    ref="editableTable"
    :loading="loading"
    :columns="columns"
    :dataSource="dataSource"
    :rowNumber="true"
    :rowSelection="true"
    :actionButton="true"
    style="margin-top: 8px;"
    @selectRowChange="handleSelectRowChange"/>
```

## 示例二

```js

import { FormTypes } from '@/utils/JEditableTableUtil'

/*--- 忽略部分代碼片斷 ---*/
columns: [
    {
        title: '名稱',
        key: 'name',
        type: FormTypes.input,
        placeholder: '請輸入${title}',
        defaultValue: '稱名',
        // 表單驗證規則
        validateRules: [
            {
                required: true, // 必填
                message: '${title}不能為空' // 提示的文本
            },
            {
                pattern: /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/, // 正則
                message: '${title}必須以字母開頭，可包含数字、下劃線、橫杠'
            }
        ]
    },
    {
        title: '年齡',
        key: 'age',
        type: FormTypes.inputNumber,
        placeholder: '請輸入${title}',
        defaultValue: 18,
        validateRules: [{required: true, message: '${title}不能為空'}]
    }
]
/*--- 忽略部分代碼片斷 ---*/
```

## 示例三

```js
// 獲取被邏輯刪除的字段id
let deleteIds = this.$refs.editableTable.getDeleteIds();
// 獲取所有表單的值，並進行驗證
this.$refs.editableTable.getValues((error, values) => {
    // 錯誤數 = 0 則代表驗證通過
    if (error === 0) {
        this.$message.success('驗證通過')
        // 將通過後的數組提交到後台或自行進行其他處理
        console.log(deleteIds, values)
    } else {
        this.$message.error('驗證未通過')
    }
})
```

## 示例四(slot)

```html
<template>
    <j-editable-table :columns="columns" :dataSource="dataSource">
        <!-- 定義插槽 -->
        <!-- 這種定義插槽的寫法是vue推薦的新版寫法（https://cn.vuejs.org/v2/guide/components-slots.html#具名插槽），舊版已被廢棄的寫法不再支持 -->
        <!-- 若webstorm這樣寫報錯，請看這篇文章：https://blog.csdn.net/lxq_9532/article/details/81870651 -->
        <template v-slot:action="props">
            <a @click="handleDelete(props)">刪除</a>
        </template>
    </j-editable-table>
</template>
<script>
    import { FormTypes } from '@/utils/JEditableTableUtil'
    import JEditableTable from '@/components/jeecg/JEditableTable'
    export default {
        components: { JEditableTable },
        data() {
            return {
                columns: [
                    // ...
                    {
                        title: '操作',
                        key: 'action',
                        width: '8%',
                        type: FormTypes.slot, // 定義該列為 自定義插值列 
                        slotName: 'action' // slot 的名稱，對應 v-slot 冒號後面和等號前面的內容
                    }
                ]
            }
        },
        methods: {
            /* a 標籤的點擊事件，刪除當前選中的行 */
            handleDelete(props) {
                // 參數解釋
                // props.index ：當前行的下標
                // props.text ：當前值，可能是defaultValue定義的值，也可能是從dataSource中取出的值
                // props.rowId ：當前選中行的id，如果是新增行則是臨時id
                // props.column ：當前操作的列
                // props.getValue ：這是一個function，執行后可以獲取當前行的所有值（禁止在template中使用）
                //                  例：const value = props.getValue()
                // props.target ：觸發當前事件的實例，可直接調用該實例內的方法（禁止在template中使用）
                //                  例：target.add()

                // 使用實例：刪除當前操作的行
                let { rowId, target } = props
                target.removeRows(rowId)
            }
        }
    }
</script>
```

## 示例五

```js
// 該示例是自定義函數校驗
columns: [
    {
        title: '字段名稱',
        key: 'dbFieldName',
        type: FormTypes.input,
        defaultValue: '',
        validateRules: [
            {
                // 自定義函數校驗 handler
                handler(type, value, row, column, callback, target) {
                    // type 觸發校驗的類型（input、change、blur）
                    // value 當前校驗的值
                    // callback(flag, message) 方法必須執行且只能執行一次
                    //          flag = 是否通過了校驗，不填寫或者填寫 null 代表不進行任何操作
                    //          message = 提示的類型，默認使用配置的 message
                    // target 行編輯的實例對象

                    if (type === 'blur') {

                        if (value === 'abc') {
                            callback(false, '${title}不能是abc') // false = 未通過，可以跟自定義提示
                            return
                        }

                        let { values } = target.getValuesSync({ validate: false })
                        let count = 0
                        for (let val of values) {
                            if (val['dbFieldName'] === value) {
                                if (++count >= 2) {
                                    callback(false, '${title}不能重複')
                                    return
                                }
                            }
                        }
                        callback(true) // true = 通過驗證
                    } else {
                        callback() // 不填寫或者填寫 null 代表不進行任何操作
                    }
                },
                message: '${title}默認提示'
            }
        ]
    },
]
```