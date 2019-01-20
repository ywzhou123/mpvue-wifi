<template>
  <div class="container"  @click="clickConnectHandle(connect.wifi_id, $event)">
    <div class="connect">
      <div class="ssid">
        {{connect.wifi && connect.wifi.ssid}}
      </div>
      <div class="time">
        {{time}}使用过
      </div>
    </div>
  </div>
</template>

<script>
import { beforeTime } from '../../utils'

import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'

export default {
  props: {
    connect: {
      type: Object,
      require: true,
      default: {
        wifi_id: '',
        time: '',
        wifi: {
          ssid: ''
        }
      }
    },
  },
  computed: {
    time(){
      const oldtime = new Date(this.connect.time);
      const newtime = new Date();
      return beforeTime(oldtime, newtime)
    }
  },
  methods: {
    clickConnectHandle(e){
      var wifi_id = this.connect.wifi_id
      if (wifi_id){
        wx.navigateTo({
          url: `/pages/connect/main?wifi_id=${wifi_id}`
        })
      }
    },
  },
}
</script>

<style scoped>
.container{
  padding: 5px 10px;
  background-color: white;
}
.connect{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.ssid{
  font-size: 14px;
}
.time{
  font-size: 12px;
  color: rgba(92, 89, 89, 0.603);
  text-align: right;
}
</style>
