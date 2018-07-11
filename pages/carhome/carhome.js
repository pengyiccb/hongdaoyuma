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
    cars:[],
    selcar:'请选择',
    selcarIndex:-1,
    carclass:[
      {
        carId:'1',
        name:'宝马'
      },
      {
        carId:'2',
        name:'奔驰'
      },
      {
        carId:'3',
        name:'奥迪'
      },
      {
        carId:'4',
        name:'英菲迪尼'
      }
    ], 
    routers:[
      {
        productclass:'产品1',
        productlist:[
          {
            name:'机油1',
            icon:'/images/image001.png',
            productid:'1'     
          },
          {
            name:'机油2',
            icon:'/images/image002.png',
            productid:'2'
          },
          {
            name:'机油3',
            icon:'/images/image003.png',
            productid:'3'
          },
          {
            name:'机油4',
            icon:'/images/image004.png',
            productid:'4'
          },
          {
            name:'机油5',
            icon:'/images/image005.png',
            productid:'5'
          },
          {
            name:'机油6',
            icon:'/images/image006.png',
            productid:'6'
          },
          {
            name:'机油7',
            icon:'/images/image007.png',
            productid:'7'
          },
          {
            name:'机油8',
            icon:'/images/image008.png',
            productid:'8'
          },
          {
            name:'机油9',
            icon:'/images/image009.png',
            productid:'9'
          },
          {
            name:'机油10',
            icon:'/images/image010.png',
            productid:'10'
          },
          {
            name:'机油11',
            icon:'/images/image011.png',
            productid:'11'
          },
          {
            name:'机油12',
            icon:'/images/image012.png',
            productid:'12'
          },
          {
            name:'机油13',
            icon:'/images/image013.png',
            productid:'13'
          },
          {
            name:'机油14',
            icon:'/images/image014.png',
            productid:'14'
          },
          {
            name:'机油15',
            icon:'/images/image015.png',
            productid:'15'
          },
          {
            name:'机油16',
            icon:'/images/image016.png',
            productid:'16'
          },
          {
            name:'机油17',
            icon:'/images/image017.png',
            productid:'17'
          },
          {
            name:'机油18',
            icon:'/images/image018.png',
            productid:'18'
          },
          {
            name:'机油19',
            icon:'/images/image019.png',
            productid:'19'
          },
          {
            name:'机油20',
            icon:'/images/image020.png',
            productid:'20'
          }
        ]
      },
      {
        productclass:'产品2',
        productlist:[
          {
            name:'机油21',
            icon:'/images/image021.png',
            productid:'21',     
          },
          {
            name:'机油22',
            icon:'/images/image022.png',
            productid:'22'
          },
          {
            name:'机油23',
            icon:'/images/image023.png',
            productid:'23'
          },
          {
            name:'机油24',
            icon:'/images/image024.png',
            productid:'24'
          },
          {
            name:'机油25',
            icon:'/images/image025.png',
            productid:'25'
          },
          {
            name:'机油26',
            icon:'/images/image026.png',
            productid:'26'
          },
          {
            name:'机油27',
            icon:'/images/image027.png',
            productid:'27'
          },
          {
            name:'机油28',
            icon:'/images/image028.png',
            productid:'28'
          },
          {
            name:'机油29',
            icon:'/images/image029.png',
            productid:'29'
          },
          {
            name:'机油30',
            icon:'/images/image030.png',
            productid:'30'
          }
        ]
      }
    ]
  },

  
  selectcat:function(event) {
    console.log("enter selectcat")

    api.getCarKinds({ appId: app.globalData.appId }).catch(err => {
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '数据加载错误',
      })
    }).then(res => {
      console.log(res);
      this.setData({
        carclass: res.data
      })
      this.initCarsData();
    })

    //this.initCarsData();
    
  },

  initCarsData:function(){
      var pinkArray = [];
      for(var i = 0;i<this.data.carclass.length;i++){
        pinkArray.push(this.data.carclass[i].name);
      }
      console.log(pinkArray)
      this.setData({
        cars:pinkArray
      });
      console.log("cars " + this.data.cars);
  },

  bindPickerCarChange:function(event){
    console.log("enter bindPickerCarChange")
    var selIterm = this.data.carclass[event.detail.value];
    this.setData({
      selcar:selIterm.name,
      selcarIndex:event.detail.value,
    })
    //let carId = -1;
    //if (this.data.selcarIndex === -1){
    //  console.log("未选择车型");
    //} else {
    //  console.log(this.data.selcar, this.data.selcarIndex, this.data.carclass[event.detail.value].carId);
      //carId = this.data.carclass[event.detail.value].carId;
    //}

   this.getProductMain(this.data.selcarIndex)
    
    //this.initCarsData()
  },

  getProductMain: function (carId) {

    api.getCarMainProduct({ appId: app.globalData.appId, carId: carId}).catch(err => {
      wx.hideLoading()
      wx.showToast({
        icon: 'none',
        title: '数据加载错误',
      })
    }).then(res => {
      console.log(res);
      this.setData({
        routers: res.data
      })
      //this.initCarsData();
    })
    

  },

  bindSave: function(e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.selectcat();
    this.initCarsData();
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
    console.log("enter onShow.");
    this.selectcat();
    this.getProductMain(this.data.selcarIndex);
    //this.initCarsData();
    //this.getProductList();
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