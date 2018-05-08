import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  systemParamInit:false,//因为要初始化默认显示一些，防止空格情况，所以systemParam不为null
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
      state.systemParamInit=true;
      state.systemParam = res;
      //console.log("getSystemParam",res);
    }).catch(err => {
      wx.showToast({
        title: '获取系统参数失败:' + err,
        icon: 'warning',
        duration: 1500
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
      wx.showToast({
        title: '获取公司列表失败:' + err,
        icon: 'warning',
        duration: 1500
      });
    })
  },
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