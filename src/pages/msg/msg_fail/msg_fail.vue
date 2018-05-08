<template>
<div class="mag_fail">
    <div class="weui-msg">
        <div class="weui-msg__icon-area">
            <icon type="warn" size="93"></icon>
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
    name: "mag_fail",
    directives: {},
    components: {},
    data() {
      return {
        title: "",
        details: "",
      }
    },
    onLoad: function(options) {
      let vm = this
      vm.title = options.title;
      vm.details = options.details;
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
        wx.navigateBack();
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
</style>