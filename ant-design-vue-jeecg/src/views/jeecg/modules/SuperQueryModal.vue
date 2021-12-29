<template>
  <a-modal
    title="高級查詢構造器"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    :mask="false"
    okText="查詢"
    @cancel="handleCancel"
    cancelText="關閉">

    <a-spin :spinning="confirmLoading">
      <a-form>
        <div>
          <a-row type="flex" style="margin-bottom:10px" :gutter="16" v-for="(item, index) in queryParamsModel" :key="index">
            <a-col :span="6">
              <a-select  placeholder="選擇查詢字段" v-model="item.field">
                <a-select-option value="name">用戶名</a-select-option>
                <a-select-option value="key_word">關鍵詞</a-select-option>
                <a-select-option value="birthday">生日</a-select-option>
                <a-select-option value="age">年齡</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select placeholder="選擇匹配規則"  v-model="item.rule">
                <a-select-option value="=">等於</a-select-option>
                <a-select-option value="!=">不等於</a-select-option>
                <a-select-option value=">">大於</a-select-option>
                <a-select-option value=">=">大於等於</a-select-option>
                <a-select-option value="<">小於</a-select-option>
                <a-select-option value="<=">小於等於</a-select-option>
                <a-select-option value="LEFT_LIKE">以..開始</a-select-option>
                <a-select-option value="RIGHT_LIKE">以..結尾</a-select-option>
                <a-select-option value="LIKE">包含</a-select-option>
                <a-select-option value="IN">在...中</a-select-option>
              </a-select>
            </a-col>

            <a-col :span="6"><a-input placeholder="請輸入值" v-model="item.val"/></a-col>
            <a-col :span="6">
              <a-button @click="handleAdd"  icon="plus"></a-button>&nbsp;
              <a-button @click="handleDel( index )"  icon="minus"></a-button>
            </a-col>
          </a-row>
        </div>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'

  export default {
    name: "SuperQueryModal",
    data () {
      return {
        visible: false,
        queryParamsModel: [{},{}],
        confirmLoading: false
      }
    },
    created () {
    },
    methods: {
      show () {
        this.visible = true;
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        console.log(this.queryParamsModel)
        // 子組件中觸發父組件方法ee並傳值cc12345
        this.$emit('handleSuperQuery', this.queryParamsModel)
      },
      handleCancel () {
        this.close()
      },
      handleAdd () {
        this.queryParamsModel.push({});
      },
      handleDel (index) {
        console.log(index)
        this.queryParamsModel.splice(index,1);
      }
    }
  }
</script>

<style scoped>
</style>