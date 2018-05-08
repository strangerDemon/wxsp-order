<template>
  <div class="orderList">
    <i :class="isShowSearch?'up dropDown':'down dropDown'" @click="isShowSearch=!isShowSearch"></i>
      <div class="search" v-show="isShowSearch">
        <div v-show="isAdmin" class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
              <div class="weui-label">用户名</div>
            </div>
            <div class="weui-cell__bd">
              <input v-model="username" class="weui-input" placeholder="请输入用户名"/>
            </div>
        </div>
        <div class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
              <div class="weui-label">起始时间</div>
            </div>
            <div class="weui-cell__bd">
              <picker mode="date" @change="updatePicker" data-key="startDate">
                  <div class="weui-input">{{startDate}}</div>
              </picker>
            </div>
        </div>
        <div class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
              <div class="weui-label">终止时间</div>
            </div>
            <div class="weui-cell__bd">
              <picker mode="date" @change="updatePicker" data-key="endDate">
                  <div class="weui-input">{{endDate}}</div>
              </picker>
            </div>
        </div>
        <div class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
              <div class="weui-label">消费类别</div>
            </div>
            <div class="weui-cell__bd">
              <picker  @change="updatePicker" data-key="orderType" :range="orderTypeOptions" range-key="label">
                <div class="weui-input">{{orderTypeStr}}</div>
              </picker>
            </div>
        </div>
        <div class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
              <div class="weui-label">账户记录</div>
            </div>
            <div class="weui-cell__bd">
              <picker @change="updatePicker" data-key="changeType" :range="changeTypeOptions" range-key="label">
                <div class="weui-input">{{changeTypeStr}}</div>
              </picker>
            </div>
        </div>
        <button class="weui-btn mini-btn searchButton" type="primary" size="mini" @click="search(1)">查询</button>
      </div>
    <div class="list">
      <ul style="padding:10px 0;" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <div v-for="(order,index) in list" :key="index">
          <div class="weui-cells weui-cells_after-title">
            <div class="weui-cell">
                <div class="weui-cell__bd">{{isAdmin?order.name+' : '+order.orderName:order.orderName}}</div>
                <div class="weui-cells__title">{{order.createDate}}</div>
                <div v-if="order.isCancle" style="color: red" class="weui-cell__ft buttonText">已退订</div>
                <div v-else-if="order.canCancle" style="color: blue" @click="cancel(order.id)" class="weui-cell__ft buttonText">退订</div>
            </div>
          </div>
        </div>
      </ul>    
    </div>
  </div>
