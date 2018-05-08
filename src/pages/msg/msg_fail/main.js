import Vue from 'vue'
import App from './msg_fail'
import store from "../../../store";

const app = new Vue({
  store,
  ...App
});
app.$mount()