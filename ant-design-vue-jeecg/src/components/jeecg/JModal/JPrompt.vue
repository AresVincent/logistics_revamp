<template>
  <j-modal :visible="visible" :confirmLoading="loading" :after-close="afterClose" v-bind="modalProps" @ok="onOk" @cancel="onCancel">
    <a-spin :spinning="loading">
      <div v-html="content"></div>
      <a-form-model ref="form" :model="model" :rules="rules">
        <a-form-model-item prop="input">
          <a-input ref="input" v-model="model.input" v-bind="inputProps" @pressEnter="onInputPressEnter"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </j-modal>
</template>

<script>
import pick from 'lodash.pick'

export default {
  name: 'JPrompt',
  data() {
    return {
      visible: false,
      loading: false,
      content: '',
      // 彈窗參數
      modalProps: {
        title: '',
      },
      inputProps: {
        placeholder: '',
      },
      // form model
      model: {
        input: '',
      },
      // 校驗
      rule: [],
      // 回調函數
      callback: {},
    }
  },
  computed: {
    rules() {
      return {
        input: this.rule
      }
    },
  },
  methods: {
    show(options) {
      this.content = options.content
      if (Array.isArray(options.rule)) {
        this.rule = options.rule
      }
      if (options.defaultValue != null) {
        this.model.input = options.defaultValue
      }
      // 取出常用的彈窗參數
      let pickModalProps = pick(options, 'title', 'centered', 'cancelText', 'closable', 'mask', 'maskClosable', 'okText', 'okType', 'okButtonProps', 'cancelButtonProps', 'width', 'wrapClassName', 'zIndex', 'dialogStyle', 'dialogClass')
      this.modalProps = Object.assign({}, pickModalProps, options.modalProps)
      // 取出常用的input參數
      let pickInputProps = pick(options, 'placeholder', 'allowClear')
      this.inputProps = Object.assign({}, pickInputProps, options.inputProps)
      // 回調函數
      this.callback = pick(options, 'onOk', 'onOkAsync', 'onCancel')
      this.visible = true
      this.$nextTick(() => this.$refs.input.focus())
    },

    onOk() {
      this.$refs.form.validate((ok, err) => {
        if (ok) {
          let event = {value: this.model.input, target: this}
          // 異步方法優先級高於同步方法
          if (typeof this.callback.onOkAsync === 'function') {
            this.callback.onOkAsync(event)
          } else if (typeof this.callback.onOk === 'function') {
            this.callback.onOk(event)
            this.close()
          } else {
            this.close()
          }
        }
      })
    },
    onCancel() {
      if (typeof this.callback.onCancel === 'function') {
        this.callback.onCancel(this.model.input)
      }
      this.close()
    },

    onInputPressEnter() {
      this.onOk()
    },

    close() {
      this.visible = this.loading ? this.visible : false
    },

    forceClose() {
      this.visible = false
    },

    showLoading() {
      this.loading = true
    },
    hideLoading() {
      this.loading = false
    },

    afterClose(e) {
      if (typeof this.modalProps.afterClose === 'function') {
        this.modalProps.afterClose(e)
      }
      this.$emit('after-close', e)
    },

  },
}
</script>

<style scoped>

</style>