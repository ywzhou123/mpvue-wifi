<template>
  <div class="container">
    <div class="title">{{wifi.title}}</div>
    <img :src="wifi.codePic" alt="" class="img">
    <div class="desc">扫一扫，连接WiFi</div>
    <div class="wifi-info">
      <icon type="success" size="20"/>
      <div class="ssid">{{wifi.ssid}}</div>
    </div>
    <div class="remark">{{wifi.remark}}</div>
    <div class="footer">
      <icon type="info" size="10"/>
      <div class="footer-text">
        <div class="comp">畅享企业WiFi</div>
        <div class="by">Powered by ywzhou</div>
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
        count: 0,
        codePic: '../../../static/image/codepic-example.png'
      }
    }
  }
}
</script>

<style scoped>
.container{
  background-color: white;
}
.title{
  font-size: 12px;
  margin: 40px 0;
  text-align: center;
}
.img{
  width: 100px;
  height: 100px;
}
.desc{
  margin: 20px 0;
}
.wifi-info{
  display: flex;
  font-size: 12px;
}
.remark{
  margin-top: 20px
}
.footer{
  width: 100%;
  background-color: rgb(28, 109, 25);
  display:flex;
  justify-content:center;
  align-items:center;
}
.footer-text{
  margin-left: 4px;
}
.comp{
  font-size: 6px;
  line-height:6px;
  color: #fff;
}
.by{
  font-size: 3px;
  line-height: 3px;
  color: #fff;
}
</style>
