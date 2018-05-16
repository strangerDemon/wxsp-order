import * as requestTask from "../../utils/requestTask";

/**
 * Initial state
 * @type {Object}
 */
const state = {
  //系统参数
  orderParam: {
    startTime: "8", //点餐起始时间
    endTime: "18", //点餐终止时间
    isOrderOrNot: true, //时候可以点餐
    lunch: [] //午餐类别
  },
  //菜品列表//第二天吃的菜单
  menuList: [],
  //换购列表
  redemptionList: [],
  //3个页面分开，和小程序的加载有关,小程序在打开一个页面后，请求一个接口，其他页面（未渲染）有监听这个接口的赋值变量也会运行
  //订餐列表
  orderList: [],
  //查询页面的列表
  searchList: [],
  //凭证列表
  certificateList: [],
  //result 根据结果返回 判断是否弹页面
  redemptionResult: "",
};

/**
 * Getters
 * @type {Object}
 */
const getters = {};

/**
 * Mutations
 * @type {Object}
 */
const mutations = {
  //获取点餐参数
  getOrderParam(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getOrderParam", info, resolve, reject)
    }).then(res => {
      state.orderParam = res;
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取点餐参数失败&details=' + err
          .errMsg
      });
    })
  },
  //获取菜单列表
  getMeunList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getMeunList", info, resolve, reject)
    }).then(res => {
      state.menuList = res;
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取菜单列表失败&details=' + err
          .errMsg
      });
    })
  },
  //获取换购列表
  getRedemptionList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getChangeBuyList", info, resolve, reject)
    }).then(res => {
      state.redemptionList = res;
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取换购记录失败&details=' + err
          .errMsg
      });
    })
  },
  //获取订单列表，时间、
  getOrderList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doSearch", info, resolve, reject)
    }).then(res => {
      switch (info.from) {
        case "order":
          state.orderList = res;
          break;
        case "orderList":
          state.searchList = res;
          break;
        case "orderCertificate":
          state.certificateList = res;
          break;
        default:
          state.orderList = res;
          break;
      }
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取订餐记录失败&details=' + err
          .errMsg
      });
    })
  },
  order(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doOrder", info, resolve, reject)
    }).then(res => {
      wx.navigateTo({
        url: '/pages/msg/msg_success/main?title=点餐成功'
      });
      if (info.func != undefined) {
        info.func();
      }
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=点餐失败&details=' + err.errMsg
      });
    })
  },
  cancle(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doCancle", info, resolve, reject)
    }).then(res => {
      wx.navigateTo({
        url: '/pages/msg/msg_success/main?title=取消点餐成功'
      });
      if (info.func != undefined) {
        info.func();
      }
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=取消点餐失败&details=' + err.errMsg
      });
    })
  },
  doChangeBuy(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doChangeBuy", info, resolve, reject)
    }).then(res => {
      state.redemptionResult = res + ":" + new Date();
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=换购失败&details=' + err.errMsg
      });
    })
  }
};

/**
 * Actions
 * @type {Object}
 */
const actions = {};

// Export module
export default {
  state,
  getters,
  mutations,
  actions
};