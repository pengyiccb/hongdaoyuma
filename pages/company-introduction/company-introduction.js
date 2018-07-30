Page({
    data:{

    },
    
    bIsTopColor: true,

    onLoad: function (options) {
        this.changeColor()
    },
    onClickPhoneCounsel:function(event){
        wx.makePhoneCall({
            phoneNumber: '15170057995',
            success: function () {
                console.log("成功拨打电话")
            }
        })
    },
    onPageScroll:function(e){
        if (this.bIsTopColor) {
            if (204 < e.scrollTop) {
                this.bIsTopColor = false;
                this.changeColor();
            }
        } else {
            if (204 >= e.scrollTop) {
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