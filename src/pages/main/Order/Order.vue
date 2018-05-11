<template>
  <div class="order">
    <div v-if="isInitWaining" class="warning-background">
      <div class="warning-text">
        {{initWarningText}}
      </div>
      </div>
    <user-info :isShowName="true" :isShowBalance="true"></user-info>
    <div class="menuDiv">
      <div  class="weui-flex kind-list__item-hd kind-list__item-hd_show">
          <div class="weui-flex__item">菜品明细：</div>
          <image class="kind-list__img" src="/static/images/icon_nav_nav.png" @click="isShowMenu=!isShowMenu"></image>
      </div>
      <div v-if="isShowMenu" class="page__bd">
        <div class="weui-grids">
          <div v-for="(dish,index) in menuList" :key="index" class="weui-grid">
            <image class="weui-grid__icon" :src="dish.image==undefined||dish.image==''?'/static/images/undefined.png':dish.image" />
            <div class="weui-grid__label">{{dish.name}}</div>
          </div>
        </div>
      </div>
      <div v-if="!isShowMenu" class="page__bd">
        <div class="dish" v-for="(dish,index) in menuList" :key="index">{{dish.name}}</div>
      </div>
    </div>
    <blobk>
      <div class="weui-flex kind-list__item-hd kind-list__item-hd_show" v-if="orderList.length>0">
        <span class="weui-flex__item title">今日点餐情况:</span>
      </div>
      <div v-for="(order,index) in orderList" :key="index" v-if="order.orderType>0">
        <div class="weui-cells weui-cells_after-title">
          <div class="weui-cell">
            <div class="weui-cell__bd">{{order.orderName}}</div>
            <div class="weui-cells__title">{{order.createDate}}</div>
            <div v-if="order.isCancle" style="color: red" class="weui-cell__ft buttonText">已退订</div>
            <div v-else style="color: blue" @click="cancel(order.id)" class="weui-cell__ft buttonText">退订</div>
          </div>
        </div>
      </div>
      <span class="space"></span>
    </blobk>
    <picker style="text-align:center;margin: 13px 8px 8px;" @change="commitAction" :range="lunchTypeOptions" range-key="label">
      <block v-if="isOrderOrNot">
        <image  src="/static/images/orderCommit.png"  class="orderCommit commitImage"></image>
        <text class="orderCommit commitText">点餐</text>
      </block>
    </picker>
  </div>
</template>
<script>
  import userInfo from "@/components/usetInfo"
  export default {
    name: "Order",
    directives: {},
    components: { userInfo },
    data() {
      return {
        isInitWaining: false,
        initWarningText: "warning",
        isOrderOrNot: false,
        isShowMenu: true,
        orderTimes: 0,
        lunchTypeTimes: [],
        lunchTypeOptions: [],
      };
    },
    props: {},
    computed: {
      currentPage() {
        return this.$store.state.init.currentPage;
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
      }
    },
    watch: {
      orderList(list) {
        let vm = this;
        if (vm.currentPage.toUpperCase() != vm.$options.name.toUpperCase())
          return;
        if (vm.orderParam != null) {
          vm.updatelunchTypeTimes();
        }
      },
      orderParam(orderParam) {
        let vm = this;
        if (vm.currentPage.toUpperCase() != vm.$options.name.toUpperCase())
          return;
        if (!orderParam.isOrderOrNot) {
          vm.isInitWaining = true;
          vm.initWarningText = "点餐程序已关闭";
          vm.isOrderOrNot = false;
        } else {
          vm.isInitWaining = false;
          vm.isOrderOrNot = true;
        }
        if (vm.orderList != null) {
          vm.updatelunchTypeTimes();
          vm.setLunchPicker();
        }
      },
    },
    methods: {
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
      checkDate() {
        let vm = this;
        var current = new Date(); //当前时间
        var hour = current.getHours();
        if (hour >= vm.orderParam.endTime || hour < vm.orderParam.startTime) {
          return false;
        }
        return true;
      },
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
          vm.initWarningText = "无法点餐（点餐次数已满或金额不足）";
          vm.isOrderOrNot = false;
        }else{
          vm.isInitWaining = false;
          vm.isOrderOrNot = true;
        }
      },
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
      requestToday() {
        let vm = this
        let today = new Date().toLocaleDateString();
        vm.$store.commit("getOrderList", {
          name: "null",
          openId: vm.userInfo.openId,
          startDate: today,
          endDate: today,
          orderType: 0,
          changeType: 2,
          page: 0,
          isCancle: 1
        });
        vm.$store.commit("getUserInfo", { code: "", openId: vm.userInfo.openId });
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      let vm = this;
      vm.$store.commit("getOrderParam", { openId: vm.userInfo.openId });
      vm.$store.commit("getMeunList", { openId: vm.userInfo.openId });
      vm.requestToday();
      vm.isOrderOrNot = true;
    },
    /*
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.$store.commit("setCurrentPage", { currentPage: "Order" })
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
    width: 100%;
    height: 35px;
    background-color: red;
  }

  .warning-text {
    color: #fff;
    text-align: center;
    width: 100%;
    font-size: 22px;
  }

  .order {
    position: absolute;
    height: 100%;
    width: 100%;
    font-size: 18px;
    scroll-behavior: auto;
  }

  .dish {
    position: relative;
    left: 5vw;
    margin: 2.5px 0;
    width: 29%;
    display: inline-table;
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

  .space {
    width: 100%;
    height: 60px;
    position: absolute;
  }

  .buttonText {
    cursor: pointer;
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
</style>