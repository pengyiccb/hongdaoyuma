//index.js
//获取应用实例
var app = getApp();
const api = require('../../utils/api');
let animationShowHeight = 300;

Page({
  data: {
    autoplay: true,
    interval: 3000,
    duration: 500,
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
    bAccept: false,
    bSharePopop: false,
    maskHidden: true,
    imageList: [],

    
    propertyChildIds: "",
    propertyChildNames: "",
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车

    productskuPriceMap : [], //单品数据价格表
    productsku:{}, //选中的单品数据

    shopCarInfo: {},
    shopType: "addShopCar",//购物类型，加入购物车或立即购买，默认为加入购物车
    attrCount: 0,
    promotionList: [],
    showBottomPopup: false
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

    wx.getUserInfo({
      success: function(res){
        that.setData({
          bAccept: true
        });
        // wx.showLoading();
        app.globalData.userInfo = res.userInfo;
        api.loginToServer({
          data:{
            userInfo: res.userInfo,
            "appId": app.globalData.appId
          },
          success: (res) => {
            // wx.hideLoading();
            if(res.code && res.code == 200){              
            }else{
              wx.showToast({
                icon: 'none',
                title: res.msg,
              })
            }            
          },
          fail: (res) => {
            // wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '网络数据错误',
            });
          }
        });
      },
      fail: function(res){
        that.setData({
          bAccept: false
        });
      }
    });
  },

  onLoad: function (e) {
    var that = this;
    this.setData({
      productId: e.id
    });

    api.getProductPromotion({ productId: e.id }).catch(response => {
      wx.showToast({
        icon: 'none',
        title: '活动数据获取错误',
      })
    }).then(response => {
      if (response.code && response.code === 200) {
        console.log(response)
        response.data.forEach(promotion => {
          //解析对象
          promotion.ruleStrategy = JSON.parse(promotion.ruleStrategy);
          if (promotion.ruleType === 1) { //满减活动
            //把规则改成描述
            // promotion.ruleStrategyDescription = promotion.ruleStrategy
            promotion.ruleStrategyDescription = promotion.ruleStrategy.map(strategy => '满'+ strategy.full + '元减' + strategy.reduction + '元')
            console.log(promotion.ruleStrategyDescription);
          }
        });

        this.setData({
          promotionList: response.data
        })
      }
    });
    api.GetProductDetail({ productId: e.id }).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      if(res.code && res.code == 200){
        this.setData({
          goodsDetail: res.data.product,
          attrs : res.data.attrs,
          single_image: res.data.product.imgPrimaryList[0].url,
        });

        this.data.goodsDetail.imgDescList.forEach(item => {
          this.data.imageList.push(item.url);
        });

        this.data.goodsDetail.imgSpecList.forEach(item => {
          this.data.imageList.push(item.url);
        });
  
        wx.setNavigationBarTitle({
          title: that.data.goodsDetail.title
        });
  
        api.getProductDetailList({
          productId: that.data.goodsDetail.id,
        }).catch(res => {
          wx.showToast({
            icon: 'none',
            title: '网络数据错误',
          })
        }).then(res=>{
          if(res.code && res.code == 200){
            let productskuPriceMap = this.data.productskuPriceMap;
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
    });
  
  },
  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },

  closeCanvas: function () {
    this.setData({
      maskHidden: true
    });
  },

  onSwiperPreview: function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.goodsDetail.imgPrimaryList.map(item => {
        return item.url;
      })
    });
  },

  onImagePreview: function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: this.data.imageList
    });
  },

  onThumbnailPreview: function(e){
    wx.previewImage({
      current: this.data.single_image,
      urls: [this.data.single_image]
    });
  },

  stopClick: function(){
  },

  baocun:function(){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        that.setData({
          maskHidden: true
        });
        wx.showToast({
          icon: 'none',
          title: '图片保存成功',
        });
      },
      fail(res){
        that.setData({
          maskHidden: true
        });
        wx.showToast({
          icon: 'none',
          title: '图片保存失败',
        })
      }
    })
  },

  //分享朋友圈
  onShareSpace: function(){
    var that = this;
    this.setData({
      hideShopPopup: true,
      maskHidden: true
    });
    wx.showLoading({
      title: '海报生成中...'
    });

    wx.downloadFile({
      url: that.data.goodsDetail.shareImage.url,
      success: function(res){
        var context = wx.createCanvasContext('mycanvas');
        context.setFillStyle("#ffffff")
        context.fillRect(0, 0, 750, 1334);
        
        context.drawImage(res.tempFilePath, 28, 70, 686, 686);

        context.font = "36px PingFang SC";
        context.setFillStyle('#333333');
        context.setTextAlign('left');
    
        var temp = '';
        var row = [];
        var chr = that.data.goodsDetail.sharetitle.split('');
        for(var i = 0; i < chr.length; i++){
          if (context.measureText(temp).width < 686) {
            temp += chr[i];
          }else{
            i--
            row.push(temp);
            temp = '';
          }
        }
        row.push(temp);
        if(row.length > 2){
          var rowCut = row.slice(0, 2);
          var rowPart = rowCut[1];
          var test = '';
          var empty = [];
          for (var j = 0; j < rowPart.length; j++){
            if (context.measureText(test).width < 600) {
              test += rowPart[j];
            }
            else {
              break;
            }
          }
          empty.push(test);
          var group = empty[0] + "...";
          rowCut.splice(1, 1, group);
          row = rowCut;
        }
        for(var k = 0; k < row.length; k++){
          context.fillText(row[k], 28, 846 + k * 60, 686);
        }

        context.font = "60px bold PingFang SC";
        context.setFillStyle('#fe403b');
        context.setTextAlign('left');
        context.fillText("￥ " + that.data.price_section, 28, 1002, 686);

        var data = {};
        data.scene = that.data.productId;
        data.page = "pages/carhome/carhome";
        data.width = 180;
        data.is_hyaline = true;
        data.appId = app.globalData.appId;
        api.getQR(data).catch(res => {
          wx.showToast({
            icon: 'none',
            title: '网络数据错误',
          })
        }).then(res01 => {
          if(res01.code && res01.code == 200){
            wx.downloadFile({
              url: res01.data.url,
              success: function(res02){
                context.drawImage(res02.tempFilePath, 286, 1100, 160, 160);

                context.font = "18px PingFang SC";
                context.setFillStyle('#9b9b9b');
                context.setTextAlign('left');
                context.fillText("扫描或长按小程序码", 291, 1290, 160);

                context.draw();
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'mycanvas',
                    success: function (res03) {
                      wx.hideLoading();
                      var tempFilePath = res03.tempFilePath;
                      that.setData({
                        imagePath: tempFilePath,
                        maskHidden: false
                      });
                    },
                    fail: function (err) {
                      wx.hideLoading();
                      wx.showLoading({
                        title: '海报生成失败'
                      });
                    }
                  });
                }, 500);
              },
              fail: function(err){
                wx.showToast({
                  icon: 'none',
                  title: err.errMsg,
                });
              }
            });
          }else{
            wx.showToast({
              icon: 'none',
              title: res01.msg,
            })
          }
        });        
      },
      fail: function(err){
        wx.showToast({
          icon: 'none',
          title: err.errMsg,
        })
      }
    });    
  },

  //分享
  onShare: function(){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear"

    });

    this.animation = animation;
    animation.bottom(-100).step();
    this.setData({
      bSharePopop: true,
      hideShopPopup: false,
      animationData: animation.export()
    });

    setTimeout(function(){
      animation.bottom(0).step();
      this.setData({
        animationData: animation.export()
      });
    }.bind(this), 100);
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
      url: "/pages/shop-cart/index"
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

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear"

    });

    this.animation = animation;
    animation.top(1000).step();
    this.setData({
      bSharePopop: false,
      hideShopPopup: false,
      animationData: animation.export()
    });

    setTimeout(function(){
      animation.top(100).step();
      this.setData({
        animationData: animation.export()
      });
    }.bind(this), 100);
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

  onTapLogin: function(e){
    this.onShow();
    /* if(e.detail.userInfo){
      this.setData({
        bAccept: true
      });

      app.globalData.userInfo = e.detail.userInfo;
      api.loginToServer({
        data:{
          userInfo: e.detail.userInfo,
          "appId": app.globalData.appId
        },
        success: (res) => {
          if(res.code && res.code == 200){
          }else{
            wx.showToast({
              icon: 'none',
              title: res.msg,
            })
          }            
        },
        fail: (res) => {
          wx.showToast({
            icon: 'none',
            title: '网络数据错误',
          });
        }
      });
    }else{
      this.setData({
        bAccept: false
      });
    } */
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
      url:"../to-pay-order/index?typeId=2"
    })
  },

  onShareAppMessage: function () {
    return {
      title: this.data.goodsDetail.sharetitle,
      path: '/pages/carhome/carhome?productId=' + this.data.productId,
      imageUrl: this.data.goodsDetail.shareImage.url,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
