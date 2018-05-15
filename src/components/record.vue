<template>
   <div class="record">
      <div class="el-card" style="padding: 14px;">
        <span v-if="isShowName">{{record.name}}&nbsp;</span>
        <span>{{record.orderName}}</span>
        <div class="bottom clearfix">
          <time class="time">{{record.createDate}}</time>
          <div class="action">
            <span v-if="record.isCancle" style="color: red">已退订</span>
            <span v-else-if="fromSource=='order'"style="color: blue" @click="cancel()">退订</span>
            <span v-else-if="fromSource=='search'&&!userInfo.isAdmin&&order.canCancle" style="color: blue" @click="cancel()">退订</span>
          </div>
        </div>
      </div>
   </div>
</template>

<script>
  export default {
    name: "record",
    props: {
      fromSource: {
        default: "",
      },
      isShowName: {
        default: false,
      },
      record: {
        default: null,
        type: Object
      }
    },
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo;
      },
    },
    methods: {
      cancel() {
        this.$emit("cancle");
      }
    }
  }
</script>

<style scoped>
  .record {
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

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .clearfix:after,
  .clearfix:before {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .time {
    font-size: 13px;
    color: #999;
    display: inline;
  }

  .action {
    float: right;
    display: inline;
  }
</style>