</template>
<script>
  export default {
    name: "orderList",
    directives: {},
    components: {},
    data() {
      return {
        page: 1,
        isShowSearch: true,
        //search option
        username: "",
        startDate: null,
        endDate: null,
        changeType: "0", //0全部 1充值 2消费
        changeTypeStr: "全部",
        changeBoolean: false,
        changeTypeOptions: [{
            value: "0",
            label: "全部"
          },
          {
            value: "1",
            label: "充值"
          },
          {
            value: "2",
            label: "消费"
          },
          {
            value: "3",
            label: "扣款"
          }
        ],
        orderType: "0", //0全部 1a 2b 3c
        orderTypeStr: "全部",
        orderBoolean: false,
        orderTypeOptions: [],
        lastRequestTime: null,
        list: [], //存储查询列表
      };
    },
    props: {},
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      isAdmin() {
        return this.$store.state.user.isAdmin;
      },
      orderParam() {
        return this.$store.state.order.orderParam;
      },
      currentPage() {
        return this.$store.state.init.currentPage;
      },
      orderList() {
        return this.$store.state.order.orderList;
      }
    },
    watch: {
      orderType(val) {
        if (val < 0) {
          this.orderTypeStr = this.orderTypeOptions[
            this.orderTypeOptions.length - 1
          ].label;
        } else {
          this.orderTypeStr = this.orderTypeOptions[val].label;
        }
      },
      changeType(val) {
        this.changeTypeStr = this.changeTypeOptions[val].label;
      },
      orderParam(orderParam) {
        let vm = this;
        if (vm.currentPage.toUpperCase() != vm.$options.name.toUpperCase())
          return;
        vm.orderTypeOptions = [];
        vm.orderTypeOptions.push({
          value: "0",
          label: "全部"
        });
        for (let i = 0, length = orderParam.lunch.length; i < length; i++) {
          vm.orderTypeOptions.push(orderParam.lunch[i]);
        }
        vm.orderTypeOptions.push({
          value: "-1",
          label: "其他换购"
        });
      },
      orderList(list) {
        let vm = this;
        if (vm.currentPage.toUpperCase() != vm.$options.name.toUpperCase())
          return;
        if (vm.page == 1) {
          vm.list = [];
        }
        if (list.length == 0) {
          if (vm.page == 1) {
            wx.showModal({
              title: '提示',
              content: "未查询到数据!",
              success: function(res) {}
            })
          } else {
            vm.page--;
          }
        }
        for (let index = 0; index < list.length; index++) {
          if (list[index].orderType > 0 && !list[index].isCancle && vm.checkDate(
              list[index].createDate)) {
            list[index]["canCancle"] = true
          } else {
            list[index]["canCancle"] = false;
          }
          vm.list.push(list[index]);
        }
      }
    },
    methods: {
      init() {
        let vm = this;
        vm.list = [];
        vm.startDate = vm.handleConfirm(new Date());
        vm.endDate = vm.handleConfirm(new Date());
        vm.search(1);
      },
      updatePicker(e) {
        let vm = this;
        switch (e.target.dataset.key) {
          case "startDate":
            vm.startDate = e.target.value
            break;
          case "endDate":
            vm.endDate = e.target.value
            break;
          case "orderType":
            vm.orderType = vm.orderTypeOptions[e.target.value].value;
            vm.orderTypeStr = vm.orderTypeOptions[e.target.value].label;
            break;
          case "changeType":
            vm.changeType = vm.changeTypeOptions[e.target.value].value;
            vm.changeTypeStr = vm.changeTypeOptions[e.target.value].label;
            break;
          default:
            break;
        }
      },
      //时间picker
      handleConfirm(date) {
        let dateString = "";
        dateString += date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
          month = "0" + month;
        }
        let day = date.getDate();
        if (day < 10) {
          day = "0" + day;
        }
        dateString += "-" + month + "-" + day;
        return dateString;
      },
      //校验是否可以退订
      checkDate(d) {
        if (d == undefined) return false;
        let vm = this;
        let current = new Date(); //当前时间
        let date = new Date(d.replace(/-/g, "/")); //ios 中不支持2017-3-31 =>2017/3/31
        let v1 = date.getFullYear(); //yyyy
        let v2 = date.getMonth() + 1; //MM
        let v3 = date.getDate(); //dd
        let year = current.getFullYear();
        let month = current.getMonth() + 1;
        let day = current.getDate();
        let hour = current.getHours();
        if (year > v1) {
          //年份小于当前年
          return false;
        } else if (year == v1 && month > v2) {
          //当前年，月份小于当前月
          return false;
        } else if (year == v1 && month == v2 && day > v3) {
          //当前年月，天小于当前天
          return false;
        } else if (
          year == v1 &&
          month == v2 &&
          day == v3 &&
          (hour >= vm.orderParam.endTime || hour < vm.orderParam.startTime)
        ) {
          //当前年月日，18点后不能
          return false;
        }
        return true;
      },
      checkCancleDate() {
        let vm = this;
        var current = new Date(); //当前时间
        var hour = current.getHours();
        if (hour >= vm.orderParam.endTime || hour < vm.orderParam.startTime) {
          return false;
        }
        return true;
      },
      cancel(orderId) {
        let vm = this;
        if (!vm.checkCancleDate()) {
          wx.showModal({
            title: '提示',
            content: "只能在 " + vm.orderParam.startTime + " 至 " +
              vm.orderParam.endTime + " 间退餐",
            success: function(res) {
              return;
            }
          })
        }
        wx.showModal({
          title: '提示',
          content: "确定取消订餐?",
          success: function(res) {
            if (res.confirm) {
              vm.$store.commit("cancle", {
                openId: vm.userInfo.openId,
                Id: orderId,
                func: function() {
                  vm.search(1);
                }
              });
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      },
      search(page) {
        let vm = this;
        vm.page = page;
        let name = vm.isAdmin ? vm.username : "null";
        vm.$store.commit("getOrderList", {
          openId: vm.userInfo.openId,
          name: name,
          startDate: vm.startDate,
          endDate: vm.endDate,
          orderType: vm.orderType,
          changeType: vm.changeType,
          page: page,
          isCancle: 0
        });
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      let vm = this;
      vm.init();
      vm.$store.commit("getOrderParam", { openId: vm.userInfo.openId });
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
      let vm = this
      vm.list = [];
      vm.page = 1;
      vm.search(vm.page);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
      let vm = this
      vm.page++;
      vm.search(vm.page);
    },
  };
</script>
<style lang="css"
       scoped>
  .orderList {
    /*position: absolute;document.body.height=0*/
    height: 100%;
    width: 100%;
    font-size: 18px;
  }

  .search {
    position: relative;
    width: 100%;
    top: 30px;
    margin-top: 10px;
  }

  .searchButton {
    left: 45vw;
  }

  .dropDown {
    background-image: url("../../../../static/images/dropDown.png");
    background-size: cover;
    /*等比缩放*/
    position: absolute;
    width: 25px;
    height: 25px;
    right: -5px;
    top: -12px;
  }

  .up {
    z-index: 9999;
    left: 45vw;
    height: 60px;
    width: 60px;
    transform: rotate(180deg);
    /*动画*/
    animation: upRotate 1s;
    -webkit-animation: upRotate 1s;
  }

  .down {
    z-index: 9999;
    left: 45vw;
    height: 60px;
    width: 60px;
    /*动画*/
    animation: downRotate 1s;
    -webkit-animation: downRotate 1s;
  }

  /*动画*/

  @keyframes upRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(180deg);
    }
  }

  /*动画*/

  @keyframes downRotate {
    from {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .searchTabOpen {
    /*动画*/
    animation: openTab 1s;
    -webkit-animation: openTab 1s;
  }

  .searchTabClose {
    /*动画*/
    animation: closeTab 1s;
    -webkit-animation: closeTab 1s;
  }

  @keyframes openTab {
    from {
      height: 0px;
    }
    to {
      height: auto;
    }
  }

  @keyframes closeTab {
    from {
      height: auto;
    }
    to {
      height: 0px;
    }
  }

  .list {
    padding-top: 15px;
  }
</style>