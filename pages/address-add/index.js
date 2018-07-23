var commonCityData = require('../../utils/city.js')
const api = require('../../utils/api')
//获取应用实例
var app = getApp()
Page({
  data: {
    provinces:[],       //省
    citys:[],           //市
    districts:[],       //区
    addressDetail: "",  //详细地址
    selProvince:'请选择',
    selCity:'请选择',
    selDistrict:'请选择',
    selProvinceIndex:0,
    selCityIndex:0,
    selDistrictIndex:0,
    isDefault: 1
  },
  bindCancel:function () {
    wx.navigateBack({})
  },
  bindSave: function(e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

    if (linkMan == ""){
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel:false
      })
      return
    }
    if (mobile == ""){
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel:false
      })
      return
    }
    if (this.data.selProvince == "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    if (this.data.selCity == "请选择"){
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel:false
      })
      return
    }
    if (address == ""){
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel:false
      })
      return
    }


    let selDistrict = this.data.selDistrict === '请选择' ? '' : this.data.selDistrict

    let data = {
      userName: linkMan,
      mobilePhone: mobile,
      areaAddress1: this.data.selProvince,
      areaAddress2: this.data.selCity,
      areaAddress3: selDistrict,
      addressDetail: address,
      postalCode: code, 
      nationalCode: 86,
      isDefault: this.data.isDefault
    }

    wx.showLoading();
    if(this.data.addressId){
      data.id = this.data.addressId;
      api.modifyAddr(data).catch(res => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '网络数据错误',
        })
      }).then(res => {
        wx.hideLoading();
        if (res.code && res.code == 200) {
          wx.showToast({
            icon: 'none',
            title: '修改成功',
          });
          wx.navigateBack({});
        }else{          
          wx.showModal({
            title: '修改失败',
            content: res.msg,
            showCancel: false
          })
          return;
        }
      });
    }else{
      wx.hideLoading();
      api.addaddr(data).catch(res => {
        wx.showToast({
          icon: 'none',
          title: '网络数据错误',
        })
      }).then(res => {
        if (res.code && res.code == 200) {
          wx.showToast({
            icon: 'none',
            title: '添加成功',
          });
          wx.navigateBack({});
        }else{          
          wx.showModal({
            title: '添加失败',
            content: res.msg,
            showCancel: false
          })
          return;
        }
      });
    }    

  },
  initCityData:function(level, obj){
    if(level == 1){
      var pinkArray = [];
      for(var i = 0;i<commonCityData.cityData.length;i++){
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces:pinkArray
      });
    } else if (level == 2){
      var pinkArray = [];
      var dataArray = obj.cityList
      for(var i = 0;i<dataArray.length;i++){
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys:pinkArray
      });
    } else if (level == 3){
      var pinkArray = [];
      var dataArray = obj.districtList
      for(var i = 0;i<dataArray.length;i++){
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts:pinkArray
      });
    }
    
  },
  bindPickerProvinceChange:function(event){
    var selIterm = commonCityData.cityData[event.detail.value];
    this.setData({
      selProvince:selIterm.name,
      selProvinceIndex:event.detail.value,
      selCity:'请选择',
      selCityIndex:0,
      selDistrict:'请选择',
      selDistrictIndex: 0
    })
    this.initCityData(2, selIterm)
  },
  bindPickerCityChange:function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity:selIterm.name,
      selCityIndex:event.detail.value,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(3, selIterm)
  },
  bindPickerChange:function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
  onLoad: function (e) {
    var that = this;
    this.initCityData(1);
    var id = e.id;
    if (id) {
      this.data.addressId = id;
      // 初始化原数据
      wx.showLoading();
      api.getAddrById({}, id).catch(res => {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '网络数据错误',
        })
      }).then(res => {
        wx.hideLoading();
        if(res.code && res.code == 200){
          let provinceName = res.data.areaAddress1;
          let cityName = res.data.areaAddress2;
          let diatrictName = res.data.areaAddress3;
          that.data.isDefault = res.data.isDefault;
  
          for (var i = 0; i < commonCityData.cityData.length; i++) {
            if (provinceName == commonCityData.cityData[i].name) {
              let eventJ = { detail: { value:i }};
              that.bindPickerProvinceChange(eventJ);
              that.data.selProvinceIndex = i;
              for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
                if (cityName == commonCityData.cityData[i].cityList[j].name) {
                  //that.data.selCityIndex = j;
                  eventJ = { detail: { value: j } };
                  that.bindPickerCityChange(eventJ);
                  for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
                    if (diatrictName == commonCityData.cityData[i].cityList[j].districtList[k].name) {
                      //that.data.selDistrictIndex = k;
                      eventJ = { detail: { value: k } };
                      that.bindPickerChange(eventJ);
                    }
                  }
                }
              }
              
            }
          }
          that.setData({
            addressData: res.data
          });          
        }else{
          wx.showToast({
            icon: 'none',
            title: res.msg,
          });
        }
      });
    }
  },

  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          api.delAddr({}, id).catch(res => {
            wx.showToast({
              icon: 'none',
              title: '网络数据错误',
            })
          }).then(res => {
            if(res.code && res.code == 200){
              wx.navigateBack({});
            }else{
              wx.showToast({
                icon: 'none',
                title: res.msg,
              });
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  readFromWx : function () {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        let provinceName = res.provinceName;
        let cityName = res.cityName;
        let diatrictName = res.countyName;
        let retSelIdx = 0;

        for (var i = 0; i < commonCityData.cityData.length; i++) {
          if (provinceName == commonCityData.cityData[i].name) {
            let eventJ = { detail: { value:i }};
            that.bindPickerProvinceChange(eventJ);
            that.data.selProvinceIndex = i;
            for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
              if (cityName == commonCityData.cityData[i].cityList[j].name) {
                //that.data.selCityIndex = j;
                eventJ = { detail: { value: j } };
                that.bindPickerCityChange(eventJ);
                for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
                  if (diatrictName == commonCityData.cityData[i].cityList[j].districtList[k].name) {
                    //that.data.selDistrictIndex = k;
                    eventJ = { detail: { value: k } };
                    that.bindPickerChange(eventJ);
                  }
                }
              }
            }
            
          }
        }

        that.setData({
          wxaddress: res,
        });
      }
    })
  }
})
