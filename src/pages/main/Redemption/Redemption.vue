<template>
  <div class="Redemption">
    <div>
      <user-info :isShowName="true" :isShowBalance="true"></user-info>
      <div class="admire">请现场与工作人员操作</div>
      <div class="param">
          <div slot="header" class="clearfix">
            <span>换购类型（多选）</span>
            <i class="el-icon-arrow-down isShowButton" @click="isShowRedemption=!isShowRedemption"></i>
          </div>
          <div v-show="isShowRedemption">
            <checkbox-group @change="checkboxChange">
              <label class="checkbox" v-for="(item,index) in redemptionList" :key="item">
                <checkbox :value="item.value" :checked="item.checked"/>{{item.label}}
              </label>
            </checkbox-group>
          </div>
          <div class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
              <div class="weui-label">金额</div>
            </div>
            <div class="weui-cell__bd">
              <input class="weui-input clearfix" :placeholder="'成交金额[0~'+userInfo.money+'元]'" type="number" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="money"/>
            </div>
          </div>
      </div>
      <div style="text-align:center;margin: 13px 8px 8px;">
        <block @click="commit">
          <image  src="/static/images/orderCommit.png"  class="orderCommit commitImage"></image>
          <text class="orderCommit commitText">确定</text>
        </block>
      </div>
    </div>
  </div>
</template>
<script>
  import userInfo from "@/components/usetInfo"
  export default {
    name: "Redemption",
    directives: {},
    components: {
      userInfo
    },
    data() {
      return {
        isShowRedemption: true,
        redemption: [],
        redemptionName: [],
        money: null,
      };
    },
    props: {},
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      redemptionList() {
        let list = this.$store.state.order.redemptionList;
        return this.resetEedemptionList(list)
      },
      redemptionResult() {
        return this.$store.state.order.redemptionResult;
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
      resetEedemptionList(list) {
        list.forEach(function(item) {
          item["checked"] = false;
        })
        return list
      },
      commit() {
        let vm = this;
        if (vm.money > vm.userInfo.money) {
          wx.showModal({
            content: "成交金额不能大于" + vm.userInfo.money,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                return;
              }
            }
          });
        } else if (!/^[0-9]*$/.test(vm.money)) {
          wx.showModal({
            content: "金额只能是数字",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                return;
              }
            }
          });
        } else if (vm.redemption.length == 0) {
          wx.showModal({
            content: "请选择换购物品",
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                return;
              }
            }
          });
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
        vm.money = 0;
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
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      let vm = this;
      vm.$store.commit("getRedemptionList", { openId: vm.userInfo.openId });
    },
    /*
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.$store.commit("setCurrentPage", { currentPage: "Redemption" })
    },

    /*
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},
  };
</script>
<style lang="css"
       scoped>
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

  .param {
    padding-bottom: 75px;
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

  .clearfix {
    font-size: 20px;
    margin: 5px 10px;
  }

  .isShowButton {
    float: right;
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
    margin: 5px 10vw;
  }
</style>