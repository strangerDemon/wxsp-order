import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  isLogin: false, //是否登录
  isAdmin: false, //时候为管理员
  //用户信息
  userInfo: null,

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
  //用户信息
  getUserInfo(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getUserInfo", info, resolve, reject)
    }).then(res => {
      state.userInfo = res;
      if (res.userName != "") {
        state.isLogin = true;
        if (res.isExamine != 1 || res.isForbidden == 1) {
          let title = "";
          if (res.isExamine == 0) {
            title = "账号未审核"
          } else if (res.isExamine == 2) {
            title = "账号审核未通过"
          } else if (res.isForbidden == 1) {
            title = "账号被禁用"
          }
          wx.navigateTo({
            url: '/pages/msg/msg_fail/main?title=' + title +
              '&redirect=/pages/index/main'
          });
        }
      } else {
        state.isLogin = false; //用户登录的时候被删掉
      }
    }).catch(err => {
      console.log("getUserInfo", err)
    })
  },

  setUserInfo(state, info) {
    state.userInfo = info.userInfo;
    state.isLogin = info.isLogin;
  },

  //注册
  register(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("userRegister", info, resolve, reject)
    }).then(res => {
      wx.navigateTo({
        url: '/pages/msg/msg_success/main?title=用户注册成功，正在审核，请稍后&redirect=/pages/index/main'
      });
      state.isLogin = true;
    }).catch(err => {
      console.log("userRegister", err)
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