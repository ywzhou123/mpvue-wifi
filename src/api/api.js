import request from './http'

export function getAccessToken () {
  console.log('gettoken')
  var url = "https://api.weixin.qq.com/cgi-bin/token";
  var data = {
    grant_type: "client_credential",
    appid: "wxd8a26b2c1042fa2a",
    secret: "38d0fa7b9a14e38ee2bfc4a696f94e08"
  }
  return request('GET', url, data)
}


export function getWXACodeUnlimit(scene){
  var access_token = getAccessToken()
  if (!access_token) return
  var url = "https://api.weixin.qq.com/wxa/getwxacodeunlimit"
  var data = {
    access_token,
    scene: scene,
    page: 'page/index/main',
    width: '430',
    auto_color: true,
  }
  return request('POST', url, data)
}
