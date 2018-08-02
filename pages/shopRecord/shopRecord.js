Page({
    data:{
        statusName:["已预约", "店家服务已完成，请确认完成"],
        shopRecordList: [
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "钻石卡套餐", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 12345", status:0},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "钻石卡套餐", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 66666", status:1},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "钻石卡套餐", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 12345", status:0},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "钻石卡套餐", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 66666", status:1},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "钻石卡套餐", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 12345", status:0},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "钻石卡套餐", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 66666", status:1},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "钻石卡套餐", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 12345", status:0},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "钻石卡套餐", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 66666", status:1},
        ],
        bIsHidePopup: false,
    },
    onLoad: function (options) {
        // this.setData({
        //     shopRecordList: this.shopRecordList
        // })
    },
    closePopupTap:function(event){
        this.setData({
            bIsHidePopup: true
        })
    },
    onClickButtonConfirm:function(event){
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
    onClickButtonCancel:function(event){
        this.setData({
            bIsHidePopup: true
        })
        console.log("onClickButtonCancel:"+this.data.bIsHidePopup)
    },
    onClickButtonContact:function(event){
        console.log("onClickButtonContact")
    },
})