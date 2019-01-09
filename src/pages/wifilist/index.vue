<template>
  <div class="container">
    <div class="wifilist">
      <div class="current">
        <div v-if="startError">
          <span>{{startError}}</span>
        </div>
        <div class="ssid">
          {{ssid||'未连接Wifi'}}
        </div>
        <div class="create">
          <button class="weui-btn" type="primary" v-if="ssid"  @click="clickHandle">快速创建WiFi码</button>
          <span v-else>未连接Wifi</span>
        </div>
      </div>
      <div class="title" v-if="wifiList">或选择 下可用WiFi，点击去创建</div>
      <div class="wifi-list">
        <div v-if="wifiListError">
          <span>{{wifiListErrorInfo}}</span>
        </div>
        <div v-for="(item, index) in wifiListSortd" :key="index">
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
      system: 'andriod', //版本号
      platform: '7', //系统 android
      ssid: 'WeiWei', //wifi帐号(必填)
      // pass: 'ywzhou123', //无线网密码(必填)
      bssid: 'ad:if:ja:wo:pp', //设备号 自动获取
      endError: '', //连接最后的提示
      wifiList: [
        {
          SSID: 'WeiWei',
          BSSID: 'ad:if:ja:wo:pp',
          secure: true,
          signalStrength: 88
        },
        {
          SSID: 'WeiWei2',
          BSSID: 'ad:if:ja:wo:pp2',
          secure: true,
          signalStrength: 55
        },
        {
          SSID: 'WeiWei3',
          BSSID: 'ad:if:ja:wo:pp3',
          secure: false,
          signalStrength: 1
        },
        {
          SSID: 'WeiWei4',
          BSSID: 'ad:if:ja:wo:pp4',
          secure: false,
          signalStrength: 73
        }
      ] //附近的wifi
    }
  },
  computed: {
    wifiListSortd(){
      var that = this
      return this.wifiList.sort((a,b)=>(a.SSID === that.ssid && a.BSSID === that.bssid) || a.signalStrength>=b.signalStrength).reverse()
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
      wx.startWifi({
        success: function (res) {
          console.log('startwifi',res)
          // that.startError = ''
          that.getList();
        },
        fail: function (res) {
          that.startError = res.errMsg;
          wx.showToast({
            title: 'WiFi初始化失败',
          })
        }
      })
    },
    getCurrentWifi () {
      var that = this;
      wx.getConnectedWifi({
        success (res) {
          that.ssid = res.SSID;
          that.bssid = res.BSSID;
          // that.secure = res.secure;
          // that.signalStrength = res.signalStrength;
          // that.startError = ''
        },
        fail (res) {
          that.startError = res.errMsg;
        }
      })
    },
    // 获取wifi列表
    getList () {
      try {
        //请求获取 Wi-Fi 列表
        wx.getWifiList({
          success (res) {
            //安卓执行方法
            that.AndroidList();
          },
          fail (res) {
            that.wifiListError = true ;
            that.wifiListErrorInfo = res.errMsg;
          }
        })
      } catch (error) {
        that.IosList();
      }
      var that = this;
      //安卓执行方法
      // if (that.platform == 'android') {

      // }
      //IOS执行方法
      // if (that.platform == 'ios') {
      //   that.IosList();
      // }

    },
    AndroidList () {
      try {
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
        })
      } catch (error) {
        that.IosList()
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
    }
  },
  created() {
    // this.getCurrentWifi()
    // this.getSystemInfo()
  },
}
</script>

<style scoped>
.wifilist {
  width: 100%;
}
.current, .wifi-list{
  background-color: #fff;
}
.ssid {
  text-align: center;
  padding-top: 60px;
  padding-bottom: 40px;
}
.create{
  padding: 60px;
  text-align: center;
}
.title{
  height: 40px;
  line-height: 40px;
  padding-left: 20px;
  font-size: 14px;
}
</style>
