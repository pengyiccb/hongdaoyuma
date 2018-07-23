// pages/user/user.js
const api = require('../../utils/api');
const util = require('../../utils/util');

const app = getApp();

const tokenKey = 'Authorization';

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
    times: 60,
    bActive: true,
    bindMobilePhone: false,
    Authorization: null,
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
        tapFunction:"onTapCloseTips"
      },
      {
        name: "绑定车型",
        url: "",
        tapFunction:"onTapCloseTips"
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
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    });
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
    var that = this;
    if(e.detail.userInfo){
      api.loginToServer({
        data:{
          userInfo: e.detail.userInfo,
          "appId": app.globalData.appId
        },
        success: (res) => {
          try {
            wx.setStorageSync(tokenKey, res.data.token);
            that.setData({
              Authorization: res.data.token
            });
            that.onShow();            
          } catch (e) {
            wx.showToast({
              icon: 'none',
              title: '设置缓存错误'
            })      
          }          
        }
      });
    }else{
      wx.showToast({
        icon: 'none',
        title: '用户拒绝授权'
      });
      
      try {
        wx.removeStorageSync(tokenKey);
      } catch (e) {
        wx.showToast({
          icon: 'none',
          title: '删除缓存错误'
        })    
      }
    }

    /* util.getUserAuth(e, {
      success: () => {
        let userInfo = app.globalData.userInfo = e.detail.userInfo;
        this.setData({
          userInfo:userInfo
        });
        api.loginToServer({
          data: {
            userInfo,
            "appId": getApp().globalData.appId
          },
          success: (res) => {
            wx.setStorageSync('Authorization', res.data.token)
            that.onShow();
          }
        });
      },
      fail: () => {
      }
    }); */
  },

  togglePopup(){
      this.setData({
        showPopup: !this.data.showPopup
      });
    },

  phoneInput: function(e){
    this.data.phoneNum = e.detail.value;
  },

  codeInput: function(e){
    this.data.codeTxt = e.detail.value;
  },

  onGetPhoneCode: function(){
    var that = this;
    if(!this.data.bActive) return;
    if(this.data.phoneNum.length != 11){
      wx.showToast({
        icon: 'none',
        title: '手机号格式不正确'
      });
      return;
    }
    api.getPhoneCode({}, this.data.phoneNum).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      if(res.code && res.code == 200){
        that.setData({
          bActive: !that.data.bActive
        });
        that.data.times = 60;
        that.setData({
          codeBtnTxt: "获取验证码(" + that.data.times + "s)"
        });
        that.data.myTimeID = setInterval(that.updateTips, 1000);
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var token = wx.getStorageSync(tokenKey);
      if(token){
        this.setData({
          Authorization: token
        });
      }else{
        this.setData({
          Authorization: null
        });
      }      
    } catch (e) {
      wx.showToast({
        icon: 'none',
        title: '获取缓存错误',
      })
    }
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
    var that = this;
    if(this.data.Authorization){
      wx.showLoading();
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
            wxNickName: res.data.wxNickName,
            avatarUrl: res.data.avatarUrl
          });
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      });
    }
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