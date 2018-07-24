// pages/productlist/productlist.js
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
        groupId: 0,
        productData: false,
        groupProductList: [
            /*{
                productId: 1,
                imageUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                title: '佳通汽车轮胎佳通汽车轮胎佳通汽车轮胎通汽车轮胎通汽车轮胎通汽车轮胎',
                price: Number(500),
                salePrice: Number(400),
                sortOrder: 1

            },
            {
                productId: 2,
                imageUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                title: '佳通汽车轮胎佳通汽车轮胎佳通汽车轮胎通汽车轮胎通汽车轮胎通汽车轮胎',
                price: Number(500),
                salePrice: Number(400),
                sortOrder: 2
            },
            {
                productId: 3,
                imageUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                title: '佳通汽车轮胎佳通汽车轮胎佳通汽车轮胎通汽车轮胎通汽车轮胎通汽车轮胎',
                price: Number(500),
                salePrice: Number(400),
                sortOrder: 3
            }*/
        ]
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

    compare:function (prop) {
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

    inputDetail: function(event) {
        var productid = event.currentTarget.dataset.productid
        wx.navigateTo({url:'../detail/detail?id='+productid})
    },

    getProductList: function(event) {
        api.getGroupProducts({groupId: this.data.groupId,
                                appId: app.globalData.appId}).then(res => {    
        //
        if (res.code && res.code == 200) {

            if (res.data == null || res.data.length == 0) {
                this.setData({
                    groupProductList: [],
                    productData: false
                }) 
                return
            }
            res.data.sort(this.compare("id"))
            var x = 0
            for (x in res.data) {
                if (res.data[x].imgPrimaryList && res.data[x].imgPrimaryList.length > 0) {
                    res.data[x].imageUrl = res.data[x].imgPrimaryList[0].url
                }        
            }

            this.setData({
                groupProductList: res.data,
                productData: true
            }) 

        }else {
            this.setData({
                groupProductList: [],
                productData: false
            })
        }
    
    })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        this.setData({
            groupId: options.groupId
        });
        
        console.log('groupId '+this.data.groupId)
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
        this.getProductList()
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