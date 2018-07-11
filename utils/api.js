
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
const DelCart = data => RequestServer(data, `/api/v1/wechat/cart/delete`, 'DELETE')

// 收货地址
// GET /api/v1/wechat/userDefaultAddr 获取默认地址
const userDefaultAddr = data => RequestServer(data, `/api/v1/wechat/userDefaultAddr`)
// POST /api/v1/wechat/addaddr 新增
const addaddr = (data, i) => RequestServer(data, `/api/v1/wechat/addaddr?isDefault=${i}`, 'POST')
// GET /api/v1/wechat/addrList 获取地址列表
const addrList = data => RequestServer(data, `/api/v1/wechat/addrList`)


// 支付接口
// POST /api/v1/wechat/playorder
const playorder = data => RequestServer(data, `/api/v1/wechat/playorder`, 'POST')

// 获取订单列表
// GET /api/v1/wechat/orderList
const orderList = data => RequestServer(data, `/api/v1/wechat/orderList`)


//== 获取购物车
const getTrolleyList = data => RequestServer("GET", "/api/v1/wechat/trolleyList");

//获取订单商品
// params.data = {sessionKey}
const getOrderList = data => RequestServer("GET", "/api/v1/wechat/OrderList");


//添加订单到购物车
const addOrderToTrolley = data => RequestServer("GET", "/api/v1/wechat/addOrderToTrolley");

//商品详情
const getOrderDetail = data => RequestServer("GET", "/api/v1/wechat/OrderDetail");

//提交订单结算
const submitOrder = data => RequestServer("GET", "/api/v1/wechat/submitOrder");

//提交订单结算
const getPrepayOrderInfo = data => RequestServer(data, "/api/v1/wechat/getPrepayOrderInfo");


//发请求到服务器 不需要了
// const requestToServer = (method, url, params={data, success, fail}, Authorization=true) => {
//   // var data = params.data || {};
//   let header = {};
//   if (Authorization) {
//     header['Authorization'] = `Bearer ` + wx.getStorageSync('Authorization');
//   }
//   header['Content-Type'] = method === "POST" && 'application/x-www-form-urlencoded;charset=UTF-8;' || 'application/json;charset=UTF-8;';
//   wx.request({
//     url: API_URL + url,
//     method: method || 'GET',
//     data: params.data || {},
//     header: header,
//     success: (res) => {
//       res.data.message && console.log(res.data.message);
//       params.success && params.success(res);
//     },
//     fail: (res) => {
//       params.fail && params.fail(res);
//     }
//   });
// }
//获取 sessionKey 登录到服务器 创建session (需要获取微信的 code)。返回一个服务器维护的 session_key
//参数 params.data = {userInfo, appId}
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
  userDefaultAddr,
  addaddr,
  addrList,
  playorder,
  orderList,
  getPrepayOrderInfo,
  getCarKinds,
  getCarMainProduct
}