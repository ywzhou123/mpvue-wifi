// 云函数入口文件
const request = require('request')
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var url = "https://api.weixin.qq.com/cgi-bin/token";
  var grant_type = "client_credential"
  var appid = "wxd8a26b2c1042fa2a"
  var secret = "38d0fa7b9a14e38ee2bfc4a696f94e08"
  var urls = `${url}?grant_type=${grant_type}&appid=${appid}&secret=${secret}`

  return new Promise((resolve, reject) => {
    try {
      request(urls, (err, resp, body) => {
        if (!err && resp.statusCode == 200) return resolve(body)
        return reject(err)
      })
    } catch (err) {
      return reject(err)
    }
  })
}
