/**
 * LunarFullCalendar 公共 js
 *
 * @version 1.0.0
 * @author sunjianlei
 *
 * */

import { getRefPromise } from '@/utils/JEditableTableUtil'

/* 日曆的視圖類型 */
const calendarViewType = {
  month: 'month', // 月視圖
  basicWeek: 'basicWeek',  // 基礎周視圖
  basicDay: 'basicDay',//  基礎天視圖
  agendaWeek: 'agendaWeek', // 議程周視圖
  agendaDay: 'agendaDay', // 議程天視圖
}

/* 定義默認視圖 */
const defaultView = calendarViewType.month

/* 定義日曆默認配置 */
const defaultSettings = {
  locale: 'zh-cn',
  // 按鈕文字
  buttonText: {
    today: '今天',
    month: '月',
    week: '周',
    day: '日'
  },
  // 頭部排列方式
  header: {
    left: 'prev,next, today',
    center: 'title',
    right: 'hide, custom, month,agendaWeek,agendaDay'
  },
  //點擊今天日列表圖
  eventLimitClick: 'day',
  // 隱藏超出的事件
  eventLimit: true,
  // 設置每週開始日期為周日
  firstDay: 0,
  // 默認显示視圖
  defaultView,
  timeFormat: 'H:mm',
  axisFormat: 'H:mm',
  // agenda視圖下是否显示all-day
  allDaySlot: true,
  // agenda視圖下all-day的显示文本
  allDayText: '全天',
  // 時區默認本地的
  timezone: 'local',
  // 周視圖和日視同的左側時間显示
  slotLabelFormat: 'HH:mm',
  // 設置第二天閾值
  nextDayThreshold: '00:00:00',
}

/** 提供了一些增強方法 */
const CalendarMixins = {
  data() {
    return {
      calenderCurrentViewType: defaultView
    }
  },
  methods: {

    getCalendarConfigEventHandler() {
      return {
        // 處理 view changed 事件
        viewRender: (view, element) => {
          let { type } = view

          let lastViewType = this.calenderCurrentViewType
          this.calenderCurrentViewType = type

          if (typeof this.handleViewRender === 'function') {
            this.handleViewRender(type, view, element)
          }

          if (lastViewType !== this.calenderCurrentViewType && typeof this.handleViewChanged === 'function') {
            this.handleViewChanged(type, view, element)
          }

        },
      }
    },

    /** 獲取 LunarFullCalendar 實例，ref = baseCalendar */
    getCalendar(fn) {
      return getRefPromise(this, 'baseCalendar').then(fn)
    },

    calendarEmit(name, data) {
      this.getCalendar(ref => ref.$emit(name, data))
    },

    /** 強制重新加載所有的事件（日程）*/
    calendarReloadEvents() {
      this.calendarEmit('reload-events')
    }
  }
}

export { defaultSettings, calendarViewType, CalendarMixins }