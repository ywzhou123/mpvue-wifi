<script>
import { fail } from 'assert';

export default {
  methods: {
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
          wx.setStorage({
            key: 'windowHeight',
            data: `${height}rpx`
          })
          var system = '';
          if (res.platform == 'android') system = parseInt(res.system.substr(8));
          if (res.platform == 'ios') system = parseInt(res.system.substr(4));
          // 版本号
          wx.setStorage({
            key: 'system',
            data: system
          })
          //系统
          wx.setStorage({
            key: 'platform',
            data: res.platform
          })
        }
      })
    },
    setOpenId(){
      var that = this
      wx.cloud.callFunction({
        name: 'login',
        success(res) {
          wx.setStorage({
            key: 'openid',
            data: res.result.openid
          })
        },
        fail(err){
          console.log('openid fail',err)
        }
      })
    },
  },
  created () {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // console.log('app created and cache logs by setStorageSync')
  },
  mounted() {
    this.setClientHeight()
    this.setOpenId()
  },
}
</script>

<style>
page {
  background-color: #eeeeee;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
