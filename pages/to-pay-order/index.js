//index.js
//获取应用实例
var app = getApp()
const api = require('../../utils/api');

Page({
  data: {
    orderId: 0,
    totalPriceToPay: 0,
    goodsData: {},
    isNeedLogistics: 1, // 是否需要物流信息
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null, // 当前选择使用的优惠券
    curAddressData: null,    //用户当前地址
    itemIdList: [],
    typeId: 1                 //1为购物车购买，2为立即购买
  },
  onShow: function () {
    var that = this;
    let goodData = wx.getStorageSync('goodData');
    var submitData = {};
    submitData.buyType = this.data.typeId;
    if(this.data.typeId == 1){
      goodData.list.forEach(e => {
        this.data.itemIdList.push(e.itemId);
      });
      submitData.cartItemIdList = this.data.itemIdList;
    }else if(this.data.typeId == 2){
      submitData.buyCount = goodData.list[0].count;
      submitData.skuId = goodData.list[0].skuId;
    }
    
    api.orderTotalPrice(submitData).then(res => {
      if(res.code && res.code == 200){
        that.initShippingAddress();
        that.setData({
          goodsData: goodData,
          totalPriceToPay: res.data
        });        
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
      }
    });
  },

  onLoad: function(e){
    if(e.typeId > 2 || e.typeId < 1){
      wx.showModal({
        title: '错误提示',
        content: '数据参数错误'
      });
      return;
    }
    this.data.typeId = e.typeId;
  },

  createOrder: function (e) {
    var submitData = {};
    submitData.customerName = this.data.curAddressData.userName;
    submitData.wxAppId = app.globalData.appId;
    submitData.mobile_phone = this.data.curAddressData.mobilePhone;
    submitData.userAddressId = this.data.curAddressData.id;
    submitData.userRemark = e.detail.value.remark;
    var goods = {};
    goods.buyType = this.data.typeId;
    if(this.data.typeId == 1){
      goods.cartItemIdList = this.data.itemIdList;
    }else if(this.data.typeId == 2){
      goods.buyCount = this.data.goodsData.list[0].count;
      goods.skuId = this.data.goodsData.list[0].skuId;
    }
    submitData.goods = goods;
    api.orderConfirm(submitData).then(res => {
      if(res.code && res.code == 200){
        var orderId = res.data;
        api.playorder({orderId: orderId}).then(res => {
          if(res.code && res.code == 200){
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success: function(res){
                console.log(res);
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
          }else{
            wx.showToast({
              icon: 'none',
              title: res.msg,
            });
          }
        });
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
      }
    });
  },


  initShippingAddress: function () {
    var that = this;
    api.userDefaultAddr({}).then(res => {
      if (res.code && res.code == 200) {
        that.setData({
          curAddressData: res.data
        });
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
      }
    })
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: "/pages/select-address/index"
    })
  },
  /* getMyCoupons: function () {
    var that = this;
    wx.request({
      url: 'https://api.it120.cc/' + app.globalData.subDomain + '/discounts/my',
      data: {
        token: wx.getStorageSync('token'),
        status: 0
      },
      success: function (res) {
        if (res.data.code == 0) {
          var coupons = res.data.data.filter(entity => {
            return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
          });
          if (coupons.length > 0) {
            that.setData({
              hasNoCoupons: false,
              coupons: coupons
            });
          }
        }
      }
    })
  },
  bindChangeCoupon: function (e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon: null
      });
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  } */
})