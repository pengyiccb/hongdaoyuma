// pages/trolley/trolley.js
// const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config');
const api = require('../../utils/api');
const app = getApp();
const util = require('../../utils/util');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    trolleyList: [], // 购物车商品列表
    trolleyCheckMap: [], // 购物车中选中的id哈希表
    trolleyAccount: 0, // 购物车结算总价
    isTrolleyEdit: false, // 购物车是否处于编辑状态
    isTrolleyTotalCheck: false, // 购物车中商品是否全选
  },

  onTapLogin(e) {
    var that = this;
    util.getUserAuth(e, {//用户点击授权之后 把数据绑到全局 并登录
      success: () => {//点击允许授权
        let userInfo = getApp().globalData.userInfo = e.detail.userInfo;
        this.setData({
          userInfo:userInfo
        });
        // console.log(userInfo);
        //app登录服务器
        api.loginToServer({
          data: {
            userInfo,
            "appId": getApp().globalData.appId
          },
          success: (res) => {
            console.log(res);
            console.log("登录到服务器成功！" + JSON.stringify(res));
            wx.setStorageSync('Authorization', res.data.token);
            that.getTrolley();
          }
        });
      },
      fail: () => { //点击拒绝授权
      }
    });
  },

  getTrolley(){
    wx.showLoading({
      title: '加载购物车数据...',
    })

    api.CarList({ }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '数据加载错误',
      })
    }).then(res => {
      console.log(res);
      wx.hideLoading()
      if (res.code && res.code == 200) {
        let data = res.data
        // console.log(data)
        // 图片（imgPrimaryUrl） 尺码(size) 颜色(color) 钱（unitPrice） 件（count）
        // let list = []
        // data.map(res => {
        //   let obj = {}
        //   obj['id'] = res.id
        //   obj['productSkuId'] = res.productSkuId
        //   obj['count'] = res.count
        //   let eshopProducSkut = res['eshopProducSkut']
        //   obj['name'] = eshopProducSkut['product']['title']
        //   obj['image'] = eshopProducSkut['product']['imgPrimaryUrl']
        //   obj['price'] = eshopProducSkut['unitPrice']
        //   eshopProducSkut['attrs'].map(res => {
        //     if (res['attrType'] === 'COLOR') {
        //       obj['color'] = `颜色：${res.attrContent}`
        //     } else if (res['attrType'] === 'SIZE') {
        //       obj['size'] = `尺码：${res.attrContent}`
        //     }
        //   })
        //   list.push(obj)
        // })
        this.setData({
          trolleyList: res.data
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: '数据加载错误',
        })
      }
    })
  },

  onTapCheckSingle(event) {
    let checkId = event.currentTarget.dataset.id
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyAccount = this.data.trolleyAccount
    let numTotalProduct
    let numCheckedProduct = 0

    // 单项商品被选中/取消
    trolleyCheckMap[checkId] = !trolleyCheckMap[checkId]

    // 判断选中的商品个数是否需商品总数相等
    numTotalProduct = trolleyList.length
    trolleyCheckMap.forEach(checked => {
      numCheckedProduct = checked ? numCheckedProduct+1 : numCheckedProduct
    })

    isTrolleyTotalCheck = (numTotalProduct === numCheckedProduct) ? true : false

    trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)
    
    this.setData({
      trolleyCheckMap:trolleyCheckMap,
      isTrolleyTotalCheck:isTrolleyTotalCheck,
      trolleyAccount:trolleyAccount
    })
  },

  onTapCheckTotal(event) {
    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList
    let isTrolleyTotalCheck = this.data.isTrolleyTotalCheck
    let trolleyAccount = this.data.trolleyAccount

    // 全选按钮被选中/取消
    isTrolleyTotalCheck = !isTrolleyTotalCheck

    // 遍历并修改所有商品的状态
    trolleyList.forEach(product => {
      trolleyCheckMap[product.itemId] = isTrolleyTotalCheck
    });

    trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)

    this.setData({
      isTrolleyTotalCheck:isTrolleyTotalCheck,
      trolleyCheckMap:trolleyCheckMap,
      trolleyAccount:trolleyAccount
    });    
  },

  calcAccount(trolleyList, trolleyCheckMap) {
    let account = 0
    trolleyList.forEach(item => {
      account = trolleyCheckMap[item.itemId] ? account + item.unitPrice * item.count : account
    })

    return account
  },

  onTapEditTrolley() {
    let isTrolleyEdit = this.data.isTrolleyEdit

    this.setData({
      isTrolleyEdit: !isTrolleyEdit
    })
    // if (isTrolleyEdit) {
    //   this.updateTrolley()
    // } else {
    //   this.setData({
    //     isTrolleyEdit: !isTrolleyEdit
    //   })
    // }
  },

  adjustTrolleyProductCount(event) {    
    let trolleyList = this.data.trolleyList;
    let dataset = event.currentTarget.dataset;
    let adjustType = dataset.type;
    let productId = dataset.id;
    let product = null;
    let index;
        

    for (index = 0; index < trolleyList.length; index++) {
      if (productId == trolleyList[index].itemId) {
        product = trolleyList[index]
        break
      }
    }

      if (product) {
        if (adjustType === 'add') {
          // 点击加号
          product.count++
          this.ModifyCart({itemId: product.itemId, count: product.count})
        } else {
          // 点击减号
          if (product.count >= 1) {
            // 商品数量大于1
            product.count--
            this.ModifyCart({itemId: product.itemId, count: product.count})
          }
        }
      }

      
  },

  ModifyCart(data) {
    api.ModifyCart(data).catch(err => console.error(err)).then(res => {
      if (res.code && res.code == 200) {
        let trolleyList = this.data.trolleyList;
        let trolleyCheckMap = this.data.trolleyCheckMap;
        // 调整结算总价
      let trolleyAccount = this.calcAccount(trolleyList, trolleyCheckMap)

      if (!trolleyList.length) { 
        // 当购物车为空，自动同步至服务器
        this.updateTrolley()
      }

      this.setData({
        trolleyAccount:trolleyAccount,
        trolleyList:trolleyList,
        trolleyCheckMap:trolleyCheckMap
      });
      }else{
        wx.showToast({
          icon: 'none',
          title: '数据加载错误',
        })
      }
    })
  },

  updateTrolley() {
    // wx.showLoading({
    //   title: '更新购物车数据...',
    // })

    let trolleyList = this.data.trolleyList

    this.setData({
      isTrolleyEdit: false
    })

    // qcloud.request({
    //   url: config.service.updateTrolley,
    //   method: 'POST',
    //   login: true,
    //   data: {
    //     list: trolleyList
    //   },
    //   success: result => {
    //     wx.hideLoading()

    //     let data = result.data

    //     if (!data.code) {
    //       this.setData({
    //         isTrolleyEdit: false
    //       })
    //     } else {
    //       wx.showToast({
    //         icon: 'none',
    //         title: '更新购物车失败'
    //       })
    //     }
    //   },
    //   fail: () => {
    //     wx.hideLoading()

    //     wx.showToast({
    //       icon: 'none',
    //       title: '更新购物车失败'
    //     })
    //   }
    // })
  },

  onTapPay() {
    if (!this.data.trolleyAccount) return

    // wx.showLoading({
    //   title: '结算中...',
    // })

    let trolleyCheckMap = this.data.trolleyCheckMap
    let trolleyList = this.data.trolleyList

    let needToPayProductList = trolleyList.filter(product => {
      return !!trolleyCheckMap[product.id]
    })

    let list = {
      data: needToPayProductList,
      trolleyAccount: this.data.trolleyAccount
    }

    wx.setStorageSync('AccountList', list)
    console.log(needToPayProductList)
    let datalist = {
      productSkuId: needToPayProductList[0]['productSkuId'],
      count: needToPayProductList[0]['count'],
      realMoney: this.data.trolleyAccount
    }
    api.addorder(datalist, needToPayProductList[0]['id']).then(res => {
      // if (res.code === 0) {
        wx.navigateTo({
          url: `../../pages/to-pay-order/index?orderType=gwc&orderId=${res.data}`
        });
      // }
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
    let Authorization = wx.getStorageSync('Authorization')
    // console.log(key)
    if (Authorization !== undefined) {
      let userInfo = getApp().globalData.userInfo;
      this.setData({ 
        userInfo: userInfo 
      });
      this.getTrolley()
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