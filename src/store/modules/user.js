import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  isLogin: false, //是否登录
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
  register(state,info){
    new Promise((resolve, reject) => {
      requestTask.wxRequest("userRegister", info, resolve, reject)
    }).then(res => {
      wx.showModal({
        content: "用户注册成功，正在审核，请稍后",
        showCancel: false,
        success: function(res) {
          wx.navigateTo({
            url: '../../pages/index/main'
          })
        }
      });
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