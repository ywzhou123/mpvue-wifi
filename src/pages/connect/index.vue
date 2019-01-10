<template>
  <div class="container" :style="{height: height,backgroundImage: 'url(' + img + ')' }" >
    <div class="header">
      <span>欢迎使用畅享无限WiFi</span>
    </div>
    <div class="body">
      <img src="../../../static/image/logo.png" alt="" class="logo">
      <span class="find">发现WiFi</span>
      <span class="ssid">{{wifi.ssid}}</span>
      <span class="title">{{wifi.title}}</span>
      <span class="remark">{{wifi.remark}}</span>
      <button class="weui-btn" type="primary" :disabled="disabled" @click="clickHandle">连接WiFi</button>
    </div>
    <a href="/pages/index/main" class="footer">如何创建WiFi码</a>
  </div>
</template>

<script>
import { getCurrentPageUrlArgs } from '../../utils'
import Img from '../../../static/image/background.png'

export default {
  data(){
    return {
      img: Img,
      height:'',
      disabled: true,
      wifi: {
        id: '',
        ssid: '',
        bssid: '',
        pass: '',
        title: '',
        remark: '',
      }
    }
  },
  methods: {
    clickHandle(e){
      console.log('click connect', e)
      var that = this
      if (that.wifi.ssid) {
        wx.showLoading({
          title: '连接中',
        })
        wx.connectWifi({
          SSID: that.wifi.ssid,
          password: that.wifi.pass,
          success(res){
            console.log('connectWifi', res.errMsg)
            wx.showToast({
              icon: 'success',
              title: '连接成功',
            })
          },
          fail(err){
            console.log('connectWifi', err)
            wx.showToast({
              icon: 'none',
              title: '连接失败',
            })
          },
          complete(){
            wx.hideLoading()
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: 'WiFi不存在',
        })
      }
    },
    getWifiDetail(wifi_id){
      const that = this;
      if (wifi_id) {
        this.$db.collection('wifi_list').doc(wifi_id).get({
          success(res) {
            that.wifi = Object.assign({}, that.wifi, res.data)
            that.disabled = false
          },
          fail(){
            wx.showToast({
              icon: 'none',
              title: '获取详情失败',
            })
          }
        })
      }
    },
    setClientHeight(){
      let that = this;
      // 获取系统信息
      wx.getSystemInfo({
        success: function (res) {
          // 获取可使用窗口宽度
          let clientHeight = res.windowHeight;
          // 获取可使用窗口高度
          let clientWidth = res.windowWidth;
          // 算出比例
          let ratio = 750 / clientWidth;
          // 算出高度(单位rpx)
          let height = clientHeight * ratio;
          // 设置高度
          that.height=`${height}rpx`
          console.log('heith: ',height)
        }
      })
    }
  },
  mounted() {
    // 设置高度
    this.setClientHeight()
    var wifi_id
    // 小程序扫码进入
    const scene = decodeURIComponent(query.scene)
    console.log('scene: ', scene)
    if (scene){
      wifi_id = scene
    } else {
      var args = getCurrentPageUrlArgs()
      console.log('args',args)
      if (args.wifi_id){
        wifi_id = args.wifi_id
      }
    }
    if (wifi_id) {
      this.wifi.id = wifi_id
      this.getWifiDetail(wifi_id)
    }else{
      wx.showToast({
        icon: 'none',
        title: '请求参数错误',
      })
    }
  }
}
</script>

<style scoped>
.container{
  justify-content: start;
  background-color: green;
}
.header{
  font-size:24px;
  color:#fff;
  margin:60px;
}
.body{
  display:flex;
  flex-direction:column;
  width:80%;
  justify-content:space-between;
  align-items:center;
  background-color:#fff;
  border-radius:10px;
  padding-bottom:60px;
}
.logo{
  width:40px;
  height:40px;
  margin:15px;
}
.find{
  font-size:12px;
  color:#ccc;
  margin-bottom:20px;
}
.ssid{
  line-height:20px;
}
.title{
  font-size:14px;
  color:#aaa;
}
.remark{
  font-size:14px;
  color:#aaa;
}
.weui-btn{
  width:60%;
}
.footer{
  position: fixed;
  bottom: 0;
  border-bottom: 2px solid #fff;
  font-size: 14px;
  color: #fff;
  margin-bottom: 20px;
}
</style>
