<template>
 <view class="userInfo">
    <image class="userinfo-avatar" :src="userInfo.avatarUrl"></image>
    <view v-if="isShowName" class="userDiv"> 账户：
      <span class="username">{{userInfo.userName==""?userInfo.nickName:userInfo.userName}}</span>
    </view>
    <view v-if="isShowBalance" class="userDiv">余额：
      <span class="balance">{{userInfo.money}}元</span>
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
        return this.$store.state.user.userInfo;
      }
    }
  }
</script>

<style scoped>
  .userInfo {
    text-align: center;
    padding: 13px 8px 8px;
    color:#fff;
    background-color:#409EFF;
  }

  .userinfo-avatar {
    width: 128rpx;
    height: 128rpx;
    /*margin: 20rpx;*/
    border-radius: 50%;
  }

  .userDiv {
    display: block;
    /*margin: 5px 0;*/
    position: relative;
  }

  .balance,
  .username {
    font-family: fantasy;
  }
</style>