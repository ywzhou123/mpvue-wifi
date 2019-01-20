<template>
  <div class="container">
    <div class="wifilist">
      <div class="current">
        <!-- <div v-if="startError">
          <span>{{startError}}</span>
        </div> -->
        <img src="/static/image/logo.png" alt="" class="logo">
        <span class="company">畅享无限</span>
        <div class="ssid">
          <span>{{ssid||'未连接Wifi'}}</span>
        </div>
        <div class="create">
          <button class="weui-btn" type="primary" :disabled="!ssid"  @click="clickHandle">快速创建WiFi码</button>
        </div>
      </div>
      <div class="title" v-if="wifiList.length">
        <span v-if="wifiList.length">或选择 下可用WiFi，点击去创建</span>
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

import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'

export default {
  components: {
    wifi,
  },
  computed: {
    ...mapState(['system', 'platform']),
    ...mapState('wifiList', ['startError', 'wifiListErrorInfo','ssid','bssid','wifiList']),
    wifiListSortd(){
      return this.wifiList.sort((a,b)=>(a.signalStrength<b.signalStrength))
    }
  },
  methods: {
    ...mapActions('wifiList', ['setState']),
    //获取系统系统
    getSystemInfo () {
      const startError = `当前系统版本(${this.platform}:${this.system})暂不支持`

      if (this.platform == 'android' && this.system < 6) {
        this.setState({startError}); return
      }
      if (this.platform == 'ios' && this.system < 11) {
        this.setState({startError}); return
      }

      //初始化 Wi-Fi 模块
      this.startWifi();
    },
    // 初始化 Wi-Fi 模块。
    startWifi () {
      var that = this
      wx.startWifi({
        success(){
          that.setState({startError: ''})
        },
        fail(res) {
          console.log('startwifi: ',res)
          that.setState({startError: 'WiFi模块初始化失败'})
        }
      })
    },
    // 获取当前wifi
    getCurrentWifi () {
      var that = this
      wx.getConnectedWifi({
        success (res) {
          console.log('getConnectedWifi ok: ',res)
          that.setState({
            ssid: res.wifi.SSID,
            bssid: res.wifi.BSSID,
            startError: ''
          })
        },
        fail (res) {
          console.log('getConnectedWifi fail: ',res)
          let startError = '获取WiFi失败'
          const code = res.errCode
          if (code === 12005){
            startError = '请打开无线网络'
          } else if(code === 12002){
            startError = '密码错误'
          }else if(code === 12003 || code === 12012){
            startError = '连接超时'
          }else if(code === 12001){
            startError = '系统不支持'
          }else if(code === 12006){
            startError = '请打开GPS定位'
          }else if(code === 12010){
            if (res.errMsg.endsWith('currentWifi is null')){
              startError = '未连接WiFi'
            }
          }
          wx.showToast({
            icon: 'none',
            title: startError
          })
          that.setState({
            ssid: '',
            bssid: '',
            startError
          })
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
          // that.wifiList=res.wifiList;
          that.setState({
            wifiList: res.wifiList,
            wifiListErrorInfo: '',
          })
        } else {
          // that.wifiListErrorInfo = '未搜索到附近的WiFi' ;
          that.setState({
            wifiList: [],
            wifiListErrorInfo: '未搜索到附近的WiFi'
          })
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
      // that.wifiList=[]
      // that.wifiListError = false
      // that.wifiListErrorInfo = ''
      try {
        //请求获取 Wi-Fi 列表
        wx.getWifiList({
          success (res) {
            console.log('getwifilist',res)
            // that.wifiListErrorInfo = ''
            that.setState({
              // wifiList: res.wifiList,
              wifiListErrorInfo: '',
            })
          },
          fail (res) {
            // that.wifiListError = true ;
            // that.wifiListErrorInfo = res.errMsg;
            // that.wifiList=[]
            that.setState({
              wifiList: [],
              wifiListErrorInfo: '未搜索到附近的WiFi',
            })
          }
        })
      } catch (error) {
        that.IosList();
      }
    },

    IosList () {
      const wifiListErrorInfo = `当前系统版本(${that.platform}:${that.system})暂不支持`;
      this.setState({
        wifiListErrorInfo,
      })
      wx.showToast({
        icon: 'none',
        title: wifiListErrorInfo
      })
    },
    clickHandle (e) {
      if (!this.ssid) return
      wx.navigateTo({
        url: `/pages/create/main?ssid=${this.ssid}&bssid=${this.bssid}`
      })
    },
    clickWifiHandle(ssid, bssid, e){
      console.log('click wifi: ',ssid, bssid)
      if(!ssid) return
      wx.navigateTo({
        url: `/pages/create/main?ssid=${ssid}&bssid=${bssid}`
      })
    }
  },
  beforeMount() {
    console.log('beforeMount')
    this.getSystemInfo() // 获取系统信息 初始化wifi
    this.onGetWifiList() // 监听wifi列表的获取
  },
  mounted() {
    console.log('Mount')
    this.getCurrentWifi() // 获取当前已连接的wifi信息
    this.getWifiList(); // 请求wifi列表
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
