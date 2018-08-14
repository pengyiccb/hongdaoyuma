//app.js
// var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
const api = require('utils/api')


App({
    onLaunch: function () {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if(res.hasUpdate){
          wx.showToast({
            title: '发现新版本',  
            icon: 'none'
          });
        }
      });

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本下载失败',
          showCancel:false
        })
      });
    },

    globalData: {
      appId:"wxfb95d995a96c1e9b",
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