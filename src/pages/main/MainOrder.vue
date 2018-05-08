<template>
  <div class="actionBtn">
    <div class="menuItem" v-for="(item,index) in pages" :key="index">
      <div @click="binddivTap(item.url,item.value)" hover-class="navigator-hover">
        <image class="menuImage" :src="item.icon" mode="aspectFit"></image>
        <div class="menuText">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "orderMain",
    directives: {},
    components: {},
    data() {
      return {
        pages: [{
            icon: "/static/images/bee.jpg",
            url: "/pages/main/Order/main",
            name: "点餐",
            value: "Order"
          },
          {
            icon: "/static/images/chicken.jpg",
            url: "/pages/main/OrderList/main",
            name: "点餐记录",
            value: "OrderList"
          },
          {
            icon: "/static/images/dog.jpg",
            url: "/pages/main/OrderCertificate/main",
            name: "就餐凭证",
            value: "OrderCertificate"
          },
          {
            icon: "/static/images/lion.jpg",
            url: "/pages/main/Redemption/main",
            name: "换购",
            value: "Redemption"
          }
        ]
      }
    },
    props: {},
    computed: {},
    watch: {},
    methods: {
      binddivTap(url, page) {
        let vm = this
        wx.navigateTo({
          url: url
        });
        vm.$store.commit("setCurrentPage", { currentPage: page })
      },
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {}
  }
</script>
<style lang="css"
       scoped>
  .actionBtn {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #EBEEF5;
  }

  .menuItem {
    width: 45vw;
    display: inline-block;
    margin: calc(25vh - 22.5vw) 2.5vw 0;
  }

  .menuImage {
    border-radius: 100%;
    width: 45vw;
    height: 45vw;
  }

  .menuText {
    text-align: center;
    width: 100%;
  }
</style>