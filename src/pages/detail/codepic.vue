<template>
  <div class="container">
    <div class="title">{{wifi.title}}</div>
    <img :src="wifi.code_url" alt="" class="img" @click="onPreviewHandle"/>
    <div class="desc">扫一扫，连接WiFi</div>
    <div class="wifi-info">
      <img src="/static/image/wifi-4.png" alt="" class="wifi">
      <div class="ssid">{{wifi.ssid}}</div>
    </div>
    <div class="remark">{{wifi.remark}}</div>
    <div class="footer">
      <img src="/static/image/logo.png" alt="" class="logo">
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
        code_url: '',
      }
    },
  },

  methods: {
    onPreviewHandle(){
      var urls = []
      var code_url = this.wifi.code_url
      if (code_url){
        urls.push(code_url)
      }
      if (urls.length){
        wx.previewImage({
          urls// 需要预览的图片http链接列表
        })
      }
    }
  },
}
</script>

<style scoped>
.container{
  background-color: white;
}
.wifi{
  width: 18px;
  height: 18px;
}
.logo{
  width: 10px;
  height: 10px;
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
