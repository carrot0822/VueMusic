<template>
  <div class="player" v-show="playList.length>0">
    <transition 
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <!-- 圆形唱片 -->
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!-- 顶部图标 -->
        <div class="top">
            <div class="back" @click="back">
              <i class="icon-back"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- middle 中间唱片歌词层 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <!-- 下方按钮 -->
        <div class="bottom">
          <!-- 进度条和时间 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper"></div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <!-- 操作按钮 -->
          <div class="operators">
            <div class="icon i-left">
              <i  class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 缩小的播放按钮 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="cdCls" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 音频播放 -->
    <audio ref="audio" 
    @canplay="ready" 
    @error="error" 
    :src="currentSong.url"
    @timeupdate="updateTime"
    ></audio>
  </div>
  
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'

const transform = prefixStyle('transform')
export default {
  data() {
    return {
      songReady: false, // 用于控制歌曲是否能够播放
      currentTime: 0 // 用于存放播放时间
    }
  },
  computed: {
    playIcon() {
      return this.playing ? 'icon-pause': 'icon-play';
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini': 'icon-play-mini';
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '':'disable'
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentSong',
      'playList',
      'currentIndex'
    ])
  },
  watch:{
    currentSong() {
      // 需要等待audio加载完才可以
      this.$nextTick(()=>{
        this.$refs.audio.play()
      })
    },
    // 这里才真正的把state的数据与行为绑定在了一起
    playing(newPlaying) {
      const audio = this.$refs.audio
      // 监听playing的状态来修改是否播放 与行为绑定
      this.$nextTick(()=>{
        newPlaying? audio.play():audio.pause();
      })
    }
  },
  methods: {
    back() {
      this.setFullScreen(false)
      console.log('?')
    },
    open() {
      this.setFullScreen(true)
    },
    // 音乐播放相关功能
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing) // 对已有的playing状态取反
    },
    // 都依赖于播放功能 内容切换 再次播放
    prev() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playList.length
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying() // 如果没有播放 就让他播放
      }
      this.songReady = false
    },
    next() {
      // 如果是false就不执行 禁用按钮 直到自定义事件返回true的时候
      // 手动补了一个异步加载的事件
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      // 处理边界情况 最后一首的时候
      if (index === this.playList.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying() // 如果没有播放 就让他播放
      }
      // 第一首执行完后调整为false 等待下一次加载事件的循环
      this.songReady = false
    },
    // 额外情况控制
    ready() {
      this.songReady = true
    },
    error() {
      this.songReady = true
    },
    // 播放时间相关
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = this._pad(interval % 60)
      return`${minute}:${second}`
    },
    // 字符串补0
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len<n) {
        num = '0' + num
        len ++
      }
      return num
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN', // 映射mututaions内的修改数据数据方法拿到此组件使用
      setPlayingState: 'SET_PLAYING_STATE', // 映射修改状态的数据
      setCurrentIndex: 'SET_CURRENT_INDEX'
    }),
    // 动画钩子函数 目的是获得 圆片间XY轴的距离和比例大小 然后利用translated做偏移做动画而非直接改变style
    _getPosAndScale() {
      const targetWidth = 40 // 小圆形唱片的直径
      const paddingLeft = 40 // 离左侧边界的距离
      const paddingBottom = 30 // 小圆片离底部边界的距离
      const paddingTop = 80 // 大圆片离顶部边界的距离
      const width = window.innerWidth * 0.8 // 此处width为圆形唱片的直径
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 -paddingLeft) // 小圆片与大圆片X轴的距离
      const y = window.innerHeight - paddingTop - width/2 -paddingBottom // 小圆片与大圆片Y轴距离
      return {
        x,
        y,
        scale
      }
    },
    // 钩子函数 需要查看库的使用方法
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    }

  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"
  .player
    .normal-player
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background
      .background
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1
        opacity: 0.6;
        filter: blur(20px);
      .top
        position: relative;
        margin-bottom: 25px;
        .back
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50
          .icon-back
            display: block
            padding: 9px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg)
        .title
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text
      .middle
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%;
              /*CD 旋转的使用方法 */
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%
      .bottom
        position: absolute;
        bottom: 50px;
        width: 100%;
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l
              text-align: left;
            &.time-r
              text-align: right;
          .progress-bar-wrapper
            flex: 1;
        .operators
          display: flex;
          align-items: center;
          .icon
            flex: 1;
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px;
          .i-left
            text-align: right;
          .i-center
            padding: 0 20px;
            text-align: center;
            i
              font-size: 40px;
          .i-right
            text-align: left;
          .icon-favorite
            color: $color-sub-theme;
        .dot-wrapper
          text-align: center;
          font-size: 0;
          .dot
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transtion: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.nomal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: $color-highlight-background;
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0;
      .icon
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img
          border-radius: 50%;
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name
          margin-bottom: 2px;
          no-wrap()
          font-size: $font-size-medium;
          color: $color-text;
        .desc
          no-wrap()
          font-size: $font-size-small;
          color: $color-text-d;
      .control
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
