// pages/user/user.js
const api = require('../../utils/api');
const util = require('../../utils/util');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    shopCarNum: 0,
    phoneNum: "",
    codeTxt: "",
    codeBtnTxt: "获取验证码",
    userInfo: null,
    times: 60,
    bActive: true,
    bindMobilePhone: false,
    icons: [
      {
        icon: '/images/user/order_wait_for_pay.png',
        name: '待付款',
        url : '/pages/order/order?currentType=1',
        num: 0
      },
      {
        icon: '/images/user/order_wait_for_service.png',
        name: '待服务',
        url: '/pages/order/order?currentType=2',
        num: 0
      },
      {
        icon: '/images/user/order_completed.png',
        name: '已服务',
        url: '/pages/order/order?currentType=3',
        num: 0
      },
      {
        icon: '/images/user/order_cancel.png',
        name: '已完成',
        url: '/pages/order/order?currentType=4',
        num: 0
      }
    ],
    userRouter: [
      {
        name: "会员卡",
        url: "",
        tapFunction:"onTapVipCard"
      },
      {
        name: "绑定车型",
        url: "",
        tapFunction:"onTapBindCar"
      },
      {
        name: "优惠券",
        url: "",
        tapFunction:"onTapCloseTips"
      },
      {
        name: "常用地址",
        url: "",
        tapFunction:"onTapAddress"
      },
     /*  {
        name: "联系客服",
        url: "",
        tapFunction:"onTapCloseTips"
      },
      {
        name: "建议反馈",
        url: "",
        tapFunction:"onTapCloseTips"
      }, */
    ]
  },

  onTapVipCard: function(){
    if(this.data.bindMobilePhone){
      wx.navigateTo({
        url:"/pages/vipcard/vipcard"
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '请先绑定手机号',
      })
    }    
  },

  getPhoneNumber: function(e){
    var that = this;
    
    api.dataDecode({iv: e.detail.iv, encryptedData: e.detail.encryptedData}).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      if(res.code && res.code == 200){
        that.setData({
          wxPhoneNo: res.data
        });
        this.data.phoneNum = res.data;
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    });
  },

  onTapBindCar: function(){
    wx.navigateTo({
      url:"/pages/bindcar/bindcar"
    })
  },
  
  onTapAddress: function(){
    wx.navigateTo({
      url:"/pages/select-address/index"
    })
  },

  onTapCloseTips() {
    wx.showToast({
      icon: 'none',
      title: '此功能暂未开放'
    })
  },

  onTapCustomService() {
    wx.showToast({
      icon: 'none',
      title: '此功能暂未开放'
    })
  },

  onTapLogin: function(e) {
    /* var that = this;
    if(e.detail.userInfo){
      that.onShow();
    }else{
      wx.showToast({
        icon: 'none',
        title: '登陆失败'
      });
    } */
    this.onShow();
  },

  togglePopup(){
      this.setData({
        showPopup: !this.data.showPopup
      });
    },

  phoneInput: function(e){
    console.log(e.detail.value);
    this.data.phoneNum = e.detail.value;
  },

  codeInput: function(e){
    this.data.codeTxt = e.detail.value;
  },

  onGetPhoneCode: function(){
    var that = this;
    if(!this.data.bActive) return;
    if(this.data.phoneNum.length != 11 && this.data.wxPhoneNo.length != 11){
      wx.showToast({
        icon: 'none',
        title: '手机号格式不正确'
      });
      return;
    }

    that.setData({
      bActive: !that.data.bActive
    });
    that.data.times = 60;
    that.setData({
      codeBtnTxt: "获取验证码(" + that.data.times + "s)"
    });
    that.data.myTimeID = setInterval(that.updateTips, 1000);

    api.getPhoneCode({}, this.data.phoneNum).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      if(res.code && res.code == 200){
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    });
  },

  updateTips: function(){
    this.data.times--;
    if(this.data.times <= 0){
      clearInterval(this.data.myTimeID);
      this.setData({
        bActive: !this.data.bActive,
        codeBtnTxt: "获取验证码"
      });
    }else{
      this.setData({
        codeBtnTxt: "获取验证码(" + this.data.times + "s)"
      });
    }    
  },

  onVerfyCode: function(){
    var that = this;
    if(this.data.phoneNum.length != 11){
      wx.showToast({
        icon: 'none',
        title: '手机号格式不正确'
      });
      return;
    }

    if(this.data.codeTxt.length != 4){
      wx.showToast({
        icon: 'none',
        title: '验证码格式不正确'
      });
      return;
    }

    api.verifyPhoneCode({}, this.data.phoneNum, this.data.codeTxt).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      if(res.code && res.code == 200){
        wx.showToast({
          icon: 'none',
          title: '恭喜你 绑定成功',
        });
        that.togglePopup();
        that.setData({
          bindMobilePhone: true
        });
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    });
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getUserInfo({
      success: function(res){
        wx.showLoading();
        app.globalData.userInfo = res.userInfo;
        api.loginToServer({
          data:{
            userInfo: res.userInfo,
            "appId": app.globalData.appId
          },
          success: (res) => {
            if(res.code && res.code == 200){
              api.getUserInfo().catch(res => {
                wx.hideLoading()
                wx.showToast({
                  icon: 'none',
                  title: '网络数据错误',
                })
              }).then(res => {
                wx.hideLoading()
                if(res.code && res.code == 200){
                  var icons = that.data.icons;
                  icons[0].num = res.data.waitForPay;
                  icons[1].num = res.data.waitForDelivered;
                  icons[2].num = res.data.hasDelivered;
                  that.setData({
                    icons: icons,
                    shopCarNum: res.data.cartItemNum,
                    bindMobilePhone: res.data.bindMobilePhone,
                    userInfo: app.globalData.userInfo
                  });
                }else{
                  wx.showToast({
                    icon: 'none',
                    title: res.msg,
                  })
                }
              });
            }else{
              wx.showToast({
                icon: 'none',
                title: res.msg,
              })
            }            
          },
          fail: (res) => {
            wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '网络数据错误',
            });
          }
        });
      },
      fail: function(res){
        app.globalData.userInfo = null;
        that.setData({
          userInfo: null
        });
      }
    });
  },

})