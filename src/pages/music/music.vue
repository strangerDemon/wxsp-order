<template>
 <div class="music">
  <div class="musicList">
    <audio v-for="(music,index) in musicList" :key="music.id" class="musicItem" :poster="music.poster" :name="music.name" :author="music.author" :src="music.src" :id="music.id" controls loop :bindtap="audioChoice(music)"></audio>
  </div>
  <div class="musicButtons">
    <button class="musicButton" bindtap="audioPlay">play</button>
    <button class="musicButton" bindtap="audioPause">pause</button>
    <button class="musicButton" data-time="14" bindtap="audio">setting time</button>
    <button class="musicButton" bindtap="audioStart">restart</button>
  </div>
</div>
</template>
<script>
  export default {
    name: "music",
    directives: {},
    components: {},
    data() {
      return {
        musicList: [{
          id: "1",
          poster: 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000',
          name: '此时此刻',
          author: '许巍',
          src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        }]
      }
    },
    props: {},
    computed: {},
    watch: {},
    methods: {
      audioChoice(music) {
        this.audioCtx = wx.createAudioContext(music.id)
      },
      audioPlay() {
        this.audioCtx.play()
      },
      audioPause() {
        this.audioCtx.pause()
      },
      audio(options) {
        this.audioCtx.seek(options.target.dataset.time)
      },
      audioStart() {
        this.audioCtx.seek(0)
      }
    },
    beforeCreate() {},
    created() {},
    destroyed() {},
    mounted() {
      this.audioCtx = wx.createAudioContext('myAudio')
    }
  }
</script>
<style lang="css"
       scoped>
  .music {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .musicList {
    width: 100%;
  }

  .musicItem {
    width: 100%;
  }

  .musicButtons {
    position: fixed;
    bottom: 0;
    min-height: 60px;
    border-radius: 0px;
    width: 100%;
  }

  .musicButton {
    display: inline-flex;
  }
</style>