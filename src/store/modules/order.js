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
  //订餐列表
  orderList: [],

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
        url: '/pages/msg/msg_fail/main?title=获取点餐参数失败&details='+err
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
        url: '/pages/msg/msg_fail/main?title=获取菜单列表失败&details='+err
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
        url: '/pages/msg/msg_fail/main?title=获取换购记录失败&details='+err
      });
    })
  },
  //获取订单列表，时间、
  getOrderList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doSearch", info, resolve, reject)
    }).then(res => {
      state.orderList = res;
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取订餐记录失败&details='+err
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
        url: '/pages/msg/msg_fail/main?title=点餐失败&details='+err
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
        url: '/pages/msg/msg_fail/main?title=取消点餐失败&details='+err
      });
    })
  },
  doChangeBuy(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doChangeBuy", info, resolve, reject)
    }).then(res => {
      state.redemptionResult =  res + ":" + new Date();
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=换购失败&details='+err
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