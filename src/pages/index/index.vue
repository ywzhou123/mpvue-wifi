<template>
  <!-- <div class="container" @click="clickHandle('test click', $event)">

    <div class="userinfo" @click="bindViewTap">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
      <div class="userinfo-nickname">
        <card :text="userInfo.nickName"></card>
      </div>
    </div>

    <div class="usermotto">
      <div class="user-motto">
        <card :text="motto"></card>
      </div>
    </div>

    <form class="form-container">
      <input type="text" class="form-control" v-model="motto" placeholder="v-model" />
      <input type="text" class="form-control" v-model.lazy="motto" placeholder="v-model.lazy" />
      <button class="weui-btn" type="primary">页面主操作 Normal</button>
    </form>
    <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>
    <div class="wifi-list">
      <div class="">

      </div>
      <div v-if="startError">
        <span>{{startError}}</span>
      </div>
      <div v-if="wifiListError">
        <span>{{wifiListErrorInfo}}</span>
      </div>
      <div><span>版本号: {{system}}</span></div>
      <div><span>系统: {{platform}}</span></div>
      <div><span>设备号: {{bssid}}</span></div>
      <div><span>wifi帐号: {{ssid}}</span></div>
      <div><span>wifi密码: {{pass}}</span></div>
      <div v-if='endError'><span>连接最后的提示: {{endError}}</span></div>
      <div v-for='item in wifiList' :key='item.SSID'>
        <span>SSID: {{item.SSID}}</span>
        <span>信号强度: {{item.signalStrength}}</span>
        <span v-if='item.secure'>有密码</span>
      </div>
    </div>
  </div> -->
  <div class="container">
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
      <div v-for="(item, index) in connectList" :key="index" @click="clickConnectHandle(item._id, $event)">
        <connect :connect="item"></connect>
      </div>
    </div>
    <blank height="40px" ></blank>
    <div class="weui-footer  weui-footer_fixed-bottom">
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
    }
  },

  components: {
    wifi,
    connect,
    blank
  },

  methods: {
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
      this.$db.collection('wifi_list').get()
        .then(res=>{
          this.wifiList = res.data
        })
        .catch(console.error)
    },
    //获取数据库 connect_list
    getConnectList () {
      this.$db.collection('connect_list').get()
        .then(res=>{
          this.connectList = res.data
        })
        .catch(console.error)
    },
    //连接wifi
    Connected () {
      var that = this;
      wx.onWifiConnected(function(res){
        console.log('onWifiConnected: ', res.wifi)
      })
      wx.connectWifi({
        SSID: that.ssid,
        BSSID: that.bssid,
        password: that.pass,
        success(res) {
          that.endError = 'wifi连接成功' ;
        },
        fail(res) {
          that.endError = res.errMsg ;
        }
      })
    },
    clickConnectHandle(connect_id, e){
      console.log('click connect', connect_id, e)
    },
    clickWifiHandle(wifi_id, e){
      console.log('click wifi', wifi_id, e)
      if (wifi_id){
        wx.navigateTo({
          url: `/pages/detail/main?wifi_id=${wifi_id}`
        })
      }
    }
  },
  mounted() {
    this.authHandle()
    this.getWifiList()
    this.getConnectList()
  }
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
