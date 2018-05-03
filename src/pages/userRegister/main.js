import Vue from 'vue'
import App from './userRegister'
import store from "../../store";

import '../../../static/css/weui.wxss';
const app = new Vue({
  store,
  ...App
});
app.$mount()