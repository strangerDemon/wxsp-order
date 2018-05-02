<template>
  <div class="orderList">
    <i :class="isShowSearch?'up dropDown':'down dropDown'" @click="isShowSearch=!isShowSearch"></i>
      <div class="search" v-show="isShowSearch">
        <view v-show="isAdmin" class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
              <view class="weui-label">用户名</view>
            </view>
            <view class="weui-cell__bd">
              <input v-model="username" class="weui-input" placeholder="请输入用户名"/>
            </view>
        </view>
        <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
              <view class="weui-label">起始时间</view>
            </view>
            <view class="weui-cell__bd">
              <picker mode="date" v-model="startDate"  @change="comfirmStart">
                  <view class="weui-input">{{startDate}}</view>
              </picker>
            </view>
        </view>
        <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
              <view class="weui-label">终止时间</view>
            </view>
            <view class="weui-cell__bd">
              <picker mode="date" v-model="endDate" @change="comfirmEnd">
                  <view class="weui-input">{{endDate}}</view>
              </picker>
            </view>
        </view>
        <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
              <view class="weui-label">消费类别</view>
            </view>
            <view class="weui-cell__bd">
              <picker  v-model="orderTypeStr" :range="orderTypeOptions">
                  <view class="weui-input">{{orderTypeStr}}</view>
              </picker>
            </view>
        </view>
         <view class="weui-cell weui-cell_input">
            <view class="weui-cell__hd">
              <view class="weui-label">账户记录</view>
            </view>
            <view class="weui-cell__bd">
              <picker  v-model="changeTypeStr" :range="changeTypeOptions">
                  <view class="weui-input">{{changeTypeStr}}</view>
              </picker>
            </view>
        </view>
        <button class="weui-btn mini-btn searchButton" type="primary" size="mini" @click="search(1)">查询</button>
      </div>
    <div class="list">
      <ul style="padding:10px 0;" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <div v-for="(order,index) in orderList" :key="index" v-if="order.orderType>0">
          <view class="weui-cells weui-cells_after-title">
            <view class="weui-cell">
                <view class="weui-cell__bd">{{isAdmin?order.name+' : '+order.orderName:order.orderName}}</view>
                <view class="weui-cells__title">{{order.createDate}}</view>
                <view v-if="order.isCancle" style="color: red" class="weui-cell__ft buttonText">已退订</view>
                <view v-else-if="checkDate(order.createDate)" style="color: blue" @click="cancel(order.id)" class="weui-cell__ft buttonText">退订</view>
            </view>
          </view>
        </div>
      </ul>    
    </div>
  </div>
