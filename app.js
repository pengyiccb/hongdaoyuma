//app.js
// var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
const api = require('utils/api')


App({
    // onLaunch: function () {
    //     qcloud.setLoginUrl(config.service.loginUrl)
    // },

    login({success, error}) {
     
    },

    globalData: {
      appId:"wxdda83d03c2d1521c",
      userInfo: null,
      serverSessionKey: null,
      shopTitle: "红道御马"
    },
})

// 加载app登录服务器
// api.loginToServer({
//   data: { appId: getApp().globalData.appId},
//   success: (res) => {
//     console.log("登录到服务器成功！" + res.data.serverSessionKey);
//     console.log("登录到服务器成功！" + getApp().globalData.serverSessionKey);
//   }
// });

// wx.request({
//   url: 'http://shop.jxxykj.cn/api/v1/wechat/testPost',
//   method: "POST",
//   header: { "content-type": "application/x-www-form-urlencoded"},
//   data:{
//     userInfo: { nickName: "aaa"}
//   },
//   success: res => {
//     console.log(res.data);
//   }
// })