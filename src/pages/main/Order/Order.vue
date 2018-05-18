<template>
  <div class="order">
    <love-loading v-if="showLoading"></love-loading>
    <block v-if="!showLoading">
      <div v-if="isUserWarning||isInitWaining" :class="isUserWarning||isInitWaining?'slidown warning-background':'warning-background'">
        <div v-if="isUserWarning&&!isLogin" class="warning-text" @click="userRegister">{{userWarningText}}</div>
        <div v-else-if="isUserWarning&&isLogin" class="warning-text">{{userWarningText}}</div>
        <div v-else-if="isInitWaining" class="warning-text">
          {{initWarningText}}
        </div>
      </div>
      <user-info :isShowName="true" :isShowBalance="true"></user-info>
      <div class="menuDiv">
        <div  class="list-title weui-flex kind-list__item-hd kind-list__item-hd_show">
          <div class="weui-flex__item">菜品明细：</div>
          <image class="kind-list__img" src="/static/images/icon_nav_nav.png" @click="isShowMenu=!isShowMenu"></image>
        </div>
        <div v-if="isShowMenu" class="write-bg-color page__bd">
          <div class="weui-grids">
            <div v-for="(dish,index) in menuList" :key="index" class="weui-grid dish">
              <block v-if="dish.name!=''">
                <image class="weui-grid__icon dishImage" :src="dish.image"  @click="previewImage(index)"/>
                <div class="weui-grid__label dishName">{{dish.name}}</div>
              </block>
              <block v-else>
                <image class="weui-grid__icon dishImage"/>
                <div class="weui-grid__label dishName"> &nbsp;</div>
              </block>
            </div>
          </div>
        </div>
        <div v-else class="page__bd" style="background-color:#EEEEE0">
          <div class="dishLabel" v-for="(dish,index) in menuList" :key="index">{{dish.name}}</div>
        </div>
      </div>
      <blobk>
        <div class="list-title weui-flex kind-list__item-hd kind-list__item-hd_show" v-if="orderList.length>0">
          <span class="weui-flex__item title">今日点餐情况:</span>
        </div>
        <record v-for="(order,index) in orderList" :key="index" v-if="order.orderType>0" :record="order" :fromSource="'order'" @cancel="cancel(order.id)"></record>
      </blobk>
      <picker style="text-align:center;margin: 13px 8px 8px;" @change="commitAction" :range="lunchTypeOptions" range-key="label">
        <block v-if="isOrderOrNot">
          <image  src="/static/images/orderCommit.png"  class="orderCommit commitImage"></image>
          <text class="orderCommit commitText">点餐</text>
        </block>
      </picker>
    </block>
  </div>