</template>
<script>
  export default {
    name: "orderList",
    directives: {},
    components: {},
    data() {
      return {
        page: 1,
        isShowSearch: true,
        //search option
        username: "",
        startDate: null,
        endDate: null,
        startDateStr: "",
        endDateStr: "",
        changeType: "0", //0全部 1充值 2消费
        changeTypeStr: "全部",
        changeBoolean: false,
        changeTypeOptions: [{
            value: "0",
            label: "全部"
          },
          {
            value: "1",
            label: "充值"
          },
          {
            value: "2",
            label: "消费"
          },
          {
            value: "3",
            label: "扣款"
          }
        ],
        orderType: "0", //0全部 1a 2b 3c
        orderTypeStr: "全部",
        orderBoolean: false,
        orderTypeOptions: [{
            value: "0",
            label: "全部"
          },
          {
            value: "1",
            label: "a餐"
          },
          {
            value: "2",
            label: "b餐"
          },
          {
            value: "3",
            label: "c餐"
          },
          {
            value: "-1",
            label: "其他换购"
          }
        ],
        list: [],
        lastRequestTime: null
      };
    },
    props: {},
    computed: {
      code() {
        return this.$store.state.init.code;
      },
      isAdmin() {
        return this.$store.state.init.isAdmin;
      },
      systemParam() {
        return this.$store.state.init.systemParam;
      },
      orderList() {
        return this.$store.state.order.orderList;
      }
    },
    watch: {
      orderType(val) {
        if (val < 0) {
          this.orderTypeStr = this.orderTypeOptions[
            this.orderTypeOptions.length - 1
          ].label;
        } else {
          this.orderTypeStr = this.orderTypeOptions[val].label;
        }
      },
      changeType(val) {
        this.changeTypeStr = this.changeTypeOptions[val].label;
      },
      systemParam(systemParam) {
        let vm = this;
        vm.orderTypeOptions.push({
          value: "0",
          label: "全部"
        });
        vm.orderTypeOptions.push(systemParam.lunch[0]);
        vm.orderTypeOptions.push(systemParam.lunch[1]);
        vm.orderTypeOptions.push(systemParam.lunch[2]);
        vm.orderTypeOptions.push({
          value: "-1",
          label: "其他换购"
        });
        console.log(vm.orderTypeOptions);
      },
      orderList(list) {
        let vm = this;
        if (vm.page == 1) {
          vm.list = [];
        }
        if (list.length == 0) {
          if (vm.page == 1) {
            wx.showToast("未能查询到数据!", "提示");
          } else {
            vm.page--;
          }
        }
        for (let index = 0; index < list.length; index++) {
          vm.list.push(list[index]);
        }
      }
    },
    methods: {
      init() {
        let vm = this;
        vm.startDate = new Date();
        vm.endDate = new Date();
        vm.startDateStr = vm.handleConfirm(vm.startDate);
        vm.endDateStr = vm.handleConfirm(vm.endDate);
        vm.search(1);
      },
      open(key) {
        let vm = this;
        switch (key) {
          case "startDate":
            vm.$refs.startDate.open();
            break;
          case "endDate":
            vm.$refs.endDate.open();
            break;
          case "lunch":
            this.$refs.lunch.open();
            break;
          case "order":
            vm.$refs.order.open();
            break;
          default:
            break;
        }
      },
      comfirmStart() {
        let vm = this;
        vm.startDateStr = vm.handleConfirm(vm.startDate);
      },
      comfirmEnd() {
        let vm = this;
        vm.endDateStr = vm.handleConfirm(vm.endDate);
      },
      //时间picker
      handleConfirm(date) {
        let vm = this;
        let d = new Date(date);
        let dateTsring = "";
        dateTsring += d.getFullYear();
        dateTsring += "-" + (d.getMonth() + 1);
        dateTsring += "-" + d.getDate();
        return dateTsring;
      },
      openLunch() {
        this.$refs.lunch.open();
      },
      //校验时候可以退订
      checkDate(d) {
        if (d == undefined) return false;
        let vm = this;
        let current = new Date(); //当前时间
        let date = new Date(d.replace(/-/g, "/")); //ios 中不支持2017-3-31 =>2017/3/31
        let v1 = date.getFullYear(); //yyyy
        let v2 = date.getMonth() + 1; //MM
        let v3 = date.getDate(); //dd
        let year = current.getFullYear();
        let month = current.getMonth() + 1;
        let day = current.getDate();
        let hour = current.getHours();
        if (year > v1) {
          //年份小于当前年
          return false;
        } else if (year == v1 && month > v2) {
          //当前年，月份小于当前月
          return false;
        } else if (year == v1 && month == v2 && day > v3) {
          //当前年月，天小于当前天
          return false;
        } else if (
          year == v1 &&
          month == v2 &&
          day == v3 &&
          (hour >= vm.systemParam.endTime || hour < vm.systemParam.startTime)
        ) {
          //当前年月日，18点后不能
          return false;
        }
        return true;
      },

      search(page) {
        let vm = this;
        vm.page = page;
        let name = vm.isAdmin ? vm.username : "null";
        vm.$store.commit("getOrderList", {
          name: name,
          code: vm.code,
          startDate: vm.startDateStr,
          endDate: vm.endDateStr,
          orderType: vm.orderType,
          changeType: vm.changeType,
          page: page,
          isCancle: 0
        });
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      let vm = this;
      this.init();
      //滚轮滚动到最底部的事件
      window.onscroll = function() {
        //总的高度
        let sh = document.body.scrollHeight;
        //窗口高度
        let ch = window.innerHeight;
        //相对顶部的高度
        let h = this.scrollY;
        if (vm.lastRequestTime == null) {
          vm.lastRequestTime = new Date();
        } else {
          let now = new Date();
          if (now - vm.lastRequestTime < 500) {
            return;
          }
          vm.lastRequestTime = now;
        }
        if (h >= sh - ch) {
          vm.page++;
          vm.search(vm.page);
        }
      };
    }
  };
</script>
<style lang="css"
       scoped>
  .orderList {
    /*position: absolute;document.body.height=0*/
    height: 100%;
    width: 100%;
    font-size: 18px;
  }

  .search {
    position: relative;
    width: 100%;
    /* height: 42%;
  min-height: 280px; */
    top: 30px;
    margin-top: 10px;
  }

  .searchButton {
    left: 45vw;
  }

  .dropDown {
    background-image: url("../../../../static/images/dropDown.png");
    background-size: cover;
    /*等比缩放*/
    position: absolute;
    width: 25px;
    height: 25px;
    right: -5px;
    top: -12px;
  }

  .up {
    z-index: 9999;
    left: 45vw;
    height: 60px;
    width: 60px;
    transform: rotate(180deg);
    /*动画*/
    animation: upRotate 1s;
    -webkit-animation: upRotate 1s;
  }

  .down {
    z-index: 9999;
    left: 45vw;
    height: 60px;
    width: 60px;
    /*动画*/
    animation: downRotate 1s;
    -webkit-animation: downRotate 1s;
  }

  /*动画*/

  @keyframes upRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  }

  /*动画*/

  @keyframes downRotate {
    from {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .list {
    padding-top: 15px;
  }
</style>