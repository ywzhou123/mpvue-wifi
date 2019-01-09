<template>
  <div class="container">
    <div class="weui-flex">
        <div class="weui-flex__item item-img">
          <img src="../../../static/image/wifi-example.png" alt="" class="img">
        </div>
        <div class="weui-flex__item item-wifi">
            <div class="ssid">
              <div class="ssid-value">{{wifi.ssid}}</div>
            </div>
            <div class="count">已连接{{wifi.count || 0}}次</div>
        </div>
        <div class="weui-flex__item item-right">
          <div class="right">></div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    wifi: {
      type: Object,
      require: true,
      default: {
        ssid: '',
        pass: '',
        title: '',
        remark: '',
        count: 0
      }
    }
  }
}
</script>

<style scoped>
.container{
  padding: 10px;
  height: 120px;
  background-color: white;
}
.weui-flex {
  width: 100%;
  height: 100%;
}
.wifi {
  padding: 10px;
}
.img{
  width: 80px;
  height: 100%;
  margin-right: 10px;
  background-color: #cccccc
}
.item-img{
  flex: 0;
}
.item-wifi{
  display: flex;
  flex-direction: column;
}
.item-right{
  flex: 0;
  align-self: center;
}
.ssid{
  height: 100%;
  font-size: 24px;
  text-align: center;
  flex: 1;
  display: flex;
}
.ssid-value{
  align-self: center;
}
.count{
  font-size: 12px;
  color: rgba(92, 89, 89, 0.603);
}
.right{
  color:  rgba(92, 89, 89, 0.603);
}
</style>
