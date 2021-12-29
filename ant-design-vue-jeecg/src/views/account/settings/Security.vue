<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
      </template>

    </a-list-item>
  </a-list>
</template>

<script>
  export default {
    data () {
      return {
        data: [
          { title: '賬戶密碼' , description: '當前密碼強度', value: '強', actions: { title: '修改', callback: () => { this.$message.info('This is a normal message'); } } },
          { title: '密保手機' , description: '已綁定手機', value: '138****8293', actions: { title: '修改', callback: () => { this.$message.success('This is a message of success'); } }  },
          { title: '密保問題' , description: '未設置密保問題，密保問題可有效保護賬戶安全', value: '', actions: { title: '設置', callback: () => { this.$message.error('This is a message of error'); } }  },
          { title: '備用郵箱' , description: '已綁定郵箱', value: 'ant***sign.com', actions: { title: '修改', callback: () => { this.$message.warning('This is message of warning'); } }  },
          { title: 'MFA 設備' , description: '未綁定 MFA 設備，綁定后，可以進行二次確認', value: '', actions: { title: '綁定', callback: () => { this.$message.info('This is a normal message'); } }  },
        ]
      }
    }
  }
</script>

<style scoped>

</style>