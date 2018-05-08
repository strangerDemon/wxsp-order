import Vue from 'vue'
import App from './msg_success'
import store from "../../../store";

const app = new Vue({
  store,
  ...App
});
app.$mount()