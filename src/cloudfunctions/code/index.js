// 云函数入口文件
const request = require('request')
const cloud = require('wx-server-sdk')

cloud.init()



// 云函数入口函数
exports.main = async (event, context) => {
  // 获取token
  // const get_access_token = async (event, context) => await cloud.callFunction({
  //   name: 'token'
  // })
  // console.log('get_access_token', get_access_token)
  // const access_token = JSON.parse(JSON.stringify(get_access_token.result)).access_token
  // const access_token = get_access_token.result
  var url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${event.access_token}`;
  var args = {
    scene: event.scene,
    page: event.page,
    width: event.width || 430,
    auto_color: event.auto_color,
    is_hyaline: event.is_hyaline
  }
  return new Promise((resolve, reject) => {
    try {
      request({
        url,
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(args)
      }, (err, resp, body) => {
        if (err) return reject(err)
        return resolve(body)
      })
    } catch (err) {
      return reject(err)
    }
  })
}
