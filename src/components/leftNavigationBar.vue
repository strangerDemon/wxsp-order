<template>
  <div class="left-navigation-bar" :class="isShow?'slidRight':'slidLeft'">
    <div @click="isShow=!isShow" class="part flyDiv">
      <image src="/static/images/fly.png"  class="fly" :class="isShow?'fly-left':'fly-right'"></image>
    </div>
    <div class="part weekDiv">
      <div class="week" v-for="(item,index) in weeks"  :class="(today==item.value&&currentWeek=='')||currentWeek==item.value?'active':''" :key="index" @click="selectWeek(item)">
        {{item.label}}<image v-if="today==item.value" src="/static/images/star.png" style="width:20px;height:20px;position:fixed;"></image>
      </div>
    </div>
  </div>
</template>
<script>
  const week = [
    "星期天",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ];
  export default {
    name: "leftNavigationBar",
    directives: {},
    components: {},
    data() {
      return {
        isShow: false,
        today: '',
        currentWeek: '',
        weeks: []
      }
    },
    props: {},
    computed: {},
    watch: {},
    methods: {
      initWeek() {
        let vm = this
        vm.today = vm.getDateStr(0)
        for (let i = 0; i < 7; i++) {
          vm.weeks.push({ label: vm.getWeek(i), value: vm.getDateStr(i) });
        }
        vm.weeks.sort(function(a,b){return b-a;})
      },
      getWeek(AddDayCount) {
        let dd = new Date();
        return week[(dd.getDay()+ AddDayCount)%7];
      },
      getDateStr(AddDayCount) {
        let dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
        let y = dd.getFullYear();
        let m = dd.getMonth() + 1; //获取当前月份的日期 
        let d = dd.getDate();
        return y + "/" + m + "/" + d;
      },
      selectWeek(week) {
        let vm = this
        vm.currentWeek = week.value;
        vm.$store.commit("setOrderDay", { orderDay: vm.currentWeek });
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      this.initWeek();

    }
  }
</script>
<style lang="css"
       scoped>
  .left-navigation-bar {
    width: 140px;
    position: fixed;
    z-index: 9999;
    right: 0px;
  }

  .week {
    background: #F2F6FC;
    text-align: center;
    padding: 5px;
  }

  .active {
    background: #fff;
  }

  .part {
    position: absoulte;
    display: inline-block;
  }

  .flyDiv {
    position: absolute;
    /* 将margin设置为auto，使浏览器自动推算元素外边距 */
    margin: auto;
    bottom: -100px;
    width: 40px;
    height: 100%;
  }

  .weekDiv {
    width: 100px;
    padding-left: 40px;
  }

  .fly {
    width: 40px;
    height: 40px;
  }

  .fly-left {}

  .fly-right {
    transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    /* IE 9 */
    -moz-transform: rotate(180deg);
    /* Firefox */
    -webkit-transform: rotate(180deg);
    /* Safari 和 Chrome */
    -o-transform: rotate(180deg);
    /* Opera */
  }

  .slidLeft {
    animation: slidLeft .7s ease-in both;
  }

  .slidRight {
    animation: slidRight .7s ease-in both;
  }

  @keyframes slidLeft {
    from {
      transform: translateX(71.43%);
    }
    to {
      transform: translateX(0%);
    }
  }

  @keyframes slidRight {
    from {
      transform: translateX(0%);
    }
    to {
      transform: translateX(71.43%);
    }
  }
</style>