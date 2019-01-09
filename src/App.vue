<script>
import { fail } from 'assert';
export default {

  created () {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // console.log('app created and cache logs by setStorageSync')

    let that = this
    wx.getStorage({
      key: 'wxInfo',
      success (res) {
        console.log('您已授权过了')
      },
      fail(err) {
        console.log('未授权')
        //获取微信code,然后用code获取后端openid,session_key等信息
        wx.login({
          success: async (res) => {
            // 这个url就是我们后端的接口地址,省略了前面的服务器名称,服务器名称配置看 /src/main.js里面的配置
            let url = 'mobileWechatApplets/jscode2session'
            let body={jsCode: res.code}
            let loginRes = await that.$post(url,body)
            if(loginRes.code == 1) {
              wx.setStorage({key:"wxInfo", data:loginRes.data})
              console.log('登录成功!:', loginRes)
            }
            // console.log('code!:', res)
          },
          fail(err){
            console.log('登陆失败： ', err)
          }
        })
      }
    })
  }
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
