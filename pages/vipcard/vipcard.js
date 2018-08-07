const api = require('../../utils/api');
const util = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.showLoading();
    var that = this;
    api.getCardList({}).catch(res => {
      // wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      // wx.hideLoading();
      if (res.code && res.code == 200) {
        that.setData({
          cardData: res.data.map(packageInfo => {
            packageInfo.history = packageInfo.history.map(e => {
              e.serverTime = e.serverTime.split(" ")[0];
              return e;
            });
            return packageInfo;
          })
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    });
  },
  openShopRecord: function (event) {
    wx.navigateTo({
      url: '../shopRecord/shopRecord'
    })
  },
})