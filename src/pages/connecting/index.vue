<template>
  <div class="container" :style="{minHeight: minHeight}">
    <img src="/static/image/connecting.gif" alt="" class="img">
    <span class="ssid">{{wifi.ssid}}</span>
    <span class="desc">{{connectText}}</span>
    <div class="step_cont">
      <div class="step_item step1">
        <span class="txt">建立连接</span>
        <icon class="success" type="success" size="20"  v-if="step1"></icon>
        <img src="/static/image/loading.png" alt="" class="status" v-else>
      </div>
      <div class="step_item step2">
        <span class="txt">分配IP地址</span>
        <icon class="success" type="success" size="20"  v-if="step2"></icon>
        <img src="/static/image/loading.png" alt="" class="status" v-else>
      </div>
      <div class="step_item step3">
        <span class="txt">安全检查</span>
        <icon class="success" type="success" size="20"  v-if="step3"></icon>
        <img src="/static/image/loading.png" alt="" class="status" v-else>
      </div>
      <div class="step_item step4">
        <span class="txt">联网检查</span>
        <icon class="success" type="success" size="20"  v-if="step4"></icon>
        <img src="/static/image/loading.png" alt="" class="status" v-else>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      wifi: {
        _id: '',
        ssid: '',
        pass: '',
      },
      step1:false,
      step2:false,
      step3:false,
      step4:false,
      connectText: '正在连接...'
    }
  },
  computed: {
    minHeight(){
      return wx.getStorageSync('windowHeight') || 0
    },
    openid(){
      return wx.getStorageSync('openid') || ''
    }
  },
  methods: {
    getWifiDetail(wifi_id){
      const that = this;
      if (wifi_id) {
        this.$db.collection('wifi_list').doc(wifi_id).get({
          success(res) {
            that.wifi = Object.assign({}, that.wifi, res.data)
            that.readyConnect()
          },
          fail(err){
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
    readyConnect(){
      var that = this
      setTimeout(()=>{
        that.step1 = true
      }, 500)
      setTimeout(()=>{
        that.step2 = true
      }, 1000)
      setTimeout(()=>{
        that.step3 = true
      }, 1500)
      setTimeout(()=>{
        that.connect()
      }, 2000)
    },
    connect(){
      const that = this
      if (that.wifi.ssid) {
        wx.onWifiConnected(function(res){
          console.log('onWifiConnected: ', res.wifi)
        })
        wx.connectWifi({
          SSID: that.wifi.ssid,
          password: that.wifi.pass,
          success(res){
            console.log('connectWifi', res.errMsg)
            that.connectText = "连接成功"
            that.step4 = true
            that.createConnect()
            wx.navigateTo({
              url: `/pages/connectsuccess/main?wifi_id=${that.wifi._id}`
            })
          },
          fail(err){
            console.log('connectWifi', err)
            wx.navigateTo({
              url: `/pages/connectfail/main?wifi_id=${that.wifi._id}`
            })
          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: 'WiFi不存在',
        })
      }
    },
    async createConnect(){
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
            res.data.forEach((element, index) => {
              if (index === 0){
                that.$db.collection('connect_list').doc(element._id).update({
                  data:{
                    count: that.$db.command.inc(1),
                    time: Date()
                  }
                })
              }else{
                that.$db.collection('connect_list').doc(element._id).remove()
              }
            });
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
  },
  mounted() {
    const that = this
    var query = that.$root.$mp.query
    var wifi_id = query.wifi_id
    if (wifi_id) {
      that.getWifiDetail(wifi_id)
    }else{
      wx.showToast({
        icon: 'none',
        title: '请求参数错误',
      })
    }
  },
}
</script>

<style scoped>
.container{
  background-color:#fff;
}
.img{
  height:180px;
  width:200px;
  margin-top:40px;
  margin-bottom:10px;
}
.desc{
  margin:10px;
  font-size:14px;
}
.success,.status{
  width: 20px;
  height: 20px;
}
.status{
  animation:rotate 1s linear infinite;
  -webkit-animation:rotate 1s linear infinite;
}
.step_cont{
  flex:1;
  margin-top:80px;
  width: 100%;
}
.step_item{
  display:flex;
  font-size:14px;
  line-height:20px;
  border-bottom:1px rgba(153, 153, 153, 0.509);
  margin:0 10px;
  padding:10px;
  justify-content:space-between;
}
@keyframes rotate
{
from {transform:rotate(0) ;}
to {transform:rotate(360deg);}
}
@-webkit-keyframes rotate
{
from {transform:rotate(0) ;}
to {transform:rotate(360deg);}
}
</style>
