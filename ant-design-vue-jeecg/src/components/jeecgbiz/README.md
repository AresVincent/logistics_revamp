# JSelectDepart 部門選擇組件
選擇部門組件,存儲部門ID,显示部門名稱

## 參數配置
| 參數           | 類型   | 必填 |說明|
|--------------|---------|----|---------|
| modalWidth      |Number   | | 彈框寬度 默認500 |
| multi      |Boolean   | | 是否多選 默認false |
| rootOpened      |Boolean   | | 是否展開根節點 默認true |
| disabled      |Boolean   | | 是否禁用 默認false|

使用示例
----
```vue
<template>
  <a-form :form="form">
    <a-form-item label="部門選擇v-decorator" style="width: 300px">
      <j-select-depart v-decorator="['bumen']"/>
      {{ getFormFieldValue('bumen') }}
    </a-form-item>

    <a-form-item label="部門選擇v-model" style="width: 300px">
      <j-select-depart v-model="bumen"/>
      {{ bumen }}
    </a-form-item>

    <a-form-item label="部門多選v-model" style="width: 300px">
      <j-select-depart v-model="bumens" :multi="true"/>
      {{ bumens }}
    </a-form-item>

  </a-form >
</template>

<script>
  import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
  export default {
    components: {JSelectDepart},
    data() {
      return {
        form: this.$form.createForm(this),
        bumen:"",
        bumens:""
      }
    },
    methods:{
      getFormFieldValue(field){
        return this.form.getFieldValue(field)
      }
    }
  }
</script>
```
# JSelectMultiUser 用戶多選組件

使用示例
----
```vue
<template>
  <a-form :form="form">
    <a-form-item label="用戶選擇v-decorator" style="width: 500px">
      <j-select-multi-user v-decorator="['users']"/>
      {{ getFormFieldValue('users') }}
    </a-form-item>

    <a-form-item label="用戶選擇v-model" style="width: 500px">
      <j-select-multi-user v-model="users" ></j-select-multi-user>
      {{ users }}
    </a-form-item>

  </a-form >
</template>

<script>
  import JSelectMultiUser from '@/components/jeecgbiz/JSelectMultiUser'
  export default {
    components: {JSelectMultiUser},
    data() {
      return {
        form: this.$form.createForm(this),
        users:"",
      }
    },
    methods:{
      getFormFieldValue(field){
        return this.form.getFieldValue(field)
      }
    }
  }
</script>
```

# JSelectUserByDep 根據部門選擇用戶

## 參數配置
| 參數           | 類型   | 必填 |說明|
|--------------|---------|----|---------|
| modalWidth      |Number   | | 彈框寬度 默認1250 |
| disabled      |Boolean   | | 是否禁用 |

使用示例
----
```vue
<template>
  <a-form :form="form">
    <a-form-item label="用戶選擇v-decorator" style="width: 500px">
      <j-select-user-by-dep v-decorator="['users']"/>
      {{ getFormFieldValue('users') }}
    </a-form-item>

    <a-form-item label="用戶選擇v-model" style="width: 500px">
      <j-select-user-by-dep v-model="users" ></j-select-user-by-dep>
      {{ users }}
    </a-form-item>

  </a-form >
</template>

<script>
  import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
  export default {
    components: {JSelectUserByDep},
    data() {
      return {
        form: this.$form.createForm(this),
        users:"",
      }
    },
    methods:{
      getFormFieldValue(field){
        return this.form.getFieldValue(field)
      }
    }
  }
</script>
```

