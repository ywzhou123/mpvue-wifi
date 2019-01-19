<script>

import {
  mapMutations,
  mapActions
} from 'vuex'

export default {
  methods: {
    ...mapActions(['getOpenId', 'getSystemInfo']),
    ...mapMutations(['updateState']),
  },
  onLaunch() {
    this.getOpenId()
    this.getSystemInfo()
  },
  // onShow(){console.log('onShow')},
  // onHide(){console.log('onHide')},
  // beforeCreate(){console.log('beforeCreate')},
  // created(){console.log('created')},
  // beforeMount(){console.log('beforeMount')},
  // mounted(){console.log('mounted')},
  // beforeUpdate(){console.log('beforeUpdate')},
  // updated(){console.log('updated')},
  // beforeDestroy(){console.log('beforeDestroy')},
  // destroyed(){console.log('destroyed')}

}
</script>

<style>
page {
  background-color: #eeeeee;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
