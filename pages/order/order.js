const api = require('../../utils/api')
const util = require('../../utils/util')
var app = getApp()
Page({
  data: {
    statusType: ["全部", "待付款", "待服务", "服务完成", "已关闭"],
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    orderList: [],
    shopTitle: "红道御马",
    leftStyle: "0px",
    changeWidth: 250
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
  
  onShow: function () {
    var that = this;
    // 获取订单列表
    wx.showLoading();
    /* var w = wx.getSystemInfoSync().windowWidth / 3;
    this.setData({
      leftStyle: "left:0px",
      changeWidth:w
    }); */
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
            shopTitle: app.globalData.shopTitle,
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

  /* touchS:function(e){
    if(e.touches.length==1){
      this.setData({
        startX:e.touches[0].clientX
      });
    }
  },

  touchM:function(e){
      if(e.touches.length==1){
        var moveX = e.touches[0].clientX;
        var disX = this.data.startX - moveX;
        var left = "";
        if(disX == 0 || disX < 0){
          if(this.data.currentType <= 0) return;
          left = "left:" + (0-disX) + "px";
        }else if(disX > 0 ){
          if(this.data.currentType >= 4) return;
          left = "left:-"+disX+"px";
        }

        this.setData({
          leftStyle: left
        });
      }
    },
  
    touchE:function(e){
      if(e.changedTouches.length==1){
        var endX = e.changedTouches[0].clientX;
        var disX = this.data.startX - endX;
        var left = "";
        if(disX >= this.data.changeWidth){
          var curType = this.data.currentType + 1;
          if(curType > 4) return;
          this.setData({
            currentType: curType
          });
          this.onShow();
        }else if(disX <= -this.data.changeWidth){
          var curType = this.data.currentType - 1;
          if(curType < 0) return;
          this.setData({
            currentType: curType
          });
          this.onShow();
        }else{
          left = "left:0px";
          this.setData({
            leftStyle: left
          });
        }        
      }
    }, */

})