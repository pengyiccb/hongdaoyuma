var app = getApp();
const api = require('../../utils/api')
Page({
    data:{
        orderId:0,
        goodsList:[],
        orderBasic: {},
        orderDetail: {},
        statusType: ["全部", "待付款", "待服务", "服务完成", "已关闭"],
        shopTitle: "宏道御马"
    },
    onLoad:function(e){
      var orderId = e.id;
      this.data.orderId = orderId;
      this.setData({
        orderId: orderId
      });
    },
    onShow : function () {
      var that = this;
      wx.showLoading();
      api.orderDetail({}, this.data.orderId).then(res => {
        wx.hideLoading();
        if(res.code && res.code == 200){
          that.setData({
            orderBasic: res.data.orderBasic,
            orderDetail: res.data.orderDetail,
            shopTitle: app.globalData.shopTitle
          });
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg,
          });
        }
      });
    },
    
    onCopy: function(){
      var copyData = 
      "订单编号：" + 
      (this.data.orderBasic.orderId ? this.data.orderBasic.orderId : "") + 
      "\n微信交易号：" + 
      (this.data.orderDetail.paymentSerialNo ? this.data.orderDetail.paymentSerialNo : "") + 
      "\n订单创建时间：" + 
      (this.data.orderBasic.orderCreateTime ? this.data.orderBasic.orderCreateTime : "") +
      "\n订单付款时间：" + 
      (this.data.orderDetail.paymentCompletedTime ? this.data.orderDetail.paymentCompletedTime : "") + 
      "\n服务开始时间：" + 
      (this.data.orderDetail.appointmentServiceTimeBegin ? this.data.orderDetail.appointmentServiceTimeBegin : "") + 
      "\n服务完成时间：" + 
      (this.data.orderDetail.appointmentServiceTimeEnd ? this.data.orderDetail.appointmentServiceTimeEnd : "");
      wx.setClipboardData({
        data: copyData,
        success: function(res) {
          wx.showToast({
            icon: 'none',
            title: '复制成功',
          });
        },
        fail: function(res){
          wx.showToast({
            icon: 'none',
            title: '复制失败',
          });
        }
      });
    }    
})