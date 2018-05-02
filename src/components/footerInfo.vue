<template>
   <view class="weui-footer weui-footer_fixed-bottom">
       <view class="weui-footer__links">
          <navigator class="weui-footer__link">{{systemParam.provider}}</navigator>
       </view>
      <view class="weui-footer__text">Copyright © 2018 ztgis</view>
  </view>
</template>

<script>
  export default {
    name: "footerInfo",
    props: {
    },
    computed: {
      systemParam() {
        return this.$store.state.init.systemParam;
      },
    }
  }
</script>

<style scoped>
</style>