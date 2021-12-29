import '../../less/reload-effect.less'
import { randomString } from '@/utils/util'

// 修改數據特效
export default {
  props: {
    vNode: null,
    // 是否啟用特效
    effect: Boolean,
  },
  data() {
    return {
      // vNode: null,
      innerEffect: false,
      // 應付同時多個特效
      effectIdx: 0,
      effectList: [],
    }
  },
  watch: {
    vNode: {
      deep: true,
      immediate: true,
      handler(vNode, old) {
        this.innerEffect = this.effect
        if (this.innerEffect && old != null) {
          let topLayer = this.renderSpan(old, 'top')
          this.effectList.push(topLayer)
        }
      },
    },
  },
  methods: {

    // 條件渲染內容 span
    renderVNode() {
      if (this.vNode == null) {
        return null
      }
      let bottom = this.renderSpan(this.vNode, 'bottom')
      // 啟用了特效，並且有舊數據，就渲染特效頂層
      if (this.innerEffect && this.effectList.length > 0) {
        this.$emit('effect-begin')
        // 1.4s 以後關閉特效
        window.setTimeout(() => {
          let item = this.effectList[this.effectIdx]
          if (item && item.elm) {
            // 特效結束后，展示先把 display 設為 none，而不是直接刪掉該元素，
            // 目的是為了防止頁面重新渲染，導致動畫重置
            item.elm.style.display = 'none'
          }
          // 當所有的層級動畫都結束時，再刪掉所有元素
          if (++this.effectIdx === this.effectList.length) {
            this.innerEffect = false
            this.effectIdx = 0
            this.effectList = []
            this.$emit('effect-end')
          }
        }, 1400)
        return [this.effectList, bottom]
      } else {
        return bottom
      }
    },
    // 渲染內容 span
    renderSpan(vNode, layer) {
      let options = {
        key: layer + this.effectIdx + randomString(6),
        class: ['j-vxe-reload-effect-span', `layer-${layer}`],
        style: {},
      }
      if (layer === 'top') {
        // 最新渲染的在下面
        options.style['z-index'] = (9999 - this.effectIdx)
      }
      return this.$createElement('span', options, [vNode])
    },
  },
  render(h) {
    return h('div', {
      class: ['j-vxe-reload-effect-box'],
    }, [this.renderVNode()])
  },
}