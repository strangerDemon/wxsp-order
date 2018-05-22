<template>
 <view class="userInfo">
    <button v-if="userInfo.avatarUrl=='' && canIUse" class="button" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo" > 获取头像昵称 </button>
    <image v-else class="userinfo-avatar" :src="userInfo.avatarUrl"  @click="eggWhite()"></image>
    <view v-if="isShowName" class="userDiv">
      <span class="username">{{userInfo.userName==""?userInfo.nickName:userInfo.userName}}</span>
    </view>
    <view v-if="isShowBalance&&isLogin" class="userDiv">
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
      isLogin() {
        return this.$store.state.user.isLogin;
      },
      userInfo() {
        return this.$store.state.user.userInfo;
      }
    },
    data() {
      return {
        times: 0,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
      }
    },
    methods: {
      eggWhite() {
        this.userUpdate();
        if (this.times++ % 11 == 10) {
          wx.navigateTo({
            url: '../../../pages/map/main'
          })
        }
      },
      userUpdate() {
        let vm = this;
        wx.showModal({
          title: '提示',
          content: "确定更新用户头像信息？",
          success: function(res) {
            if (res.confirm) {
              vm.getUnloginUserInfo();
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      getUnloginUserInfo() {
        let vm = this
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: (res) => {
                vm.$store.commit("updateLocal", { user: res.userInfo });
                vm.$store.commit("userUpdate", {})
              }
            })
          }
        });
      },
      //未授权
      onGotUserInfo() {
        let vm = this
        vm.getUnloginUserInfo();
      },
    },
  }
</script>

<style scoped>
  .userInfo {
    text-align: center;
    padding: 13px 8px 8px;
    color: #fff;
    background-color: #409EFF;
  }

  .userinfo-avatar {
    width: 128rpx;
    height: 128rpx;
    /*margin: 20rpx;*/
    border-radius: 50%;
  }

  .button {
    width: 200rpx;
    font-size: 24rpx;
    margin: 10px auto;
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