
import tip from './tip'

const app = getApp();

let tokenVal = null;

//const API_URL = "http://localhost:8080";
//const API_URL = "https://shop.ydmaj.com";
const API_URL = "https://shop.jxxykj.cn";
// const API_URL = "http://192.168.10.100:8080";

// 通过Promise发请求到服务器
const RequestServer = (data, url, method="GET", token = true) => {
  let header = {};
  if (token) {
    header['Authorization'] = `Bearer ` + tokenVal;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: API_URL + url,
      method: method,
      header: header,
      data: data,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        }
        else {
          reject(res)
        }
      },
      fail: (res) => {
        reject(res)
      }
    });
  })
}

//获取主页商品
// params.data = {appId}
const getKindsList = data => RequestServer(data, '/api/v1/wechat/getKindsList');
const getMainBindCar = data => RequestServer(data, '/api/v1/wechat/bindcar');
const getMainConfig = data => RequestServer(data, '/api/v1/wechat/page/main' , 'GET', false);

//绑定汽车
const getBindCarList = data => RequestServer(data, '/api/v1/wechat/bindcarlist');
const getCarBrandList = data => RequestServer(data, '/api/v1/wechat/carbrandlist');
const getCarSeriesList = data => RequestServer(data, '/api/v1/wechat/carserieslist');
const getCarTimeList = data => RequestServer(data, '/api/v1/wechat/cartimelist');
const getCarVersionList = data => RequestServer(data, '/api/v1/wechat/carversionlist');
const userBindCarInfo = (data, carId) => RequestServer(data, `/api/v1/wechat/bindCar?carId=${carId}`, 'POST');
const changeDefaultBindCar = (data, bindId) => RequestServer(data, `/api/v1/wechat/bindDefaultCar?bindId=${bindId}`, 'POST');
const userDeleteBindCar = (data, bindId) => RequestServer(data, `/api/v1/wechat/deleteBindCar?bindId=${bindId}`, 'DELETE');

//api分类信息
const getGroupTree = data => RequestServer(data, '/api/v1/wechat/product/group/tree' , 'GET', false);
const getGroupProducts = data => RequestServer(data, '/api/v1/wechat/product/group/products', 'GET', false);
const GetProductList = data => RequestServer(data, '/api/v1/wechat/getProductList');
// GET /api/v1/wechat/productDetail
const GetProductDetail = data => RequestServer(data, '/api/v1/wechat/product/detail', 'GET', false);
const getProductDetailList = data => RequestServer(data, '/api/v1/wechat/product/sku/detail/list', 'GET', false);
const getProductSkuStockAmount = data => RequestServer(data, '/api/v1/wechat/getProductSkuStockAmount');

const getCarKinds = data => RequestServer(data, '/api/v1/wechat/carList')
const getCarMainProduct = data => RequestServer(data, '/api/v1/wechat/getMainCarProductList')
//获取购物车商品 
// GET /api/v1/wechat/cartList // 列表
const CarList = data => RequestServer(data, '/api/v1/wechat/cart/list')
// POST /api/v1/wechat/addCart 加入购物车
const AddCart = data => RequestServer(data, '/api/v1/wechat/cart/add', 'POST')
// POST /api/v1/wechat/modifyCart // 修改
const ModifyCart = data => RequestServer(data, `/api/v1/wechat/cart/modify`, 'POST')
// POST /api/v1/wechat/addorder // 删除商品
const DelCart = (data, itemId) => RequestServer(data, `/api/v1/wechat/cart/delete?itemId=${itemId}`, 'DELETE');
//GET 购物车商品确认
const CarVerify = data => RequestServer(data, "/api/v1/wechat/cart/verify");

// 收货地址
//获取用户默认地址
const userDefaultAddr = data => RequestServer(data, `/api/v1/wechat/address/default`)
//添加用户地址
const addaddr = data => RequestServer(data, `/api/v1/wechat/address/add`, 'POST')
//获取地址列表
const addrList = data => RequestServer(data, `/api/v1/wechat/address/list`)
//修改用户地址
const modifyAddr = data => RequestServer(data, `/api/v1/wechat/address/modify`, 'POST')
//删除用户地址
const delAddr = (data, addressId) => RequestServer(data, `/api/v1/wechat/address/delete?addressId=${addressId}`, 'DELETE')
//获取指定用户地址
const getAddrById = (data, addressId) => RequestServer(data, `/api/v1/wechat/address/detail?addressId=${addressId}`)

