<template>
  <div class="user-register">
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell weui-cell_select">
          <div class="weui-cell__hd weui-cell__hd_in-select-after">
            <div class="weui-label">公司<b class="must-write">*</b></div>
          </div>
          <div class="weui-cell__bd">
            <picker @change="companyChange"  :range="companys" range-key="label">
              <div class="weui-select weui-select_in-select-after">{{selectCompanyName}}</div>
            </picker>
          </div>
      </div>
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">账号<b class="must-write">*</b></div>
        </div>
        <div class="weui-cell__bd">
           <input class="weui-input" placeholder="请输入账号(不可变更)" v-model="user.userAccount"/>
        </div>
      </div>
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">姓名<b class="must-write">*</b></div>
        </div>
        <div class="weui-cell__bd">
           <input class="weui-input" placeholder="请输入姓名" v-model="user.userName"/>
        </div>
      </div>   
      <div class="weui-cell weui-cell_input weui-cell_vcode">
        <div class="weui-cell__hd">
          <div class="weui-label">手机号</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" @blur="checkPhone" placeholder="请输入手机号" v-model="user.phone"/>
        </div>
        <!--<div class="weui-cell__ft">
           <div class="weui-vcode-btn">获取验证码</div>
         </div>-->
      </div>
      <div class="weui-cell">
          <div class="weui-cell__bd">
            <textarea class="weui-textarea" maxlength="20" placeholder="请输入备注" style="height: 5em" v-model="user.comment"/>
            <div class="weui-textarea-counter">{{user.comment.length}}/200</div>
          </div>
      </div>
    </div>
    <checkbox-group @change="agreeChange">
      <label class="weui-agree" for="weuiAgree">
        <div class="weui-agree__text">
          <checkbox class="weui-agree__checkbox" id="weuiAgree" value="agree" :checked="isAgree" />
          <div class="weui-agree__checkbox-icon">
            <icon class="weui-agree__checkbox-icon-check" type="success_no_circle" size="9" v-if="isAgree"></icon>
          </div>
          阅读并同意<navigator :url="systemParam.relevantUrl" class="weui-agree__link">《相关条款》</navigator>
        </div>
      </label>
    </checkbox-group>
    <div class="weui-btn-area">
      <button class="weui-btn" type="primary" @click="register" :disabled="!isAgree">确定</button>
    </div>
  </div>
</template>
<script>
  export default {
    name: "user-register",
    directives: {},
    components: {},
    data() {
      return {
        isAgree: false,
        user: {
          openId: "",
          userAccount: "",
          userName: "",
          nickName:"",
          avatarUrl:"",
          companyCoce: 0,
          phone: "",
          comment: "",
        },
        selectCompanyName: ""
      }
    },
    props: {},
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      companys() {
        return this.$store.state.init.companyList;
      },
      systemParam() {
        return this.$store.state.init.systemParam;
      },
    },
    watch: {},
    methods: {
      companyChange(e) {
        let vm = this
        for (let i = 0, length = vm.companys.length; i < length; i++) {
          if (vm.companys[i].value == e.target.value) {
            vm.selectCompanyName = vm.companys[i].label;
            vm.user.companyCode = vm.companys[i].companyCode
            break;
          }
        }
      },
      checkPhone() {
        let vm = this
        if (vm.user.phone.trim() == "") return true;
        if (!(/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(vm.user.phone))) {
          wx.showModal({
            content: "手机号码不正确",
            showCancel: false,
            success: function(res) {}
          });
          return false;
        }
        return true;
      },
      checkNull(value) {
        if (value == null || value == "" || value.trim() == "") {
          return false;
        }
        return true;
      },
      showModal(text) {
        wx.showModal({
          content: text,
          showCancel: false,
          success: function(res) {}
        });
      },
      agreeChange() {
        this.isAgree = !this.isAgree;
      },
      checkCommit() {
        let vm = this
        if (!vm.checkNull(vm.userInfo.openId)) {
          vm.showModal("无法创建用户，未获取到用户微信信息，请稍后重试");
          return false;
        }
        if (!vm.checkPhone()) return false;
        if (!vm.checkNull(vm.user.userAccount)||!vm.checkNull(vm.user.userName)||!vm.checkNull(vm.user.companyCode)) {
          vm.showModal("星标项为必输项");
          return false;
        }
        return true;
      },
      register() {
        let vm = this
        if (!vm.checkCommit()) return false;
        vm.user.openId = vm.userInfo.openId;
        vm.user.nickName=vm.userInfo.nickName;
        vm.user.avatarUrl=vm.userInfo.avatarUrl;
        this.$store.commit("register", vm.user);
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      this.$store.commit("getCompanyList", {});
    }
  }
</script>
<style lang="css"
       scoped>
  .must-write {
    color: red;
    display: inline-block;
  }
</style>