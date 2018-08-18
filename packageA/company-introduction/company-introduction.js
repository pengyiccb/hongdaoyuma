Page({
    data:{

    },
    
    bIsTopColor: true,
    changeColorPosY: 0,

    onLoad: function (options) {
        this.changeColorPosY = wx.getSystemInfoSync().windowHeight / 3;
        this.changeColor()
    },
    onClickPhoneCounsel:function(event){
        wx.makePhoneCall({
            phoneNumber: '13697009343',
            success: function () {
                console.log("成功拨打电话")
            }
        })
    },
    onPageScroll:function(e){
        if (this.bIsTopColor) {
            if (this.changeColorPosY < e.scrollTop) {
                this.bIsTopColor = false;
                this.changeColor();
            }
        } else {
            if (this.changeColorPosY >= e.scrollTop) {
                this.bIsTopColor = true;
                this.changeColor();
            }
        }
    },
    changeColor:function(){
        if (this.bIsTopColor) {
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#f64500',
                animation: {
                    duration: 400,
                    timingFunc: 'easeIn'
                }
            })
        } else {
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#cccccc',
                animation: {
                    duration: 400,
                    timingFunc: 'easeIn'
                }
            })
        }
    },
})