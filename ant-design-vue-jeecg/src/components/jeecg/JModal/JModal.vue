<template>
  <a-modal
    ref="modal"
    :class="getClass(modalClass)"
    :style="getStyle(modalStyle)"
    :visible="visible"
    v-bind="_attrs"
    v-on="$listeners"
    @ok="handleOk"
    @cancel="handleCancel"
    destroyOnClose
  >

    <slot></slot>
    <!--有設置標題-->
    <template v-if="!isNoTitle" slot="title">
      <a-row class="j-modal-title-row" type="flex">
        <a-col class="left">
          <slot name="title">{{ title }}</slot>
        </a-col>
        <a-col v-if="switchFullscreen" class="right" @click="toggleFullscreen">
          <a-button class="ant-modal-close ant-modal-close-x" ghost type="link" :icon="fullscreenButtonIcon"/>
        </a-col>
      </a-row>
    </template>
    <!--沒有設置標題-->
    <template v-else slot="title">
      <a-row class="j-modal-title-row" type="flex">
        <a-col v-if="switchFullscreen" class="right" @click="toggleFullscreen">
          <a-button class="ant-modal-close ant-modal-close-x" ghost type="link" :icon="fullscreenButtonIcon"/>
        </a-col>
      </a-row>
    </template>

    <!-- 處理 scopedSlots -->
    <template v-for="slotName of scopedSlotsKeys" :slot="slotName">
      <slot :name="slotName"></slot>
    </template>

    <!-- 處理 slots -->
    <template v-for="slotName of slotsKeys" v-slot:[slotName]>
      <slot :name="slotName"></slot>
    </template>

  </a-modal>
</template>

<script>

import { getClass, getStyle } from '@/utils/props-util'
import { triggerWindowResizeEvent } from '@/utils/util'

export default {
    name: 'JModal',
    props: {
      title: String,
      // 可使用 .sync 修飾符
      visible: Boolean,
      // 是否全屏彈窗，當全屏時無論如何都會禁止 body 滾動。可使用 .sync 修飾符
      fullscreen: {
        type: Boolean,
        default: false
      },
      // 是否允許切換全屏（允許后右上角會出現一個按鈕）
      switchFullscreen: {
        type: Boolean,
        default: false
      },
      // 點擊確定按鈕的時候是否關閉彈窗
      okClose: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        // 內部使用的 slots ，不再處理
        usedSlots: ['title'],
        // 實際控制是否全屏的參數
        innerFullscreen: this.fullscreen,
      }
    },
    computed: {
      // 一些未處理的參數或特殊處理的參數綁定到 a-modal 上
      _attrs() {
        let attrs = { ...this.$attrs }
        // 如果全屏就將寬度設為 100%
        if (this.innerFullscreen) {
          attrs['width'] = '100%'
        }
        return attrs
      },
      modalClass() {
        return {
          'j-modal-box': true,
          'fullscreen': this.innerFullscreen,
          'no-title': this.isNoTitle,
          'no-footer': this.isNoFooter,
        }
      },
      modalStyle() {
        let style = {}
        // 如果全屏就將top設為 0
        if (this.innerFullscreen) {
          style['top'] = '0'
        }
        return style
      },
      isNoTitle() {
        return !this.title && !this.allSlotsKeys.includes('title')
      },
      isNoFooter() {
        return this._attrs['footer'] === null
      },
      slotsKeys() {
        return Object.keys(this.$slots).filter(key => !this.usedSlots.includes(key))
      },
      scopedSlotsKeys() {
        return Object.keys(this.$scopedSlots).filter(key => !this.usedSlots.includes(key))
      },
      allSlotsKeys() {
        return Object.keys(this.$slots).concat(Object.keys(this.$scopedSlots))
      },
      // 切換全屏的按鈕圖標
      fullscreenButtonIcon() {
        return this.innerFullscreen ? 'fullscreen-exit' : 'fullscreen'
      },
    },
    watch: {
      visible() {
        if (this.visible) {
          this.innerFullscreen = this.fullscreen
        }
      },
      innerFullscreen(val) {
        this.$emit('update:fullscreen', val)
      },
    },
    methods: {

      getClass(clazz) {
        return { ...getClass(this), ...clazz }
      },
      getStyle(style) {
        return { ...getStyle(this), ...style }
      },

      close() {
        this.$emit('update:visible', false)
      },

      handleOk() {
        if (this.okClose) {
          this.close()
        }
      },
      handleCancel() {
        this.close()
      },

      /** 切換全屏 */
      toggleFullscreen() {
        this.innerFullscreen = !this.innerFullscreen
        triggerWindowResizeEvent()
      },

    }
  }
</script>

<style lang="less">
  
  .j-modal-box {
    &.fullscreen {
      top: 0;
      left: 0;
      padding: 0;

      // 兼容1.6.2版本的antdv
      & .ant-modal {
        top: 0;
        padding: 0;
        height: 100vh;
      }

      & .ant-modal-content {
        height: 100vh;
        border-radius: 0;

        & .ant-modal-body {
          /* title 和 footer 各占 55px */
          height: calc(100% - 55px - 55px);
          overflow: auto;
        }
      }

      &.no-title, &.no-footer {
        .ant-modal-body {
          height: calc(100% - 55px);
        }
      }
      &.no-title.no-footer {
        .ant-modal-body {
          height: 100%;
        }
      }
    }

    .j-modal-title-row {
      .left {
        width: calc(100% - 56px - 56px);
      }

      .right {
        width: 56px;
        position: inherit;

        .ant-modal-close {
          right: 56px;
          color: rgba(0, 0, 0, 0.45);

          &:hover {
            color: rgba(0, 0, 0, 0.75);
          }
        }
      }
    }
    &.no-title{
      .ant-modal-header {
        padding: 0px 24px;
        border-bottom: 0px !important;
      }
    }
  }

  @media (max-width: 767px) {
    .j-modal-box.fullscreen {
      margin: 0;
      max-width: 100vw;
    }
  }
</style>