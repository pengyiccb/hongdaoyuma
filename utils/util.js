const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

//只有在 button 的 open-type='getUserInfo' 才能使用！
const getUserAuth = (e, { success, fail }) => {
  if (e.detail.userInfo) { //点击了允许授权
    getApp().globalData.userInfo = e.detail.userInfo;
    success && success();
  } else {//点击了拒绝授权
    console.log("用户未授权 " + JSON.stringify(e.detail.errMsg));
    fail && fail();
  }
}

//检查一下是否有用户信息
const checkSession = ({ success, fail }) => {

  if (getApp().globalData.userInfo) {
    return success && success({ userInfo: getApp().globalData.userInfo });
  }

  wx.checkSession({
    success: () => {
      wx.getUserInfo({
        success: res => {
          success && success({ userInfo: res.userInfo });
        },
        fail: () => {
          fail && fail();
        }
      })
    },
    fail: () => {
      fail && fail();
    }
  })
}

module.exports = { formatTime, showBusy, showSuccess, showModel, getUserAuth, checkSession}
