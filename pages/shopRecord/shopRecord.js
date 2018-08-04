
const api = require('../../utils/api');

Page({
    data:{
        statusName:["服务已完成", "预约已提交", "预约已完成", "预约已取消",],
        shopRecordList: [],
    },
    onLoad: function (options) {
        
    },
    onShow: function () {
        this.GetReservationRecord();
    },
    GetReservationRecord: function () {
        var that = this;
        api.getReservationRecord({}).catch(res => {
            wx.showToast({
              icon: 'none',
              title: '网络数据错误',
            })
          }).then(res => {
            if(res.code && res.code == 200){
                that.setData({ 
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
        var that = this;
        wx.showModal({
            title: '提示',
            content: '是否取消订单',
            success: function(res){
                if(res.confirm){
                    api.shopRecordCancel({}, event.currentTarget.dataset.id).catch(res => {
                        wx.showToast({
                          icon: 'none',
                          title: '网络数据错误',
                        })
                      }).then(res =>{
                        if(res.code && res.code == 200){
                            console.log(res);
                            that.GetReservationRecord();
                        }else{
                          wx.showToast({
                            icon: 'none',
                            title: res.msg,
                          })
                        }
                    });
                }else if(res.cancel){
                }
            }
        });
        
    },
    onClickButtonConfirm:function(event){
        var that = this;
        api.shopRecordConfirm({}, event.currentTarget.dataset.id).catch(res => {
            wx.showToast({
              icon: 'none',
              title: '网络数据错误',
            })
          }).then(res =>{
            if(res.code && res.code == 200){
                console.log(res);
                that.GetReservationRecord();
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
})