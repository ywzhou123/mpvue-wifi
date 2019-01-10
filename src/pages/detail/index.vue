<template>
  <div class="container">
    <div class="codepic-cont">
      <codepic :wifi="wifi"></codepic>
    </div>
    <div class="share">点击查看大图，分享给朋友</div>
    <button class="weui-btn" type="primary" @click="continueHandle">继续创建</button>
    <button class="weui-btn" type="primary" @click="updateHandle">修改</button>
    <button class="weui-btn" type="primary" @click="deleteHandle">删除</button>
  </div>
</template>

<script>
import codepic from './codepic'
import { getCurrentPageUrlArgs } from '../../utils'

export default {
  components: {
    codepic
  },
  data(){
    return {
      wifi: {
        id: '',
        ssid: '',
        bssid: '',
        pass: '',
        title: '',
        remark: '',
        codePic:''
      }
    }
  },
  computed: {
  },
  methods: {
    continueHandle(){
      wx.navigateTo({
        url: '/pages/wifilist/main'
      })
    },
    updateHandle(){
      wx.navigateBack({
        delta: 1
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
      wx.showLoading({
        title: '删除中',
      })
      this.$db.collection('wifi_list').doc(this.wifi.id).remove({
        success(){
          wx.navigateTo({
            url: '/pages/index/main'
          })
        },
        fail(err){
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
    getWifiDetail(wifi_id){
      const that = this;
      this.$db.collection('wifi_list').doc(wifi_id).get({
        success(res) {
          that.wifi = Object.assign({}, that.wifi, res.data)
          wx.getStorage({
            key: wifi_id,
            success(res) {
              console.log('get store',res)
              that.wifi.codePic=res.data
            }
          })
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
    console.log('args',args)
    if (args.wifi_id) {
      this.wifi.id=args.wifi_id
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
.codepic-cont, .weui-btn{
  margin: 20px 0;
  width: 60%;
}
.share{
  text-align: center;
  font-size: 12px;
  color: rgba(196, 164, 164, 0.603);
}
</style>
