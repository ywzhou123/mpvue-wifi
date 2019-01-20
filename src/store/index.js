import state from './state'
import getters from './getters'
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate' // 解决Vuex持久化插件-在F5刷新页面后数据不见的问题
import indexStore from './modules/index'
import detailStore from './modules/detail'

Vue.use(Vuex)
export default new Vuex.Store({
  state(){
    return state
  },
  getters,
  actions,
  mutations,
  modules: {
    index: indexStore,
    detail: detailStore
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => wx.getStorageSync(key),
        setItem: (key, value) => wx.setStorageSync(key, value),
        removeItem: key => wx.clearStorage()
      }
    })
  ]
})
