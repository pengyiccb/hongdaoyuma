var app = getApp();
const api = require('../../utils/api')
Page({
    data:{
    },
    OnClickPhoneCounsel:function(event){
        wx.makePhoneCall({
            phoneNumber: '15170057995',
            success: function () {
                console.log("成功拨打电话")
            }
        })
    },
})