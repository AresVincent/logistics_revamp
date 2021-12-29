import JModal from './JModal'
import JPrompt from './JPrompt'

export default {
  install(Vue) {
    Vue.component(JModal.name, JModal)

    const JPromptExtend = Vue.extend(JPrompt)
    Vue.prototype.$JPrompt = function (options = {}) {
      // 創建prompt實例
      const vm = new JPromptExtend().$mount()
      vm.show(options)
      // 關閉后銷毀
      vm.$on('after-close', () => vm.$destroy())
      return vm
    }
  },
}