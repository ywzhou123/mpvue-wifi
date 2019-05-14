# mpvue-test

  畅享无限WiFi码，用于分享已知的wifi，让朋友扫小程序码直接连接
  使用mpvue框架+微信云函数开发，部署非常方便，但调试比较麻烦，
  最新版微信开发工具已支持本地调试。

  另外在云函数中获取小程序码时出现回调地狱（结合上传到七牛云），因此改版使用腾讯云(nodejs)开发后台接口，直接返回小程序码二进制流进行展示。

[新版项目地址](https://github.com/ywzhou123/mpvue-node-wifi)



## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
