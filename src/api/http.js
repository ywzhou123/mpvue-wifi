// http请求工具，封闭wx.request

const request = function (method, url,  data = {}, isJson=true) {
  let contentType = isJson ? 'application/json' : 'application/x-www-form-urlencoded'
  let allow_methods = ['GET', 'POST', 'PATCH', 'DELETE']
  if (!allow_methods.includes(method)) {
    return new Error('请求方式错误')
  }
  return new Promise((resolve, reject) => {
    try {
      // 调用微信的请求方法,请求后端接口
      wx.request({
        url,
        data,
        method,
        header: { 'content-type': contentType },
        success(res) {
          resolve(res.data)
        },
        fail(e) {
          e.code = 400
          resolve(e)  //注意,这里要用resolve,否则前端代码会崩溃
        }
      })
    } catch (e) {
      e.code = 400
      console.error('网络异步请求出错,', e)
      resolve(e)  //注意,这里要用resolve,否则前端代码会崩溃
    }
  })
}


export default request
