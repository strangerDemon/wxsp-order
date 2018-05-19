<template>
   <view class="weui-footer weui-footer_fixed-bottom">
       <view class="weui-footer__links">
          <navigator url="https://www.ztgis.com" class="weui-footer__link">{{systemParam.provider}}</navigator> 
          <div v-if="!isLogin&&isRegister" class="weui-footer__link" @click="toRegister">注册</div>
          <div v-if="isLogin&&isUpdate" class="weui-footer__link" @click="toUpdate">更新</div>
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
      },
      isUpdate:{
        default:false,
      },
      isRegister:{
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
      },
      toUpdate(){
        this.$emit("userUpdate");
      }
    }
  }
</script>

<style scoped>
</style>