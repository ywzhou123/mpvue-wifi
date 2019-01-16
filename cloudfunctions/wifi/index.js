// 云函数入口文件
const request = require('request')
const cloud = require('wx-server-sdk')
const axios = require('axios')
const qs = require('qs')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var url = 'http://uatyskadmin.youshiker.com/api/wixin-code/?';
  var args = {}
  if (event.scene) {
    url+=`scene=${event.scene}&`
    args.scene = event.scene
  }
  if (event.page) {
    url += `page=${event.page}&`
    args.page = event.page
  }
  if (event.width) {
    url += `width=${event.width}&`
    args.width = event.width
  }
  console.log('event', event)
  console.log('args', args)

  return new Promise((resolve, reject) => {
    try {
      axios({
        method: 'get',
        url: url,
        data: args,
        headers: {
          "content-type": "application/json",
        }
      }).then(response => {
        const data = response.data
        console.log('response.data: ', response.data)
        resolve(response.data)
      }, err => {
        reject(err)
      }).catch((err) => {
        reject(err)
      })
    } catch (err) {
      return reject(err)
    }
  })
}
