<template>
  <div class="orderList">
    <love-loading v-if="showLoading"></love-loading>
    <block v-if="!showLoading">
      <block>
        <div class="nav">
          <div class="nav-son" :class="shownavindex == 1? 'active' : ''" @click="naviAction(1)">
            <div class="content">账户变动</div>
            <div class="icon"></div>
          </div>
          <div class="nav-son" :class="shownavindex == 2? 'active' : ''" @click="naviAction(2)">
            <div class="content">消费类别</div>
            <div class="icon"></div>
          </div>
          <div class="nav-son" :class="shownavindex == 3? 'active' : ''" @click="naviAction(3)">
            <div class="content">更多</div>
            <div class="icon"></div>
          </div>
        </div>
        <div class="temp temp1 temp2" :class="changeTypeOpen||changeTypeShow?changeTypeOpen?changeTypeShow? 'slidown disappear':'slidown':'slidup disappear':'slidup' ">
          <radio-group @change="radioChange">
            <label class="weui-check__label" v-for="(item,index) in changeTypeOptions" :key="index">
              <radio class="weui-check" :value="item.value" :checked="item.checked"/>
              <div class="weui-cell__bd">{{item.label}}</div>
              <div class="weui-cell__ft weui-cell__ft_in-radio radio-icon" v-if="item.checked">
                <icon class="weui-icon-radio" type="success_no_circle" size="16"></icon>
              </div>
            </label>
          </radio-group>
        </div>
        <div class="temp temp1 temp2" :class="orderTypeOpen||orderTypeShow?orderTypeOpen?orderTypeShow? 'slidown disappear':'slidown':'slidup disappear':'slidup'" >
          <radio-group @change="radioOrder">
            <label class="weui-check__label" v-for="(item,index) in orderTypeOptions" :key="index">
              <radio class="weui-check" :value="item.value" :checked="item.checked"/>
              <div class="weui-cell__bd" >{{item.label}}</div>
              <div class="weui-cell__ft weui-cell__ft_in-radio radio-icon" v-if="item.checked">
                <icon class="weui-icon-radio" type="success_no_circle" size="16"></icon>
              </div>
            </label>
          </radio-group>
        </div>
        <div class="temp temp1" :class="moreOpen||moreShow?moreOpen?moreShow? 'slidown disappear':'slidown':'slidup disappear':'slidup'">
          <div v-if="userInfo.isAdmin" class="weui-cell weui-cell_input" >
            <div class="weui-cell__hd">
              <div class="weui-label">用户名</div>
            </div>
            <div class="weui-cell__bd">
              <input v-model="username" class="weui-input" placeholder="请输入用户名"/>
            </div>
            <icon v-if="username!=''" class="clearInput" type="cancel" size="23" @click="clearInput('username')"></icon>
          </div>
          <div class="weui-cell weui-cell_input" >
            <div class="weui-cell__hd">
              <div class="weui-label">起始时间</div>
            </div>
            <div class="weui-cell__bd">
              <picker mode="date" @change="updatePicker" data-key="startDate" :end="maxDate">
                  <div class="weui-input">{{startDate}}</div>
              </picker>
            </div>
            <icon v-if="startDate!=''" class="clearInput" type="cancel" size="23" @click="clearInput('startDate')"></icon>
          </div>
          <div class="weui-cell weui-cell_input">
            <div class="weui-cell__hd">
              <div class="weui-label">终止时间</div>
            </div>
            <div class="weui-cell__bd">
              <picker mode="date" @change="updatePicker" data-key="endDate" :end="maxDate">
                  <div class="weui-input">{{endDate}}</div>
              </picker>
            </div>
            <icon v-if="endDate!=''" class="clearInput" type="cancel" size="23" @click="clearInput('endDate')"></icon>
          </div>
          <button class="mini-btn searchButton" type="primary" size="mini" @click="search(1)">确定</button>
        </div>
        <div class="fullbg" :class="isfull? 'fullopacity':'hide'" @click="naviAction(0)"></div>
      </block>
      <div class="list">
        <ul infinite-scroll-disabled="loading" infinite-scroll-distance="10">
          <record v-for="(order,index) in list" :key="index" :isShowName="userInfo.isAdmin?true:false" :record="order" :fromSource="'search'" @cancel="cancel(order.id)"></record>
          <div v-if="list.length==0" style="position:absoulte;text-align:center;width:100%;">
            <image src="/static/images/undefined.png" />
          </div>
          <mini-loading v-if="requesting"></mini-loading>
          <div v-if="page>1&&!requesting" class="backToTop" @click="backToTop()">点击返回顶部</div>
        </ul>
      </div>
    </block>
  </div>
