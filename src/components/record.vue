<template>
   <div class="record">
      <div class="el-card" style="padding: 14px;">
        <span v-if="isShowName">{{record.name}}&nbsp;</span>
        <span>{{record.orderName}}
        </span>
        <div class="bottom clearfix">
          <time class="time">{{record.createDate}}</time>    
          <div class="action">
            <span v-if="record.isCancle" style="color: red">已退订</span>
            <span v-else-if="fromSource=='order'||(fromSource=='search'&&!userInfo.isAdmin&&record.canCancle)" >
              <button class="weui-btn button" type="warn" plain="true" @click="cancel()">退订</button>
            </span>
            <!--<span v-else-if="fromSource=='search'&&!userInfo.isAdmin&&record.canCancle"  @click="cancel()">
              <button class="weui-btn button" type="warn" plain="true" >退订2</button>
            </span>-->
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
    watch: {},
    methods: {
      cancel() {
        this.$emit("cancel");
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
    background-color: #EEEEE0;
    overflow: hidden;
    color: #000;
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

  .button {
    padding: 0px 7px;
    line-height: 2;
    margin-top: -30px;
  }
</style>