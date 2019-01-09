<template>
  <div class="container">
    <div class="title">
      {{title}}
    </div>
    <div class="code">
      <img :src="code"/>
    </div>
    <div>
      扫一扫，连接WiFi
    </div>
    <div class="wifi">
      <div class="ssid">
        {{ssid}}
      </div>
      <div class="remark">
        {{remark}}
      </div>
    </div>
    <div class="botm">
      <div class="logo">
        <icon />
      </div>
      <div class="company">
        <div class="name">畅享无限企业WiFi</div>
        <div class="desc">Powered by 畅享无限</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id:{
      type: String,

    }
  }
}
</script>

<style scoped>

</style>
