import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  showLoading: true,
  currentPage: "main", //暂时处理，小程序在打开一个页面后，请求一个接口，其他页面（未渲染）有监听这个接口的赋值变量也会运行
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
      requestTask.wxRequest("getSystemParam", info, resolve, reject)
    }).then(res => {
      state.systemParamInit = true;
      state.systemParam = res;
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取系统参数失败&details=' +
          err.errMsg
      });
    })
  },
  //公司列表
  getCompanyList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getCompanyList", info, resolve, reject)
    }).then(res => {
      //console.log("getCompanyList",res);
      state.companyList = res.companyList;
    }).catch(err => {
      wx.navigateTo({
        url: '/pages/msg/msg_fail/main?title=获取公司列表失败&details=' +
          err.errMsg
      });
    })
  },
  setCurrentPage(state, info) {
    state.currentPage = info.currentPage;
  },
  //同意控制是否显示loading
  setShowLoading(state, info) {
    state.showLoading = info.showLoading;
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