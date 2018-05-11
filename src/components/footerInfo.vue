<template>
   <view class="weui-footer weui-footer_fixed-bottom">
       <view class="weui-footer__links">
          <navigator url="https://www.ztgis.com" class="weui-footer__link">{{systemParam.provider}}</navigator> 
          <div v-if="!isLogin" class="weui-footer__link" @click="toRegister">注册</div>
       </view>
      <view class="weui-footer__text">Copyright © 2018 ztgis</view>
  </view>
</template>

<script>
  export default {
    name: "footerInfo",
    props: {
      isLogin:{
        default:false,
      }
    },
    computed: {
      systemParam() {
        return this.$store.state.init.systemParam;
      },
    },
    methods: {
      toRegister() {
        this.$emit("userRegister");
      }
    }
  }
</script>

<style scoped>
</style>