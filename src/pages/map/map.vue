<template>
  <map class="map" longitude="118.1431961060" latitude="24.4987083984" scale="14" data-point="" bindmarkertap="bindMap"></map>
</template>
<script>
  export default {
    name: "map",
    directives: {},
    components: {},
    data() {
      return {}
    },
    props: {},
    computed: {},
    watch: {},
    methods: {
      bindMap(event) {
        wx.showToast({
          title: "your click point is:" + event.target.dataset.point,
          icon: 'warning',
          duration: 2000
        })
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
  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>