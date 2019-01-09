<template>
  <div class="container">
    <div class="code">
      <code v-bind="wifi"></code>
    </div>
    <div class="share">点击查看大图，分享给朋友</div>
    <a href="/pages/index/main" class="home">继续创建</a>
  </div>
</template>

<script>
export default {
  data(){
    return {
      wifi: {
        id: '',
        ssid: '',
        bssid: '',
        pass: '',
        title: '',
        remark: '',
        code:''
      }
    }
  },
  computed: {
  },
  methods: {
    getWifiDetail(wifi_id){
      const that = this;
      this.$db.collection('wifi_list').doc(wifi_id).get({
        success(res) {
          that.wifi = Object.assign({}, that.wifi, res.data)
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
  mounted() {
    var args = getCurrentPageUrlArgs()
    if (args.wifi_id) {
      this.getWifiDetail(args.wifi_id)
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
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
