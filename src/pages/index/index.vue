<template>
  <div class="container" :style="{heightHeight:min_height}" >
    <div class="userinfo">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
    </div>
    <div class="welcome">
      <h1 class="head">欢迎使用！</h1>
      <p class="info">在活动现场、会议室、公司前台、客厅等放置您的专属WiFi码，访客扫一扫即可免密连WiFi。还能查看微官网、产品介绍、公众号、一键签到！</p>
    </div>
    <div class="btn">
      <button class="weui-btn" type="primary" @click="clickHandle" v-if="canIUse">我要创建WiFi码</button>
      <button class="weui-btn"  type="primary" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo" v-else>
        获取用户信息
      </button>
    </div>
    <blank></blank>
    <div class="wifi-list">
      <div v-for="(item, index) in wifiList" :key="index" @click="clickWifiHandle(item._id,$event)">
        <wifi :wifi="item"></wifi>
        <blank></blank>
      </div>
    </div>
    <div class="connect-head" v-if="connectList">
      <div class="icon"></div>
      <div class="title">最近使用</div>
    </div>
    <div class="connect-list">
      <div v-for="(item, index) in connectList" :key="index">
        <connect :connect="item"></connect>
      </div>
    </div>
    <blank height="40px" ></blank>
    <div class="weui-footer">
      <div class="weui-footer__text"><span class="text">Powered by 畅享无限</span></div>
    </div>
  </div>
</template>

<script>
import wifi from './wifi'
import connect from './connect'
import blank from '../../components/blank'

export default {
  data () {
    return {
      canIUse: false,
      openid:'',
      userInfo: {
        nickName:'',
        avatarUrl:'',
        gender:0,
        province:'',
        city:'',
        country:''
      },
      wifiList: [],
      connectList: [],
      min_height:'',
    }
  },

  components: {
    wifi,
    connect,
    blank
  },
  async onPullDownRefresh() {
    // to doing..
    console.log('lalala')
    wx.showLoading({
      title: 'Loading',
    })
    this.getWifiList()
    this.getConnectList()
    // 停止下拉刷新
    wx.stopPullDownRefresh();
  },
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
          that.min_height=`${height}rpx`
        }
      })
    },
    authHandle(){
      var that = this
      // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userInfo" 这个 scope
      wx.getSetting({
        success(res) {
          console.log('getSetting',res)
          if (!res.authSetting['scope.userInfo']) {
            wx.authorize({
              scope: 'scope.userInfo',
              success(res) {
                console.log(res)
                that.canIUse=true
                that.getUserInfo()
              },
              fail(err){
                console.log(err)
                that.canIUse=false
              }
            })
          }else{
            that.canIUse=true
            that.getUserInfo()
          }
        }
      })
    },
    //获取用户信息
    getUserInfo (e) {
      console.log('getuser',e)
      // 调用登录接口
      var that = this;
      wx.login({
        success () {
          that.getOpenId()
          wx.getUserInfo({
            success(res){
              that.userInfo = res.userInfo
              console.log('userInfo',res.userInfo)
            }
          })
        },
        fail(res){
          console.log('login fail: ', res.errMsg)
        }
      })
    },
    getOpenId(){
      var that = this
      console.log('get openid: ')
      wx.cloud.callFunction({
        name: 'login',
        success(res) {
          console.log('openid: ',res.result)
          var result = res.result
          that.openid=result.openid
        },
        fail(err){
          console.log('openid fail',err)
        }
      })
    },
    bindGetUserInfo (e) {
      console.log('bindGetUserInfo',e)
      this.userInfo = e.mp.detail.userInfo
      this.canIUse = true
    },
    //跳转wifilist
    clickHandle (e) {
      wx.navigateTo({
        url: '/pages/wifilist/main'
      })
    },

    //获取数据库 wifi_list
    getWifiList () {
      var that = this;
      this.$db.collection('wifi_list').limit(10).where({
        _openid: that.openid,
      }).get()
        .then(res=>{
          this.wifiList = res.data
        })
        .catch(console.error)
    },
    //获取数据库 connect_list
    getConnectList () {
      var that = this;
      this.$db.collection('connect_list').limit(10).where({
        _openid: that.openid,
      }).get()
        .then(res=>{
          this.connectList = res.data
        })
        .catch(console.error)
    },
    clickWifiHandle(wifi_id, e){
      console.log('click wifi', wifi_id, e)
      if (wifi_id){
        wx.navigateTo({
          url: `/pages/detail/main?wifi_id=${wifi_id}`
        })
      }
    },
    // uploadFileHandle(){
    //   wx.cloud.uploadFile({
    //     cloudPath: 'background.png', // 上传至云端的路径
    //     filePath: '/static/image/background.png', // 小程序临时文件路径
    //     success: res => {
    //       // 返回文件 ID
    //       console.log('文件 ID',res.fileID)
    //     },
    //     fail(err){
    //       console.log(err)
    //     }
    //   })
    // },
  },
  watch: {
    openid: function (val, oldVal) {
      if ( val !== oldVal){
        console.log('watch openid')
        this.getWifiList()
        this.getConnectList()
      }
    }
  },
  mounted() {
    this.setClientHeight()
    this.authHandle()
  },
}
</script>

<style scoped>
.welcome {
  background-color: white;
  text-align: center;
}
.head {
  background-color: white;
  padding: 20px 0;
  font-size: 14px;
}
.info{
  padding: 0 40px;
  font-size: 14px;
  color: rgba(196, 164, 164, 0.603);
}
.btn {
  background-color: white;
  width:100%;
}
.weui-btn{
  margin-top: 40px;
  margin-bottom: 20px;
  width:60%;
}
.weui-footer{
  margin: 10px 0;
}
.text{
  font-size: 14px;
}
.wifi-list{
  width: 100%;
}
.connect-head{
  background-color: white;
  padding: 20px;
  width: 100%;
  display: flex;
  align-items: center;
}
.icon{
  width: 4px;
  height: 18px;
  margin-left: 20px;
  background-color: green;
}
.title{
  padding-left: 10px;
}
.connect-list{
  width: 100%;
}
.userinfo{
  background-color: white;
  width:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 40rpx;
  border-radius: 50%;
}
/* .userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
} */
</style>
