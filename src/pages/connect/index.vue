<template>
  <div class="container"  :style="{height: height, backgroundImage:backgroundImage}" >
    <div class="header">
      <span>欢迎使用畅享无限WiFi</span>
    </div>
    <div class="body">
      <img src="/static/image/logo.png" alt="" class="logo">
      <span class="find">发现WiFi</span>
      <span class="ssid">{{wifi.ssid}}</span>
      <span class="title">{{wifi.title}}</span>
      <span class="remark">{{wifi.remark}}</span>
      <button class="weui-btn" type="primary" :disabled="disabled" @click="clickHandle">{{connectBtnText}}</button>
    </div>
    <a href="/pages/index/main" class="footer">如何创建WiFi码</a>
  </div>
</template>

<script>
// import Img from '../../../static/image/background.png'

export default {
  data(){
    return {
      openid: '',
      img: '/static/image/background.png',
      height:'',
      disabled: true,
      connectBtnText: '连接WiFi',
      wifi: {
        _id: '',
        ssid: '',
        bssid: '',
        pass: '',
        title: '',
        remark: '',
        count: 0,
        code_url: '',
      }
    }
  },
  computed: {
    backgroundImage () {
      // return `url(${this.img})`
      let base64 = wx.getFileSystemManager().readFileSync(this.img, 'base64');
      return `url(data:image/jpg;base64,${base64})`
    }
  },
  methods: {
    clickHandle(e){
      wx.navigateTo({
        url: `/pages/connecting/main?wifi_id=${this.wifi._id}`
      })
    },
    clickHandle2(e){
      console.log('click connect', e)
      var that = this
      if (that.wifi.ssid) {
        wx.showLoading({
          title: '连接中',
        })
        wx.onWifiConnected(function(res){
          console.log('onWifiConnected: ', res.wifi)
        })
        wx.connectWifi({
          SSID: that.wifi.ssid,
          password: that.wifi.pass,
          success(res){
            console.log('connectWifi', res.errMsg)
            wx.showToast({
              icon: 'success',
              title: '连接成功',
              duration: 5000
            })
            that.createConnect()
          },
          fail(err){
            console.log('connectWifi', err)
            that.connectBtnText='重新连接'
            wx.showToast({
              icon: 'none',
              title: '连接失败',
              duration: 5000
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
    createConnect(){
      const that = this
      if (!that.openid){
        console.log('no openid')
        return
      }
      // 创建一个连接记录,如果存在就更新time
      const connect_list = that.$db.collection('connect_list').where({
        wifi_id: that.wifi._id,
        _openid: that.openid
      }).orderBy('time','desc').get({
        success(res){
          console.log('connect_list: ',res)
          if (res.data.length){
            // 已有此连接记录，更新连接次数及时间，多余的删除
            const array = res.data
            for (let index = 0, length = array.length; index < length; index++) {
              const element = array[index];
              if (index === 0){
                that.$db.collection('connect_list').doc(element._id).update({
                  data:{
                    count: that.$db.command.inc(1)
                  }
                })
              }else{
                that.$db.collection('connect_list').doc(element._id).remove()
              }
            }
          }else{
            // 没有连接记录，新建
            that.$db.collection('connect_list').add({
              data: {
                wifi_id: that.wifi._id,
                time: Date(),
                count: 1,
              },
              success (res) {
                console.log('add connect:',res)
              },
              fail (err) {
                console.log('add connect fail')
              }
            })
          }
        },
        fail(err){
          console.log('con list f: ', err)
        }
      })
    },
    getWifiDetail(wifi_id){
      const that = this;
      if (wifi_id) {
        console.log('get wifi: ', wifi_id)
        this.$db.collection('wifi_list').doc(wifi_id).get({
          success(res) {
            console.log("wifi:",res.data)
            that.wifi = Object.assign({}, that.wifi, res.data)
            that.disabled = false
          },
          fail(err){
            console.log('get wifi fail: ', err)
            wx.showToast({
              icon: 'none',
              title: 'WiFi已被分享者删除',
            })
            wx.navigateTo({
              url: '/pages/index/main'
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
    },
    getOpenId(){
      var that = this
      wx.cloud.callFunction({
        name: 'login',
        success(res) {
          that.openid=res.result.openid
        },
        fail(err){
          console.log('openid fail',err)
        }
      })
    },
  },
  mounted() {
    // 设置高度
    this.setClientHeight()
    this.getOpenId()

    var wifi_id
    var query = this.$root.$mp.query
    console.log('query: ', query)

    if (query.scene && query.scene !== "scene"){
      wifi_id = decodeURIComponent(query.scene)
    } else {
      wifi_id = query.wifi_id
    }

    if (wifi_id) {
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
  /* background-image: url('/static/image/background.png') */
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
