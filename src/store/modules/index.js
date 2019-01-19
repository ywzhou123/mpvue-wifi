import createPersistedState from 'vuex-persistedstate'
import db from '@/store/db'
import authStore from './auth'

const userInfo = {
  nickName: '',
  avatarUrl: '',
  gender: 0,
  province: '',
  city: '',
  country: ''
}
export default {
  namespaced: true,
  state: {
    userInfo,
    wifiList: [],
    connectList: [],
  },
  mutations: {
    startLoading() {
      wx.showLoading({
        title: '数据加载中...',
      })
    },
    endLoading() {
      wx.hideLoading()
    },
    updateWifiList(state, data) {
      state.wifiList = data
    },
    updateConnectList(state, data) {
      state.connectList = data
    },
    updateUserInfo(state, data) {
      state.userInfo = data
    },
  },
  actions: {
    //获取数据库 wifi_list
    getWifiList({ state, commit, rootState }) {
      console.log('wifi_list: ', rootState.openId)
      if (rootState.openId) {
        commit('startLoading')
        db.collection('wifi_list').where({
          _openid: rootState.openId,
        })
          // .orderBy('create', 'desc')
          // .limit(10)
          .get()
          .then(res => {
            console.log('getWifiList: ', res.data)
            commit('updateWifiList', res.data)
            commit('endLoading')
          })
          .catch(console.error)
      }
    },
    //获取数据库 connect_list
    getConnectList({ state, commit, rootState }) {
      if (rootState.openId) {
        commit('startLoading')
        db.collection('connect_list').where({
          _openid: rootState.openId,
        })
          // .orderBy('time', 'asc')
          // .limit(10)
          .get()
          .then(res => {
            console.log('getConnectList: ',res.data)
            commit('updateConnectList', res.data)
            commit('endLoading')
          })
          .catch(console.error)
      }
    },
    getAuthSetting({ state, commit, rootState, dispatch }) {
      console.log('getAuthSetting: ',rootState)
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            dispatch('getUserInfo')
          } else {
            commit('updateUserInfo', userInfo)
            commit('auth/showTip')
          }
        }
      })
    },
    //获取用户信息
    getUserInfo({ state, commit, rootState }) {
      wx.login({
        success() {
          console.log('login success: ')
          wx.getUserInfo({
            success(res) {
              console.log('getUserInfo: ', res.userInfo)
              commit('updateUserInfo', res.userInfo)
            }
          })
        }
      })
    },
  },
  modules: {
    auth: authStore
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
}
