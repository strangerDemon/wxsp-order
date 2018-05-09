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
    pages: [
      '^pages/index/main',
      "pages/userRegister/main",
      "pages/map/main",

      "pages/main/OrderCertificate/main",
      "pages/main/Order/main",
      "pages/main/OrderList/main",
      "pages/main/Redemption/main",

      "pages/msg/msg_fail/main",
      "pages/msg/msg_success/main"
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '报餐系统',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: true
    },
    tabBar: {
      "color": "#000000",
      "borderStyle": "#000",
      "selectedColor": "#9999FF",
      "list": [{
          "pagePath": "pages/main/Order/main",
          "text": "",
          "iconPath": "/static/images/tabbar_order_unselected.jpg",
          "selectedIconPath": "/static/images/tabbar_order_selected.jpg"
        },
        {
          "pagePath": "pages/main/OrderList/main",
          "text": "",
          "iconPath": "/static/images/tabbar_search_unselected.jpg",
          "selectedIconPath": "/static/images/tabbar_search_selected.jpg"
        },
        {
          "pagePath": "pages/main/OrderCertificate/main",
          "text": "",
          "iconPath": "/static/images/tabbar_certificate_unselected.jpg",
          "selectedIconPath": "/static/images/tabbar_certificate_selected.jpg"
        },
        {
          "pagePath": "pages/main/Redemption/main",
          "text": "",
          "iconPath": "/static/images/tabbar_redemption_unselected.jpg",
          "selectedIconPath": "/static/images/tabbar_redemption_selected.jpg"
        }, {
          "pagePath": "pages/index/main",
          "text": "",
          "iconPath": "/static/images/tabbar_my_unselected.jpg",
          "selectedIconPath": "/static/images/tabbar_my_selected.jpg"
        },
      ]
    }
  }
}