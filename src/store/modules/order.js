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
  orderResult:"",
  cancleResult:"",
  redemptionResult: "",
  isErrorResult:"",
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
      state.isErrorResult='获取点餐参数失败:' + err+ ":" + new Date();
    })
  },
  //获取菜单列表
  getMeunList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getMeunList", info, resolve, reject)
    }).then(res => {
      state.menuList = res;
    }).catch(err => {
      state.isErrorResult='获取菜单列表失败:' + err+ ":" + new Date();
    })
  },
  //获取换购列表
  getRedemptionList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getChangeBuyList", info, resolve, reject)
    }).then(res => {
      state.redemptionList = res;
    }).catch(err => {
      state.isErrorResult='获取换购记录失败:' + err+ ":" + new Date();
    })
  },
  //获取订单列表，时间、
  getOrderList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doSearch", info, resolve, reject)
    }).then(res => {
      state.orderList = res;
    }).catch(err => {
      state.isErrorResult='获取订餐记录失败:' + err+ ":" + new Date();
    })
  },
  order(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doOrder", info, resolve, reject)
    }).then(res => {
      wx.showModal({
        content: '点餐成功',
        showCancel: false
      });
      if (info.func != undefined) {
        info.func();
      }
    }).catch(err => {
      wx.showToast({
        title: '点餐失败:' + err,
        icon: 'warning',
        duration: 1500
      });
    })
  },
  cancle(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doCancle", info, resolve, reject)
    }).then(res => {
      wx.showModal({
        content: '取消点餐成功',
        showCancel: false
      });
      if (info.func != undefined) {
        info.func();
      }
    }).catch(err => {
      state.isErrorResult='取消点餐失败:' + err+ ":" + new Date();
    })
  },
  doChangeBuy(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("doChangeBuy", info, resolve, reject)
    }).then(res => {
      state.redemptionResult = "true:" + res + ":" + new Date();
    }).catch(err => {
      state.redemptionResult = "false:" + err + ":" + new Date();
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