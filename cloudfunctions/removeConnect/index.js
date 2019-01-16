// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    console.log('wifi_id',event.wifi_id)
    return await db.collection('connect_list').where({
      wifi_id: event.wifi_id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}