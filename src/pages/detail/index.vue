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
import codepic from './codepic'

export default {
  components: {
    codepic
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
  data(){
    return {
      windowWidth: 0,
      windowHeight: 0,
      wifi: {
        _id: '',
        ssid: '',
        bssid: '',
        pass: '',
        title: '',
        remark: '',
        code_url:'',
      },
      downloadImagePath: '',
      canvasImagePath: ''
    }
  },
  computed: {
  },
  methods: {
    //url图片下载到本地
    downloadImage(){
      const that = this
      wx.downloadFile({
        url: that.wifi.code_url,
        success: function (sres) {
          console.log(sres.tempFilePath);
          //确保图片已下载到本地，再开始进行canvas操作
          if (sres.tempFilePath){
            that.downloadImagePath = sres.tempFilePath
            that.createNewImage();
          }
        }, fail: function (fres) {
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
    createNewImage: function (){
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
      console.log('ctx',ctx)
      ctx.width = 225
      //白色背景
      ctx.setFillStyle('white')
      ctx.fillRect(0, 0, 225, 350)
      //小程序码图
      ctx.drawImage(that.downloadImagePath, 125/2, 160/2, 200/2, 200/2 ); // px
      ctx.setFontSize(12) //设置字体大小，默认10
      ctx.setFillStyle('black')
      // ctx.setFillStyle('#5F6FEE')//文字颜色：默认黑色
      ctx.fillText(title, (ctx.width - ctx.measureText(title).width) / 2, 40)
      //说明文字
      const desc = '扫一扫，连接WiFi'
      ctx.setFontSize(20) //设置字体大小，默认10
      ctx.setFillStyle('black')
      ctx.fillText(desc, (ctx.width - ctx.measureText(desc).width) / 2, 240)
      //ssid文字
      ctx.setFontSize(12) //设置字体大小，默认10
      ctx.setFillStyle('black')
      const ssidX=(ctx.width - ctx.measureText(ssid).width) / 2
      ctx.fillText(ssid, ssidX, 280)
      ctx.drawImage('/static/image/wifi-green.png', ssidX-26, 266, 18, 18 );
      //备注文字
      ctx.setFontSize(12) //设置字体大小，默认10
      ctx.setFillStyle('rgba(196, 164, 164, 0.603)')
      ctx.fillText(remark, (ctx.width - ctx.measureText(remark).width) / 2, 320)
      //底部背景
      ctx.setFillStyle('green')
      ctx.fillRect(0, 340, 225, 350)
      //底部文字
      ctx.setFillStyle('white')
      // ctx.font = "small-caps bold 35px Arial";//设置用户文本填充颜色
      ctx.setFontSize(4) //设置字体大小，默认10
      const company = '畅享无限WiFi码'
      const companyX=(ctx.width - ctx.measureText(company).width) / 2
      ctx.fillText(company, companyX, 345)
      ctx.drawImage('/static/image/logo.png',  companyX-12, 340,10, 10 );
      ctx.setFontSize(3) //设置字体大小，默认10
      const by = 'Powered by ywzhou'
      ctx.fillText(by, companyX, 348)

      ctx.draw();//绘制图片
      that.savePic()
    },
    //把生成好的图片保存到本地
    savePic () {
      let that = this;
      let offset_left = (this.windowWidth - 303) / 2
      console.log('savePic')
      setTimeout(() => {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 225,
          height: 350,
          canvasId: 'canvas',
          success: function (res) {
            console.log(res.tempFilePath)
            that.canvasImagePath = res.tempFilePath
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
    getWifiDetail(wifi_id){
      const that = this;
      that.$db.collection('wifi_list').doc(wifi_id).get({
        success(res) {
          that.wifi = Object.assign({}, that.wifi, res.data)
          that.downloadImage()
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
  created() {
    console.log('detail created')

  },
  onShow(){
    console.log('detail onShow')

  },
  mounted() {
    console.log('detail mounted')
    this.wifi = []
    this.canvasImagePath = ''
    this.downloadImagePath = ''
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

    // 获取手机宽高
    const that = this
    wx.getSystemInfo({
      success: (res) => {
          that.windowWidth = res.windowWidth
          that.windowHeight = res.windowHeight
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
}
</script>

<style scoped>
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
