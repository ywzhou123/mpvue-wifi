<template>
  <div class="container">
    <div class="image">
      <img src="../../../static/image/wifi-example.png" alt="" class="img">
    </div>
    <form class="form">
      <input type="text" class="ssid" :value="ssid" disabled/>
      <input type="password" class="pass" placeholder="输入WiFi密码（必填）" v-model="pass" auto-focus/>
      <input type="text" class="title" placeholder="输入欢迎语（例：XXX企业欢迎您）" v-model="title"/>
      <input type="text" class="remark" placeholder="输入备注（例：会议室专用）" v-model="remark"/>
      <button class="weui-btn" type="primary" @click="clickHandle">生成WiFi码</button>
    </form>
  </div>
</template>

<script>
import { getCurrentPageUrlArgs, isIncludeChinese } from '../../utils'

export default {
  data() {
    return {
      ssid: '',
      bssid: '',
      pass: '',
      title: '',
      remark: ''
    }
  },
  methods: {
    clickHandle (e) {
      e.preventDefault();
      var that = this;
      var pass = this.pass.trim()
      if (!pass) {
        wx.showToast({
          icon: 'none',
          title: '密码不能为空',
        })
        return
      }
      if (isIncludeChinese(pass)) {
        wx.showToast({
          icon: 'none',
          title: '密码不能包含中文',
        })
        return
      }
      wx.showModal({
        title: '请确认WiFi密码是否填写正确？',
        content: '请输入准确的WiFi密码，WiFi密码错误将导致访客无法连接，您的WiFi密码将加密存储，请放心使用',
        success(res) {
          if (res.confirm) {
            that.createWifi()
          }
        }
      })
    },
    createWifi () {
      var ssid = this.ssid
      var bssid = this.bssid
      var pass = this.pass.trim()
      var title = this.title.trim()
      var remark = this.remark.trim()
      wx.showLoading({
        title: '生成中',
      })
      this.$db.collection('wifi_list').add({
        data: {
          ssid,
          bssid,
          pass,
          title,
          remark
        },
        success (res) {
          var id = res.data._id
          // 生成小程序码
          // wx.navigateTo({
          //   url: `/pages/detail/main?wifi_id=${wifi_id}`
          // })
        },
        fail (err) {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
        },
        complete () {
          wx.hideLoading()
        }
      })
    }
  },
  mounted() {
    var args = getCurrentPageUrlArgs()
    if (args.ssid) this.ssid=args.ssid
    if (args.bssid) this.bssid=args.bssid
  }
}
</script>

<style scoped>
.image{
  background-color: #fff;
  margin-top: 40px;
}
.img{
  height: 400px;
  width: 280px;
}
.form{
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
}
input{
  margin: 4px 20px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}
.weui-btn{
  margin: 20px;
}
</style>
