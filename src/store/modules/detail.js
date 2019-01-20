import db from '@/store/db'

const state = function () {
  return {
    wifi:{
      _id:'',
      ssid: '',
      bssid:'',
      title: '',
      remark:'',
      pass:'',
      code_url: '',
      create:'',
    },
    canvasImagePath: '',
  }
}
export default {
  namespaced: true,
  state,
  mutations: {
    updateCanvasImagePath(state, data) {
      console.log('update canvasImagePath: ', data)
      state.canvasImagePath = data
    },
    updateWifi(state, data){
      console.log('update wifi: ',data)
      state.wifi = data
    }
    // showTip(state) {
    //   state.tip = true
    // },
    // hideTip(state) {
    //   state.tip = false
    // }
  },
  getters: {
    // getWifiDetail (state, getters, rootState) {
    //   rootState.wifi_list.forEach(wifi => {
    //     if (wifi._id === state.wifi_id) {
    //       return wifi
    //     }
    //   });
    //   return
    // }
    wifiDetail(state,getters,rootState){
      return state.wifi
    }
  },
  actions: {
    getWifiDetail({commit}, wifi_id){
      if (wifi_id){
        db.collection('wifi_list').doc(wifi_id).get({
          success(res) {
            commit('updateWifi', res.data)
            // that.downloadImage()
          },
          fail() {
            wx.showToast({
              icon: 'none',
              title: '获取详情失败',
            })
          }
        })
      }
    },
    getCanvasImagePath({commit}, data){
      commit('updateCanvasImagePath',data)
    }
  }
}
