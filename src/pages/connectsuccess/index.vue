<template>
  <div class="container" :style="{minHeight: minHeight}">
    <img src="/static/image/success.png" alt="" class="success">
    <span class="success_txt">已连接成功</span>
    <span class="ssid">{{wifi.ssid}}</span>
    <span class="remark">{{wifi.remark}}</span>
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
.success{
  background-color:rgb(7, 184, 66);
  border-radius:50%;
  height:100px;
  width:100px;
  padding:50px;
  margin:40px;
}
.success_txt{
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
.create{
  font-size:14px;
  color:green;
}
.footer{
  flex: 1;
}
</style>
