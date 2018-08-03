
const api = require('../../utils/api');

Page({
    data:{
        statusName:["服务已完成", "预约已提交", "预约已完成", "预约已取消",],
        shopRecordList: [],
        bIsHidePopup: true,
    },
    onLoad: function (options) {
        // testcode popup
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
        console.log("onClickButtonConfirm:"+this.data.bIsHidePopup)
    },
    onShow: function () {
        this.GetReservationRecord();
    },
    GetReservationRecord: function () {
        api.getReservationRecord({}).catch(res => {
            wx.showToast({
              icon: 'none',
              title: '网络数据错误',
            })
          }).then(res => {
            if(res.code && res.code == 200){
                console.log(res)
                this.setData({ 
                    shopRecordList: res.data,
                });
              }else{
                wx.showToast({
                  icon: 'none',
                  title: res.msg,
                })
              }
          });
    },
    onClickButtonCancel:function(event){
        api.shopRecordCancel({}, event.currentTarget.dataset.id).catch(res => {
            wx.showToast({
              icon: 'none',
              title: '网络数据错误',
            })
          }).then(res =>{
            if(res.code && res.code == 200){
                console.log(res);
                this.GetReservationRecord();
            }else{
              wx.showToast({
                icon: 'none',
                title: res.msg,
              })
            }
        });
    },
    onClickButtonConfirm:function(event){
        api.shopRecordConfirm({}, event.currentTarget.dataset.id).catch(res => {
            wx.showToast({
              icon: 'none',
              title: '网络数据错误',
            })
          }).then(res =>{
            if(res.code && res.code == 200){
                console.log(res);
                this.GetReservationRecord();
            }else{
              wx.showToast({
                icon: 'none',
                title: res.msg,
              })
            }
        });
    },
    onClickButtonContact:function(event){
        wx.makePhoneCall({
            phoneNumber: '15170057995',
            success: function () {
                console.log("成功拨打电话")
            }
        })
    },
    closePopupTap:function(event){
        this.setData({
            bIsHidePopup: true
        })
    },
})