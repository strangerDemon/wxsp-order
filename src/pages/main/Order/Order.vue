<template>
  <div class="order">
    <user-info :isShowName="true" :isShowBalance="true"></user-info>
    <div class="promptDiv">
      <div class="prompt">就餐时间：下一个工作日中午</div>
      <div class="prompt">点餐时间：早 {{orderParam.startTime}}点 至 晚 {{orderParam.endTime}}点</div>
    </div>
    <div class="menuDiv">
      <div slot="header" class="clearfix">
        <span>菜品明细：</span>
        <i class="el-icon-arrow-down isShowMenuButton" @click="isShowMenu=!isShowMenu"></i>
      </div>
      <div v-if="isShowMenu">
        <div class="dish" v-for="(dish,index) in menuList" :key="index">{{dish.name}}</div>
      </div>
    </div>
    <div class="todayOrderList">
      <div>今日点餐情况:</div>
      <div v-for="(order,index) in orderList" :key="index" v-if="order.orderType>0">
        <view class="weui-cells weui-cells_after-title">
          <view class="weui-cell">
            <view class="weui-cell__bd">{{order.orderName}}</view>
            <view class="weui-cells__title">{{order.createDate}}</view>
            <view v-if="order.isCancle" style="color: red" class="weui-cell__ft buttonText">已退订</view>
            <view v-else style="color: blue" @click="cancel(order.id)" class="weui-cell__ft buttonText">退订</view>
          </view>
        </view>
      </div>
      <div v-if="orderList.length==0" class="unOrderList">未查询到记录</div>
      <span class="space"></span>
    </div>
    <picker @change="commitAction" :range="lunchTypeOptions" range-key="label">
        <!-- <button id="pickerButton" v-show="false" class="weui-btn saveButton" type="primary"></button>-->
         <button v-if="isOrderOrNot" class="weui-btn saveButton" type="primary">点餐</button>
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
        isAdmire: false,
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
        if (vm.currentPage != vm.$options.name) return;
        if (vm.orderParam != null) {
          vm.updatelunchTypeTimes();
        }
      },
      orderParam(orderParam) {
        let vm = this;
        if (vm.currentPage != vm.$options.name) return;
        if (!orderParam.isOrderOrNot) {
          wx.showModal({
            title: '提示',
            content: "点餐程序已关闭",
            success: function(res) {
              vm.isOrderOrNot = false;
            }
          })
        } else {
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
        }
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
          wx.showModal({
            title: '提示',
            content: "无法点餐（点餐次数已满或金额不足）",
            success: function(res) {}
          })
          vm.isOrderOrNot = false;
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
    }
  };
</script>
<style lang="css"
       scoped>
  .order {
    position: absolute;
    height: 100%;
    width: 100%;
    font-size: 18px;
    scroll-behavior: auto;
  }

  .promptDiv {
    text-align: center;
    margin: 5px 0;
    position: relative;
  }

  .prompt {
    margin: 3px 0;
  }

  .admire {
    text-align: center;
    font-size: 16px;
    color: red;
    margin: 5px;
  }

  /* 菜品列表 */

  .clearfix {
    font-size: 20px;
    margin: 5px 10px;
  }

  .dish {
    position: relative;
    left: 5vw;
    margin: 2.5px 0;
    width: 29%;
    display: inline-table;
  }

  .isShowMenuButton {
    float: right;
  }

  .saveButton {
    position: fixed;
    bottom: 0;
    min-height: 48px;
    border-radius: 0px;
    width: 100%;
  }

  .space {
    width: 100%;
    height: 60px;
    position: absolute;
  }

  .buttonText {
    cursor: pointer;
  }

  .unOrderList {
    display: block;
    margin: 25px;
    position: relative;
    font-family: fantasy;
  }
</style>