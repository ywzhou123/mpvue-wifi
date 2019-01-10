<template>
  <div class="container">
    <div class="wifilist">
      <div class="current">
        <div v-if="startError">
          <span>{{startError}}</span>
        </div>
        <img src="../../../static/image/logo.png" alt="" class="logo">
        <span class="company">畅享无限</span>
        <div class="ssid">
          <span>{{ssid||'未连接Wifi'}}</span>
        </div>
        <div class="create">
          <button class="weui-btn" type="primary" :disabled="disabled"  @click="clickHandle">快速创建WiFi码</button>
        </div>
      </div>
      <div class="title" v-if="wifiList.length">
        <span v-if="wifiListError">{{wifiListErrorInfo}}</span>
        <span v-else>或选择 下可用WiFi，点击去创建</span>
      </div>
      <div class="wifi-list">
        <div v-for="(item, index) in wifiListSortd" :key="index" @click="clickWifiHandle(item.SSID, item.BSSID, $event)">
          <wifi :wifi="item" :ssid="ssid" :bssid="bssid"></wifi>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wifi from './wifi.vue'

export default {
  components: {
    wifi,
  },
  data(){
    return {
      startError: '',//初始化错误提示
      wifiListError: false, //wifi列表错误显示开关
      wifiListErrorInfo: '',//wifi列表错误详细
      system: '', //版本号
      platform: '', //系统 android
      ssid: '', //wifi帐号(必填)
      bssid: '', //设备号 自动获取
      endError: '', //连接最后的提示
      wifiList: [],//附近的wifi
    }
  },
  computed: {
    wifiListSortd(){
      var that = this
      return this.wifiList.sort((a,b)=>(a.SSID === that.ssid && a.BSSID === that.bssid) || a.signalStrength>=b.signalStrength).reverse()
    },
    disabled(){
      if (this.ssid){
        return false
      }
      return true
    }
  },
  methods: {
    //获取系统系统
    getSystemInfo () {
      var that = this
      wx.getSystemInfo({
        success (res) {
          var system = '';
          if (res.platform == 'android') system = parseInt(res.system.substr(8));
          if (res.platform == 'ios') system = parseInt(res.system.substr(4));
          that.system = system ;
          that.platform = res.platform ;
          var errMsg = `当前系统版本(${that.platform}:${that.system})暂不支持`
          if (res.platform == 'android' && system < 6) {
            that.startError= errMsg; return
          }
          if (res.platform == 'ios' && system < 11) {
            that.startError = errMsg; return
          }
          //初始化 Wi-Fi 模块
          that.startWifi();
        }
      })
    },
    // 初始化 Wi-Fi 模块。
    startWifi () {
      var that = this
      this.startError=''
      wx.startWifi({
        success: function (res) {
          console.log('startwifi',res)
          // that.getCurrentWifi()
          // that.getList();
        },
        fail: function (res) {
          that.startError = res.errMsg;
          // wx.showToast({
          //   title: 'WiFi初始化失败',
          // })
        }
      })
    },
    getCurrentWifi () {
      console.log('start getCurrentWifi')
      if (this.startError) {
        wx.showToast({
          icon: 'none',
          title: 'WiFi初始化失败',
        })
        return
      }
      var that = this
      that.ssid = ''
      that.bssid = ''
      that.startError = ''
      wx.getConnectedWifi({
        success (res) {
          console.log('getConnectedWifi ok: ',res)
          that.ssid = res.wifi.SSID
          that.bssid = res.wifi.BSSID
        },
        fail (res) {
          console.log('getConnectedWifi fail: ',res)
          that.startError = res.errMsg
        }
      })
    },
    // 监听wifi列表
    onGetWifiList () {
      var that = this;
      //监听获取到 Wi-Fi 列表数据
      wx.onGetWifiList(function (res) {
        //获取列表
        console.log('onGetWifiList',res)
        if (res.wifiList.length) {
          that.wifiList=res.wifiList;
        } else {
          that.wifiListError = true;
          that.wifiListErrorInfo = '未搜索到附近的WiFi' ;
        }
        // 设置 wifiList 中 AP 的相关信息。在 onGetWifiList 回调后调用，iOS特有接口。
        // if (res.wifiList.length && that.platform === 'ios') {
        //   wx.setWifiList({
        //     wifiList: [{
        //       SSID: res.wifiList[0].SSID,
        //       BSSID: res.wifiList[0].BSSID,
        //       password: '123456'
        //     }]
        //   })
        // } else {
        //   wx.setWifiList({
        //     wifiList: []
        //   })
        // }
      })
    },
    // 请求获取wifi列表
    getWifiList () {
      var that = this
      that.wifiList=[]
      that.wifiListError = false
      that.wifiListErrorInfo = ''
      try {
        //请求获取 Wi-Fi 列表
        wx.getWifiList({
          success (res) {
            console.log('getwifilist',res)
          },
          fail (res) {
            that.wifiListError = true ;
            that.wifiListErrorInfo = res.errMsg;
          }
        })
      } catch (error) {
        that.IosList();
      }
    },

    IosList () {
      var that = this;
      that.wifiListError = true ;
      that.wifiListErrorInfo = `当前系统版本(${that.platform}:${that.system})暂不支持`;
    },
    clickHandle (e) {
      wx.navigateTo({
        url: `/pages/create/main?ssid=${this.ssid}&bssid=${this.bssid}`
      })
    },
    clickWifiHandle(ssid, bssid, e){
      console.log('click wifi: ',ssid, bssid, e)
      wx.navigateTo({
        url: `/pages/create/main?ssid=${ssid}&bssid=${bssid}`
      })
    }
  },
  created() {
    this.getSystemInfo() // 获取系统信息 初始化wifi
    this.onGetWifiList() // 监听wifi列表的获取
  },
  mounted() {
    if (this.startError) {
      wx.showToast({
        icon: 'none',
        title: 'WiFi初始化失败',
      })
      return
    } else {
      this.getCurrentWifi() // 获取当前已连接的wifi信息
      this.getWifiList(); // 请求wifi列表
    }
  },
}
</script>

<style scoped>
.wifilist {
  width: 100%;
}
.current{
  display:flex;
  flex-direction:column;
}
.logo{
  width: 40px;
  height: 40px;
  align-self: center;
  margin-top: 20px;
  margin-bottom: 10px;
}
.company{
  font-size: 12px;
  color:#ccc;
  align-self: center;
}
.current, .wifi-list{
  background-color: #fff;
}
.ssid {
  text-align: center;
  padding-top: 40px;
}
.create{
  padding: 40px;
  text-align: center;
}
.title{
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  font-size: 14px;
}
</style>
