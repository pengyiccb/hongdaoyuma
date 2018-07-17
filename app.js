//app.js
// var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
const api = require('utils/api')


App({
    // onLaunch: function () {
    //     qcloud.setLoginUrl(config.service.loginUrl)
    // },

    login({success, error}) {
      // api.loginToServer({
      //   success: res => {
      //     console.log("app.login()");
      //     console.log("app.login() code = " + res.data.code);
      //     console.log("==== app.login() data ==== " + JSON.stringify(res.data));
      //     // console.log(res.data);
      //     if (res.data.code == 0) {
      //       this.globalData.serverSessionKey = res.data.serverSessionKey;
      //       console.log("this.globalData.serverSessionKey111=" + this.globalData.serverSessionKey);
      //       success && success(this.globalData.serverSessionKey);
      //     } else {
      //         error && error();
      //     }
      //   }
      // });
      // wx.getSetting({
      //   success: res => {
      //     if (res.authSetting['scope.userInfo'] === false) {
      //       // 已拒绝授权
      //       wx.showModal({
      //         title: '提示',
      //         content: '请授权我们获取您的用户信息',
      //         showCancel: false,
      //         success: () => {
      //           wx.openSetting({
      //             success: res => {
      //               if (res.authSetting['scope.userInfo'] === true) {
      //                 // this.doQcloudLogin({ success, error })
      //               }
      //             }
      //           })
      //         }
      //       })
      //     } else {
      //       // this.doQcloudLogin({ success, error })
      //     }
      //   }
      // })
    },

    // doQcloudLogin({success, error}) {
    //   // 调用 qcloud 登陆接口
    //   qcloud.login({
    //     success: result => {
    //       if (result) {
    //         userInfo = result

    //         success && success({
    //           userInfo
    //         })
    //       } else {
    //         // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
    //         this.getUserInfo({ success, error })
    //       }
    //     },
    //     fail: () => {
    //       error && error()
    //     }
    //   })
    // },

    // getUserInfo({ success, error }){
    //   if (userInfo) return userInfo

    //   qcloud.request({
    //     url: config.service.user,
    //     login: true,
    //     success: result => {
    //       let data = result.data

    //       if (!data.code){
    //         userInfo = data.data

    //         success && success({
    //           userInfo
    //         })
    //       } else {
    //         error && error()
    //       }
    //     },
    //     fail: () => {
    //       error && error()
    //     }
    //   })
    // },

    globalData: {
      appId:"wxdda83d03c2d1521c",
      userInfo: null,
      serverSessionKey: null,
      shopTitle: "宏道御马"
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