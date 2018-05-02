<template>
  <div class="order">
    <user-info :isShowName="true" :isShowBalance="true"></user-info>
    <div class="promptDiv">
      <div class="prompt">就餐时间：下一个工作日中午</div>
      <div class="prompt">点餐时间：早 {{orderParam.startTime}}点 至 晚 {{orderParam.endTime}}点</div>
    </div>
    <!--<div class="admire" v-show="isAdmire">金额不足，请先充值</div>-->
    <div class="admire" v-show="showNoUser">没有点餐账户，请联系管理员添加</div>
    <div class="menuDiv">
      <div slot="header" class="clearfix">
        <span>菜品明细：</span>
        <i class="el-icon-arrow-down isShowMenuButton" @click="isShowMenu=!isShowMenu"></i>
      </div>
      <div v-show="isShowMenu">
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
      <span class="space"></span>
    </div>
   
    <picker @change="commitAction" :value="lunchType" :range="lunchTypeOptions">
        <!-- <button id="pickerButton" v-show="false" class="weui-btn saveButton" type="primary"></button>-->
         <button v-if="!showNoUser&&isOrderOrNot" class="weui-btn saveButton" type="primary" @click="commit">点餐</button>
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
        showNoUser: true,
        isOrderOrNot: false,
        isShowMenu: true,
        orderTimes: 0,
        lunchType: "c",
        lunchTypeTimes: [],
        lunchTypeOptions: ["a餐", "b餐", "c餐"],
      };
    },
    props: {},
    computed: {
      orderParam() {
        return this.$store.state.order.orderParam;
      },
      userInfo() {
        return this.$store.state.init.userInfo;
      },
      menuList() {
        return this.$store.state.init.menuList;
      },
      orderList() {
        return this.$store.state.order.orderList;
      }
    },
    watch: {
      orderList(list) {
        let vm = this;

        if (vm.orderParam != null) {
          vm.updatelunchTypeTimes();
        }
        // if (vm.userInfo != null) {
        //   vm.updateIsAdmire();
        // }
      },
      orderParam(orderParam) {
        let vm = this;
        if (!orderParam.isOrderOrNot) {
          wx.showToast("点餐程序已关闭", "提示");
          vm.isOrderOrNot = false;
        } else {
          vm.isOrderOrNot = true;
        }
        if (vm.orderList != null) {
          vm.updatelunchTypeTimes();
        }
      },
      userInfo(userInfo) {
        console.log(userInfo)
        let vm = this;
        vm.showNoUser = false;
        if (vm.orderList != null) {
          // vm.updateIsAdmire();
          vm.updatelunchTypeTimes();
        }
      }
    },
    methods: {
      updateIsAdmire() {
        let vm = this;
        let balance = vm.userInfo.balance;

      },
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
          wx.showToast(
            "只能在 " +
            vm.orderParam.startTime +
            " 至 " +
            vm.orderParam.endTime +
            " 间退餐",
            "提示"
          );
          return;
        }
        wx.showModal({
          title: '提示',
          content: "确定取消订餐?",
          success: function(res) {
            if (res.confirm) {
              vm.$store.commit("cancle", {
                wechatId: vm.userInfo.wechatId,
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
      commit() {
        let vm = this;
        if (!vm.checkDate()) {
          wx.showToast(
            "只能在 " +
            vm.orderParam.startTime +
            " 至 " +
            vm.orderParam.endTime +
            " 间点餐",
            "提示"
          );
          return;
        }
        /*if (vm.orderTimes > 0) {
          wx.showModal({
            title: '提示',
            content: "今日已点餐" + vm.orderTimes + "次, 是否继续点餐?",
            success: function(res) {
              if (res.confirm) {
                vm.setDialoglunchType();
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else {*/
        vm.setDialoglunchType();
        //}
      },
      setDialoglunchType() {
        let vm = this;
        vm.lunchTypeOptions = [];
        vm.lunchType = "c";
        let balance = vm.userInfo.balance;
        let canOrder = false;
        for (let i = 0, length = vm.orderParam.lunch.length; i < length; i++) {
          if (
            vm.lunchTypeTimes[i] >= vm.orderParam.lunch[i].maxOrderTimes ||
            vm.userInfo.userType > vm.orderParam.lunch[i].value ||
            balance < vm.orderParam.lunch[i].money
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
        if (canOrder) {
          // document.getElementById("pickerButton").click();
        } else {
          wx.showToast("无法点餐（点餐次数已满或金额不足）");
        }
      },
      commitAction() {
        let vm = this;
        let isSelect = false;
        for (let i = 0, length = vm.orderParam.lunch.length; i < length; i++) {
          if (vm.orderParam.lunch[i].value == vm.lunchType) {
            isSelect = true;
          }
        }
        if (!isSelect) {
          wx.showToast("请选择订餐类别", "提示");
          return;
        }
        vm.$store.commit("order", {
          wechatId: vm.userInfo.wechatId,
          orderType: vm.lunchType,
          func: function() {
            vm.requestToday();
          }
        });
      },
      requestToday() {
        this.$store.commit("getOrderList", {
          name: "null",
          wechatId: vm.userInfo.wechatId,
          startDate: today,
          endDate: today,
          orderType: 0,
          changeType: 2,
          page: 0,
          isCancle: 1
        });
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      let vm = this;
      vm.$store.commit("getorderParam", {
        wechatId: vm.userInfo.wechatId,
      });
      vm.requestToday();
      vm.$store.commit("getMeunList", { wechatId: vm.userInfo.wechatId });
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
</style>