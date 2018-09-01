<template>
  <div class="Redemption">
    <mini-loading v-if="showLoading" :type="1" :isFullScreen="true"></mini-loading>
    <block v-if="!showLoading">
      <mini-loading v-if="redemptionLoading" :type="1" :isFullScreen="true"></mini-loading>
      <div v-if="isUserWarning||isWarning" :class="isUserWarning||isWarning?'warning-background slidown':'warning-background'">
        <div v-if="isUserWarning&&!isLogin" class="warning-text" @click="userRegister" v-html="userWarningText"></div>
        <div v-else-if="isUserWarning&&isLogin" class="warning-text" v-html="userWarningText"></div>
        <div v-else-if="isWarning" class="warning-text" v-html="warningText"></div>
      </div>
      <user-info :isShowName="true" :isShowBalance="true"></user-info>
      <div v-if="isLogin&&redemptionList.length>0" class="admire write-bg-color page__bd">换购时请与食堂管理人员联系</div>
      <form report-submit="ture" @submit="commit">
        <div v-if="isLogin&&redemptionList.length>0" slot="header">
          <div class="list-title weui-flex kind-list__item-hd kind-list__item-hd_show">
            <div class="weui-flex__item">换购物品（多选）</div>
            <image class="kind-list__img" src="/static/images/icon_nav_nav.png" @click="isShowRedemption=!isShowRedemption"/>
          </div>
          <div v-if="isShowRedemption" class="write-bg-color page__bd">
            <checkbox-group @change="checkboxChange">
              <div class="el-card" :style="item.checked?'border-color: #409eff;':''" v-for="(item,index) in redemptionList" :key="index">
                <checkbox :value="item.value" :checked="item.checked"/>
                <span>{{item.label}}</span>
              </div>
            </checkbox-group>
          </div>
          <div v-else class="el-card" style="background-color:#EEEEE0;padding:0px;">
            <div class="dishLabel" v-for="(item,index) in redemptionList" :key="index" v-if="item.checked">{{item.label}}</div>
          </div>
          <div class="write-bg-color page__bd inputDiv">
            <div class="titleLabel">
              <div class="">金额:</div>
            </div>
            <div class="inputLabel">
              <input class="" :placeholder="'成交金额[0~'+userInfo.money+'元]'" type="number" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" @focus="hideList()" @blur="showList()" v-model="money"/>
            </div>
          </div>
        </div>
        <button formType="submit" v-if="!isUserWarning&&money>0?true:false">
          <image src="/static/images/orderCommit.png"  class="orderCommit commitImage"/>
          <text class="orderCommit commitText">确定</text>
        </button>
      </form>
    </block>
  </div>
