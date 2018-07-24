// pages/carhome/carhome.js
// const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js');
const api = require('../../utils/api');

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {

    addressInfo: {
      longitude: Number(115.85794),
      latitude: Number(28.68202),
      name: '东湖区南昌市政府(世贸路北)',
      address: '江西省南昌市东湖区世贸路'
    },
    adUrl: [
      '../../images/image1.png',
      '../../images/image1.png',
      '../../images/image1.png'
    ],

    scrollList: [],
    hotList: [],
    recommendList: [],
  
    isBindCar: false, 
    hotTitle: '', 
    displayHot: false,
    recommendTitle: '',
    displayRecommend: false,
    bindCar: {
      carid: 0,
      mainText: '请添加车型',
      secondText: '添加车型后可使用本店更多服务',
      brandImage: '../../images/cardefault.png',
      defaultCar: 1
    },
    indicatorDots: true,
    interval: 5000,
    duration: 1000,
    inputSearch: false,
    searchValue: '',
    carMainText: '大众迈腾·2016款',
    carText: '1.8TSI 智享豪华版',
    carImage: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
    kindsAllInfo: {},
    kindsInfo: {
      gradeId:  1,
      parentId: 0,
      kindlist: [
        {
            kindId: 1,
            name: '洗车美容',
            imageUrl: '../../images/kind0.png',
            sortId: 1
        },
        {
            kindId: 2,
            name: '保养快修',
            imageUrl: '../../images/kind1.png',
            sortId: 2
        },
        {
            kindId: 3,
            name: '套餐卡',
            imageUrl: '../../images/kind2.png',
            sortId: 3
        },
        {
            kindId: 4,
            name: '钣金喷漆',
            imageUrl: '../../images/kind3.png',
            sortId: 4
        },
        {
            kindId: 999,
            name: '更多服务',
            imageUrl: '../../images/kind4.png',
            sortId: 5
        }
      ]
    },
    
    actieveTitleText: '八折热卖',
    actieveInfo: [
      {
        imageUrl: 'http://p9l3k4x4g.bkt.clouddn.com/product1.jpg',
        name: '前位',
        money: 300,
        total: 10
      },
      {
        imageUrl: 'http://p9l3k4x4g.bkt.clouddn.com/product2.jpg',
        name: '前位汽车通用车载车用空气净化器消除异味活性炭过滤器加湿器',
        money: 300,
        total: 10
      },
      {
        imageUrl: 'http://p9l3k4x4g.bkt.clouddn.com/product3.jpg',
        name: '前位汽车通用车载车用空气净化器消除异味活性炭过滤器加湿器',
        money: 300,
        total: 10
      },
      {
        imageUrl: 'http://p9l3k4x4g.bkt.clouddn.com/product4.jpg',
        name: '前位汽车通用车载车用空气净化器消除异味活性炭过滤器加湿器',
        money: 300,
        total: 10
      }
    ],
    currentGradeId: 1,
    currentParentId: 0
  },


  loadKindPage: function(event) {
    var kindId = event.currentTarget.dataset.kindid;
    wx.navigateTo({url: '../group/group?kindId='+kindId})
  },

  bindUserCar:function(event) {

    wx.getUserInfo({
      success: function(res){
        wx.navigateTo({url:'../bindcar/bindcar'})
      },
      fail: function(res){ 
        wx.switchTab({
          url: '/pages/user/user'
        })
        wx.showToast({  
          title: '请先登陆',  
          icon: 'none',  
          duration: 1000  
        })
      }
    })
    
    /*
    if (this.data.isBindCar) {
      this.setData({
        isBindCar: false,
        bindCar: {
          carid: 0,
          mainText: '请添加车型',
          secondText: '添加车型后可使用本店更多服务',
          brandImage: '../../images/cardefault.png',
          defaultCar: 1
        }
      })
    }else {
      this.setData({
        isBindCar: true,
        bindCar: {
          carid: 0,
          mainText: '大众迈腾·2016款',
          secondText: '1.8TSI 智享豪华版',
          brandImage: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
          defaultCar: 1
        }
      })
    }*/
  },

  bindNavigation:function(e) {
    console.log(e)
    var value = e.detail.value
    console.log(value)
    wx.openLocation({
      longitude: this.data.addressInfo.longitude,
      latitude: this.data.addressInfo.latitude,
      name: this.data.addressInfo.name,
      address: this.data.addressInfo.address
    })
  },

  compare:function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }            
    } 
  },

  comparedown:function(prop){
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];if (val1 < val2) {
          return 1;
      } else if (val1 > val2) {
          return -1;
      } else {
          return 0;
      }            
    } 
  },

  scrollImage: function(event) {
    var index = event.currentTarget.dataset.id
    console.log("scrollImage index"+index)
    //跳商品
    if (this.data.scrollList[index].navigateType == -3) {
      wx.navigateTo({
        url: "/pages/detail/detail?id="+this.data.scrollList[index].navigateParam
      });
    //跳分组
    } else if (this.data.scrollList[index].navigateType == -2) {
      wx.navigateTo({url: '../productlist/productlist?groupId='+this.data.scrollList[index].navigateParam})
    }
  },

  bindHot: function(event) {
    var productid = event.currentTarget.dataset.productid
    wx.navigateTo({
      url: "/pages/detail/detail?id="+productid
    });
  },

  inputDetail: function(event) {
    var productid = event.currentTarget.dataset.productid
    wx.navigateTo({
      url: "/pages/detail/detail?id="+productid
    });
  },

  getMainConfigInfo: function(){
    api.getMainConfig({appId: app.globalData.appId}).then(res=>{
      if (res.code && res.code == 200) {
        //console.log("getMainConfigInfo res.data"+JSON.stringify(res.data))
        //遍历整个数组
        var x = 0
        for (x in res.data) {
          var listconfig = res.data[x]
          if (listconfig.cellType == 1) {
            var scroll = listconfig.children
            if (scroll) {
              scroll.sort(this.compare("sortOrder"))
              this.setData({
                scrollList: scroll
              })
            }
          } else if (listconfig.cellType == 2) {

          } else if (listconfig.cellType == 3) {
            var y = 0
            var hot = []
            this.setData({
              hotTitle: listconfig.cellLabel
            })
            for (y in listconfig.children){
              hot.push(listconfig.children[y].product)
            }
            if (hot) {
              hot.sort(this.comparedown("productId"))
              this.setData({
                displayHot: true,
                hotList: hot
              })
            } else {
              this.setData({
                displayHot: false
              })
            }

          } else if (listconfig.cellType == 4) { 
            var y = 0
            var recommend = []
            this.setData({
              recommendTitle: listconfig.cellLabel
            })
            for (y in listconfig.children){
              recommend.push(listconfig.children[y].product)
            }
            if (recommend) {
              recommend.sort(this.comparedown("productId"))
              this.setData({
                displayRecommend: true,
                recommendList: recommend
              })
            } else {
              this.setData({
                displayRecommend: false
              })
            }
          }
        }

        


      }
    })
  },

  getBindMainCar: function() {
    api.getMainBindCar().then(res=>{
      if (res.code && res.code == 200) {
          console.log("getBindMainCar res.data"+JSON.stringify(res.data))
          if (res.data == null || res.data.carId == null || res.data.carId == 0) {
            var bindinfo = {
              carId: 0,
              mainText: '请添加车型',
              secondText: '添加车型后可使用本店更多服务',
              brandImage: '../../images/cardefault.png',
              defaultCar: 0
            }
            this.setData({
              bindCar: bindinfo,
              isBindCar: false
            })
          } else {
            this.setData({
              bindCar: res.data,
              isBindCar: true
            })
          }
      } else {
        var bindinfo = {
          carid: 0,
          mainText: '请添加车型',
          secondText: '添加车型后可使用本店更多服务',
          brandImage: '../../images/cardefault.png',
          defaultCar: 0
        }
        this.setData({
          bindCar: bindinfo,
          isBindCar: false
        })
      }
    })
  },

  getGroupTree: function() {

    api.getGroupTree({appId: app.globalData.appId}).then(res => {

        if (res.code && res.code == 200) {
          var x=0
          var kindInfo = {
            gradeId:  1,
            parentId: 0,
            kindlist: []
          }

          for (x in res.data) {
            kindInfo.kindlist.push({
              kindId: res.data[x].groupId,
              name: res.data[x].name,
              imageUrl: res.data[x].imageUrl,
              sortId: res.data[x].sortOrder
            })
          }

          if (kindInfo.kindlist.length > 0) {
            kindInfo.kindlist.sort(this.compare("sortId"))
          }

          // 如果小于等于5，直接显示
          if (kindInfo.kindlist.length <= 5) { 
            this.setData({
              kindsInfo:  kindInfo
          })
          } else {
            let moreKinds = {
                kindId: kindInfo.kindlist[0].kindId,
                name: '更多服务',
                imageUrl: '../../images/kind4.png',
                sortId: 999 
              }
              let mainKindList = []
              for (var i = 0; i < 4; i++){
                mainKindList = [...mainKindList, kindInfo.kindlist[i]]
              }
              mainKindList = [...mainKindList, moreKinds]
              kindInfo.kindlist = mainKindList
              this.setData({
                kindsInfo:  kindInfo
              })
          }
        } else {
          var kindInfo = {
            gradeId:  1,
            parentId: 0,
            kindlist: []
          }
          this.setData({
            kindsInfo:  kindInfo
          })
        }
    })

  },

  getKindsList: function() {
      
      api.getKindsList({parentId: this.data.currentParentId, gradeId: this.data.currentGradeId}).then(res => {
        if (res.code && res.code == 200) {

          // 排序
          if ( res.data.kindlist && res.data.kindlist.length > 0){
            res.data.kindlist.sort(this.compare("sortId"))
          }
          this.setData({
            kindsAllInfo:  res.data
          })

          // 如果小于等于5，直接显示
          if (res.data.kindlist.length <= 5) { 
            this.setData({
              kindsInfo:  res.data
            })
          //如果大于5，只显示4个加一个更多
          } else {
            let moreKinds = {
              kindId: res.data.kindlist[0].kindId,
              name: '更多服务',
              imageUrl: '../../images/kind4.png',
              sortId: 5 }
            let mainKindList = []
            for (var i = 0; i < 4; i++){
              mainKindList = [...mainKindList, res.data.kindlist[i]]
            }
            mainKindList = [...mainKindList, moreKinds]
            res.data.kindlist = mainKindList
            this.setData({
              kindsInfo:  res.data
            })
          }
          //console.log("getKindsList success."+ JSON.stringify(res.data))    
          //console.log("getKindsList "+JSON.stringify(this.data.kindsInfo))
        } else {
        
        }
      })
  },

  startInputSearch: function(event) {
    this.setData({
      inputSearch: true
    })
  },

  endInputSearch: function(event) {

    this.setData({
      inputSearch: false,
      searchValue: ''
    })
  },

  tapKinds: function(event) {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if(options.productId){
      wx.navigateTo({
        url: "/pages/detail/detail?id=" + options.productId
      });
    }
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
    this.getBindMainCar()
    this.getGroupTree()
    this.getMainConfigInfo()
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