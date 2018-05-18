<template>
  <div class="user-register">
    <image src="/static/images/background.jpg" class="background-image"></image>
    <div class="cont">
	    <div class="demo">
	      <div class="login">
          <image src="/static/images/logo.png" class="logo-image"></image>
	        <div class="login__form">
	          <div class="login__row">
              <div class="title">姓名</div>
	            <input type="text" class="login__input name" placeholder="请输入姓名" v-model="user.userName"/>
	          </div>
	          <div class="login__row">
	            <div class="title">手机号</div>
              <input type="text" class="login__input pass"  @blur="checkPhone" placeholder="请输入手机号" v-model="user.phone"/>
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
	          <button type="button" class="login__submit" @click="register" :disabled="!isAgree">登 录</button>	       
	        </div>
	      </div>
	    </div>
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
          nickName: "",
          avatarUrl: "",
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

  .svg-icon {
    cursor: pointer;
  }

  .svg-icon path {
    stroke: rgba(255, 255, 255, 0.9);
    fill: none;
    stroke-width: 1;
  }

  input,
  button {
    outline: none;
    border: none;
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
    text-align: center;
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
    text-align: center;
  }

  .login__row {
    height: 50px;
    padding-top: 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .login__input {
    display: inline-block;
    width: 75%;
    height: 100%;
    font-size: 15px;
    background: transparent;
    color: #FDFCFD;
  }

  .title {
    height: 50px;
    width: 20%;
    padding-bottom: 10px;
    color: #fff;
    font-weight: 700;
    display: inline-block;
  }

  .login__submit {
    position: relative;
    left:10%;
    width: 80%;
    height: 40px;
    margin: 50px 0 22px;
    color: rgba(255, 255, 255, 0.8);
    background: #FF3366;
    font-size: 15px;
    border-radius: 20px;
    cursor: pointer;
    overflow: hidden;
    -webkit-transition: width 0.3s 0.15s, font-size 0.1s 0.15s;
    transition: width 0.3s 0.15s, font-size 0.1s 0.15s;
  }

  .login__submit.processing:after {
    opacity: 1;
  }

  .login__submit.success {
    -webkit-transition: -webkit-transform 0.3s 0.1s ease-out, opacity 0.1s 0.3s, background-color 0.1s 0.3s;
    transition: transform 0.3s 0.1s ease-out, opacity 0.1s 0.3s, background-color 0.1s 0.3s;
    -webkit-transform: scale(30);
    -ms-transform: scale(30);
    transform: scale(30);
    opacity: 0.9;
  }

  .login__submit.success:after {
    -webkit-transition: opacity 0.1s 0s;
    transition: opacity 0.1s 0s;
    opacity: 0;
  }

  .login__signup a {
    color: #fff;
    cursor: pointer;
  }

  @-webkit-keyframes animRipple {
    to {
      -webkit-transform: scale(3.5);
      transform: scale(3.5);
      opacity: 0;
    }
  }

  @keyframes animRipple {
    to {
      -webkit-transform: scale(3.5);
      transform: scale(3.5);
      opacity: 0;
    }
  }

  @-webkit-keyframes rotate {
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes rotate {
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @-webkit-keyframes animatePath {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes animatePath {
    to {
      stroke-dashoffset: 0;
    }
  }
</style>