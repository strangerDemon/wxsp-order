import Vue from 'vue'
import App from './OrderCertificate'
import store from "../../../store"

const app = new Vue({
  store,
  ...App
});
app.$mount()