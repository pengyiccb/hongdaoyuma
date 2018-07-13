//index.js
//获取应用实例
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
const api = require('../../utils/api');

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    goodsDetail: {},
    swiperCurrent: 0,
    hasMoreSelect: false,
    selectSize: "选择：",
    selectSizePrice: 0,
    totalScoreToPay: 0,
    shopNum: 0,
    hideShopPopup: true,
    isOkButton: false,
    buyNumber: 1,
    buyNumMin: 1,
    toView: "goodDesc",
    productId: 0,     //商品ID
    scrollHeight: 0,
    stock_amount: 0,
    pop_goods_price: 0,
    sale_amount: 0,
    single_image: "",
    select_string: "",    //已选规格

    
    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车

    productskuPriceMap : [], //单品数据价格表
    productsku:{}, //选中的单品数据

    shopCarInfo: {},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
  },

  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onShow:function(){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },

  onLoad: function (e) {
    this.selectArr = [];
    var that = this;
    // 获取购物车数据
    wx.getStorage({
      key: 'shopCarInfo',
      success: function (res) {
        that.setData({
          shopCarInfo: res.data,
          shopNum: res.data.shopNum
        });
      }
    })    

    this.setData({
      productId: e.id
    });

    api.GetProductDetail({ productId: e.id }).then(res => {
      let data = res.data
      this.setData({
        goodsDetail: res.data.product,
        attrs : res.data.attrs,
        single_image: res.data.product.imgPrimaryList[0].url,
      });

      wx.setNavigationBarTitle({
        title: that.data.goodsDetail.title
      });

      api.getProductDetailList({
        productId: that.data.goodsDetail.id,
      }).then(res=>{
        let productskuPriceMap = this.data.productskuPriceMap;
        if (res.code==200) {
          res.data.forEach(element => {
            productskuPriceMap[element.attrOption] = element;
          });
          let pirceList = res.data.map(e => {return e.unitPrice});
          let max = Math.max.apply(null, pirceList);
          let min = Math.min.apply(null, pirceList);
          this.setData({ price_section: min + "-" + max});
        }
    });
    });
  
  },

  //商品介绍
  goodInstr: function(){
    this.setData({
      toView: "goodDesc",
    });
  },

  //商品规格
  goodSize: function(){
    this.setData({
      toView: "goodSize",
    });
  },

  goShopCar: function () {
    wx.reLaunch({
      url: "/pages/trolley/trolley"
    });
  },
  toAddShopCar: function () {
    this.setData({
      shopType: "addShopCar",
      isOkButton: true
    })
    this.bindGuiGeTap();
  },

  onGoodSelect: function(){
    this.setData({
      isOkButton: false
    })
    this.bindGuiGeTap();
  },

  onOKButton: function(){
    if(this.data.shopType === "addShopCar"){
      this.addShopCar();
    }else if(this.data.shopType === "tobuy"){
      this.buyNow();
    }

  },
  tobuy: function () {
    this.setData({
      shopType: "tobuy",
      isOkButton: true
    });
    this.bindGuiGeTap();
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },
  numJianTap: function () {
    if (this.data.buyNumber > this.data.buyNumMin) {
      var currentNum = this.data.buyNumber;
      currentNum--;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  numJiaTap: function () {
    if (this.data.buyNumber < this.data.stock_amount) {
      var currentNum = this.data.buyNumber;
      currentNum += 1;
      this.setData({
        buyNumber: currentNum
      })
    }
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  labelItemTap: function (e) {
    var that = this;

    let attrParentId = e.currentTarget.dataset.propertyid;
    let tapAttrId = e.currentTarget.dataset.propertychildid;

    // for (var i=0; i<that.data.attrs.length; ++i) {
    //   that.data.attrs[i].active =false;
    // }
    //点击按钮的所有子节点先取消 再选中
    var childs = that.data.attrs[e.currentTarget.dataset.propertyindex].children;
    for (var i = 0; i < childs.length; i++) {
      that.data.attrs[e.currentTarget.dataset.propertyindex].children[i].active = false;
      // that.data.goodsDetail.properties[e.currentTarget.dataset.propertyindex].childsCurGoods[i].active = false;
    }

    // 设置当前选中状态
    that.data.attrs[e.currentTarget.dataset.propertyindex].children[e.currentTarget.dataset.propertychildindex].active = true;
    that.selectArr[e.currentTarget.dataset.propertyindex] = that.data.attrs[e.currentTarget.dataset.propertyindex].children[e.currentTarget.dataset.propertychildindex].attrName;
    this.setData({
      attrs: that.data.attrs,
      select_string:that.selectArr.join(",")
    });

    //获取所有的选中规格尺寸数据
    let needSelectNumber = that.data.attrs.length;
    let currentSelectNumber = 0;
    let attrOptionString =[];
    for (var i=0; i<needSelectNumber; ++i) {
      let children = that.data.attrs[i].children;
      for(var j=0; j<children.length; ++j) {
        if(children[j].active) {
          currentSelectNumber++;
          attrOptionString.push(children[j].id);
        }
      }
    }
    if (needSelectNumber == currentSelectNumber) {
      this.data.canSubmit = true;

      let sku = this.data.productskuPriceMap[attrOptionString.join("|")];
      if (sku) {
        this.setData({
          pop_goods_price: sku.unitPrice,       //单品价格
          stock_amount: sku.stockAmount,         //单品库存
          sale_amount: sku.saleAmount,          //单品销售
          single_image: sku.imageSelect,         //单品图片
          productsku: sku                 
        });
      }
    }
   
  },
  /**
  * 加入购物车
  */
  addShopCar: function () {
      if (!this.data.canSubmit) {
        wx.showModal({
          title: '提示',
          content: '请选择商品规格！',
          showCancel: false
        });
        return;
      }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建购物车
    var shopCarInfo = this.bulidShopCarInfo();

    this.setData({
      shopCarInfo: shopCarInfo,
      shopNum: shopCarInfo.shopNum
    });

    // 写入本地存储
    wx.setStorage({
      key: 'shopCarInfo',
      data: shopCarInfo
    })
    this.closePopupTap();
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      duration: 2000
    })

    api.AddCart({
      productId:this.data.productId,
      skuId:shopCarInfo.productSkuId,
      count: shopCarInfo.shopNum
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '数据错误，加入购物车失败',
      })
    }).then(res => {
      if (!res.code || res.code != 200) {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    })

    //shopCarInfo = {shopNum:12,shopList:[]}
  },
	/**
	  * 立即购买
	  */
  buyNow: function () {
    // if (this.data.goodsDetail.properties && !this.data.canSubmit) {
    //   if (!this.data.canSubmit) {
    //     wx.showModal({
    //       title: '提示',
    //       content: '请选择商品规格！',
    //       showCancel: false
    //     })
    //   }
    //   this.bindGuiGeTap();
    //   wx.showModal({
    //     title: '提示',
    //     content: '请先选择规格尺寸哦~',
    //     showCancel: false
    //   })
    //   return;
    // }
    if (this.data.buyNumber < 1) {
      wx.showModal({
        title: '提示',
        content: '购买数量不能为0！',
        showCancel: false
      })
      return;
    }
    //组建立即购买信息
    var buyNowInfo = this.buliduBuyNowInfo();
    // 写入本地存储
    wx.setStorage({
      key: "buyNowInfo",
      data: buyNowInfo
    })
    this.closePopupTap();

    let list = {
      productSkuId: buyNowInfo['productSkuId'],
      count: buyNowInfo['count'],
      realMoney: buyNowInfo['realMoney']
    }
    let AccountList = {
      data:[
        { 
          "id": buyNowInfo['id'],
          "productSkuId": buyNowInfo['productSkuId'], 
          "count": buyNowInfo['count'], 
          "name": buyNowInfo['list'][0]['product']['title'], 
          "image": buyNowInfo['list'][0]['product']['imgPrimaryUrl'],
          "price": buyNowInfo['list'][0]['product']['priceUnderline'],
          "color": "", 
          "size": "" 
        }
      ], 
      trolleyAccount: buyNowInfo['realMoney'] 
    }

    api.addorder(list, 0).then(res => {
      wx.setStorageSync("AccountList", AccountList)
      wx.navigateTo({
        url: `/pages/to-pay-order/index?orderType=buyNow&orderId=${res.data}`
      })
    }).catch(err => {console.error(err)})
  },
  /**
   * 组建购物车信息
   */
  bulidShopCarInfo: function () {
    let data = this.data.productsku;
    let shopCarInfo = this.data.shopCarInfo;
    shopCarInfo['productSkuId'] = data.id
    shopCarInfo['shopNum'] = this.data.buyNumber

    return shopCarInfo

  },
	/**
	 * 组建立即购买信息
	 */
  buliduBuyNowInfo: function () {
    let data = this.data.productsku
    let shopCarInfo = this.data.shopCarInfo;
    shopCarInfo['productSkuId'] = data.id
    shopCarInfo['count'] = this.data.buyNumber
    shopCarInfo['realMoney'] = this.data.buyNumber * data.unitPrice
    shopCarInfo['list'] = this.data.goodsDetail

    return shopCarInfo
    
  },
  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.basicInfo.name,
      path: '/pages/goods-details/index?id=' + this.data.goodsDetail.basicInfo.id + '&inviter_id=' + wx.getStorageSync('uid'),
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