// 支付接口
// POST /api/v1/wechat/playorder
const playorder = data => RequestServer(data, `/api/v1/wechat/pay/prepay`)

// 获取订单列表
// GET /api/v1/wechat/orderList
const orderList = data => RequestServer(data, `/api/v1/wechat/order/list`)
//创建订单
const orderCreate = data => RequestServer(data, `/api/v1/wechat/order/create`, 'POST')
//取消订单
const orderCancel = (data, orderId) => RequestServer(data, `/api/v1/wechat/order/cancel?orderId=${orderId}`, 'DELETE')
//微信获取订单详情
const orderDetail = (data, orderId) => RequestServer(data, `/api/v1/wechat/order/detail?orderId=${orderId}`)
//计算订单总价
const orderTotalPrice = data => RequestServer(data, `/api/v1/wechat/order/price/total`, 'POST')
//确认服务
const orderConfirm = (data, orderId) => RequestServer(data, `/api/v1/wechat/order/confirm?orderId=${orderId}`, 'PUT')


//个人信息查询
const getUserInfo = data => RequestServer(data, `/api/v1/wechat/user/info`)
//获取用户短信验证码
const getPhoneCode = (data, phoneNo) => RequestServer(data, `/api/v1/wechat/user/sms/verification/code?mobilePhone=${phoneNo}`)
//验证用户短信验证码
const verifyPhoneCode = (data, phoneNo, code) => ReoneCode = (data, phoneNo, code) => RequestServer(data, `/api/v1/wechat/user/sms/verification/code?mobilePhone=${phoneNo}&code=${code}`, 'POST')
//
const dataDecode = data => RequestServer(data, `/api/v1/wechat/user/data/decode`, 'POST')

const getQR = data => RequestServer(data, `/api/v1/wechat/qrcode/generate`, 'POST', false)

//会员卡套餐
const getCardList = data => RequestServer(data, `/api/v1/wechat/user/member/list`)
const getCardDetail = data => RequestServer(data, `/api/v1/wechat/user/member/detail`)
const serviceSubmit = data => RequestServer(data, `/api/v1/wechat/reservation/submit`, 'POST')
//获取预约（历史）记录
const getReservationRecord = data => RequestServer(data, '/api/v1/wechat/reservation/list' , 'GET')
//预约记录 取消预约
const shopRecordCancel = (data, reservationId) => RequestServer(data, `/api/v1/wechat/reservation/cancel?reservationId=${reservationId}`, 'POST')
//预约记录 确认完成
const shopRecordConfirm = (data, reservationId)  => RequestServer(data, `/api/v1/wechat/reservation/confirm?reservationId=${reservationId}`, 'POST')


const loginToServer = (params = {data, success, fail}) => {
  wx.login({
    success : (wxLoginRes) => {
      if (wxLoginRes.code) {
        params.data = params.data || {};
        params.data.code = wxLoginRes.code;
        params.data.userInfo = params.data.userInfo && params.data.userInfo || {}
        RequestServer(params.data, "/auth/wxlogin", 'POST', false)
        .then(res=>{
          tokenVal = res.data.token;
          params.success && params.success(res);
        }).catch(res=> {
          console.log(res);
          params.fail && params.fail(res);
        });
      }
    },
    fail: (res) => {
      params.fail && params.fail(res);
    },
  });
};

module.exports= {
  loginToServer,
  GetProductList,
  GetProductDetail,
  getProductDetailList,
  getProductSkuStockAmount,
  CarList,
  AddCart,
  ModifyCart,
  DelCart,
  CarVerify,
  userDefaultAddr,
  addaddr,
  addrList,
  modifyAddr,
  delAddr,
  getAddrById,
  playorder,
  orderList,
  orderCancel,
  orderDetail,
  orderCreate,
  orderTotalPrice,
  orderConfirm,
  getCarKinds,
  getCarMainProduct,
  getUserInfo,
  getPhoneCode,
  verifyPhoneCode,
  dataDecode,
  getKindsList,
  getMainBindCar,
  getBindCarList,
  getCarBrandList,
  getCarSeriesList,
  getCarTimeList,
  getCarVersionList,
  userBindCarInfo,
  changeDefaultBindCar,
  userDeleteBindCar,
  getGroupTree,
  getGroupProducts,
  getMainConfig,
  getQR,
  getCardList,
  getCardDetail,
  serviceSubmit,
  getReservationRecord,
  shopRecordCancel,
  shopRecordConfirm,
}