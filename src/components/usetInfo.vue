<template>
 <view class="userInfo">
    <image class="userinfo-avatar" :src="userInfo.avatarUrl"></image>
    <view v-show="isShowName" class="userDiv"> 账户：
      <span class="username">{{userInfo.nickName}}</span>
    </view>
    <view v-show="isShowBalance" class="userDiv">余额：
      <span class="balance">{{userInfo.balance}}元</span>
    </view>
  </view>
</template>

<script>
  export default {
    name: "userInfo",
    props: {
      isShowName: {
        type: Boolean,
        default: true,
      },
      isShowBalance: {
        type: Boolean,
        default: true,
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.init.userInfo;
      }
    }
  }
</script>

<style scoped>
  .userInfo {
    text-align: center;
    margin: 13px 8px 8px;
  }

  .userinfo-avatar {
    width: 128rpx;
    height: 128rpx;
    margin: 20rpx;
    border-radius: 50%;
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
</style>