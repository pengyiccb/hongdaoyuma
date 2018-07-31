Page({
    data:{
        statusName:["已预约", "店家服务已完成，请确认完成"],
        shopRecordList: [
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "《钻石卡套餐》", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 12345", status:0},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "《钻石卡套餐》", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 66666", status:1},
            {shopRecordId: 23, time: "2018-07-31 16:07:00", setMealType: "《钻石卡套餐》", projectType: "1、翡翠紫瓷套装(数量x2)", carNumber:"赣A 88888", status:0}
        ],
    },
    onClickPhoneCounsel:function(event){
        console.log("onClickPhoneCounsel")
    },
    onLoad: function (options) {
        // this.setData({
        //     shopRecordList: this.shopRecordList
        // })
    },
})