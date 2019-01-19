<template>
  <div class="container" :style="{minHeight:windowHeight}" >
    <div class="userinfo">
      <img class="userinfo-avatar" v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" background-size="cover" />
    </div>
    <div class="welcome">
      <h1 class="head">欢迎使用！</h1>
      <p class="info">在活动现场、会议室、公司前台、客厅等放置您的专属WiFi码，访客扫一扫即可免密连WiFi。还能查看微官网、产品介绍、公众号、一键签到！</p>
    </div>
    <div class="btn">
      <button class="weui-btn" type="primary" @click="createWifiHandle">我要创建WiFi码</button>
    </div>
    <blank></blank>
    <div class="wifi-list">
      <div v-for="(item, index) in getWifiListSorted" :key="index" @click="clickWifiHandle(item._id,$event)">
        <wifi :wifi="item"></wifi>
        <blank></blank>
      </div>
    </div>
    <div class="connect-head" v-if="getConnectListSorted.length">
      <div class="icon"></div>
      <div class="title">最近使用</div>
    </div>
    <div class="connect-list">
      <div v-for="(item, index) in getConnectListSorted" :key="index">
        <connect :connect="item"></connect>
      </div>
    </div>
    <blank height="40px" ></blank>
    <div class="weui-footer">
      <div class="weui-footer__text"><span class="text">Powered by 畅享无限</span></div>
    </div>
    <auth-modal/>
  </div>
</template>

<script>
import wifi from './wifi'
import connect from './connect'
import blank from '@/components/blank'
import authModal from '@/components/authModal'
import { setTimeout } from 'timers';
import { sortTime } from '@/utils'

import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'

export default {
  components: {
    wifi,
    connect,
    blank,
    authModal
  },
  computed: {
    ...mapGetters(['getOpenId']),
    ...mapState(['openId', 'windowHeight','system','platform','ratio']),
    ...mapState('index',['userInfo','wifiList','connectList']),
    getWifiListSorted(){
      return this.wifiList.sort((a,b)=>sortTime(a.create, b.create, 'desc'))
    },
    getConnectListSorted(){
      return this.connectList.sort((a,b)=>sortTime(a.time, b.time, 'desc'))
    },
  },
  async onPullDownRefresh() {
    await this.getWifiList()
    await this.getConnectList()
    wx.stopPullDownRefresh()
  },
  methods: {
    ...mapActions('index',['getWifiList','getConnectList','getAuthSetting','getUserInfo']),
    createWifiHandle (e) {
      wx.navigateTo({
        url: '/pages/wifilist/main'
      })
    },
    clickWifiHandle(wifi_id, e){
      if (wifi_id){
        wx.navigateTo({
          url: `/pages/detail/main?wifi_id=${wifi_id}`
        })
      }
    },
    getCodeImage(){
      wx.cloud.callFunction({
        name: 'code',
        data: {
          scene: 'XD65R5T75u22PhRU',
        },
        success(res) {
          console.log(res.result)
        },
        fail(err){
          console.error(err)
        }
      })
    }
  },
  mounted() {
    // this.getCodeImage()
    console.log('index mount: ', this.openId)
    this.getAuthSetting()
    this.getWifiList()
    this.getConnectList()
  },
  watch: {
    getOpenId(newV,oldV) {
      this.getWifiList()
      this.getConnectList()
    }
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
</style>
