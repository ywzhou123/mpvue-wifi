// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const fs = require('fs')
const path = require('path')
const qiniu = require('qiniu')

cloud.init()

const baseDir = '/tmp'
const db = cloud.database()

const update = async (fileName, wifi_id) => {
  try {
    const code_url = `https://pub.image.youshiker.com/${fileName}`
    return await db.collection('wifi_list').doc(wifi_id).update({
      data: {
        code_url
      }
    })
  } catch (e) {
    console.error('update err: ',e)
  }
}
const upload = async (fileName) => {
  try{
    const filePath = path.join(baseDir, fileName)
    // const status = fs.statSync(filePath)
    // console.log('filePath', filePath)
    // console.log('status', status)
    const fileStream = fs.createReadStream(filePath)
    return await cloud.uploadFile({
      cloudPath: fileName,
      fileContent: fileStream,
    })
  }catch(err){
    console.log('eee',err)
    return err
  }
}
const uploadQiniu = async (fileName, wifi_id)=>{
  try {
    var accessKey = 'JrMc8zDDSlBFEpp4VpZOBsHOtjjyHUlNT6jEcxzT';
    var secretKey = 'rOgsEapfQ5B4Yw-Pe9KMbOvo2EItWxzDtGGWi1xc';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var domain = 'pub.image.youshiker.com'
    var bucket = 'ysk-production-pub'
    var options = {
      scope: bucket,
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    var config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z2;
    // 是否使用https域名
    //config.useHttpsDomain = true;
    // 上传是否使用cdn加速
    //config.useCdnDomain = true;
    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    var key = fileName;
    var localFile = path.join(baseDir, fileName)
    return await new Promise((resolve, reject) => {
      // 文件上传
      var result = {
        fileName,
        wifi_id,
        statusCode: -1,
        message: 'noput'
      }
      var that = this
      formUploader.putFile(uploadToken, key, localFile, putExtra,
        function(respErr, respBody, respInfo){
          if (respErr) {
            reject(respErr);
          }
          if (respInfo.statusCode == 200) {
            console.log('respBody', respBody);
            that.result.body = respBody
            that.result.statusCode = 200
            that.result.message = 'putFile:ok'
          }
        })
      resolve(result)
    })
  } catch(err){
    console.log('qiniu: ',err)
    return err
  }
}
// 云函数入口函数
exports.main = async (event, context) => {
  const getAccessToken = await cloud.callFunction({
    name: 'token'
  })
  const data = getAccessToken.result
  if (!data.access_token) return
  // console.log('access_token: ', data.access_token)

  let url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${data.access_token}`;
  let args = {
    scene: event.scene || "scene",
    page: event.page || "pages/index/main",
    width: event.width || 430,
    // auto_color: true,
    // is_hyaline: event.is_hyaline
  }


  let fileName = 'code_' + Date.now() + '.png'
  let filePath = path.join(baseDir, fileName)

  var result = {
    fileName,
    wifi_id: event.scene
  }
  return new Promise((resolve, reject) => {
    try {
      var httpStream = request({
        url,
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(args)
      })
      let writeStream = fs.createWriteStream(filePath);
      httpStream.pipe(writeStream)
      // httpStream.on('response', (response) => {
      //   console.log('response headers is: ', response.headers);
      // });
      // let totalLength = 0;
      // httpStream.on('data', (chunk) => {
      //   totalLength += chunk.length;
      //   console.log('recevied data size: ' + totalLength + '字节');
      // });
      // writeStream.on('error', (err) => {
      //   console.log('write error: ', err);
      //   reject(err)
      // });
      // writeStream.on('finish', () => {
      //   console.log('finish: ');
      // });
      // writeStream.on('finish',  () => { resolve(result); });
      writeStream.on('close', ()=>{
        console.log('download finished: ');
        // await upload(fileName)
        // const upres = await uploadQiniu(fileName, event.scene)
        // console.log('upres: ',upres)
        // result = upres
        // fs.unlink(filePath, function(err){
        //   console.log('unlink: ',err)
        // })
        resolve(result)
      });
      // resolve(writeStream)
    } catch (e) {
      reject(e)
    }
  })
  .then((res)=>{
    console.log('then res: ',res)
    if (res.fileName){
      const filePath = path.join(baseDir, res.fileName)
      const status = fs.statSync(filePath)
      console.log('file status: ',status)
    }
    return res
  })
  .then(res=> {
    console.log('updata res: ', res)
    if (res.fileName && res.wifi_id){
      return uploadQiniu(res.fileName, res.wifi_id)
    }
    return res
  })
  .then(res=>{
    // 上传成功后修改wifi的file_url
    console.log('update wifi res: ', res);
    if (res.fileName && res.wifi_id) {
      return update(res.fileName, res.wifi_id)
    }
    return res
  })
  .then(res => {
    console.log('unlink res: ', res);
    if (res.fileName) {
      const filePath = path.join(baseDir, res.fileName)
      fs.unlink(filePath, console.log)
    }
    return res
  })
  .catch(error => console.log('error: ', error))
}
