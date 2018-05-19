<template>
  <div class="Redemption">
    <love-loading v-if="showLoading"></love-loading>
    <block v-if="!showLoading">
      <mini-loading v-if="redemptionLoading" :type="1" :isFullScreen="true"></mini-loading>
      <div v-if="isUserWarning||isWarning" :class="isUserWarning||isWarning?'warning-background slidown':'warning-background'">
        <div v-if="isUserWarning&&!isLogin" class="warning-text" @click="userRegister">{{userWarningText}}</div>
        <div v-else-if="isUserWarning&&isLogin" class="warning-text">{{userWarningText}}</div>
        <div v-else-if="isWarning" class="warning-text">
          {{warningText}}
        </div>
      </div>
      <user-info :isShowName="true" :isShowBalance="true"></user-info>
      <div v-if="isLogin&&redemptionList.length>0" class="admire write-bg-color page__bd">请现场与工作人员操作</div>
      <div v-if="isLogin&&redemptionList.length>0" slot="header">
        <div class="list-title weui-flex kind-list__item-hd kind-list__item-hd_show">
          <div class="weui-flex__item">换购物品（多选）</div>
          <image class="kind-list__img" src="/static/images/icon_nav_nav.png" @click="isShowRedemption=!isShowRedemption"></image>
        </div>
        <div v-if="isShowRedemption" class="write-bg-color page__bd">
          <!--<checkbox-group>
              <div class="el-card" :style="item.checked?'border-color: #409eff;':''" v-for="(item,index) in redemptionList" :key="item" @click="checkItem(item.value)">
                <checkbox :value="item.value" :checked="item.checked"/>
                <span>{{item.label}}</span>
              </div>
          </checkbox-group>-->
           <checkbox-group @change="checkboxChange">
              <div class="el-card" :style="item.checked?'border-color: #409eff;':''" v-for="(item,index) in redemptionList" :key="item">
                <checkbox :value="item.value" :checked="item.checked"/>
                <span>{{item.label}}</span>
              </div>
          </checkbox-group>
        </div>
        <div v-else class="el-card" style="background-color:#EEEEE0">
          <div class="dishLabel" v-for="(item,index) in redemptionList" :key="index" v-if="item.checked">{{item.label}}</div>
        </div>
        <div class="write-bg-color page__bd weui-cell weui-cell_input">
            <div class="weui-cell__hd">
              <div class="weui-label">金额</div>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input" :placeholder="'成交金额[0~'+userInfo.money+'元]'" type="number" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" @focus="hideList()" @blur="showList()" v-model="money"/>
            </div>
        </div>
      </div>
      <div v-if="!isUserWarning&&money>0?true:false" @click="commit" style="text-align: center;margin: 13px 8px 8px;">
          <image src="/static/images/orderCommit.png"  class="orderCommit commitImage"></image>
          <text class="orderCommit commitText">确定</text>
      </div>
    </block>
  </div>
</template>
<script>
  import userInfo from "@/components/usetInfo";
  import loveLoading from "@/components/loading";
  import miniLoading from "@/components/miniLoading";
  export default {
    name: "Redemption",
    directives: {},
    components: {
      userInfo,
      loveLoading,
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
      commit() {
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
          vm.$store.commit("doChangeBuy", {
            openId: vm.userInfo.openId,
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
      /*checkItem(value) {
        let vm = this
        vm.redemption = [];
        vm.redemptionList.forEach(function(item) {
          if (value == item.value) {
            if (!item["checked"] || item["checked"] == "") {
              item["checked"] = true;
            } else {
              item["checked"] = false;
            }
          }
          if (item["checked"]) {
            vm.redemption.push(item.value);
          }
        })
      },*/
      hideList() {
        this.isShowRedemption = false;
      },
      showList() {
        this.isShowRedemption = true;
      }
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
    height: 25px;
    background-color: red;
    top: 0px;
  }

  .warning-text {
    color: #fff;
    text-align: center;
    width: 100%;
    font-size: 16px;
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
    height: 95rpx;
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

  .titles {
    text-align: center;
  }

  .title {
    display: block;
    width: 100%;
    margin: 5px 10px;
  }

  .item {
    margin: 20px 10px;
  }

  .money {
    text-align: center;
    width: 100%;
    display: block;
    font-size: 24px;
    color: red;
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
    padding-left: 10px;
  }
</style>