
import tip from './tip'

const appId = "wxdda83d03c2d1521c";

//const API_URL = "http://localhost:8080";
const API_URL = "https://shop.jxxykj.cn";
// const API_URL = "http://192.168.10.100:8080";

// 通过Promise发请求到服务器
const RequestServer = (data, url, method="GET", Authorization = true) => {
  let header = {};
  
  wx.setStorageSync
  if (Authorization) {
    header['Authorization'] = `Bearer ` + wx.getStorageSync('Authorization');
  }
  // header['content-type'] = method === "POST" ? 'application/x-www-form-urlencoded;charset=UTF-8;' : 'application/json;charset=UTF-8;';
  console.log(header)
  return new Promise((resolve, reject) => {
    wx.request({
      url: API_URL + url,
      method: method,
      header: header,
      data: data,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
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
const GetProductList = data => RequestServer(data, '/api/v1/wechat/getProductList');
// GET /api/v1/wechat/productDetail
const GetProductDetail = data => RequestServer(data, '/api/v1/wechat/product/detail');
const getProductDetailList = data => RequestServer(data, '/api/v1/wechat/product/sku/detail/list');
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


const loginToServer = (params = {data, success, fail}) => {
  wx.login({
    success : (wxLoginRes) => {
      if (wxLoginRes.code) {
        params.data = params.data || {};
        params.data.code = wxLoginRes.code;
        params.data.userInfo = params.data.userInfo && params.data.userInfo || {}
        console.log(params.data);
        // wx.setStorageSync('key', params.data)
        // requestToServer("POST", "/auth/wxlogin", params, false);
        RequestServer(params.data, "/auth/wxlogin", 'POST', false)
        .then(res=>{
          params.success && params.success(res);
        }).catch(res=> {
          console.log(res);
          params.fail && params.fail(res);
        });
      }
    }
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
  getCarMainProduct
}