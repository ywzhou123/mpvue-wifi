<template>
  <div class="container">
    <div class="codepic-cont">
      <!-- <codepic :wifi="wifi"></codepic> -->
      <button open-type="share" class="sharebtn"><img src="/static/image/share.png" alt="" class="share" @click="shareHandle"></button>
      <img src="/static/image/edit.png" alt="" class="update" @click="updateHandle">
      <img src="/static/image/delete.png" alt="" class="delete"  @click="deleteHandle">
    </div>
    <canvas class="canvas" canvas-id="canvas" @click="onPreviewImage"></canvas>
    <span class="desc">点击查看大图，分享给朋友</span>
    <span class="continue" @click="continueHandle">继续创建</span>
    <span class="back" @click="homeHandle">返回首页</span>
  </div>
</template>

<script>
// import codepic from './codepic'
import * as Vuex from 'vuex'
const { mapState, mapActions, mapGetters } = Vuex.createNamespacedHelpers('detail')

export default {
  components: {
    // codepic
  },
  onShareAppMessage(){
    return{
      title: `邀请你连接${this.wifi.ssid}`,
      path: `/pages/connect/main?wifi_id=${this.wifi._id}`,
      // imageUrl:'https://ceshi.guirenpu.com/images/banner.png',
      success(res){
        console.log("转发成功"+res);
      }
    }
  },
  // data(){
  //   return {
  //     wifi: {
  //       _id: '',
  //       ssid: '',
  //       bssid: '',
  //       pass: '',
  //       title: '',
  //       remark: '',
  //       code_url:'',
  //     },
  //     downloadImagePath: '',
  //     canvasImagePath: ''
  //   }
  // },
  computed: {
    ...mapGetters(['wifiDetail']),
    ...mapState(['wifi','canvasImagePath']),
    ...Vuex.mapState(['windowHeight','ratio'])
  },
  methods: {
    ...mapActions(['getWifiDetail','getCanvasImagePath']),
    //url图片下载到本地
    downloadImage(){
      const that = this
      wx.downloadFile({
        url: that.wifi.code_url,
        success: function (res) {
          //确保图片已下载到本地，再开始进行canvas操作
          if (res.tempFilePath){
            // that.downloadImagePath = res.tempFilePath
            that.createNewImage(res.tempFilePath);
          }
        },
        fail: function (fres) {
          console.log('down',fres)
          wx.showModal({
            title: '小程序码下载失败',
            showCancel: false,
            success(res) {
              wx.redirectTo({
                url: '/pages/index/main'
              })
            }
          })
        }
      })
    },
    /* 处理图片/文字绘制 */
    createNewImage(tempFilePath){
      wx.showLoading({
        title: '生成中'
      })
      var that = this;
      var ctx = wx.createCanvasContext('canvas', this)
      const {title,ssid,remark} = that.wifi
      // 把模板图片绘制到canvas上
      // CanvasContext.fillStyle()
      // ctx.setFillStyle('witer')
      // ctx.fillRect(0, 0, 225, 300)
      // const ratio = 2/wx.getStorageSync('ratio')
      console.log('canvas: ',title,ssid,remark,that.ratio)
      const ratio = 2/that.ratio
      ctx.width = 225*ratio
      //白色背景
      ctx.setFillStyle('white')
      ctx.fillRect(0, 0, ctx.width, 350*ratio)
      //小程序码图
      ctx.drawImage(tempFilePath, 125*ratio/2, 160*ratio/2, 200*ratio/2, 200*ratio/2 ); // px
      ctx.setFontSize(12) //设置字体大小，默认10
      ctx.setFillStyle('black')
      // ctx.setFillStyle('#5F6FEE')//文字颜色：默认黑色
      ctx.fillText(title, (ctx.width - ctx.measureText(title).width*ratio) / 2, 40*ratio)
      //说明文字
      const desc = '扫一扫，连接WiFi'
      ctx.setFontSize(20) //设置字体大小，默认10
      ctx.setFillStyle('black')
      ctx.fillText(desc, (ctx.width - ctx.measureText(desc).width*ratio) / 2, 240*ratio)
      //ssid文字
      ctx.setFontSize(12) //设置字体大小，默认10
      ctx.setFillStyle('black')
      const ssidX=(ctx.width - ctx.measureText(ssid).width*ratio) / 2
      ctx.fillText(ssid, ssidX, 280*ratio)
      ctx.drawImage('/static/image/wifi-green.png', ssidX-26*ratio, 266*ratio, 18*ratio, 18*ratio );
      //备注文字
      ctx.setFontSize(12) //设置字体大小，默认10
      ctx.setFillStyle('rgba(196, 164, 164, 0.603)')
      ctx.fillText(remark, (ctx.width - ctx.measureText(remark).width*ratio) / 2, 320*ratio)
      //底部背景
      ctx.setFillStyle('green')
      ctx.fillRect(0, 340*ratio, 225*ratio, 350*ratio)
      //底部文字
      ctx.setFillStyle('white')
      // ctx.font = "small-caps bold 35px Arial";//设置用户文本填充颜色
      ctx.setFontSize(4) //设置字体大小，默认10
      const company = '畅享无限WiFi码'
      const companyX=(ctx.width - ctx.measureText(company).width*ratio) / 2
      ctx.fillText(company, companyX, 345*ratio)
      ctx.drawImage('/static/image/logo.png',  companyX-12*ratio, 340*ratio,10*ratio, 10*ratio );
      ctx.setFontSize(3) //设置字体大小，默认10
      const by = 'Powered by ywzhou'
      ctx.fillText(by, companyX, 348*ratio)

      ctx.draw();//绘制图片
      that.savePic()
    },
    //把生成好的图片保存到本地
    savePic () {
      let that = this;
      // const ratio = 2/wx.getStorageSync('ratio')
      const ratio = 2/that.ratio
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 225*ratio,
          height: 350*ratio,
          canvasId: 'canvas',
          success: function (res) {
            console.log('savePic: ', res.tempFilePath)
            // that.canvasImagePath = res.tempFilePath
            that.getCanvasImagePath(res.tempFilePath)
          },
          fail (e) {
            console.log(e)
          },
          complete(){
            wx.hideLoading()
          }
        }, this)
      }, 2000);
    },
    onPreviewImage(){
      const urls = [this.canvasImagePath]
      wx.previewImage({
        urls
      })
    },
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
          wx.redirectTo({
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
    // getWifiDetail(wifi_id){
    //   const that = this;
    //   that.$db.collection('wifi_list').doc(wifi_id).get({
    //     success(res) {
    //       that.wifi = Object.assign({}, that.wifi, res.data)
    //       that.downloadImage()
    //     },
    //     fail(){
    //       wx.showToast({
    //         icon: 'none',
    //         title: '获取详情失败',
    //       })
    //     }
    //   })
    // }
  },
  watch: {
    wifiDetail(newV, oldV){
      console.log('watch wifi: ',newV,oldV)
      if (newV !== oldV){
        this.downloadImage()
      }
    }
  },
  mounted() {
    // this.wifi = []
    // this.canvasImagePath = ''
    // this.downloadImagePath = ''
    var query = this.$root.$mp.query
    this.getWifiDetail(query.wifi_id)
    wx.showShareMenu({
      withShareTicket: true
    })
  },
}
</script>

<style lang='scss' scoped>
.canvas{
  background-color:white;
  /* margin: 40rpx 0; */
  width: 225px;
  height: 350px;
}
.codepic-cont, .weui-btn{
  margin-top: 40rpx;
  width: 60%;
}
.share, .update, .delete{
  background-color:#aaa;
  width: 40rpx;
  height: 40rpx;
  padding: 10rpx;
}
.sharebtn{
  background-color:transparent;
  position:absolute;
  right:60rpx;
  top:40rpx;
  padding:0;
  border-radius: 0;
  box-sizing: unset
}
button::after{
  border:none;
}

.update{
  position:absolute;
  right:60rpx;
  top:120rpx;
}
.delete{
  position:absolute;
  right:60rpx;
  top:200rpx;
}
.desc{
  font-size: 12px;
  color: rgba(196, 164, 164, 0.603);
  text-align: center;
  margin: 40rpx;
}
.continue,.back{
  font-size: 14px;
  color: green;
  margin-bottom: 40rpx;
}
.continue {
  font-size: 18px;
}
</style>
