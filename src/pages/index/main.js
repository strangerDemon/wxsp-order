import Vue from 'vue'
import App from './index'
import store from "../../store"

import '../../../static/css/weui.wxss';

const app = new Vue({
  store,
  ...App
})
app.$mount()