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
  state(){
    return {
      userInfo,
      wifiList: [],
      connectList: [],
    }
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
    updateConnectWifiList(state, data) {
      const wifi_id_list = data.map(wifi=>wifi._id)
      state.connectList = state.connectList.map(con=>{
        if (wifi_id_list.includes(con.wifi_id)) {
          con.wifi = data.filter(wifi=>wifi._id==con.wifi_id)[0]
        }
        return con
      })
    },
    updateUserInfo(state, data) {
      state.userInfo = data
    },
  },
  actions: {
    //获取数据库 wifi_list
    getWifiList({ state, commit, rootState }) {
      // console.log('wifi_list: ', rootState.openId)
      if (rootState.openId) {
        commit('startLoading')
        db.collection('wifi_list').where({
          _openid: rootState.openId,
        })
          // .orderBy('create', 'desc')
          // .limit(10)
          .get()
          .then(res => {
            // console.log('getWifiList: ', res.data)
            commit('updateWifiList', res.data)
            commit('endLoading')
          })
          .catch(console.error)
      }
    },
    //获取数据库 connect_list
    getConnectList({ state, commit, rootState, dispatch }) {
      if (rootState.openId) {
        commit('startLoading')
        db.collection('connect_list').where({
          _openid: rootState.openId,
        })
          // .orderBy('time', 'asc')
          // .limit(10)
          .get()
          .then(res => {
            commit('updateConnectList', res.data)
            commit('endLoading')
            dispatch('getConnectWifiList', res.data.map(con=>con.wifi_id))
          })
          .catch(console.error)
      }
    },
    getConnectWifiList({ state, commit, rootState}, payload){
      db.collection('wifi_list').where({
        _id: db.command.in(payload)
      })
        .get()
        .then(res => {
          // console.log('getConnectWifiList: ', res.data)
          commit('updateConnectWifiList', res.data)
        })
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
  }
}
