<template>
  <div class="OrderCertificate">
    <mini-loading v-if="showLoading" :type="1" :isFullScreen="true"></mini-loading>
    <block v-if="!showLoading">
      <div v-if="isUserWarning||isInitWaining" :class="isUserWarning||isInitWaining?'slidown warning-background':'warning-background'">
        <div v-if="isUserWarning&&!isLogin" class="warning-text" @click="userRegister" v-html="userWarningText"></div>
        <div v-else-if="isUserWarning&&isLogin" class="warning-text" v-html="userWarningText"></div>
      </div>
      <user-info :isShowName="true" :isShowBalance="false"></user-info>
      <div v-if="isLogin" class="orderList">
        <!--暂时无点击事件，防止用户今天点完，查询第二天然后截图，再退餐-->
        <picker mode="date" @change="updatePicker">
          <span class="title">{{dateStr}}<span v-if="!isToday">(预览)</span></span>   
        </picker>
        <ticket v-for="(lunch,index) in lunchTimes" v-if="lunch>0" :key="index" :selectStyle="index+1" :ticketType="lunchName[index]" :number="lunch"></ticket>
      </div>
    </block>
  </div>
</template>
<script>
  const week = [
    "星期天",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ];
  import userInfo from "@/components/usetInfo";
  import ticket from "@/components/ticket";
  export default {
    name: "OrderCertificate",
    directives: {},
    components: {
      userInfo,
      ticket
    },
    data() {
      return {
        today: "",
        isToday: false,
        pickerDate: "",
        dateStr: "",
        lunchName: [],
        lunchTimes: []
      };
    },
    props: {},
    computed: {
      isUserWarning() {
        return this.$store.state.user.isUserWarning;
      },
      userWarningText() {
        return this.$store.state.user.userWarningText;
      },
      showLoading() {
        return this.$store.state.init.showLoading;
      },
      isLogin() {
        return this.$store.state.user.isLogin;
      },
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      orderList() {
        return this.$store.state.order.certificateList;
      }
    },
    watch: {
      orderList(orderList) {
        let vm = this;
        vm.lunchTimes = new Array(3).fill(0);
        vm.lunchName = new Array(3);
        orderList.forEach(element => {
          vm.lunchName[element.orderType - 1] = element.orderName;
          vm.lunchTimes[element.orderType - 1]++;
        });
      }
    },
    methods: {
      formatDate(date) {
        let vm = this;
        vm.dateStr =
          date.getMonth() +
          1 +
          "月" +
          date.getDate() +
          "日  " +
          week[date.getDay()];
        vm.pickerDate = (date.getYear() + 1900) + "-" + (date.getMonth() + 1) +
          "-" + date.getDate();
      },
      updatePicker(e) {
        let vm = this;
        vm.pickerDate = e.target.value
        let dd = new Date(vm.pickerDate);
        vm.formatDate(dd);
        if (vm.today == vm.pickerDate) {
          vm.isToday = true;
        } else {
          vm.isToday = false;
        }
        vm.getCertificate(new Date(
          dd.setTime(dd.getTime() - 24 * 60 * 60 * 1000)
        ).toLocaleDateString());
      },
      getCertificate(day) {
        let vm = this;
        vm.$store.commit("getOrderList", {
          from: "orderCertificate",
          name: "null",
          openId: vm.userInfo.openId,
          startDate: day,
          endDate: day,
          orderType: 0,
          changeType: 2,
          page: 0,
          isCancle: 1,
        });
      },
      userRegister() {
        wx.navigateTo({
          url: '../../userRegister/main'
        })
      },
      initRequest() {
        let vm = this;
        if (vm.isLogin) {
          let today = new Date();
          vm.formatDate(today);
          vm.today = vm.pickerDate;
          vm.isToday = true;
          vm.getCertificate(new Date(
            today.setTime(today.getTime() - 24 * 60 * 60 * 1000)
          ).toLocaleDateString());
        }
      },
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      this.initRequest();
    },
    onPullDownRefresh() {
      this.initRequest();
      wx.stopPullDownRefresh();
    },
    /*
     * 生命周期函数--监听页面显示
     */
    onShow() {
      wx.setNavigationBarTitle({
        title: '凭证',
      })
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
    height: 28px;
    background-color: red;
    z-index: 9999;
  }

  .warning-text {
    color: #fff;
    text-align: center;
    width: 100%;
    font-size: 18px;
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

  .OrderCertificate {
    position: absolute;
    height: 100%;
    width: 100%;
    font-size: 18px;
    scroll-behavior: auto;
    background-color: #F2F6FC;
  }

  .userInfoDiv {
    text-align: center;
    margin: 13px 8px 8px;
  }

  .userDiv {
    display: block;
    margin: 5px 0;
    position: relative;
  }

  .balance,
  .username {
    font-family: fantasy;
  }

  .orderList {
    margin-top: 10px;
  }

  .item {
    margin: 35px 10px;
    font-size: 40px;
    display: block;
  }

  .title {
    font-size: 30px;
    text-align: center;
    display: block;
    margin: 10px;
    background-color: #fff;
    border-radius: 4px;
    margin: 10px 5px;
    padding: 5px;
  }
</style>