</template>
<script>
  import userInfo from "@/components/usetInfo";
  import miniLoading from "@/components/miniLoading";
  export default {
    name: "Redemption",
    directives: {},
    components: {
      userInfo,
      miniLoading
    },
    data() {
      return {
        isWarning: false,
        warningText: "",
        isShowRedemption: true,
        redemption: [],
        redemptionName: [],
        money: null,
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
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      redemptionList() {
        let list = this.$store.state.order.redemptionList;
        return this.resetEedemptionList(list)
      },
      redemptionResult() {
        return this.$store.state.order.redemptionResult;
      },
      redemptionLoading() {
        return this.$store.state.order.redemptionLoading;
      }
    },
    watch: {
      redemptionResult(result) {
        let vm = this
        let answer = result.split(":");
        wx.navigateTo({
          url: '../../msg/msg_success/main?title=' + answer[0] +
            '&details= 换购列表:' + vm.redemptionName + '\n换购金额:' + vm.money +
            '元',
        });
        vm.returnRedemption();
      }
    },
    methods: {
      userRegister() {
        wx.navigateTo({
          url: '../../userRegister/main'
        })
      },
      resetEedemptionList(list) {
        list.forEach(function(item) {
          item["checked"] = false;
        })
        return list
      },
      commit(e) {
        console.log(e)
        let vm = this;
        if (vm.money > vm.userInfo.money) {
          vm.isWarning = true;
          vm.warningText = "成交金额不能大于您的最大余额:" + vm.userInfo.money + "元";
          setTimeout(function() {
            vm.isWarning = false;
            return;
          }, 3000);

        } else if (!/^[0-9]*$/.test(vm.money)) {
          vm.isWarning = true;
          vm.warningText = vm.money == null ? "请输入金额" : "金额只能是数字";
          setTimeout(function() {
            vm.isWarning = false;
            return;
          }, 3000);
        } else if (vm.redemption.length == 0) {
          vm.isWarning = true;
          vm.warningText = "请选择换购物品";
          setTimeout(function() {
            vm.isWarning = false;
            return;
          }, 3000);
        } else {
          vm.redemptionList.forEach(element => {
            if (vm.redemption.includes(element.value)) {
              vm.redemptionName.push(element.label);
            }
          });
          let formId = "";
          if (e && e.target && e.target.formId) {
            formId = e.target.formId
          }
          vm.$store.commit("doChangeBuy", {
            openId: vm.userInfo.openId,
            formId: formId,
            value: vm.redemption.toString(),
            money: vm.money
          });
        }
      },
      returnRedemption() {
        let vm = this;
        vm.money = null;
        vm.redemption = [];
        vm.redemptionName = [];
        vm.$store.commit("getUserInfo", { code: "", openId: vm.userInfo.openId });
        vm.resetEedemptionList(vm.redemptionList);
      },
      checkboxChange(e) {
        let vm = this
        vm.redemption = e.target.value;
        vm.redemptionList.forEach(function(item) {
          if (e.target.value.includes(item.value)) {
            item["checked"] = true;
          } else {
            item["checked"] = false;
          }
        })
      },
      hideList() {
        this.isShowRedemption = false;
      },
      showList() {
        this.isShowRedemption = true;
      },
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      let vm = this;
      if (vm.isLogin) {
        vm.$store.commit("getRedemptionList", { openId: vm.userInfo.openId });
      }
    },
    onPullDownRefresh() {
      let vm = this;
      if (vm.isLogin) {
        vm.$store.commit("getRedemptionList", { openId: vm.userInfo.openId });
      }
      wx.stopPullDownRefresh();
    },
    /*
     * 生命周期函数--监听页面显示
     */
    onShow() {
      wx.setNavigationBarTitle({
        title: '换购',
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
  .Redemption {
    background-color: #F2F6FC;
    height: 100vh;
  }

  .warning-background {
    position: fixed;
    width: 100%;
    height: 28px;
    background-color: red;
    top: 0px;
    z-index: 9999;
  }

  .warning-text {
    color: #fff;
    text-align: center;
    width: 100%;
    font-size: 18px;
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

  .admire {
    text-align: center;
    font-size: 16px;
    color: red;
    margin: 5px;
  }

  .orderCommit {
    position: fixed;
    bottom: 5px;
    flex-direction: column;
    align-items: center;
    width: 130rpx;
    height: 130rpx;
    border-radius: 50%;
    z-index: 999;
    margin-left: -65rpx;
  }

  .commitImage {}

  .commitText {
    height: 110rpx;
    color: #fff;
  }

  .isShowButton {
    float: right;
    width: 30px;
    height: 30px
  }

  .moneyInput {
    display: inline-block;
    width: 80%;
  }

  .result {
    position: absolute;
    width: 100%;
    font-size: 18px;
    padding-bottom: 75px;
  }

  .redemptionDetails {
    margin: 10px;
  }

  .checkbox {
    display: block;
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

  .el-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: .3s;
    padding: 8px;
    margin: 4.5px 0px;
  }

  .dishLabel {
    position: relative;
    left: 5vw;
    margin: 2.5px 0;
    display: inline-table;
    color: #666;
    /*    text-align: center;*/
    padding: 8px 0px 8px 10px;
  }

  .inputDiv {
    padding: 5px 15px;
  }

  .titleLabel {
    display: inline-block;
    width: 20%;
    margin: 5px;
  }

  .inputLabel {
    position: absolute;
    display: inline-block;
    width: 70%;
    margin: 5px;
  }
</style>