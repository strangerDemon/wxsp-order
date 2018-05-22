import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  toReload: "", //是否重新reload用户和系统参数
  showLoading: true,
  loadSysParamError: false, //是否加载失败，一般为网络原因
  systemParamInit: false, //因为要初始化默认显示一些，防止空格情况，所以systemParam不为null
  //系统参数
  systemParam: {
    provider: "厦门众图", //提供服务公司
    relevantUrl: "https://www.ztgis.com" //相关条款连接
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
      requestTask.wxRequest("getSystemParam", info, resolve, reject,false)
    }).then(res => {
      state.systemParamInit = true;
      state.systemParam = res;
      state.loadSysParamError = false;
    }).catch(err => {
      state.loadSysParamError = true;
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取系统参数失败&details=' +
          err.errMsg
      });
    })
  },
  //公司列表
  getCompanyList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getCompanyList", info, resolve, reject,false)
    }).then(res => {
      state.companyList = res.companyList;
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取公司列表失败&details=' +
          err.errMsg
      });
    })
  },
  //同意控制是否显示loading
  setShowLoading(state, info) {
    state.showLoading = info.showLoading;
  },
  toReload(state, info) {
    state.toReload = (new Date()).getTime();
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