</template>
<script>
  import userInfo from "@/components/usetInfo";
  import loveLoading from "@/components/loading";
  import record from "@/components/record";
  export default {
    name: "Order",
    directives: {},
    components: { userInfo, loveLoading, record },
    data() {
      return {
        isInitWaining: false,
        initWarningText: "warning",
        isOrderOrNot: false,
        isShowMenu: true,
        orderTimes: 0,
        lunchTypeTimes: [],
        lunchTypeOptions: [],
        imageList: [],
      };
    },
    props: {},
    computed: {
      showLoading() {
        return this.$store.state.init.showLoading;
      },
      isUserWarning() {
        return this.$store.state.user.isUserWarning;
      },
      userWarningText() {
        return this.$store.state.user.userWarningText;
      },
      isLogin() {
        return this.$store.state.user.isLogin;
      },
      orderParam() {
        return this.$store.state.order.orderParam;
      },
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      menuList() {
        return this.$store.state.order.menuList;
      },
      orderList() {
        return this.$store.state.order.orderList;
      },
      systemParamInit() {
        return this.$store.state.init.systemParamInit;
      },
    },
    watch: {
      userInfo(userInfo) {
        let vm = this;
        if (!vm.systemParamInit) {
          vm.$store.commit("getSystemParam", {});
          vm.$store.commit("getOrderParam", { openId: "" });
          vm.$store.commit("getMeunList", { openId: "" });
          if (vm.isLogin) {
            vm.requestToday();
          }
        }
      },
      menuList(list) {
        let vm = this
        let ROW = 3;
        let length = list.length
        //补全行缺失
        if (length % ROW != 0) {
          let addItemNum = ROW - length % ROW;
          for (let i = 0; i < addItemNum; i++) {
            list.push({ name: "", image: "" });
          }
        }
        //提取图片
        vm.imageList = [];
        list.forEach(function(item) {
          if (item.name != "") {
            vm.imageList.push(item.image)
          }
        });
      },
      orderList(list) {
        let vm = this;
        if (vm.orderParam != null) {
          vm.updatelunchTypeTimes();
        }
      },
      orderParam(orderParam) {
        let vm = this;
        if (!orderParam.isOrderOrNot) {
          vm.isInitWaining = true;
          vm.initWarningText = "点餐程序已关闭";
          vm.isOrderOrNot = false;
        } else {
          vm.isInitWaining = false;
          if (!vm.isUserWarning) {
            vm.isOrderOrNot = true;
          }
        }
        if (vm.orderList != null) {
          vm.updatelunchTypeTimes();
          vm.setLunchPicker();
        }
      },
      isUserWarning(warning) {
        let vm = this;
        if (vm.isOrderOrNot) {
          vm.isOrderOrNot = warning;
        }
      }
    },
    methods: {
      //预览图片
      previewImage(index) {
        let vm = this;
        wx.previewImage({
          current: vm.imageList[index], //当前图片地址
          urls: vm.imageList, //所有要预览的图片的地址集合 数组形式
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      //更新点餐次数
      updatelunchTypeTimes() {
        let vm = this;
        vm.orderTimes = 0;
        vm.lunchTypeTimes = new Array(vm.orderParam.lunch.length).fill(0);
        for (let i = 0; i < vm.orderList.length; i++) {
          if (vm.orderList[i].orderType > 0) {
            vm.orderTimes++;
          }
          for (let j = 0, length = vm.orderParam.lunch.length; j < length; j++) {
            if (vm.orderList[i].orderType == vm.orderParam.lunch[j].value) {
              vm.lunchTypeTimes[j]++;
            }
          }
        }
      },
      //取消点餐次数
      cancel(orderId) {
        let vm = this;
        if (!vm.checkDate()) {
          wx.showModal({
            title: '提示',
            content: "只能在 " + vm.orderParam.startTime + " 至 " +
              vm.orderParam.endTime + " 间退餐",
            success: function(res) {
              return;
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: "确定取消订餐?",
            success: function(res) {
              if (res.confirm) {
                vm.$store.commit("cancle", {
                  openId: vm.userInfo.openId,
                  Id: orderId,
                  func: function() {
                    vm.requestToday();
                  }
                });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      //校验时间
      checkDate() {
        let vm = this;
        var current = new Date(); //当前时间
        var hour = current.getHours();
        if (hour >= vm.orderParam.endTime || hour < vm.orderParam.startTime) {
          return false;
        }
        return true;
      },
      //设置午餐选择
      setLunchPicker() {
        let vm = this;
        vm.lunchTypeOptions = [];
        let money = vm.userInfo.money;
        let canOrder = false;
        for (let i = 0, length = vm.orderParam.lunch.length; i < length; i++) {
          if (
            vm.lunchTypeTimes[i] >= vm.orderParam.lunch[i].maxOrderTimes ||
            vm.userInfo.userType > vm.orderParam.lunch[i].value ||
            money < vm.orderParam.lunch[i].money
          ) {
            vm.lunchTypeOptions.push({
              value: vm.orderParam.lunch[i].value,
              label: vm.orderParam.lunch[i].label,
              disabled: true
            });
          } else {
            vm.lunchTypeOptions.push(vm.orderParam.lunch[i]);
            canOrder = true;
          }
        }
        if (!canOrder) {
          vm.isInitWaining = true;
          vm.initWarningText = "余额不足，无法点餐";
          vm.isOrderOrNot = false;
        } else {
          vm.isInitWaining = false;
          vm.isOrderOrNot = true;
        }
      },
      //提交点餐
      commitAction(e) {
        let vm = this;
        if (!vm.checkDate()) {
          wx.showModal({
            title: '提示',
            content: "只能在 " + vm.orderParam.startTime + " 至 " +
              vm.orderParam.endTime + " 间退餐",
            success: function(res) {
              return;
            }
          })
        } else {
          vm.$store.commit("order", {
            openId: vm.userInfo.openId,
            orderType: vm.orderParam.lunch[e.target.value].value,
            func: function() {
              vm.requestToday();
            }
          });
        }
      },
      //请求今日点餐
      requestToday() {
        let vm = this
        let today = new Date().toLocaleDateString();
        vm.$store.commit("getOrderList", {
          from: "order",
          name: "null",
          openId: vm.userInfo.openId,
          startDate: today,
          endDate: today,
          orderType: 0,
          changeType: 2,
          page: 0,
          isCancle:0// 1 已退订的也显示
        });
        vm.$store.commit("getUserInfo", { code: "", openId: vm.userInfo.openId });
      },
      //初始化页面用户登录
      getUserInfo() {
        let vm = this
        wx.login({
          success: function(res) { //获得唯一code
            if (res.code) {
              //console.log(res.code);
              //登录后台
              vm.$store.commit("getUserInfo", { code: res.code, openId: "" });
            } else {
              vm.getUnloginUserInfo();
            }
          }
        });
      },
      getUnloginUserInfo(callback) {
        let vm = this
        //console.log(vm.userInfo);
        // 未登录后台
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: (res) => {
                //console.log(res);
                if (vm.userInfo == null) {
                  vm.userInfo = res.userInfo
                } else {
                  vm.userInfo.nickName = res.userInfo.nickName
                  vm.userInfo.avatarUrl = res.userInfo.avatarUrl
                }
                vm.hasUserInfo = true;
                vm.$store.commit("setUserInfo", {
                  userInfo: vm.userInfo,
                  isLogin: vm.isLogin
                })
                if (callback != undefined) {
                  callback();
                }
              }
            })
          }
        });
      },
      userRegister() {
        wx.navigateTo({
          url: '../../userRegister/main'
        })
      },
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      this.getUserInfo();
    },
    onPullDownRefresh() {
      let vm = this
      this.getUserInfo();
      this.$store.commit("getSystemParam", {});
      if (vm.menuList.length == 0) {
        vm.$store.commit("getMeunList", { openId: "" });
      }
      if (vm.orderParam.lunch.length == 0) {
        vm.$store.commit("getOrderParam", { openId: "" });
      }
      this.setLunchPicker();
      wx.stopPullDownRefresh(); 
    },
    /*
     * 生命周期函数--监听页面显示
     */
    onShow() {
      wx.setNavigationBarTitle({
        title: '点餐',
      })
      if (this.showLoading) return;
      if (this.isLogin) {
        this.requestToday();
      }
      //this.setLunchPicker();
    },

    /*
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},
  };
</script>
<style lang="css"
       scoped>
  .warning-background {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 25px;
    background-color: red;
  }

  .warning-text {
    color: #fff;
    text-align: center;
    width: 100%;
    font-size: 16px;
  }

  .order {
    position: absolute;
    height: 100%;
    width: 100%;
    font-size: 18px;
    scroll-behavior: auto;
    background-color: #F2F6FC;
  }

  .dishLabel {
    position: relative;
    left: 5vw;
    margin: 2.5px 0;
    width: 29%;
    display: inline-table;
    color: #aaa;
    /*    text-align: center;*/
    padding-left: 10px;
  }

  .orderCommit {
    position: fixed;
    bottom: 5px;
    flex-direction: column;
    align-items: center;
    width: 130rpx;
    height: 130rpx;
    margin-left: -65rpx;
    border-radius: 50%;
  }

  .commitImage {}

  .commitText {
    height: 95rpx;
    color: #fff;
  }

  .weui-flex {
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center
  }

  .kind-list__img {
    width: 30px;
    height: 30px
  }

  .kind-list__item-hd {
    padding: 20px;
    -webkit-transition: opacity .3s;
    transition: opacity .3s
  }

  .kind-list__item-hd_show {
    opacity: .4
  }

  @keyframes slidown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0%);
    }
  }

  .slidown {
    display: block;
    animation: slidown .7s ease-in both;
  }

  .dish {
    padding: 2px;
    height: 33vw;
  }

  .dishImage {
    width: 100%;
    height: 100%;
  }

  .dishName {
    position: absolute;
    bottom: 0rpx;
    text-align: center;
    width: 60%;
    left: 20%;
    background-color: #fff;
  }

  .list-title {
    opacity: 1;
    background-color: #fff;
    margin: 5px;
    padding: 10px;
  }

  .write-bg-color {
    background-color: #fff;
  }

  .page__bd {
    margin: 5px;
  }
</style>