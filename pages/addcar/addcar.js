// pages/addcar/addcar.js
const config = require('../../config.js');
const api = require('../../utils/api');

const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        currentSelect: 1,
        selectBrandId: -1,
        selectBrandName: '品牌',
        selectBrandImg: '',
        selectSeriesId: -1,
        selectSeriesName: '车系',
        selectSeriesImg: '',
        selectTimeId: -1,
        selectTimeName: '年款',
        selectVersionId: -1,
        selectVersionName: '车型',
        toView: '',
        scrollHeight: 0,
        imgSerieswidth:0,
        imgSeriesheight:0,
        searchY: 0,
        scrollAnimation: true,
        timeList:[
            /*{timeId:1, timeName: '2018款'},
            {timeId:2, timeName: '2017款'},
            {timeId:3, timeName: '2016款'},
            {timeId:4, timeName: '2015款'}*/
        ],
        versionList:[
            /*{versionId:1, versionName: '乐享1.8手动'},
            {versionId:2, versionName: '乐享1.8手动'},
            {versionId:3, versionName: '乐享1.8手动'},
            {versionId:4, versionName: '乐享1.8手动'}*/
        ],
        seriesList:[
            /*{
                seriesId: 1,
                seriesName: '泰威',
                seriesImage: 'https://img.alicdn.com/bao/uploaded/TB1XSK0HVXXXXb2XpXXSutbFXXX_230x87Q50s150.jpg'
            },
            {
                seriesId: 2,
                seriesName: '泰威',
                seriesImage: 'https://img.alicdn.com/bao/uploaded/TB1XSK0HVXXXXb2XpXXSutbFXXX_230x87Q50s150.jpg'
            },
            {
                seriesId: 3,
                seriesName: '泰威',
                seriesImage: 'https://img.alicdn.com/bao/uploaded/TB1XSK0HVXXXXb2XpXXSutbFXXX_230x87Q50s150.jpg'
            },
            {
                seriesId: 4,
                seriesName: '泰威',
                seriesImage: 'https://img.alicdn.com/bao/uploaded/TB1XSK0HVXXXXb2XpXXSutbFXXX_230x87Q50s150.jpg'
            },
            {
                seriesId: 5,
                seriesName: '泰威',
                seriesImage: 'https://img.alicdn.com/bao/uploaded/TB1XSK0HVXXXXb2XpXXSutbFXXX_230x87Q50s150.jpg'
            }*/
        ],
        hotCarBrandList: [
            /*{
                brandId: 1,
                brandName: '大众1',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            },
            {
                brandId: 2,
                brandName: '大众2',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            },
            {
                brandId: 3,
                brandName: '大众3',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            },
            {
                brandId: 4,
                brandName: '大众4',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            },
            {
                brandId: 5,
                brandName: '大众5',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            },
            {
                brandId: 6,
                brandName: '大众6',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            },
            {
                brandId: 7,
                brandName: '大众7',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            },
            {
                brandId: 8,
                brandName: '大众8',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            },
            {
                brandId: 9,
                brandName: '大众9',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
            }*/
        ],

        wordindex:[/*'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'*/],

        carBrandGroupList: [
           /* {
                groupName: 'A',
                groupList: [
                    {
                        brandId: 1,
                        brandName: '大众1',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    },
                    {
                        brandId: 2,
                        brandName: '大众1',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    }
                ]                 
            },
            {
                groupName: 'B',
                groupList: [
                    {
                        brandId: 3,
                        brandName: '大众3',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    },
                    {
                        brandId: 4,
                        brandName: '大众4',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    }
                ]                 
            },
            {
                groupName: 'C',
                groupList: [
                    {
                        brandId: 3,
                        brandName: '大众3',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    },
                    {
                        brandId: 4,
                        brandName: '大众4',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    }
                ]                 
            },
            {
                groupName: 'D',
                groupList: [
                    {
                        brandId: 3,
                        brandName: '大众3',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    },
                    {
                        brandId: 4,
                        brandName: '大众4',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    }
                ]                 
            },
            {
                groupName: 'E',
                groupList: [
                    {
                        brandId: 3,
                        brandName: '大众3',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    },
                    {
                        brandId: 4,
                        brandName: '大众4',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    }
                ]                 
            },
            {
                groupName: 'F',
                groupList: [
                    {
                        brandId: 3,
                        brandName: '大众3',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    },
                    {
                        brandId: 4,
                        brandName: '大众4',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    }
                ]                 
            },
            {
                groupName: 'G',
                groupList: [
                    {
                        brandId: 3,
                        brandName: '大众3',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    },
                    {
                        brandId: 4,
                        brandName: '大众4',
                        brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg'
                    }
                ]                 
            }*/
        ],
        carBrandList: [
            /*{
                brandId: 1,
                brandName: '大众1',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'A',
                isHot: 0
            },
            {
                brandId: 2,
                brandName: '大众2',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'B',
                isHot: 1
            },
            {
                brandId: 2,
                brandName: '大众3',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'B',
                isHot: 1
            },
            {
                brandId: 2,
                brandName: '大众4',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'B',
                isHot: 1
            },
            {
                brandId: 2,
                brandName: '大众5',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'C',
                isHot: 1
            },
            {
                brandId: 2,
                brandName: '大众6',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'E',
                isHot: 1
            },
            {
                brandId: 2,
                brandName: '大众7',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'E',
                isHot: 1
            },
            {
                brandId: 2,
                brandName: '大众8',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'F',
                isHot: 1
            },
            {
                brandId: 2,
                brandName: '大众9',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'F',
                isHot: 1
            },
            {
                brandId: 2,
                brandName: '大众10',
                brandUrl: 'https://img.alicdn.com/bao/uploaded/TB1VdVfJFXXXXaeXVXXSutbFXXX_230x87Q50s150.jpg',
                groupName: 'G',
                isHot: 1
            },*/
        ]
    },

    choiceWordindex: function (event) {
        let wordindex = event.currentTarget.dataset.wordindex;
        if (wordindex == '#') {
          this.setData({
            toView: '热门品牌',
          })
        } else {
          this.setData({
            toView: wordindex,
          })
          wx.showToast({  
            title: wordindex,  
            icon: 'none',  
            duration: 1000  
        })
        }
     
        console.log(this.data.toView);
      },

    
    selectHotBrand: function (event) {
        let brandId = event.currentTarget.dataset.brandid;
        for (var x in this.data.hotCarBrandList)
        {
            if (this.data.hotCarBrandList[x].brandId==brandId)
            {
                this.setData({
                    currentSelect: 2,
                    selectBrandId: brandId,
                    selectBrandName: this.data.hotCarBrandList[x].brandName,
                    selectBrandImg: this.data.hotCarBrandList[x].brandUrl
                })
                this.getCarSeriesInfo()
                return
            }
        }
    },

    selectSeries: function (event) {
        let seriesId = event.currentTarget.dataset.seriesid;
        for (var x in this.data.seriesList)
        {
            if (this.data.seriesList[x].seriesId==seriesId){
                this.setData({
                    currentSelect: 3,
                    selectSeriesId: seriesId,
                    selectSeriesName: this.data.seriesList[x].seriesName,
                    selectSeriesImg: this.data.seriesList[x].seriesImage
                })
                this.getCarTimeInfo()
                return
            }
        }
    },

    errbrandImg: function(e) {

    },

    touchstartWord: function(e) {
        var word = e.currentTarget.dataset.wordindex
        var id = e.currentTarget.dataset.id
        console.log("touchstartWord:"+word+"id:"+id)
        var touchs = e.touches[0]; 
        var pageX = touchs.pageX; 
        var pageY = touchs.pageY; 
        console.log('pageX: ' + pageX) 
        console.log('pageY: ' + pageY) 
        
        this.setData({
            //scrollAnimation: false
        })

        this.setData({
            searchY: touchs.pageY,
            //toView: word
        })
        
    },

    touchmoveWord: function(e) {
        this.setData({
            scrollAnimation: true
        })
        
        var word = e.currentTarget.dataset.wordindex
        var id = e.currentTarget.dataset.id
        
        var touchs = e.touches[0]; 
        var pageX = touchs.pageX; 
        var pageY = touchs.pageY; 
        var  indexpos = parseInt((pageY-this.data.searchY)/18)
        console.log("touchmoveWord indexpos: "+indexpos +" id:"+id)
        var current = (id+indexpos)
        var lenword = this.data.wordindex.length
        if (current >= 0 && current < lenword) {
            this.setData({
               // toView: this.data.wordindex[id+indexpos]
            })
        }

    },

    touchendWord: function(e) {

        var touchs = e.changedTouches[0]; 
        var id = e.currentTarget.dataset.id
        var pageY = touchs.pageY;
        var  indexpos = parseInt((pageY-this.data.searchY)/18)
        var current = (id+indexpos)
        var lenword = this.data.wordindex.length
        if (current >= 0 && current < lenword) {
            console.log("touchendWord:"+word + " this.data.wordindex[id+indexpos]"+this.data.wordindex[id+indexpos])
            this.setData({
                //toView: this.data.wordindex[id+indexpos]
            })
        }
        var word = e.currentTarget.dataset.wordindex
        var id = e.currentTarget.dataset.id
        
        this.setData({
           /* scrollAnimation: true,*/
            searchY: 0
        })
    },

    loadSeriesimage: function (e) {
        var _this=this;
		var width=e.detail.width,    //获取图片真实宽度
            height=e.detail.height,
            ratio=height/ width;   //图片的真实宽高比例

        var id = e.currentTarget.dataset.id
            
        console.log("width :" + width+ "height:" + height)
		var viewHeight=87,           //设置图片显示宽度，
            viewWidth=87/ratio;    //计算的高度值 
            console.log("id:"+id+"viewWidth :" + viewWidth+ "viewHeight:" + viewHeight)  

        var serieslist = this.data.seriesList
        serieslist[id].imgSerieswidth = viewWidth
        serieslist[id].imgSeriesheight = viewHeight
		this.setData({
			seriesList: serieslist
		})

    },

    selectTime: function (event) {
        let timeId = event.currentTarget.dataset.timeid;
        for (var x in this.data.timeList)
        {
            if (this.data.timeList[x].timeId==timeId){
                this.setData({
                    currentSelect: 4,
                    selectTimeId: timeId,
                    selectTimeName: this.data.timeList[x].timeName
                })
                this.getCarVersionInfo()
                return
            }
        }

    },

    selectVersion: function (event) {
        let versionId = event.currentTarget.dataset.versionid;
        console.log("selectVersion " + versionId)
        /*api.userBindCarInfo()*/
        api.userBindCarInfo(null, versionId).then(res=>{
            if (res.code && res.code == 200) {
                wx.showToast({  
                    title: '添加成功',  
                    icon: 'success',  
                    duration: 2000  
                })
                wx.navigateBack() 
            } else {
                wx.showToast({  
                    title: '添加失败',  
                    icon: 'fail',  
                    duration: 2000  
                })
                //wx.navigateBack() 
            }
        })
        
    },

    selectBrand: function (event) {
        let brandId = event.currentTarget.dataset.brandid;
        let groupname = event.currentTarget.dataset.groupname;
        for (var x in this.data.carBrandGroupList) {
            if (this.data.carBrandGroupList[x].groupName==groupname){
                let brandlist = this.data.carBrandGroupList[x].groupList
                for (var y in brandlist){     
                    if (brandlist[y].brandId == brandId) {
                        this.setData({
                            currentSelect: 2,
                            selectBrandId: brandId,
                            selectBrandName: brandlist[y].brandName,
                            selectBrandImg: brandlist[y].brandUrl
                        })
                        this.getCarSeriesInfo()
                        return
                    }
                }
            }
        }
    },

    choosebrand: function (event) {
        this.setData({
            currentSelect: 1,
            selectBrandId: -1,
            selectBrandName: '品牌',
            selectBrandImg: '',
            selectSeriesId: -1,
            selectSeriesName: '车系',
            selectSeriesImg: '',
            selectTimeId: -1,
            selectTimeName: '年款',
            selectVersionId: -1,
            selectVersionName: '车型',
            seriesList: [],
            versionList: [],
            timeList: []   
        })
    },

    chooseseries: function (event) {
        this.setData({
            currentSelect: 2,
            selectSeriesId: -1,
            selectSeriesName: '车系',
            selectSeriesImg: '',
            selectTimeId: -1,
            selectTimeName: '年款',
            selectVersionId: -1,
            selectVersionName: '车型',
            versionList: [],
            timeList: [] 
        })
    },

    choosetime: function (event) {
        this.setData({
            currentSelect: 3,
            selectTimeId: -1,
            selectTimeName: '年款',
            selectVersionId: -1,
            selectVersionName: '车型',
            timeList: [] 
        })
    },

    chooseversion: function (event) {
        this.setData({
            currentSelect: 4,
            selectVersionId: -1,
            selectVersionName: '车型'
        })
    },

    getCarSeriesInfo: function() {
        api.getCarSeriesList({brandId: this.data.selectBrandId}).then(res=>{
            if (res.code && res.code == 200) {
                if (res.data == null || res.data.length == 0) {
                  var serieslist = [];
                  this.setData({
                    seriesList: serieslist
                  })
                } else {
                  this.setData({
                    seriesList: res.data
                  })
                }
            } else {
                var serieslist = [];
                this.setData({
                    seriesList: serieslist
                })
            }
        })
    },


    getCarTimeInfo: function() {
        api.getCarTimeList({seriesId: this.data.selectSeriesId}).then(res=>{
            if (res.code && res.code == 200) {
                if (res.data == null || res.data.length == 0) {
                  var timelist = [];
                  this.setData({
                    timeList: timelist
                  })
                } else {
                  this.setData({
                    timeList: res.data
                  })
                }
            } else {
                var timelist = [];
                this.setData({
                    timeList: timelist
                })
            }
        })
    },

    getCarVersionInfo: function() {
        api.getCarVersionList({timeId: this.data.selectTimeId}).then(res=>{
            if (res.code && res.code == 200) {
                if (res.data == null || res.data.length == 0) {
                  var versionlist = [];
                  this.setData({
                    versionList: versionlist
                  })
                } else {
                  this.setData({
                    versionList: res.data
                  })
                }
            } else {
                var versionlist = [];
                this.setData({
                    versionList: versionlist
                })
            }
        })
    },

    getCarBrandInfo: function() {
        api.getCarBrandList().then(res=>{
            if (res.code && res.code == 200) {
                if (res.data == null || res.data.length == 0) {
                  var brandlist = [];
                  this.setData({
                      carBrandList: brandlist
                  })
                } else {
                  this.setData({
                      carBrandList: res.data
                  })
                }
            } else {
                var brandlist = [];
                this.setData({
                    carBrandList: brandlist
                })
            }
            this.initBrandData()
        })
    },

    initBrandData: function() {
        var hotBrandList = []
        var word = []
        var brandGroupList = []
        var x=0, y=0, z=0
        for (x in this.data.carBrandList) {
            var brandinfo = this.data.carBrandList[x]
            if (brandinfo.isHot == 1) {
                hotBrandList.push({
                    brandId: brandinfo.brandId,
                    brandName: brandinfo.brandName,
                    brandUrl: brandinfo.hotBrandUrl
                })
            }

            var isInWord = false 
            for (y in word) {
                if (word[y] == brandinfo.groupName){
                    isInWord=true
                    break
                }
            }
            if (isInWord == false) {
                word.push(brandinfo.groupName)
            }

            if (isInWord == false) {
                var groupInfo = {
                    groupName: brandinfo.groupName,
                    groupList: []
                }
                groupInfo.groupList.push({
                    brandId: brandinfo.brandId,
                    brandName: brandinfo.brandName,
                    brandUrl: brandinfo.brandUrl
                })
                brandGroupList.push(groupInfo)
            }
            else {
                for (z in brandGroupList) {

                    if (brandGroupList[z].groupName == brandinfo.groupName) {
                        brandGroupList[z].groupList.push({
                            brandId: brandinfo.brandId,
                            brandName: brandinfo.brandName,
                            brandUrl: brandinfo.brandUrl
                        })
                    }

                }
            }
        }
        this.setData({
            hotCarBrandList: hotBrandList,
            wordindex: word,
            carBrandGroupList: brandGroupList
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
        var that = this;
        wx.getSystemInfo({
        success: function (res) {
            that.setData({
            scrollHeight: res.windowHeight
            });
        }
        });
        this.getCarBrandInfo()
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