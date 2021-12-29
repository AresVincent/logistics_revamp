<template>
  <div :class="disabled?'jeecg-form-container-disabled':''">
    <fieldset :disabled="disabled">
      <slot name="detail"></slot>
    </fieldset>
    <slot name="edit"></slot>
    <fieldset disabled>
      <slot></slot>
    </fieldset>
  </div>
</template>

<script>
  /**
   * 使用方法
   * 在form下直接寫這個組件就行了，
   *<a-form layout="inline" :form="form" >
   *     <j-form-container :disabled="true">
   *         <!-- 表單內容省略..... -->
   *     </j-form-container>
   *</a-form>
   */
  export default {
    name: 'JFormContainer',
    props:{
      disabled:{
        type:Boolean,
        default:false,
        required:false
      }
    },
    mounted(){
      console.log("我是表單禁用專用組件,但是我並不支持表單中iframe的內容禁用")
    }
  }
</script>
<style>
  .jeecg-form-container-disabled{
    cursor: not-allowed;
  }
  .jeecg-form-container-disabled fieldset[disabled] {
    -ms-pointer-events: none;
    pointer-events: none;
  }
  .jeecg-form-container-disabled .ant-select{
    -ms-pointer-events: none;
    pointer-events: none;
  }

  .jeecg-form-container-disabled .ant-upload-select{display:none}
  .jeecg-form-container-disabled .ant-upload-list{cursor:grabbing}
  .jeecg-form-container-disabled fieldset[disabled] .ant-upload-list{
    -ms-pointer-events: auto !important;
    pointer-events: auto !important;
  }

  .jeecg-form-container-disabled .ant-upload-list-item-actions .anticon-delete,
  .jeecg-form-container-disabled .ant-upload-list-item .anticon-close{
    display: none;
  }
</style>