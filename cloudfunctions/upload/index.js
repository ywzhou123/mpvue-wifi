// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const fileContent = event.fileContent
  const filePath = even.filePath
  if (filePath){
    fileContent = fs.createReadStream(path.join(__dirname, event.filePath))
  }
  if (!fileContent) return
  return await cloud.uploadFile({
    cloudPath: event.cloudPath,
    fileContent: fileContent,
  })
}
