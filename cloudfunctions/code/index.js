// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const fs = require('fs')
const path = require('path')
const qiniu = require('qiniu')
cloud.init()
let baseDir = '/tmp'

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
const uploadQiniu = async (fileName)=>{
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
    // 文件上传
    await formUploader.putFile(uploadToken, key, localFile, putExtra, async function (respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        console.log(respBody);
        // 上传成功后修改wifi的file_url
        // await function (){
        // }
      } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
      }
    });
  } catch(err){
    console.log('qiniu: ',err)
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
    "err": "no data"
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
      httpStream.on('response', (response) => {
        // console.log('response headers is: ', response.headers);
      });
      let totalLength = 0;
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
      writeStream.on('close', async function () {
        try {
          console.log('download finished: ');
          await upload(fileName)
          await uploadQiniu(fileName)
          // fs.unlink(filePath, function(err){
          //   console.log('unlink: ',err)
          // })
        } catch (error) {
          reject(error)
        }
      });
      resolve(fileName)
    } catch (e) {
      reject(e)
    }
  })
    // .then(res => {
    //   console.log('dir: ', fs.readdirSync(event.dir))
    //   console.log('unlink: ', res)
    //   // if (res.fileName) {
    //   //   const filePath = path.join(baseDir, fileName)
    //   //   fs.unlink(filePath, console.log)
    //   // }
    //   return res
    // })
    .catch(error => console.log('error: ', error))
}
