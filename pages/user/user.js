// pages/user/user.js
const api = require('../../utils/api');
const util = require('../../utils/util');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },

  onTapLogin: function(e) {
    util.getUserAuth(e, {//用户点击授权之后 把数据绑到全局 并登录
      success: () => {//点击允许授权
        let userInfo = getApp().globalData.userInfo = e.detail.userInfo;
        this.setData({
          userInfo:userInfo
        });
        // console.log(userInfo);
        //app登录服务器
        api.loginToServer({
          data: {
            userInfo,
            "appId": getApp().globalData.appId
          },
          success: (res) => {
            console.log(res);
            console.log("登录到服务器成功！" + JSON.stringify(res));
            wx.setStorageSync('Authorization', res.data.token)
          }
        });
      },
      fail: () => { //点击拒绝授权
      }
    });
  },
  
  onTapTestPay() {
    api.getPrepayOrderInfo({tradeNo:7654324}).then(res=> {
      console.log(res);
      if(res.code == 0) {
        wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        success: function(res){
          console.log(res);
          // success 
          // notify service 这里最好延时1秒再通知服务器。表示已经付款成功了。服务器会去客户端二次确认。
          },
        fail: function (res) {
          console.log(res);
          // fail
          },
        complete: function (res) {
          console.log(res);
          // complete
          }
        });
      }
    }).catch(res=>{
      console.error(res);
    });
  },

  onTapAddress() {
    wx.showToast({
      icon: 'none',
      title: '此功能暂未开放'
    })
  },

  onTapKf() {
    wx.showToast({
      icon: 'none',
      title: '此功能暂未开放'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onTapLogin();
    // api.checkSession({
    //   success: ({ userInfo }) => {
    //     this.setData({userInfo});
    //     // console.log(wx.getStorageSync("serverSessionKey"));
    //     // api.requestToServer({
    //     //   url: "/api/v1/wechat/checkSession",
    //     //   success: (res) => {
    //     //     console.log(res);
    //     //   }
    //     // });
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})