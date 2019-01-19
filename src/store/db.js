import Vue from 'vue'

let db
// 微信小程序云开发模式，初始化db
if (!wx.cloud) {
  console.error('请使用 2.2.3 或以上的基础库以使用云能力')
} else {
  wx.cloud.init({
    traceUser: true,
  })
  const isDev = process.env.NODE_ENV === 'development'
  const env = isDev ? 'env-72ff23' : 'pr-10b393'
  db = wx.cloud.database({ env: 'env-72ff23' })
  Vue.prototype.$db = db
}
export default db
