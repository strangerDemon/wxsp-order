<template>
  <view class="container">
    <mini-loading v-if="showLoading" :type="1" :isFullScreen="true"></mini-loading>
    <div v-if="!showLoading">
      <div class="userinfo">
        <button v-if="!hasUserInfo && canIUse" open-type="getUnloginUserInfo" bindgetuserinfo="getUnloginUserInfo"> 获取头像昵称 </button>
        <block v-else>
          <image class="userinfo-avatar" :src="userInfo.avatarUrl" background-size="cover" @click="eggWhite"/>
          <text class="userinfo-nickname">{{userInfo.nickName}}</text>
        </block>
      </div>
      <div class="application" >
        <div class="app-item" v-for="(item ,index) in buttonTexts" :key="index">
          <image class="munuImage" :src="item.icon" background-size="cover"/>
          <text class="item" @click="binddivTap(item.value)">{{item.name}}</text>
        </div>
      </div>
      <footer-info :isLogin="isLogin" @userRegister="userRegister" @userUpdate="userUpdate"></footer-info>
    </div>
  </view>
</template>
<script>
  import footerInfo from "@/components/footerInfo"
  import miniLoading from "@/components/miniLoading";
  export default {
    ///
    // 微信原始的函数 
    ///
    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      wx.setNavigationBarTitle({
        title: '微信点餐',
      })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
      this.getUserInfo();
      this.$store.commit("getSystemParam", {});
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {},

    data() {
      return {
        dialogMessage: "请先注册",
        buttonTexts: [
          /*{ name: '点餐入口', value: 'order', icon: '../../static/images/bee.jpg' },
                             { name: 'map', value: 'map', icon: '../../static/images/chicken.jpg' },
                             { name: 'music', value: 'music', icon: '../../static/images/dog.jpg' }*/
        ],
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        times: 0,
      }
    },

    components: {
      footerInfo,
      miniLoading
    },
    computed: {
      toReload() {
        return this.$store.state.init.toReload;
      },
      isLogin() {
        return this.$store.state.user.isLogin;
      },
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      systemParamInit() {
        return this.$store.state.init.systemParamInit;
      },
      showLoading() {
        return this.$store.state.init.showLoading;
      }
    },
    watch: {
      userInfo(user) {
        if (user && user.data && user.data.RespCode == 0) { //获取用户异常，后台报错
          this.getUnloginUserInfo();
        } else if (user && (user.nickName == "" && user.avatarUrl == "")) { //后台没有昵称 图片数据
          this.getUnloginUserInfo();
        } else {
          this.hasUserInfo = true;
        }
        if (user && this.systemParamInit) {
          this.$store.commit("setShowLoading", { showLoading: false });
        }
      },
      systemParamInit(init) {
        if (this.userInfo != null) this.$store.commit("setShowLoading", { showLoading: false });
      },
      toReload(toreload) {
        this.load();
      }
    },
    methods: {
      binddivTap(type) {
        let vm = this
        if (vm.userInfo.isExamine == 0) {
          wx.showModal({
            content: "该账号未审核，请联系管理人员",
            showCancel: false,
            success: function(res) {}
          });
          return;
        }
        if (vm.userInfo.isExamine == 2) {
          wx.showModal({
            content: "该账号审核未通过，请联系管理人员",
            showCancel: false,
            success: function(res) {}
          });
          return;
        }
        if (vm.userInfo.isForbidden == 1) {
          wx.showModal({
            content: "该账号已被禁用，请联系管理人员",
            showCancel: false,
            success: function(res) {}
          });
          return;
        }
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
      getUnloginUserInfo(callback) {
        let vm = this
        //console.log(vm.userInfo);
        // 未登录后台
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: (res) => {
                //console.log(res);
                if (vm.userInfo == null) {
                  vm.userInfo = res.userInfo
                } else {
                  vm.userInfo.nickName = res.userInfo.nickName
                  vm.userInfo.avatarUrl = res.userInfo.avatarUrl
                }
                vm.hasUserInfo = true;
                vm.$store.commit("setUserInfo", {
                  userInfo: vm.userInfo,
                  isLogin: vm.isLogin
                })
                if (callback != undefined) {
                  callback();
                }
              }
            })
          }
        });
      },
      userRegister() {
        wx.navigateTo({
          url: '../userRegister/main'
        })
      },
      userUpdate() {
        let vm = this;
        wx.showModal({
          title: '提示',
          content: "确定更新用户信息？",
          success: function(res) {
            if (res.confirm) {
              vm.getUnloginUserInfo(function() {
                vm.$store.commit("userUpdate", {})
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      eggWhite() {
        if (this.times++ % 11 == 10) {
          this.binddivTap("map");
        }
      },
      load() {
        this.getUserInfo();
        this.$store.commit("getSystemParam", {});
      }
    },
    created() {
      // 调用应用实例的方法获取全局数据
      //this.load();
    }
  }
</script>

<style>
  .container {
    height: 100vh;
    background-color: #F2F6FC;
  }

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

  .application {
    margin-top: 40px;
  }

  .app-item {
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