// 云函数入口文件
const request = require('request')
const cloud = require('wx-server-sdk')
const fs = require('fs')
const axios = require('axios')
cloud.init()
// axios.defaults.responseType = 'arraybuffer'
// axios.interceptors.response.use( response  =>  {
//   if  (response.data  ==  null  &&  response.config.responseType  ===  'json'  && response.request.responseText  !=  null) {
//     try  {
//       response.data  =  JSON.parse(response.request.responseText);
//     }  catch  (e) {
//     }
//   }
//   return  response;
// }
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
      axios({
        method: 'post',
        url: url,
        data: JSON.stringify(args),
        // json:true,
        encoding: null,
        // responseType: 'arraybuffer',
        headers:{
          "content-type": "application/json",
        }
      }).then(response => {
        const data = response.data
        console.log('response.data: ',response.data)
        // console.log('response.body: ', response.body)
        // base64 = new Buffer(response.data, 'utf8').toString('base64');
        // var result = response.data || response.body
        // var base64Img = result.toString('base64');
        // var dataBuffer = new Buffer(base64Img, 'base64');
        // const fileStream = fs.createReadStream(data)
        // console.log('stream',fileStream)
        // const res = cloud.uploadFile({
        //   cloudPath: 'upload-codepic.png',
        //   fileContent: fileStream,
        // })
        // console.log('res', res)
        // resolve(res)
        resolve(response.data)
      }, err => {
        reject(err)
      }).catch((err) => {
          reject(err)
        })
      // request({
      //   url,
      //   method: "POST",
      //   responseType: 'arraybuffer',
      //   headers: {
      //     "content-type": "application/json;charset=UTF-8",
      //   },
      //   body: JSON.stringify(args)
      // }, (err, resp, body) => {
      //   console.log('result', body)
      //   if (err) return reject(err)
      //   var result = body.result
      //   try {
      //     // 可以解析成json格式 说明返回错误
      //     result = JSON.parse(result)
      //   } catch (error) {
      //     console.log('err',error)
      //     if (result){
      //       var base64Img = result.toString('base64');  // base64图片编码字符串
      //       var dataBuffer = new Buffer(base64Img, 'base64');
      //       const fileStream = fs.createReadStream(dataBuffer)
      //       const res = cloud.uploadFile({
      //         cloudPath: 'upload-codepic.png',
      //         fileContent: fileStream,
      //       })
      //       return resolve(res)
      //     }
      //   }
      //   return resolve(body)
      // })
    } catch (err) {
      return reject(err)
    }
  })
}
