// pages/group/group.js
const config = require('../../config.js');
const api = require('../../utils/api');

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputSearch: false,
    secondkindsData: true,
    searchValue: '',
    selectKinds: 1,
    groupTree: {},

    mainKindsInfo: {
    /*    gradeId:  1,
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
          }
        ]*/
    },

    secondKindsInfo: {
     /*   gradeId:  1,
        parentId: 0,
        kindlist: [
          {
              kindId: 100,
              name: '刹车片',
              imageUrl: 'http://p9l3k4x4g.bkt.clouddn.com/car_brakeblock.png',
              sortId: 1
          },
          {
              kindId: 101,
              name: '刹车片',
              imageUrl: 'http://p9l3k4x4g.bkt.clouddn.com/car_brakeblock.png',
              sortId: 2
          },
          {
              kindId: 102,
              name: '刹车片',
              imageUrl: 'http://p9l3k4x4g.bkt.clouddn.com/car_brakeblock.png',
              sortId: 3
          },
          {
              kindId: 103,
              name: '刹车片',
              imageUrl: 'http://p9l3k4x4g.bkt.clouddn.com/car_brakeblock.png',
              sortId: 4
          }
        ]*/
      },
    
  },

  selectKind: function(event) {
    console.log("zhoubin tapKinds"+event.currentTarget.dataset.id)
    this.setData({
        selectKinds:    event.currentTarget.dataset.id
    })
    this.initSecondKind()
    //this.getSecondKindsList()
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

  getGroupTree: function() {
    wx.showLoading({})
    api.getGroupTree({appId: app.globalData.appId}).catch(err => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '网络数据错误',
        })
    }).then(res => {
        //
        wx.hideLoading();
        if (res.code && res.code == 200) {
            res.data.sort(this.compare("sortOrder"))
            this.setData({
                groupTree:  res.data
            })
        } else {
            this.setData({
                groupTree:  []
            })
        }
        this.initMainKind()
        this.initSecondKind()
    })
  },

  initMainKind: function() {
    var x = 0
    var maingroup = {
        gradeId:  0,
        parentId: 0,
        kindlist: []
    }
    for (x in this.data.groupTree) {
        var groupinfo = this.data.groupTree[x]
        maingroup.kindlist.push({
            kindId: groupinfo.groupId,
            name: groupinfo.name,
            imageUrl: groupinfo.imageUrl,
            sortId: groupinfo.sortOrder
        })
    }
    this.setData({
        mainKindsInfo: maingroup
    })
  },

  initSecondKind: function() {
    var x = 0, y = 0 
    for (x in this.data.groupTree) {
        if (this.data.groupTree[x].groupId == this.data.selectKinds) {
            var groupinfo = this.data.groupTree[x]
            var secondKinds = {
                gradeId:  1,
                parentId: this.data.selectKinds,
                kindlist: []
            }
            if (groupinfo.children == null || groupinfo.children.length <= 0) {
                this.setData({
                    secondKindsInfo: secondKinds,
                    secondkindsData: false
                })
                return
            }

            groupinfo.children.sort(this.compare("sortOrder"))
            
            
            for (y in groupinfo.children) {

                secondKinds.kindlist.push({
                    kindId: groupinfo.children[y].groupId,
                    name: groupinfo.children[y].name,
                    imageUrl: groupinfo.children[y].imageUrl,
                    sortId: groupinfo.children[y].sortOrder
                })
            }
    
            this.setData({
                secondKindsInfo: secondKinds,
                secondkindsData: true
            })
            return
 
        }
    }
  },

  getSecondKindsList: function() {
    api.getKindsList({parentId: this.data.selectKinds, gradeId: 1}).then(res => {
        if (res.code && res.code == 200) {
          // 排序
          if (res.data.kindlist && res.data.kindlist.length > 0){
            res.data.kindlist.sort(this.compare("sortId")) 
            this.setData({
              secondkindsData: true
            })
         } else{
            this.setData({
                secondkindsData: false
              })
         }        
          this.setData({
            secondKindsInfo:  res.data
          })

          

        } else {
          console.log("getKindsList failed."+ JSON.stringify(res.data))
        }
      })
  },

  getAllKindsList: function() {
      
      api.getKindsList({parentId: 0, gradeId: 0}).then(res => {
        if (res.code && res.code == 200) {

          // 排序
          if (res.data.kindlist && res.data.kindlist.length > 0){
            res.data.kindlist.sort(this.compare("sortId")) 
          }
          this.setData({
            mainKindsInfo:  res.data
          })

        } else {
          console.log("getKindsList failed."+ JSON.stringify(res.data))
        }
      })
  },

  startInputSearch: function(event) {
    console.log("zhoubin")
    this.setData({
      inputSearch: true
    })
  },

  endInputSearch: function(event) {
    console.log("zhoubin end"+event.detail.value)

    this.setData({
      inputSearch: false,
      searchValue: ''
    })
  },

  selectOneKind: function(event) {
    let kindId = event.currentTarget.dataset.kindid;
    wx.navigateTo({url: '../productlist/productlist?groupId='+kindId})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;

    this.setData({
        selectKinds: options.kindId
    });
    this.getGroupTree()
    //this.getAllKindsList()
    //this.getSecondKindsList()

    console.log("onLoad "+ this.data.currentKindId)
    
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
  /* onShareAppMessage: function () {
    let that =this;
    return {
        title: '闲约·红道御马',
        path: '/pages/carhome/carhome',
        imageUrl: "/images/image1.png",
        success: (res) => {
            wx.showToast({  
                title: '转发成功',  
                icon: 'none',  
                duration: 1000  
            })
        },
        fail: (res) => {
            wx.showToast({  
                title: '转发失败',  
                icon: 'none',  
                duration: 1000  
            })
        }
    }
  } */
})