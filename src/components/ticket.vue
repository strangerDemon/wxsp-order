<template>
   <div class="ticket">
    <div class="el-card" style="padding: 20px;">
      <span class="text">{{ticketType}}</span>
      <span class="text rightText">{{number}}份</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ticket",
    props: {
      ticketType: {
        default: "",
      },
      number: {
        default: 0,
      }
    },
    computed: {
      systemParam() {
        return this.$store.state.init.systemParam;
      },
    },
    methods: {}
  }
</script>

<style scoped>
  .ticket {
    margin: 5px;
  }

  .el-card {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    background-color: #fff;
    overflow: hidden;
    color: #303133;
    transition: .3s;
  }

  .text {
    font-size: 40px;
  }

  .rightText {
    float: right;
    margin-right: 25px;
  }
</style>