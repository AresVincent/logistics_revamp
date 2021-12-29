# JSelectBizComponent

Jeecg 選擇組件的公共可復用組件

## 引用方式

```js
import JSelectBizComponent from '@/src/components/jeecgbiz/JSelectBizComponent'

export default {
  components: { JSelectBizComponent }
}
```

## 參數

### 配置參數

| 參數名                | 類型    | 必填 | 默認值       | 備註                                                                                 |
|-----------------------|---------|------|--------------|--------------------------------------------------------------------------------------|
| rowKey                | String  |      | "id"         | 唯一標識的字段名                                                                     |
| value(v-model)        | String  |      | ""           | 默認選擇的數據，多個用半角逗號分割                                                   |
| name                  | String  |      | ""           | 显示名字，例如選擇用戶就填寫"用戶"                                                   |
| listUrl               | String  | 是   |              | 數據請求地址，必須是封裝了分頁的地址                                                 |
| valueUrl              | String  |      | ""           | 獲取显示文本的地址，例如存的是 username，可以通過該地址獲取到 realname               |
| displayKey            | String  |      | null         | 显示在標籤上的字段 key    ，不傳則直接显示數據                                       |
| returnKeys            | Array   |      | ['id', 'id'] | v-model 綁定的 keys，是個數組，默認使用第二項，當配置了 `returnId=true` 就返回第一項 |
| returnId              | Boolean |      | false        | 返回ID，設為true后將返回配置的 `returnKeys` 中的第一項                               |
| selectButtonText      | String  |      | "選擇"       | 選擇按鈕的文字                                                                       |
| queryParamText        | String  |      | null         | 查詢條件显示文字，不傳則使用 `name`                                                  |
| columns               | Array   | 是   |              | 列配置項，與antd的table的配置完全一致。列的第一項會被配置成右側已選擇的列表上        |
| columns[0].widthRight | String   |      | null         | 僅列的第一項可以應用此配置，表示右側已選擇列表的寬度，建議 `70%`，不傳則應用`width`  |
| placeholder           | String  |      | "請選擇"     | 佔位符                                                                               |
| disabled              | Boolean |      | false        | 是否禁用                                                                             |
| multiple              | Boolean |      | false        | 是否可多選                                                                           |
| buttons               | Boolean |      | true         | 是否显示"選擇"按鈕，如果不显示，可以直接點擊文本框打開選擇界面                       |
