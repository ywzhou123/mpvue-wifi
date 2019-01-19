import db from '@/store/db'

export default {
  namespaced: true,
  state: {
    tip: false
  },
  mutations: {
    showTip(state) {
      state.tip = true
    },
    hideTip(state){
      state.tip = false
    }
  },
}
