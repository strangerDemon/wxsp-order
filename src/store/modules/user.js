import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  isLogin: false, //是否登录,其实为未注册
  //用户信息
  userInfo: null,
  loadUserError:false,
  userWarningText: "", //提醒文字
  isUserWarning: false, //是否警告
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
      state.loadUserError=false;
      if (res.userName != "") {
        state.isLogin = true;
        if (res.isExamine != 1 || res.isForbidden == 1) {
          if (res.isExamine == 0) {
            state.userWarningText = "账号未审核"
          } else if (res.isExamine == 2) {
            state.userWarningText = "账号审核未通过"
          } else if (res.isForbidden == 1) {
            state.userWarningText = "账号被禁用"
          }
          state.userWarningText += ",请联系管理员";
          state.isUserWarning = true;
          //不能跳转页面这里 会造成不好的用户交互
          /*wx.navigateTo({
            url: '/pages/msg/msg_fail/main?title=' + title +
              '&redirect=/pages/index/main'
          });*/
        } else {
          state.userWarningText = "";
          state.isUserWarning = false;
        }
      } else {
        state.isLogin = false; //用户登录的时候被删掉
        state.userWarningText = "用户未注册，请返回首页注册";
        state.isUserWarning = true;
      }
    }).catch(err => {
      state.loadUserError=true;
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=' + err.errMsg +
          '&redirect=/pages/index/main'
      });
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
      state.userWarningText = "用户注册成功，正在审核，请稍后";
      wx.navigateTo({
        url: '/pages/msg/msg_success/main?title='+state.userWarningText+'&redirect=/pages/index/main'
      });
      state.isLogin = true;
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=' + err.errMsg +
          '&redirect=/pages/index/main'
      });
    })
  },

  //更新用户
  userUpdate(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("userUpdate", info, resolve, reject)
    }).then(res => {
      wx.navigateTo({
        url: '/pages/msg/msg_success/main?title=用户更新成功'
      });
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=' + err.errMsg +
          '&redirect=/pages/index/main'
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