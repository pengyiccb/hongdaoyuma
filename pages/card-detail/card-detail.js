const api = require('../../utils/api');
const posVal = ["24rpx", "435rpx"];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bottomVal: "24rpx",
    keybordShow: false,
    keybordType: 1,
    cityName: '赣',
    carNumber: '',
    cardColor: "rgb(255, 255, 255)",
    cardName: '',
    cardBuyTime: '',
    isRunOut: false,
    cardItemList: [],
    noSelect: true,
    bIsHidePopup: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.id){
      this.cardId = options.id;
    }
  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    if(this.cardId){
      api.getCardDetail({packageId: this.cardId}).catch(res => {
        wx.showToast({
          icon: 'none',
          title: '网络数据错误',
        })
      }).then(res => {
        if(res.code && res.code == 200){
          that.setData({
            cardName: res.data.packageInfo.packageName,
            cardBuyTime: res.data.packageInfo.packageBuyTime,
            cardColor: res.data.packageInfo.colorString,
            cardItemList: res.data.itemList,
            noSelect: true
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
        title: '卡id错误',
      })
    }
  },

  getNoSelect:function(){
    var list = this.data.cardItemList;
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

  onSelectItem: function(e){
    var index = e.currentTarget.dataset.index;
    var list = this.data.cardItemList;
    if(index!=="" && index != null){
        if(list[parseInt(index)].itemRemainingTimes > 0){
          list[parseInt(index)].active = !list[parseInt(index)].active ; 
          this.setItemList(list);
        }        
      }
  },

  serviceSubmit: function(){
    var that = this;
    if(this.data.noSelect){
      return;
    }
    if(this.data.carNumber.length < 6){
      wx.showToast({
        icon: 'none',
        title: '请输入正确车牌号',
      });
      return;
    }
    this.setData({
      bottomVal: posVal[0],
      keybordShow: false,
    });
    var data = {};
    var carNo = this.data.cityName + this.data.carNumber;
    data.userRemark = carNo;
    data.userPackageId = this.cardId;
    data.itemIdList = [];
    var list = this.data.cardItemList;
    for(var i = 0; i < list.length;i++){
      if(list[i].active){
        var item = {};
        item.itemId = list[i].itemId;
        item.amount = 1;
        data.itemIdList.push(item);
      }
    }

    wx.showLoading();
    api.serviceSubmit(data).catch(res => {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '网络数据错误',
      })
    }).then(res => {
      wx.hideLoading();
      if(res.code && res.code == 200){
        wx.showToast({
          icon: 'none',
          title: '预约成功',
          success: function(){
            wx.navigateTo({
              url:"/pages/shopRecord/shopRecord"
            })
          }
        });
        that.onShow();
      }else{
        wx.showToast({
          icon: 'none',
          title: res.msg,
        })
      }
    });
  },

  setItemList: function(list){
     this.setData({
        cardItemList:list,
        noSelect:this.getNoSelect()
      });
  },

  inputCarNum: function(){
    this.setData({
      bottomVal: posVal[1],
      keybordType: 2,
      keybordShow: true
    });
  },

  selectCity: function(){
    this.setData({
      bottomVal: posVal[1],
      keybordType: 1,
      keybordShow: true
    });
  },

  inputChange: function(res){
    if(this.data.keybordType == 1){
      this.setData({
        bottomVal: posVal[0],
        cityName: res.detail,
        keybordShow: false,
      });
    }else{
      if(this.data.carNumber.length < 6){
        this.data.carNumber += res.detail;
        this.setData({
          carNumber: this.data.carNumber
        });
      }
    }
  },

  inputdelete: function(){
    if(this.data.carNumber.length > 0){
      var carNumber = this.data.carNumber;
      carNumber = carNumber.substring(0, carNumber.length - 1);
      this.setData({
        carNumber: carNumber
      });
    }
  },

  inputOk: function(){
    this.setData({
      bottomVal: posVal[0],
      keybordShow: false,
    });
  },

  showCardInfo: function(){
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear"
    });
    this.animation = animation;
    animation.height(0).step();
    this.setData({
      bIsHidePopup: false,
      animationData: animation.export()
    });
  },
  hideCardInfo:function(event){
    this.setData({
        bIsHidePopup: true
    })
  },
})