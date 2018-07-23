//index.js
//获取应用实例
var app = getApp()
const api = require('../../utils/api')
Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var addr = this.data.addressList[parseInt(index)];
    api.modifyAddr({id: addr.id, userName: addr.userName, mobilePhone: addr.mobilePhone, areaAddress1: addr.areaAddress1, areaAddress2: addr.areaAddress2, areaAddress3: addr.areaAddress3,
      addressDetail:addr.addressDetail, postalCode: addr.postalCode, nationalCode: addr.nationalCode, isDefault: 1}).catch(res => {
        wx.showToast({
          icon: 'none',
          title: '网络数据错误',
        })
      }).then(res => {
        if(res.code && res.code == 200){
          for(let i = 0; i < that.data.addressList.length; i++){
            that.data.addressList[i].isDefault = 0;
          }
          that.data.addressList[parseInt(index)].isDefault = 1;
          that.setData({
            addressList: that.data.addressList
          });
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg,
          });
        }
    });
  },

  addAddess : function () {
    wx.navigateTo({
      url:"/pages/address-add/index"
    })
  },
  
  editAddess: function (e) {
    wx.navigateTo({
      url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    })
  },
  
  onLoad: function () {
    console.log('onLoad')

   
  },
  onShow : function () {
    this.initShippingAddress();
  },
  
  initShippingAddress: function () {
    var that = this;
    api.addrList().catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      if (res.code && res.code == 200) {
        that.setData({
          addressList: res.data
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
      }
    })
  }

})
