<template>
  <div class="msg_success">
    <div class="weui-msg">
        <div class="weui-msg__icon-area">
            <icon type="success" size="93"></icon>
        </div>
        <div class="weui-msg__text-area">
            <div class="weui-msg__title">{{title}}</div>
            <text class="weui-msg__desc">{{details}}</text>
        </div>
        <div class="weui-msg__opr-area">
            <div class="weui-btn-area">
                <button class="weui-btn" type="primary" @click="back">确定</button>
                <!--<button class="weui-btn" type="default">辅助操作</button>-->
            </div>
        </div>
        <footer-info :isLogin="isLogin"></footer-info>
    </div>
</div>
</template>
<script>
  import footerInfo from "@/components/footerInfo"
  export default {
    name: "msg_success",
    directives: {},
    components: {},
    data() {
      return {
        title: "",
        details: [],
        redirect: "",
      }
    },
    onLoad: function(options) {
      let vm = this
      vm.title = options.title;
      vm.details = options.details;
      vm.redirect = options.redirect;
    },
    props: {},
    computed: {
      isLogin() {
        return this.$store.state.user.isLogin;
      },
    },
    watch: {},
    methods: {
      back() {
        let vm = this
        if (vm.redirect != undefined && vm.redirect != "") {
          //wx.redirectTo({ url: vm.redirect });//和navigateTo,只能打开非tabbar页面,switchTab只能打开tabbar页面 reLaunch打开任意页面
          wx.reLaunch({ url: vm.redirect });
        } else {
          wx.navigateBack();
        }
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {}
  }
</script>
<style lang="css"
       scoped>
  .msg_success {
    height: 100vh;
    background-color: #F2F6FC;
  }
</style>