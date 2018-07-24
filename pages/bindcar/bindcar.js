// pages/bindcar/bindcar.js
const config = require('../../config.js');
const api = require('../../utils/api');

var app = getApp()
Page({
 data: {
    haveDefaultCar: true,
    bindCarList: [
        /*{
            carid: 1,
            mainText: '大众迈腾·2016款',
            secondText: '1.8TSI 智享豪华版',
            brandImage: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            defaultCar: 0
        },
        {
            carid: 2,
            mainText: '大众迈腾·2016款',
            secondText: '1.8TSI 智享豪华版',
            brandImage: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            defaultCar: 1
        }*/
    ],
    startX: 0, //开始坐标
    startY: 0
  },

  getBindCarList: function() {
    api.getBindCarList().then(res=>{
      if (res.code && res.code == 200) {
          if (res.data == null || res.data.length == 0) {
            var bindlist = [];
            this.setData({
                bindCarList: bindlist,
                haveDefaultCar: false
            })
          } else {
            this.setData({
                bindCarList: res.data,
                haveDefaultCar: true
            })
          }
      } else {
        var bindlist = [];
        this.setData({
            bindCarList: bindlist,
            haveDefaultCar: false
        })
      }
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
        this.getBindCarList()   
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

    },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
   //开始触摸时 重置所有删除
   this.data.bindCarList.forEach(function (v, i) {
    if (v.isTouchMove)//只操作为true的
     v.isTouchMove = false;
   })
   this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    bindCarList: this.data.bindCarList
   })
  },
  //滑动事件处理
  touchmove: function (e) {
   var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
   that.data.bindCarList.forEach(function (v, i) {
    v.isTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (i == index) {
     if (touchMoveX > startX) //右滑
      v.isTouchMove = false
     else //左滑
      v.isTouchMove = true
    }
   })
   //更新数据
   that.setData({
    bindCarList: that.data.bindCarList
   })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
   var _X = end.X - start.X,
    _Y = end.Y - start.Y
   //返回角度 /Math.atan()返回数字的反正切值
   return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (event) {
    let bindId = event.currentTarget.dataset.bindid;
    api.userDeleteBindCar(null, bindId).then(res=>{
        if (res.code && res.code == 200) {
            wx.showToast({  
                title: '删除成功',  
                icon: 'none',  
                duration: 2000  
            })
            this.getBindCarList()
        }else {
            wx.showToast({  
                title: '删除失败',  
                icon: 'none',  
                duration: 2000  
            })
        }
    })
  },

  addUserCar: function (event) {

    if (this.data.bindCarList.length >=5) {
        wx.showToast({  
            title: '超过最大绑定限制',  
            icon: 'none',  
            duration: 2000  
        })
        return
    }
    wx.navigateTo({url:'../addcar/addcar'})
  },

    /**
     * 更新默认车型
     */
    updateDefaultCar: function (event) {
        let bindId = event.currentTarget.dataset.bindid;
        api.changeDefaultBindCar(null, bindId).then(res=>{
            if (res.code && res.code == 200) {
                wx.showToast({  
                    title: '更换成功',  
                    icon: 'none',  
                    duration: 500  
                })
                this.getBindCarList()
                setTimeout(function () {
                    wx.navigateBack() //要延时执行的代码
                   }, 500) //延迟时间 这里是1秒
                //
            }else {
                wx.showToast({  
                    title: '更换失败',  
                    icon: 'none',  
                    duration: 2000  
                })
            }
        })  
    }
 })

 