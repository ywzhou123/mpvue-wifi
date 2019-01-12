<template>
  <div class="container">
    <div class="codepic-cont">
      <codepic :wifi="wifi"></codepic>
    </div>
    <div class="share">点击查看大图，分享给朋友</div>
    <button class="weui-btn" type="primary" @click="continueHandle">继续创建</button>
    <button class="weui-btn" type="primary" @click="updateHandle">修改</button>
    <button class="weui-btn" type="primary" @click="deleteHandle">删除</button>
    <button class="weui-btn" type="primary" @click="homeHandle">返回首页</button>
  </div>
</template>

<script>
import codepic from './codepic'

export default {
  components: {
    codepic
  },
  data(){
    return {
      wifi: {
        _id: '',
        ssid: '',
        bssid: '',
        pass: '',
        title: '',
        remark: '',
        code_url:'',
      }
    }
  },
  computed: {
  },
  methods: {
    homeHandle(){
      wx.navigateTo({
        url: '/pages/index/main'
      })
    },
    continueHandle(){
      wx.navigateTo({
        url: '/pages/wifilist/main'
      })
    },
    updateHandle(){
      wx.navigateTo({
        url: `/pages/create/main?wifi_id=${this.wifi._id}`
      })
    },
    deleteHandle(){
      var that = this
      wx.showModal({
        title: '您确定要删除吗',
        success(res) {
          if (res.confirm) {
            that.deleteWifi()
          }
        }
      })
    },
    deleteWifi(){
      var that = this
      wx.showLoading({
        title: '删除中',
      })
      this.$db.collection('wifi_list').doc(that.wifi._id).remove({
        success(){
          that.removeConnectDoc(that.wifi._id)
          wx.navigateTo({
            url: '/pages/index/main'
          })
        },
        fail(err){
          console.error('del',err)
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
        },
        complete(){
          wx.hideLoading()
        }
      })
    },
    removeConnectDoc(wifi_id){
      wx.cloud.callFunction({
        name: 'removeConnect',
        data: {
          wifi_id,
        },
        success(res) {
          console.log('remove con',res)
        },
        fail(err){
          console.error(err)
        }
      })
    },
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
    var query = this.$root.$mp.query
    var wifi_id = query.wifi_id
    if (query.wifi_id) {
      this.getWifiDetail(wifi_id)
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
.codepic-cont, .weui-btn{
  margin: 10px 0;
  width: 60%;
}
.share{
  text-align: center;
  font-size: 12px;
  color: rgba(196, 164, 164, 0.603);
}
</style>
