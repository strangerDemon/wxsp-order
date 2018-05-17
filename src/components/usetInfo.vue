<template>
 <view class="userInfo">
    <image class="userinfo-avatar" :src="userInfo.avatarUrl"  @click="eggWhite()"></image>
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
    },
    data() {
      return {
        times: 0,
      }
    },
    methods: {
      userUpdate() {
        let vm = this;
        wx.showModal({
          title: '提示',
          content: "确定更新用户头像信息？",
          success: function(res) {
            if (res.confirm) {
              vm.getUnloginUserInfo(function() {
                vm.$store.commit("userUpdate", {
                  openId: vm.userInfo.openId,
                  nickName: vm.userInfo.nickName,
                  avatarUrl: vm.userInfo.avatarUrl
                })
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      eggWhite() {
        this.userUpdate();
        if (this.times++ % 11 == 10) {
          wx.navigateTo({
            url: '../../../pages/map/main'
          })
        }
      },
    }
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