//index.js
var app = getApp()
const api = require('../../utils/api');
Page({
  data: {
    isEmpty: true,          //购物车是否空
    totalPrice:0,           //总价
    allSelect:false,         //是否全选
    noSelect:true,         //是否选择
    list:[],                //商品列表
    hideShopPopup: true,    //弹出窗口是否隐藏
    attrs:[],               //商品属性
    single_image: "",       //商品图片
    pop_goods_price: 0,     //商品价格
    stock_amount: 0,        //商品库存
    select_string: 0,       //商品规格名称
    skuId: 0,
    delBtnWidth:120,    //删除按钮宽度单位（rpx）
    productskuPriceMap : [], //单品数据价格表
    productsku:{}, //选中的单品数据
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车
    selAttr: [],
    curIndex: 0
  },

  onPullDownRefresh: function(){
    this.getTrolley();
    /* wx.stopPullDownRefresh(); */
  },
 
 //获取元素自适应后的实际宽度
  getEleWidth:function(w){
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750/2)/(w/2);  //以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res/scale);
      return real;
    } catch (e) {
      return false;
     // Do something when catch error
    }
  },
  initEleWidth:function(){
    var delBtnWidth = this.getEleWidth(120);
    this.setData({
      delBtnWidth:delBtnWidth
    });
  },
  /* onLoad: function () {
      this.initEleWidth();
      this.onShow();
  }, */

  getTrolley(){
    let that = this;
    wx.showLoading({
      title: '加载购物车数据...',
    })

    api.CarList({ }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      if (res.code && res.code == 200) {
        that.data.list = res.data;
        that.setGoodsList(res.data);
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    });
  },

  onShow: function(){
    var that = this;
    wx.getUserInfo({
      success: function(res){
        that.initEleWidth();
        that.getTrolley();
      },
      fail: function(res){
        wx.switchTab({
          url: '/pages/user/user'
        });
        wx.showToast({
          icon: 'none',
          title: '请先登录',
        })
      }
    });      
  },
  toIndexPage:function(){
      wx.switchTab({
            url: "/pages/carhome/carhome"
      });
  },

  touchS:function(e){
    if(e.touches.length==1){
      this.setData({
        startX:e.touches[0].clientX
      });
    }
  },
  touchM:function(e){
  var index = e.currentTarget.dataset.index;

    if(e.touches.length==1){
      var moveX = e.touches[0].clientX;
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var left = "";
      if(disX == 0 || disX < 0){//如果移动距离小于等于0，container位置不变
        left = "left:0px";
      }else if(disX > 0 ){//移动距离大于0，container left值等于手指移动距离
        left = "left:-"+disX+"px";
        if(disX>=delBtnWidth){
          left = "left:-"+delBtnWidth+"px";
        }
        /* left = "left:-60px"; */
      }
      var list = this.data.list;
      if(index!="" && index !=null){
        list[parseInt(index)].left = left; 
        this.setGoodsList(list);
      }
    }
  },

  touchE:function(e){
    var index = e.currentTarget.dataset.index;    
    if(e.changedTouches.length==1){
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;      
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth/2 ? "left:-"+delBtnWidth+"px":"left:0px";
      var list = this.data.list;
     if(index!=="" && index != null){
        list[parseInt(index)].left = left; 
        this.setGoodsList(list);
      }
    }
  },

  closePopupTap: function () {
    this.setData({
      hideShopPopup: true,
    });
  },

  selectSpec: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.data.curIndex = parseInt(index);
    var list = this.data.list;
    this.data.selAttr = [];
    this.data.selAttr = list[parseInt(index)].spec.split("|");
    api.GetProductDetail({ productId: list[parseInt(index)].productId }).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      if(res.code && res.code == 200){
        that.setData({
          attrs : res.data.attrs
        });

        for(let i = 0; i < that.data.attrs.length; i++){
          for(let j = 0; j < that.data.attrs[i].children.length; j++){
            var children = that.data.attrs[i].children[j];
            for(let k = 0; k < that.data.selAttr.length; k++)
              if(children.attrName == that.data.selAttr[k]){
                children.active = true;
              }
          }
        }

        that.setData({
          attrs: that.data.attrs,
          select_string: that.data.selAttr.join(",")
        });

        api.getProductDetailList({
          productId: list[parseInt(index)].productId,
        }).catch(res => {
          wx.showToast({
            icon: 'none',
            title: '网络数据错误',
          })
        }).then(res => {
          if(res.code && res.code == 200){
            let productskuPriceMap = that.data.productskuPriceMap;
            res.data.forEach(element => {
              productskuPriceMap[element.attrOption] = element;
            });

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
        })
      }
    });

    this.setData({
      hideShopPopup: false,
    });
  },

  labelItemTap: function (e) {
    var that = this;

    //点击按钮的所有子节点先取消 再选中
    var childs = that.data.attrs[e.currentTarget.dataset.propertyindex].children;
    for (var i = 0; i < childs.length; i++) {
      that.data.attrs[e.currentTarget.dataset.propertyindex].children[i].active = false;
    }

    // 设置当前选中状态
    that.data.selAttr = [];
    that.data.attrs[e.currentTarget.dataset.propertyindex].children[e.currentTarget.dataset.propertychildindex].active = true;
    for(let i = 0; i < that.data.attrs.length; i++){
      for(let j = 0; j < that.data.attrs[i].children.length; j++){
        var children = that.data.attrs[i].children[j];
        if(children.active){
          that.data.selAttr.push(children.attrName);
        }
      }
    }

    this.setData({
      attrs: that.data.attrs,
      select_string:that.data.selAttr.join(",")
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

  onOKButton: function(){
    if (!this.data.canSubmit) {
      wx.showModal({
        title: '提示',
        content: '请选择商品规格！',
        showCancel: false
      });
      return;
    }
    let that = this;
    var list = that.data.list;
    console.log(list);
    api.ModifyCart({itemId: list[that.data.curIndex].itemId, skuId: that.data.skuId}).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      if(res.code && res.code == 200){
        list[that.data.curIndex].spec = that.data.selAttr.join("|");
        that.setGoodsList(list);

        that.setData({
          hideShopPopup: true,
        });
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        });
      }
    });
  },

  stopTap: function(){
  },

  delItem:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    api.DelCart({},list[parseInt(index)].itemId).catch(res => {
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res =>{
      if(res.code && res.code == 200){
        list.splice(index,1);
        that.setGoodsList(list);
      }
    });    
  },
  selectTap:function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    if(index!=="" && index != null){
        list[parseInt(index)].active = !list[parseInt(index)].active ; 
        this.setGoodsList(list);
      }
   },
   getTotalPrice:function(){
      var list = this.data.list;
      var total = 0;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(curItem.active){
            total+= parseFloat(curItem.unitPrice)*curItem.count;
          }
      }
      total = parseFloat(total.toFixed(2));//js浮点计算bug，取两位小数精度
      return total;
   },
   getAllSelect:function(){
      var list = this.data.list;
      var allSelect = false;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(curItem.active){
            allSelect = true;
          }else{
             allSelect = false;
             break;
          }
      }
      return allSelect;
   },
   getNoSelect:function(){
      var list = this.data.list;
      var noSelect = 0;
      for(var i = 0 ; i < list.length ; i++){
          var curItem = list[i];
          if(!curItem.active){
            noSelect++;
          }
      }
      if(noSelect == list.length){
         return true;
      }else{
        return false;
      }
   },
   setGoodsList:function(list){
     var bEmpty = list.length > 0 ? false: true;
     this.setData({
          list:list,
          totalPrice:this.getTotalPrice(),
          allSelect:this.getAllSelect(),
          noSelect:this.getNoSelect(),
          isEmpty: bEmpty
      });
   },
   bindAllSelect:function(){
      var currentAllSelect = this.data.allSelect;
      var list = this.data.list;
      if(currentAllSelect){
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = false;
        }
      }else{
        for(var i = 0 ; i < list.length ; i++){
            var curItem = list[i];
            curItem.active = true;
        }
      }
      this.setGoodsList(list);
   },

   jiaBtnTap:function(e){
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = that.data.list;
    if(index!=="" && index != null){
      var carShopBean = list[parseInt(index)];
      var itemCount = carShopBean.count + 1;
      api.ModifyCart({itemId: carShopBean.itemId, count: itemCount}).catch(res => {
        wx.showToast({
          icon: 'none',
          title: '网络数据错误',
        })
      }).then(res =>{
        if(res.code && res.code == 200){
          list[parseInt(index)].count = itemCount;
          that.setGoodsList(list);
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        }
      });
    }
   },

   jianBtnTap:function(e){
    var that = this
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    if(index!=="" && index != null){
      if(list[parseInt(index)].count > 1){
        list[parseInt(index)].count-- ;
        that.setGoodsList(list);
        api.ModifyCart({itemId: list[parseInt(index)].itemId, count: list[parseInt(index)].count}).catch(res => {
          wx.showToast({
            icon: 'none',
            title: '网络数据错误',
          })
        }).then(res =>{
          if(res.code && res.code == 200){
          }else{
            wx.showToast({
              icon: 'none',
              title: res.msg,
            })
          }
        });
      }
    }
   },

    toPayOrder:function(){
      wx.showLoading();
      var that = this;
      if (this.data.noSelect) {
        wx.hideLoading();
        return;
      }
      // 重新计算价格，判断库存
      var shopList = [];
      shopList = this.data.list.filter(entity => {
        return entity.active;
      });
      if (shopList.length == 0) {
        wx.hideLoading();
        return;
      }
      var isFail = false;
      var doneNumber = 0;
      var needDoneNUmber = shopList.length;
      for (let i =0; i < shopList.length; i++) {
        if (isFail) {
          wx.hideLoading();
          return;
        }
        let carShopBean = shopList[i];

        api.CarVerify({itemId: carShopBean.itemId}).catch(res => {
          wx.showToast({
            icon: 'none',
            title: '网络数据错误',
          })
        }).then(res => {
          if(res.code && res.code == 200){
            //商品已失效
            if(res.data.delFlag == 1){
                wx.showModal({
                  title: '提示',
                  content: carShopBean.desc + ' 商品已失效，请重新购买',
                  showCancel:false
                });
                isFail = true;
                wx.hideLoading();
                return;
            }
            
            if(carShopBean.unitPrice != res.data.unitPrice){
              wx.showModal({
                title: '提示',
                content: carShopBean.desc + ' 价格有调整，请重新购买',
                showCancel:false
              });
              isFail = true;
              wx.hideLoading();
              return;
            }

            if(carShopBean.count > res.data.stockAmount){
              wx.showModal({
                title: '提示',
                content: carShopBean.desc + ' 库存不足，请重新购买',
                showCancel:false
              })
              isFail = true;
              wx.hideLoading();
              return;
            }
            doneNumber++;
            if (needDoneNUmber == doneNumber) {
              var goodData = {};
              goodData.list = shopList;
              //goodData.totalPrice = that.getTotalPrice();
              wx.setStorageSync('goodData', goodData);
              that.navigateToPayOrder();
            }
          }
        });
      }
    },
    navigateToPayOrder:function () {
      wx.hideLoading();
      wx.navigateTo({
        url:"/packageA/to-pay-order/index?typeId=1"
      })
    }
})
