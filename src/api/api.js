import request from './request.js'

export function getAccessToken(){
  const url = "https://api.weixin.qq.com/cgi-bin/token"
  const params = {
    grant_type: "client_credential",
    appid: "wxd8a26b2c1042fa2a",
    secret: "38d0fa7b9a14e38ee2bfc4a696f94e08"
  }
  return handleRequest(request.get(url, params))
}

export function getWXACodeUnlimit(params={}) {
  const access_token = getAccessToken()
  if (!access_token) return Promise.reject()
  const url = "https://api.weixin.qq.com/wxa/getwxacodeunlimit"
  const data = {
    access_token,
    scene: 'scene',
    page: 'page/index/main',
    width: '430',
    auto_color: true,
    ...params
  }
  return handleRequest(request.post(url, data))
}

export function fetchLogin(params){
  return request('GET', '/wixin-openid/', params)
}
