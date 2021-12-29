import Vue from 'vue'
import { ONL_AUTH_FIELDS } from "@/store/mutation-types"
import { getAction } from '@/api/manage'


const online = {
  state: {
    //存儲對象屬性 value,text
    authFields: [],
  },
  mutations: {
    SET_AUTHFIELDS: (state, fields) => {
      console.log('fields',fields)
      Vue.set(state, 'authFields', fields)
    }
  },
  actions: {
    // TODO 如果沒找到可以嘗試請求一下
    xxxxxx({ commit }, userInfo) {
    }

  }
}

export default online