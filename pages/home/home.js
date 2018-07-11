// pages/home/home.js
// const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js');
const api = require('../../utils/api');

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    adList: [],
    imgUrls: [
      'http://p9l3k4x4g.bkt.clouddn.com/product1.jpg',
      'http://p9l3k4x4g.bkt.clouddn.com/product2.jpg',
      'http://p9l3k4x4g.bkt.clouddn.com/product3.jpg',
      'http://p9l3k4x4g.bkt.clouddn.com/product4.jpg',
      'http://p9l3k4x4g.bkt.clouddn.com/product5.jpg'
    ],
    indicatorDots: true,
    interval: 5000,
    duration: 1000
  },

  getProductList(){
    let that = this
    api.GetProductList({ appId: app.globalData.appId }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '商品数据加载错误',
      })
    }).then(res => {
      if (!res.code && res.code === 0) {
        that.setData({
          productList: res.data
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '商品数据加载错误',
        })
      }
    })
  },

  getAdList(){
    let that = this
    api.GetAdList({ appId: app.globalData.appId }).catch(err =>{
      wx.showToast({
        icon: 'none',
        title: '商品数据加载错误',
      })
    }).then ( res => {
      if (!res.code && res.code === 0) {
        that.setData({
          adList: res.data
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '商品数据加载错误',
        })
      }
    })
  },

  addToTrolley(event){
    let productId = event.currentTarget.dataset.id
    let productList = this.data.productList
    let product

    for (let i = 0, len = productList.length; i < len; i++) {
      if (productList[i].id === productId) {
        product = productList[i]
        break
      }
    }

    if (product){
      
    }
  },

  suo: function (e) {  
    wx.navigateTo({  
      url: '../search/search',  
    })  
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getProductList();
    //this.getAdList();
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