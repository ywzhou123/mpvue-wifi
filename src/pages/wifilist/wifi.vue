<template>
  <div class="container">
    <div class="weui-flex">
        <div class="weui-flex__item item-select">
          <icon type="success_no_circle" size="20"  v-show="isCurrentWifi"/>
        </div>
        <div class="weui-flex__item  weui-flex flex-item-ssid">
          <div class="weui-flex__item item-ssid">
          <div class="ssid">{{wifi.SSID}}</div>
          </div>
          <div class="weui-flex__item item-secure">
            <icon type="info" size="20" v-if="wifi.secure"/>
          </div>
          <div class="weui-flex__item item-signalStrength">
            <div class="signalStrength">{{signalStrengthLevel}}</div>
          </div>
        </div>

      </div>
  </div>
</template>

<script>
export default {
  props: {
    ssid: {
      type: String,
      default: ''
    },
    bssid: {
      type: String,
      default: ''
    },
    wifi: {
      type: Object,
      require: true,
      default: {
        SSID: '',
        BSSID: '',
        secure: '',
        signalStrength: 0
      }
    }
  },
  computed: {
    isCurrentWifi () {
      return this.wifi.SSID === this.ssid && this.wifi.BSSID === this.bssid
    },
    signalStrengthLevel () {
      var signalStrength = this.wifi.signalStrength
      if (signalStrength > 80) return '满格'
      if (signalStrength > 60) return '4格'
      if (signalStrength > 50) return '3格'
      if (signalStrength > 20) return '2格'
      return '1格'
    }
  },
}
</script>

<style scoped>
.container{
  background-color: white;
  height: 40px;
}
.weui-flex {
  width: 100%;
  height: 100%;
  justify-content: space-between;
}
.weui-flex__item{
  flex: 0;
  align-self: center;
}
.item-select{
  padding: 0 10px;
  flex-basis: 20px;
}
.flex-item-ssid{
  flex: 1;
  border-bottom: 1px solid #ccc;
}
.item-ssid{
  flex: 1;
}
.item-signalStrength{
  margin-right: 10px;
}
.signalStrength{
  width: 40px;
  text-align: right;
}
</style>
