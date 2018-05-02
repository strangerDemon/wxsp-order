import Vue from 'vue'
import App from './App'
import store from "./store";


Vue.config.productionTip = false
App.mpType = 'app'


const app = new Vue({
  store,
  ...App
});

app.$mount("#app");

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main',
      'pages/logs/main',

      "pages/main/main",
      "pages/map/main",
      "pages/music/main",
      "pages/main/OrderCertificate/main",
      "pages/main/Order/main",
      "pages/main/OrderList/main",
      "pages/main/Redemption/main",
      "pages/main/NoUser/main",

      /*"pages/weuidemo/weui",
      "pages/weuidemo/button/button",
      "pages/weuidemo/list/list",
      "pages/weuidemo/input/input",
      "pages/weuidemo/slider/slider",
      "pages/weuidemo/uploader/uploader",
      "pages/weuidemo/article/article",
      "pages/weuidemo/badge/badge",
      "pages/weuidemo/flex/flex",
      "pages/weuidemo/footer/footer",
      "pages/weuidemo/gallery/gallery",
      "pages/weuidemo/grid/grid",
      "pages/weuidemo/icons/icons",
      "pages/weuidemo/loadmore/loadmore",
      "pages/weuidemo/panel/panel",
      "pages/weuidemo/preview/preview",
      "pages/weuidemo/progress/progress",
      "pages/weuidemo/actionsheet/actionsheet",
      "pages/weuidemo/dialog/dialog",
      "pages/weuidemo/msg/msg",
      "pages/weuidemo/msg/msg_success",
      "pages/weuidemo/msg/msg_fail",
      "pages/weuidemo/picker/picker",
      "pages/weuidemo/toast/toast",
      "pages/weuidemo/navbar/navbar",
      "pages/weuidemo/tabbar/tabbar",
      "pages/weuidemo/searchbar/searchbar"*/
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }
}