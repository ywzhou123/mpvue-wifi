<template>
  <div class="container" :style="{minHeight: minHeight}">
    <img src="/static/image/warning.png" alt="" class="fail">
    <span class="fail_txt">连接失败</span>
    <span class="ssid">{{wifi.ssid}}</span>
    <span class="remark">{{wifi.remark}}</span>
    <span class="desc">您当前可能不在WiFi覆盖范围内，或WiFi密码有误</span>
    <button type='primary' class="connect" @click="clickHandle">重新连接</button>
    <a href="/pages/index/main" class="create">我也想创建WiFi码</a>
    <div class="footer"></div>
  </div>
</template>

<script>
export default {
  props:{
    wifi:{
      request: true,
      type: Object,
      default: {
        _id:'',
        ssid: 'weiwei',
        bssid: '',
        title: '欢迎使用',
        remark: '我是备注信息哦',
      }
    }
  },
  computed: {
    minHeight(){
      return wx.getStorageSync('windowHeight') || 0
    }
  },
  methods: {
    clickHandle(){
      const that = this
      wx.navigateTo({
        url: `/pages/connecting/main?wifi_id=${this.wifi._id}`
      })
    },
    getWifiDetail(wifi_id){
      const that = this;
      if (wifi_id) {
        this.$db.collection('wifi_list').doc(wifi_id).get({
          success(res) {
            that.wifi = Object.assign({}, that.wifi, res.data)
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
.fail{
  background-color:rgb(152, 151, 151);
  border-radius:50%;
  height:100px;
  width:100px;
  padding:50px;
  margin:40px;
}
.fail_txt{
  top:0;
  position:absolute;
  top:187px;
  font-size:14px;
  color:#fff;
}
.ssid{
  font-size:16px;
}
.remark{
  margin-top:20px;
  margin-bottom:30px;
  font-size:16px;
}
.desc{
  font-size:12px;
  color:gray;
}
.connect{
  width:175px;
  margin:20px;
}
.create{
  font-size:14px;
  color:green;
}
.footer{
  flex: 1;
}
</style>
