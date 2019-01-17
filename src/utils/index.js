export function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}
export function sortTime (a, b, s='asc') {
  try {
    const at = new Date(a)
    const bt = new Date(b)
    if (s === 'desc') return at < bt
    else return at > bt
  } catch (error) {
    return false
  }
}
//计算时间差
export function beforeTime(oldDate, newDate){
  if ((! oldDate instanceof Date) && (! newDate instanceof Date)) return
  var time = newDate - oldDate
  //1秒内
  var one_second = 1000
  if (time < one_second){
    return '刚刚'
  }
  //1分内
  var one_minute = one_second * 60
  if (time < one_minute) {
    var seconds = Math.floor(time / one_second)
    return `${seconds}秒前`
  }
  //1小时内
  var one_hour = one_minute * 60
  if (time < one_hour) {
    var minutes = Math.floor(time / one_minute)
    return `${minutes}分钟前`
  }
  //1天内
  var one_day = one_hour * 24
  if (time < one_day) {
    var hours = Math.floor(time / one_hour)
    return `${hours}小时前`
  }
  //1月内
  var one_month = one_day * 30
  if (time < one_month) {
    var days = Math.floor(time / one_day)
    return `${days}天前`
  }
  //1年内
  var one_year = one_month * 12
  if (time < one_year) {
    var months = Math.floor(time / one_month)
    return `${months}个月前`
  }
  var years = Math.floor(time / one_year)
  return `${years}年前`
}

/*获取当前页url*/
export function getCurrentPageUrl() {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var url = currentPage.route
  return url
}

/*获取当前页url中的参数对象*/
export function getCurrentPageUrlArgs() {
  var pages = getCurrentPages()
  var currentPage = pages[pages.length - 1]
  var options = currentPage.options
  return options
}

/*获取当前页带参数的url*/
export function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

export function isIncludeChinese(str){
  if (escape(str).indexOf("%u") < 0) {
    return false // 不带中文
  }
  return true // 带中文
}
