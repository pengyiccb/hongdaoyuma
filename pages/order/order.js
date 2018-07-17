const api = require('../../utils/api')
const util = require('../../utils/util')
var app = getApp()
Page({
  data: {
    statusType: ["全部", "待付款", "待服务", "服务完成", "已关闭"],
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: []
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    if(curType == 0) curType = -1;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          api.orderCancel({}, orderId).then(res => {
            if(res.code && res.code == 200){
              wx.hideLoading();
              that.onShow();              
            }else{
              wx.hideLoading();
              wx.showToast({
                icon: 'none',
                title: res.msg,
              });
            }
          });
        }
      }
    })
  },
  toPayTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;

    api.playorder({orderId: orderId}).then(res => {
      if(res.code && res.code == 200){
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: function(res){
            wx.showToast({
              icon: 'none',
              title: '支付成功',
            });
            wx.navigateTo({
              url: "/pages/order-details/index?id=" + orderId
            })
          },
          fail: function (res) {
            wx.showToast({
              icon: 'none',
              title: '支付失败',
            });
          },
          });
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
      }
    });
  },
  onLoad: function (e) {
    if(e && e.currentType){
      this.data.currentType = e.currentType;
    }else{
      this.data.currentType = -1;
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  getOrderStatistics: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/order/statistics',
      data: { token: wx.getStorageSync('token') },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code == 0) {
          var tabClass = that.data.tabClass;
          if (res.data.data.count_id_no_pay > 0) {
            tabClass[0] = "red-dot"
          } else {
            tabClass[0] = ""
          }
          if (res.data.data.count_id_no_transfer > 0) {
            tabClass[1] = "red-dot"
          } else {
            tabClass[1] = ""
          }
          if (res.data.data.count_id_no_confirm > 0) {
            tabClass[2] = "red-dot"
          } else {
            tabClass[2] = ""
          }
          if (res.data.data.count_id_no_reputation > 0) {
            tabClass[3] = "red-dot"
          } else {
            tabClass[3] = ""
          }
          if (res.data.data.count_id_success > 0) {
            //tabClass[4] = "red-dot"
          } else {
            //tabClass[4] = ""
          }

          that.setData({
            tabClass: tabClass,
          });
        }
      }
    })
  },
  onShow: function () {
    var that = this;
    // 获取订单列表
    wx.showLoading();
    /* postData.status = that.data.currentType; */
    /* this.getOrderStatistics(); */
    api.orderList({ orderStatus: this.data.currentType}).catch(res => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '数据加载错误',
      });
    }).then(res => {
      wx.hideLoading();
      if(res.code && res.code == 200){
        that.setData({
          orderList: res.data
        });
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg
        });
      }
    });
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  }
})