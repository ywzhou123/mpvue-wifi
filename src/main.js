import Vue from 'vue'
import App from './App'
import request from './api/http'
import '../static/css/weui.css'

Vue.prototype.$http = request
Vue.config.productionTip = false
App.mpType = 'app'

if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    traceUser: true,
  })
  const db = wx.cloud.database({ env: 'env-72ff23' })
  Vue.prototype.$db = db
}

const app = new Vue(App)

app.$mount()
