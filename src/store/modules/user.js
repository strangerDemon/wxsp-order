import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  isLogin: false, //是否登录,其实为未注册
  //用户信息
  userInfo: null,
  loadUserError: false,
  userWarningText: "", //提醒文字
  isUserWarning: false, //是否警告
  registerLoading:false,
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
      requestTask.wxRequest("getUserInfo", info, resolve, reject,true)
    }).then(res => {
      state.userInfo = res;
      state.loadUserError = false;
      if (res.userName != "") {
        state.isLogin = true;
        state.userWarningText = "";
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
        } else {
          state.userWarningText = "";
          state.isUserWarning = false;
        }
      } else {
        state.isLogin = false; //用户登录的时候被删掉
        state.userWarningText = "用户未注册，请【<span style='color:blue'>点击注册</span>】";
        state.isUserWarning = true;
      }
    }).catch(err => {
      state.loadUserError = true;
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=' + err.errMsg +
          '&redirect=/pages/main/Order/main'
      });
    })
  },

  setUserInfo(state, info) {
    state.userInfo = info.userInfo;
    state.isLogin = info.isLogin;
  },

  //注册
  register(state, info) {
    state.registerLoading=true
    new Promise((resolve, reject) => {
      requestTask.wxRequest("userRegister", info, resolve, reject,true)
    }).then(res => {
      state.registerLoading=false
      state.isLogin = true;
      wx.navigateTo({
        url: '/pages/msg/msg_success/main?title=' + res +
          '&redirect=/pages/main/Order/main'
      });
      if (info.func != undefined) {
        info.func();
      }
    }).catch(err => {
      state.registerLoading=false
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=' + err.errMsg +
          '&redirect=/pages/main/Order/main'
      });
    })
  },

  updateLocal(state, info) {
    if (state.userInfo == null) {
      state.userInfo = info.user
    } else {
      state.userInfo.nickName = info.user.nickName
      state.userInfo.avatarUrl = info.user.avatarUrl
    }
    state.isLogin = info.isLogin;
  },
  //更新用户
  userUpdate(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("userUpdate", {
        openId: state.userInfo.openId,
        nickName: state.userInfo.nickName,
        avatarUrl: state.userInfo.avatarUrl
      }, resolve, reject,false)
    }).then(res => {
      wx.navigateTo({
        url: '/pages/msg/msg_success/main?title=用户更新成功'
      });
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=' + err.errMsg +
          '&redirect=/pages/main/Order/main'
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