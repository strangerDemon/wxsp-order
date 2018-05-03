import * as requestTask from "../../utils/requestTask";
/**
 * Initial state
 * @type {Object}
 */
const state = {
  //系统参数
  systemParam: {
    provider: "厦门众图", //提供服务公司
    relevantUrl: "https://www.ztgis.com" //相关条款连接
  },
  companyList: [{"companyId":"xmzt","label":"厦门众图","value":0,"contacts":"demo"},{"companyId":"fjsdzcyy","label":"福建省地质测绘院","value":1,"contacts":"demo"},{"companyId":"tagtj","label":"同安国土局","value":2,"contacts":"张工"}], //公司列表
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
      console.log(res);
    }).catch(err => {
      console.log("getSystemParam", err)
    })
  },
  //公司列表
  getCompanyList(state, info) {
    new Promise((resolve, reject) => {
      requestTask.wxRequest("getCompanyList", info, resolve, reject)
    }).then(res => {
      console.log("getCompanyList",res);
      state.companyList = res.companyList;
    }).catch(err => {
      console.log("getCompanyList", err)
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