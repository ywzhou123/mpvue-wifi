import Vue from 'vue'
import App from './App'
import '../static/css/weui.css'

// import request from './api/http'
// Vue.prototype.$http = request
Vue.config.productionTip = false
App.mpType = 'app'

import db from '@/store/db'

// mpvue不支持在new Vue中导入store，因此放在原型上
import store from '@/store'
Vue.prototype.$store=store
const app = new Vue(App)

app.$mount()
