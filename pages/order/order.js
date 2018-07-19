const api = require('../../utils/api')
const util = require('../../utils/util')
var app = getApp()
Page({
  data: {
    statusType: ["全部", "待付款", "待服务", "服务完成", "已关闭"],
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: [],
    shopTitle: "红道御马"
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
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

  ConfirmOrder: function(e){
    var orderId = e.currentTarget.dataset.id;
    wx.showLoading();
    api.orderConfirm({}, orderId).then(res => {
      wx.hideLoading();
      if(res.code && res.code == 200){
        wx.navigateTo({
          url: "/pages/order-details/index?id=" + orderId
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
    }
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  
  onShow: function () {
    var that = this;
    // 获取订单列表
    wx.showLoading();
    /* postData.status = that.data.currentType; */
    /* this.getOrderStatistics(); */
    if(this.data.currentType == 0){
      api.orderList({}).catch(res => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '数据加载错误',
        });
      }).then(res => {
        wx.hideLoading();
        if(res.code && res.code == 200){
          that.setData({
            orderList: res.data,
            shopTitle: app.globalData.shopTitle
          });
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg
          });
        }
      });
    }else{
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
            orderList: res.data,
            shopTitle: app.globalData.shopTitle
          });
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg
          });
        }
      });
    }
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