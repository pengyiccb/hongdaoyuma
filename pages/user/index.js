import componentsConfig from './config';

const app = getApp()

Page({
  data: {
    showPopup: false,
    userInfo: {},
    hasUserInfo: false,
    list: componentsConfig,
    icons: [
      {
        icon: 'pending-payment',
        name: '待付款',
        url : '/pages/order-list/index?currentType=1'
      },
      {
        icon: 'tosend',
        name: '待发货',
        url: '/pages/order-list/index?currentType=2'
      },
      {
        icon: 'logistics',
        name: '已发货',
        url: '/pages/order-list/index?currentType=3'
      },
      {
        icon: 'sign',
        name: '已完成',
        url: '/pages/order-list/index?currentType=4'
      }
    ]
  },

  onLoad: function () {
    this.setData({
      userInfo: {
        nickName: 'Hi,游客您好！请点击登录',
        avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
      },
    })
    
  },

  bindGetUserInfo() {
    wx.getUserInfo({
      success: res => {
        // app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },

  onShow: function() {
  },

  togglePopup() {
    this.setData({
      showPopup: !this.data.showPopup
    });
  },
})
