<template>
   <div class="ticket">
    <div class="container" >
      <!--<span class="text">{{ticketType}}</span>
      <span class="text rightText">{{number}}份</span>-->
      <!--小程序不能加载背景图，使用image标签来做背景图-->
      <div class="container-0" :class="'container-'+selectStyle">
        <image src="/static/images/ticket/fabric.png" style="width:100%;height:100%"></image>
				<h4>
          <span>{{number}}<!--份--></span>
        </h4>
				<h5>
          <span>{{ticketType}}</span>
        </h5>											
			</div>
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
      },
      selectStyle: {
        default: 1,
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

  .container {
    position: relative;
    width: clac(100vw - 10px);
    height: 114px;
    padding: 0px;
    /*margin: 30px auto 0 auto;*/
  }

  .container div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    height: 100px;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    align-items: center;
    /*指定垂直居中*/
    background-image: url("/static/images/ticket/fabric.png");
    -webkit-transform-origin: 25% 90%;
    -moz-transform-origin: 25% 90%;
    -o-transform-origin: 25% 90%;
    -ms-transform-origin: 25% 90%;
    transform-origin: 25% 90%;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .container-1 {
    background-color: #7EC0EE !important;
    /*background-color: #ea2a29 !important;*/
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 1px 1px 1px rgba(0, 0, 0, 0.1) !important;
  }

  .container-2 {
    background-color: #7EC0EE !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 2px 2px 1px rgba(0, 0, 0, 0.1) !important;
  }

  .container-3 {
    background-color: #87CEFA !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 3px 3px 2px rgba(0, 0, 0, 0.2) !important;
  }

  .container-4 {
    background-color: #B2DFEE !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 4px 4px 4px rgba(0, 0, 0, 0.2) !important;
  }

  .container-5 {
    background-color: #ffea0d !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 5px 5px 6px rgba(0, 0, 0, 0.3) !important;
  }

  .container-6 {
    background-color: #87b11d !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 6px 6px 8px rgba(0, 0, 0, 0.3) !important;
  }

  .container-7 {
    background-color: #008253 !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 7px 7px 10px rgba(0, 0, 0, 0.4) !important;
  }

  .container-8 {
    background-color: #f16729 !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 8px 8px 12px rgba(0, 0, 0, 0.4) !important;
  }

  .container-9 {
    background-color: #4c549f !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 9px 9px 14px rgba(0, 0, 0, 0.4) !important;
  }

  .container-10 {
    background-color: #764394 !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 10px 10px 16px rgba(0, 0, 0, 0.4) !important;
  }

  .container-11 {
    background-color: #ca0d86 !important;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.1), 11px 11px 18px rgba(0, 0, 0, 0.4) !important;
  }

  .container div:last-child {
    background: #645b5c url("/static/images/ticket/cover.jpg") repeat center center;
    box-shadow: -1px -1px 3px rgba(0, 0, 0, 0.2), 12px 12px 20px rgba(0, 0, 0, 0.6), inset 2px 2px 0 rgba(255, 255, 255, 0.1);
  }

  .container div:last-child:after {
    content: '';
    position: absolute;
    bottom: 15px;
    left: 15px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #dddddd;
    background: -moz-linear-gradient(-45deg, #dddddd 0%, #58535e 48%, #889396 100%);
    background: -webkit-gradient(linear, left top, right bottom, color-stop(0%, #dddddd), color-stop(48%, #58535e), color-stop(100%, #889396));
    background: -webkit-linear-gradient(-45deg, #dddddd 0%, #58535e 48%, #889396 100%);
    background: -o-linear-gradient(-45deg, #dddddd 0%, #58535e 48%, #889396 100%);
    background: -ms-linear-gradient(-45deg, #dddddd 0%, #58535e 48%, #889396 100%);
    background: linear-gradient(135deg, #dddddd 0%, #58535e 48%, #889396 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#dddddd', endColorstr='#889396', GradientType=1);
    box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.5), 1px 1px 1px rgba(255, 255, 255, 0.1);
  }

  .container div h4 {
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    font-weight: 700;
    font-size: 50px;/*40px;*/
    text-transform: uppercase;
    border-top: 1px dashed rgba(0, 0, 0, 0.1);
    border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
    margin: 4px;
    padding: 5px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    float: right;
    height: 82px;
    width: 25%;
    position: absolute;
    bottom: 0px;
    right:0px;
  }

  .container div:last-child h4 {
    background: rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
  }

  .container div:last-child h5 {
    font-size: 50px;
    white-space: nowrap;
    /*text-align: left;*/
    margin: 0;
    padding: 0;
    position: absolute;
    color: #fff;
    text-shadow: -1px -1px 1px rgba(255, 255, 255, 0.1);
    text-transform: uppercase;
    width: 73%;
    height: 95%;
    position: absolute;
    bottom: 0px;
  }

  span.sb-icon {
    display: block;
    height: 70px;
    width: 70px;
    margin: 20px auto;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  span.sb-icon:before {
    font-family: 'icons';
    font-style: normal;
    font-weight: normal;
    speak: none;
    display: block;
    text-decoration: inherit;
    text-align: center;
    text-shadow: 1px 1px 1px rgba(127, 127, 127, 0.3);
    line-height: 64px;
    width: 100%;
    font-size: 60px;
    color: #000;
    text-shadow: 0 0 1px #000;
  }

  .icon-cog:before {
    content: '\35';
  }

  /* '5' */

  .icon-flight:before {
    content: '\37';
  }

  /* '7' */

  .icon-eye:before {
    content: '\34';
  }

  /* '4' */

  .icon-install:before {
    content: '\39';
  }

  /* '9' */

  .icon-bag:before {
    content: '\36';
  }

  /* '6' */

  .icon-globe:before {
    content: '\38';
  }

  /* '8' */

  .icon-picture:before {
    content: '\32';
  }

  /* '2' */

  .icon-video:before {
    content: '\30';
  }

  /* '0' */

  .icon-download:before {
    content: '\41';
  }

  /* 'A' */

  .icon-mobile:before {
    content: '\42';
  }

  /* 'B' */

  .icon-camera:before {
    content: '\33';
  }

  /* '3' */
</style>