# JPopup 彈窗選擇組件

## 參數配置
| 參數           | 類型   | 必填 |說明|
|--------------|---------|----|---------|
| placeholder      |string   | | placeholder |
| code      |string   | | online報表編碼 |
| orgFields      |string   | | online報表中显示的列,多個以逗號隔開 |
| destFields      |string   | | 回調對象的屬性,多個以逗號隔開,其順序和orgFields一一對應 |
| field      |string   | | v-model模式專用,表示從destFields中選擇一個屬性的值返回給當前組件 |
| triggerChange      |Boolean   | | v-decorator模式下需設置成true |
| callback(事件)      |function   | | 回調事件,v-decorator模式下用到,用於設置form控件的值 |

使用示例
----
```vue
<template>
  <a-form :form="form">
    <a-form-item label="v-model模式指定一個值返回至當前組件" style="width: 300px">
      <j-popup
        v-model="selectValue"
        code="user_msg"
        org-fields="username,realname"
        dest-fields="popup,other"
        field="popup"/>
      {{ selectValue }}
    </a-form-item>

    <a-form-item label="v-decorator模式支持回調多個值至當前表單" style="width: 300px">
      <j-popup
        v-decorator="['one']"
        :trigger-change="true"
        code="user_msg"
        org-fields="username,realname"
        dest-fields="one,two"
        @callback="popupCallback"/>
      {{ getFormFieldValue('one') }}
    </a-form-item>

    <a-form-item label="v-decorator模式被回調的值" style="width: 300px">
      <a-input v-decorator="['two']"></a-input>
    </a-form-item>


  </a-form >
</template>

<script>
  export default {
    data() {
      return {
        form: this.$form.createForm(this),
        selectValue:"",
      }
    },
    methods:{
      getFormFieldValue(field){
        return this.form.getFieldValue(field)
      },
      popupCallback(row){
        this.form.setFieldsValue(row)
      }
    }
  }
</script>
