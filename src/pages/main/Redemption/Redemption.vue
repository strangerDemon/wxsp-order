<template>
  <div class="Redemption">
    <div v-show="!isShowResult">
      <user-info :isShowName="true" :isShowBalance="true"></user-info>
      <div class="admire">请现场与工作人员操作</div>
      <div class="admire" v-show="!showCommit">没有点餐账户，请联系管理员添加</div>
      <div class="param">
          <div slot="header" class="clearfix">
            <span>换购类型（多选）</span>
            <i class="el-icon-arrow-down isShowButton" @click="isShowRedemption=!isShowRedemption"></i>
          </div>
          <div v-show="isShowRedemption">
            <checkbox-group v-model="redemption" @change="checkboxChange">
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
              <input class="weui-input clearfix" :placeholder="'成交金额[0~'+userInfo.balance+'元]'" type="number" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" v-model="money"/>
            </div>
          </div>
      </div>
      <button v-show="showCommit" class="weui-btn saveButton" type="primary" size="large" @click="commit">确定</button>
    </div>
    <div class="result" v-show="isShowResult">
      <div class="redemptionDetails">
        <h2 class="titles">换购详细单</h2>
        <span class="title">换购详细：</span>
        <ul>
          <li class="item" v-for="(item,index) in redemptionName" :key="index">{{item}}</li>
        </ul>
        <span class="title">换购金额：</span>
        <span class="money">{{money}}元</span>
      </div>
      <button class="weui-btn saveButton" size="large" type="primary" @click="returnRedemption">返回继续换购</button>
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
        money: 0,
        isShowResult: false,
        showCommit: false
      };
    },
    props: {},
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      redemptionList() {
        return this.$store.state.init.redemptionList;
      }
    },
    watch: {
      userInfo(userInfo) {
        this.showCommit = true;
      }
    },
    methods: {
      commit() {
        let vm = this;
        if (vm.money > vm.userInfo.balance) {
          wx.showModal({
            content: "成交金额不能大于" + vm.userInfo.balance,
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
          vm.$store.commit("doChangeBuy", {
            wechatId: vm.userInfo.wechatId,
            value: vm.redemption.toString(),
            money: vm.money
          });
          vm.redemptionList.forEach(element => {
            if (vm.redemption.includes(element.value)) {
              vm.redemptionName.push(element.label);
            }
          });
          vm.isShowResult = true;
        }
      },
      returnRedemption() {
        let vm = this;
        vm.money = 0;
        vm.redemption = [];
        vm.redemptionName = [];
        vm.$store.commit("getUserInfo", { code: "",openId: vm.userInfo.wechatId });
        vm.isShowResult = false;
      },

      checkboxChange(e) {
        let vm = this
        let checkboxItems = this.redemptionList;
        let values = e.target.value;
        // for (let i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        //     checkboxItems[i].checked = false;
        //     for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        //         if(checkboxItems[i].value == values[j]){
        //             checkboxItems[i].checked = true;
        //             break;
        //         }
        //     }
        // }
        // console.log(values);
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      let vm = this;
      vm.$store.commit("getRedemptionList", { wechatId: vm.userInfo.wechatId });
    }
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

  .saveButton {
    position: fixed;
    bottom: 0;
    min-height: 48px;
    border-radius: 0px;
    width: 100%;
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
    margin: 10px 10px;
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