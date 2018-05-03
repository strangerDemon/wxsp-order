<template>
<div class="container">
  <div class="userinfo">
    <button v-if="!hasUserInfo && canIUse" open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 获取头像昵称 </button>
    <block v-else>
      <image class="userinfo-avatar" :src="userInfo.avatarUrl" background-size="cover"></image>
      <text class="userinfo-nickname">{{userInfo.nickName}}</text>
    </block>
  </div>
  <div class="usermotto" >
    <div class="user-motto" v-for="(item ,index) in buttonTexts" :key="index">
      <image class="munuImage" :src="item.icon" background-size="cover"></image>
      <text class="item" @click="binddivTap(item.value)">{{item.name}}</text>
    </div>
  </div>
  <footer-info :isLogin="isLogin" @userRegister="userRegister"></footer-info>
</div>
</template>
<script>
  import footerInfo from "@/components/footerInfo"
  export default {
    data() {
      return {
        dialogMessage: "请先注册",
        buttonTexts: [{ name: 'order', value: 'order', icon: '../../static/images/bee.jpg' },
          { name: 'map', value: 'map', icon: '../../static/images/chicken.jpg' },
          { name: 'music', value: 'music', icon: '../../static/images/dog.jpg' }
        ],
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
      }
    },

    components: {
      footerInfo
    },
    computed: {   
      isLogin() {
        return this.$store.state.user.isLogin;
      },
      userInfo() {
        return this.$store.state.user.userInfo;
      }
    },
    watch: {
      userInfo(user) {
        if (user && user.data && user.data.RespCode == 0) {
          this.getUnloginUserInfo();
        }
      }
    },
    methods: {
      binddivTap(type) {
        let vm = this
        if (!vm.isLogin) {
          wx.showModal({
            content: vm.dialogMessage,
            showCancel: false,
            success: function(res) {}
          });
          return;
        }
        switch (type) {
          case 'order':
            wx.navigateTo({
              url: '../main/main'
            })
            break;
          case 'map':
            wx.navigateTo({
              url: '../map/main'
            })
            break;
          case 'music':
            wx.navigateTo({
              url: '../music/main'
            })
            break;
          default:
            break;
        }
      },
      getUserInfo() {
        let vm = this
        wx.login({
          success: function(res) { //获得唯一code
            if (res.code) {
              //console.log(res.code);
              //登录后台
              vm.$store.commit("getUserInfo", { code: res.code, openId: "" });
            } else {
              vm.getUnloginUserInfo();
            }
          }
        });
      },
      getUnloginUserInfo() {
        let vm = this
        // 未登录后台
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: (res) => {
                vm.userInfo = res.userInfo
                vm.hasUserInfo = true;
                vm.$store.commit("setUserInfo", {
                  userInfo: res.userInfo,
                  isLogin: false
                })
              }
            })
          }
        });
      },
      userRegister() {
        wx.navigateTo({
          url: '../userRegister/main'
        })
      }
    },
    created() {
      // 调用应用实例的方法获取全局数据
      this.getUserInfo();
      this.$store.commit("getSystemParam",{});
    }
  }
</script>

<style>
  .userinfo {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .userinfo-avatar {
    width: 128rpx;
    height: 128rpx;
    margin: 20rpx;
    border-radius: 50%;
  }

  .userinfo-nickname {
    color: #aaa;
  }

  .user-motto {
    margin-top: 20px;
    display: block;
  }

  .item {
    margin: 20rpx;
    height: 64rpx;
  }

  .munuImage {
    width: 64rpx;
    height: 64rpx;
    margin: 20rpx;
    border-radius: 50%;
    display: inline-flex;
  }
</style>