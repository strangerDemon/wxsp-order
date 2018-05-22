<template>
  <div class="user-register">
    <image src="/static/images/background.jpg" class="background-image"></image>
    <div class="cont">
	    <div class="demo">
	      <div class="login">
          <div style="text-align:center">
            <image src="/static/images/logo.png" class="logo-image"></image>
          </div>
	        <div class="login__form">
	          <div class="login__row">
              <div class="title">姓 名</div>
              <div class="login-div">
                <input type="text" class="login__input" placeholder="请输入姓名" v-model="user.userName"/>
              </div>
	          </div>
	          <div class="login__row">
	            <div class="title">手机号</div>
              <div class="login-div">
                <input type="text" class="login__input"  @blur="checkPhone" placeholder="请输入手机号" v-model="user.phone"/>
              </div>
	          </div>
            <checkbox-group style="padding-top:20px;margin-left:10%;" @change="agreeChange">
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
	          <button type="warn" class="weui-btn login__submit" @click="register" :disabled="!isAgree">注 册</button> 
	        </div>
	      </div>
	    </div>
	  </div>
    <footer-info :isLogin="false"></footer-info>
  </div>
</template>
<script>
  import footerInfo from "@/components/footerInfo"
  export default {
    name: "user-register",
    directives: {},
    components: { footerInfo },
    data() {
      return {
        isAgree: false,
        user: {
          openId: "",
          userName: "",
          nickName: "",
          avatarUrl: "",
          phone: "",
        },
        selectCompanyName: ""
      }
    },
    props: {},
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      systemParam() {
        return this.$store.state.init.systemParam;
      },
    },
    watch: {},
    methods: {
      checkPhone() {
        let vm = this
        //if (vm.user.phone.trim() == "") return true;
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
        if (!vm.checkNull(vm.user.userName)) {
          vm.showModal("星标项为必输项");
          return false;
        }
        return true;
      },
      register() {
        let vm = this
        if (!vm.checkCommit()) return false;
        vm.user.openId = vm.userInfo.openId;
        vm.user.nickName = vm.userInfo.nickName;
        vm.user.avatarUrl = vm.userInfo.avatarUrl;
        this.$store.commit("register", vm.user);
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      //this.$store.commit("getCompanyList", {});
    }
  }
</script>
<style lang="css"
       scoped>
  .user-register {
    height: 100vh;
    background-color: #F2F6FC;
  }

  .must-write {
    color: red;
    display: inline-block;
  }

  .background-image {
    position: fixed;
    height: 100%;
    width: 100%;
    background-size: cover;
    overflow: auto;
  }

  .logo-image {
    margin-top: 50px;
    width: 180px;
    height: 180px;
  }

  .cont {
    position: relative;
    height: 100%;
    background-size: cover;
    overflow: auto;
    font-family: "Open Sans", Helvetica, Arial, sans-serif;
  }

  .demo {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .login {
    position: relative;
    height: 100%;
    background: -webkit-linear-gradient(top, rgba(146, 135, 187, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
    background: linear-gradient(to bottom, rgba(146, 135, 187, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%);
    -webkit-transition: opacity 0.1s, -webkit-transform 0.3s cubic-bezier(0.17, -0.65, 0.665, 1.25);
    transition: opacity 0.1s, transform 0.3s cubic-bezier(0.17, -0.65, 0.665, 1.25);
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
  }

  .login.inactive {
    opacity: 0;
    -webkit-transform: scale(1.1);
    -ms-transform: scale(1.1);
    transform: scale(1.1);
  }

  .login__form {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 50%;
  }

  .login__row {
    height: 40px;
    padding-top: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    width: 80%;
    margin-left: 10%;
  }

  .login-div {
    position: absolute;
    display: inline-block;
    width: 75%;
  }

  .login__input {
    font-size: 15px;
    background: transparent;
    color: #FDFCFD;
  }

  .title {
    width: 30%;
    padding-left: 10px;
    color: #fff;
    font-weight: 700;
    display: inline-block;
  }

  .login__submit {
    position: relative;
    left: 10%;
    width: 80%;
    height: 40px;
    margin: 22px 0;
    font-size: 15px;
    border-radius: 20px;
  }
</style>