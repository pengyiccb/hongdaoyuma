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
    skuId: 0,

    
    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车

    productskuPriceMap : [], //单品数据价格表
    productsku:{}, //选中的单品数据

    shopCarInfo: {},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
    attrCount: 0
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
    var that = this;
    this.setData({
      productId: e.id
    });

    api.GetProductDetail({ productId: e.id }).then(res => {
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
        if (res.code && res.code==200) {
          that.data.attrCount = res.data.length;
          res.data.forEach(element => {
            productskuPriceMap[element.attrOption] = element;
          });
          let pirceList = res.data.map(e => {return e.unitPrice});
          let max = Math.max.apply(null, pirceList);
          let min = Math.min.apply(null, pirceList);
          if(max != min){
            this.setData({ price_section: min + "-" + max});
          }else{
            this.setData({ price_section: max});
          }
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
    if(this.data.canSubmit){
      this.buyNow();
    }else{
      this.setData({
        shopType: "tobuy",
        isOkButton: true
      });
      this.bindGuiGeTap();
    }
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    var selAttr = [];
    if(this.data.attrCount == 1){
      for(let i = 0; i < this.data.attrs.length; i++){
        for(let j = 0; j < this.data.attrs[i].children.length; j++){
          var children = this.data.attrs[i].children[j];
          children.active = true;
          selAttr.push(children.attrName);
        }
      }
      this.setData({
        attrs: this.data.attrs,
        select_string:selAttr.join(",")
      });

      //获取所有的选中规格尺寸数据
      let needSelectNumber = this.data.attrs.length;
      let currentSelectNumber = 0;
      let attrOptionString =[];
      for (var i=0; i<needSelectNumber; ++i) {
        let children = this.data.attrs[i].children;
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
            skuId: sku.id         
          });
        }
      }
    }
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

  labelItemTap: function (e) {
    var that = this;

    //点击按钮的所有子节点先取消 再选中
    var childs = that.data.attrs[e.currentTarget.dataset.propertyindex].children;
    for (var i = 0; i < childs.length; i++) {
      that.data.attrs[e.currentTarget.dataset.propertyindex].children[i].active = false;
    }

    // 设置当前选中状态
    var selAttr = [];
    that.data.attrs[e.currentTarget.dataset.propertyindex].children[e.currentTarget.dataset.propertychildindex].active = true;
    for(let i = 0; i < that.data.attrs.length; i++){
      for(let j = 0; j < that.data.attrs[i].children.length; j++){
        var children = that.data.attrs[i].children[j];
        if(children.active){
          selAttr.push(children.attrName);
        }
      }
    }

    this.setData({
      attrs: that.data.attrs,
      select_string:selAttr.join(",")
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
          skuId: sku.id         
        });
      }
    }
   
  },
  /**
  * 加入购物车
  */
  addShopCar: function () {
    var that = this;
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

    if(this.data.stock_amount < 1){
      wx.showModal({
        title: '提示',
        content: '库存数量为0！',
        showCancel: false
      })
      return;
    }

    api.AddCart({
      productId: that.data.productId,
      skuId: that.data.skuId,
      count: that.data.buyNumber
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '数据错误，加入购物车失败',
      })
    }).then(res => {
      if (res.code && res.code == 200) {
        that.closePopupTap();
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    })

    //shopCarInfo = {shopNum:12,shopList:[]}
  },

  buyNow: function () {
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

    if(this.data.stock_amount < 1){
      wx.showModal({
        title: '提示',
        content: '库存数量为0！',
        showCancel: false
      })
      return;
    }

    var goodData = {};
    var shopData = {};
    var list = this.data.select_string.split(",");
    shopData.image = this.data.single_image;
    shopData.desc = this.data.goodsDetail.sharetitle;
    shopData.spec = list.join("|");
    shopData.unitPrice = this.data.pop_goods_price;
    shopData.count = this.data.buyNumber;
    shopData.skuId = this.data.skuId;
    goodData.list = [];
    goodData.list.push(shopData);
    wx.setStorageSync('goodData', goodData);
    this.closePopupTap();
    wx.navigateTo({
      url:"/pages/to-pay-order/index?typeId=2"
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.sharetitle,
      path: '/pages/carhome/carhome?productId=' + this.data.productId,
      imageUrl: this.data.goodsDetail.imgPrimaryList[0],
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