</template>
<script>
  import loveLoading from "@/components/loading";
  import miniLoading from "@/components/miniLoading";
  import record from "@/components/record";
  export default {
    name: "orderList",
    directives: {},
    components: { loveLoading, record, miniLoading },
    data() {
      return {
        //nav
        shownavindex: '',
        changeTypeOpen: false,
        orderTypeOpen: false,
        moreOpen: false,
        changeTypeShow: false,
        orderTypeShow: false,
        moreShow: false,
        isfull: false,
        page: 1,
        requesting: false,
        //search option
        username: "",
        startDate: "",
        endDate: "",
        changeType: "0", //0全部 1充值 2消费
        changeBoolean: false,
        changeTypeOptions: [{
            value: "0",
            label: "全部",
            checked: false
          },
          {
            value: "1",
            label: "充值",
            checked: false
          },
          {
            value: "2",
            label: "消费",
            checked: false
          },
          {
            value: "3",
            label: "扣款",
            checked: false
          }
        ],
        maxDate: "",
        orderType: "0", //0全部 1a 2b 3c
        orderBoolean: false,
        orderTypeOptions: [],
        lastRequestTime: null,
        list: [], //存储查询列表
      };
    },
    props: {},
    computed: {
      showLoading() {
        return this.$store.state.init.showLoading;
      },
      isLogin() {
        return this.$store.state.user.isLogin;
      },
      userInfo() {
        return this.$store.state.user.userInfo;
      },
      orderParam() {
        return this.$store.state.order.orderParam;
      },
      orderList() {
        return this.$store.state.order.searchList;
      }
    },
    watch: {
      orderParam(orderParam) {
        let vm = this;
        vm.orderTypeOptions = [];
        vm.orderTypeOptions.push({
          value: "0",
          label: "全部",
          checked: false,
        });
        for (let i = 0, length = orderParam.lunch.length; i < length; i++) {
          vm.orderTypeOptions.push({
            value: orderParam.lunch[i].value,
            label: orderParam.lunch[i].label,
            checked: false,
          });
        }
        vm.orderTypeOptions.push({
          value: "-1",
          label: "其他换购",
          checked: false,
        });
      },
      orderList(list) {
        let vm = this;
        vm.requesting = false;
        if (vm.page == 1) {
          vm.list = [];
        }
        if (list.length == 0) {
          if (vm.page > 1) {
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
        vm.search(1);
        vm.$store.commit("getOrderParam", { openId: vm.userInfo.openId });
      },
      reset() { //查询参数重置
        let vm = this;
        vm.name = "";
        vm.startDate = "";
        vm.endDate = "";
        vm.orderType = "0";
        vm.changeType = "0";
        vm.page = 1;
        vm.isCancle = 0;
      },
      naviAction(nav) {
        let vm = this
        if (vm.shownavindex == nav) { //再次点击
          vm.changeTypeOpen = false;
          vm.orderTypeOpen = false;
          vm.moreOpen = false;
          vm.changeTypeShow = true;
          vm.orderTypeShow = true;
          vm.moreShow = true;
          switch (nav) {
            case 1:
              vm.changeTypeShow = false;
              break;
            case 2:
              vm.orderTypeShow = false;
              break;
            case 3:
              vm.moreShow = false;
              break;
            default:
              break;
          }
          vm.isfull = false;
          vm.shownavindex = 0;
        } else {
          vm.shownavindex = nav;
          vm.isfull = true;
          vm.changeTypeOpen = false;
          vm.orderTypeOpen = false;
          vm.moreOpen = false;
          vm.changeTypeShow = true;
          vm.orderTypeShow = true;
          vm.moreShow = true;
          switch (nav) {
            case 1:
              vm.changeTypeOpen = true;
              vm.changeTypeShow = false;
              break;
            case 2:
              vm.orderTypeOpen = true;
              vm.orderTypeShow = false;
              break;
            case 3:
              vm.moreOpen = true;
              vm.moreShow = false;
              break;
            default:
              vm.isfull = false;
              break;
          }
        }
      },
      backToTop() {
        console.log(this.shownavindex);
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      },
      radioChange(e) {
        let vm = this
        for (var i = 0, len = vm.changeTypeOptions.length; i < len; ++i) {
          vm.changeTypeOptions[i].checked = vm.changeTypeOptions[i].value == e.target
            .value;
        }
        vm.changeType = e.target.value;
        vm.search(1);
        vm.naviAction(1);
      },
      radioOrder(e) {
        let vm = this
        for (var i = 0, len = vm.orderTypeOptions.length; i < len; ++i) {
          vm.orderTypeOptions[i].checked = vm.orderTypeOptions[i].value == e.target
            .value;
        }
        vm.orderType = e.target.value;
        vm.search(1);
        vm.naviAction(2);
      },
      clearInput(input) {
        let vm = this
        switch (input) {
          case "startDate":
            vm.startDate = "";
            break;
          case "endDate":
            vm.endDate = "";
            break;
          case "username":
            vm.username = "";
            break;
          default:
            break;
        }
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
        vm.requesting = true;
        let name = vm.userInfo.isAdmin ? vm.username : "null";
        let openId = vm.userInfo.isAdmin ? "" : vm.userInfo.openId;
        vm.$store.commit("getOrderList", {
          from: "searchList",
          openId: openId,
          name: name,
          startDate: vm.startDate,
          endDate: vm.endDate,
          orderType: vm.orderType,
          changeType: vm.changeType,
          page: page,
          isCancle: 0
        });
        if (vm.shownavindex == 3) {
          vm.naviAction(3);
        }
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      let vm = this;
      let today = new Date();
      vm.maxDate = (today.getYear() + 1900) + "-" + (today.getMonth() + 1) +
        "-" + today
        .getDate();
      if (vm.isLogin) {
        vm.init();

      }
    },
    /*
     * 生命周期函数--监听页面显示
     */
    onShow() {
      wx.setNavigationBarTitle({
        title: '记录',
      })
      this.reset();
      if (this.isLogin) {
        this.search(1);
      }
    },

    /*
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
      let vm = this
      vm.list = [];
      vm.page = 1;
      vm.search(vm.page);
      wx.stopPullDownRefresh(); 
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
    background-color: #F2F6FC;
  }

  .searchButton {
    left: 40vw;
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

  .list {
    position: absolute;
    margin-top: 41px;
    width: 100%;
  }

  .nav {
    position: fixed;
    width: 100%;
    z-index: 99;
    display: flex;
    border-bottom: 1px solid #d1d3d4;
    background: #fff;
  }

  .nav-son {
    display: flex;
    flex: 1;
    text-align: center;
    height: 40px;
    align-items: center;
    justify-content: center;
    /*font-size: 14px;*/
  }

  .borders {
    border-left: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
  }

  .content {
    display: inline-block;
  }

  .icon {
    display: inline-block;
    border: 4px solid transparent;
    border-top: 4px solid #9b9b9b;
    margin-left: 5px;
  }

  .temp {
    position: fixed;
    width: 100%;
    z-index: 4;
    margin-top: 41px;
  }

  .temp1 {
    display: none;
    /*width: 100%;*/
    max-height: 550rpx;
    overflow-y: scroll;
    padding: 0 20rpx 0 20rpx;
    line-height: 90rpx;
    background: #fff;
    font-size: 14px;
  }

  .temp2 {
    width: calc(100vw - 20px) !important;
  }

  .slidedown {
    transform: translateY(0%);
  }

  .temp2 view {
    border-bottom: 1px solid #d1d3d4;
    font-size: 14px;
    color: #666;
  }

  .current {
    background: #e0e0e0;
  }

  .current2 {
    background: #fff;
  }

  .fullbg {
    position: fixed;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: rgb(1, 1, 1);
    transition: all 2s;
    opacity: 0;
  }

  .fullopacity {
    opacity: .5;
  }

  .hide {
    display: none;
  }

  .nav-son.active .content {
    color: #61beff;
  }

  .nav-son.active .icon {
    border-bottom: 4px solid #61beff;
    border-top: 0;
  }

  @keyframes slidown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0%);
    }
  }

  .slidown {
    display: block;
    animation: slidown .7s ease-in both;
  }

  @keyframes slidup {
    from {
      transform: translateY(0%);
    }
    to {
      transform: translateY(-100%);
    }
  }

  .slidup {
    /*display: block;*/
    animation: slidup .7s ease-in both;
  }

  .disappear {
    display: none;
  }

  .radio-icon {
    position: relative;
    float: right;
    border-bottom: 0rpx solid #fff !important;
    margin: -40px 20px 0 0;
  }

  .clearInput {
    position: relative;
    float: right;
    top: 10px;
    right: 10px;
  }

  .backToTop {
    text-align: center;
    margin: 4px;
    font-size: 12px;
    color: blue;
    cursor: pointer;
  }

  .weui-cell {
    right: 15px;
  }

  .weui-label {
    color: #666;
  }
</style>