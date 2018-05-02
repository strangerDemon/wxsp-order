import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  isLogin: false, //时候登录
  //用户信息
  userInfo: {},

  //系统参数
  systemParam: {
    provider: "厦门众图" //提供服务公司
  },
  companyList: [], //公司列表
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
  //系统参数
  getSystemParam(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getSystemParam", info, resolve, reject)
    }).then(res => {
      state.systemParam = res;
    }).catch(err => {
      console.log("getSystemParam", err)
    })
  },
  //公司列表
  getCompanyList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getCompanyList", info, resolve, reject)
    }).then(res => {
      state.getCompanyList = res;
    }).catch(err => {
      console.log("getCompanyList", err)
    })
  },
  //用户信息
  getUserInfo(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getUserInfo", info, resolve, reject)
    }).then(res => {
      state.isLogin = true;
      state.userInfo = res;
    }).catch(err => {
      console.log("getUserInfo", err)
    })
  },

  setUserInfo(state, info) {
    state.userInfo = info.userInfo;
    state.isLogin = info.isLogin;
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