import Vue from "vue";
import Vuex from "vuex";
import * as modules from "./modules";

Vue.use(Vuex);

const state = {};

const getters = {};
const mutations = {};
const actions = {};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
});
