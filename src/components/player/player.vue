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
        <div class="middle"
             @touchstart.prevent = "middleTouchStart"
             @touchmove.prevent = "middleTouchMove"
             @touchend = "middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词部分 是藏在右边的便于左右滑动 -->
          <scroll class="middle-r" 
            ref="lyricList"
            :data="currentLyric && currentLyric.lines"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   v-for="(line, index) in currentLyric.lines"
                   :key="index"
                   :class="{'current': currentLineNum === index}"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 下方按钮 -->
        <div class="bottom">
          <!-- 小圆点 -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}" ></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <!-- 进度条和时间 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <!-- 进度条 -->
            <div class="progress-bar-wrapper">
              <progress-bar @percentChange="onProgressBarChange" :percent="percent"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <!-- 操作按钮 -->
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="iconMode"></i>
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
          <progress-circle :percent="percent" :radius="radius">
          <i @click.stop="togglePlaying" :class="miniIcon" class="icon-mini"></i>
          </progress-circle>
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
    @ended="end"
    :src="currentSong.url"
    @timeupdate="updateTime"
    ></audio>
  </div>
  
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from '../../base/progress-bar/progress-bar'
import ProgressCircle from '../../base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration') 
export default {
  data() {
    return {
      songReady: false, // 用于控制歌曲是否能够播放
      currentTime: 0, // 用于存放播放时间
      radius: 32, // 这里传值要注意写固定值数字会被当成字符串传递
      currentLyric: null, // 实例的歌词
      currentLineNum: 0, // 播放歌词的行数
      currentShow: 'cd', // 控制小圆点被选中的状态
      playingLyric: '' // 正在播放的歌词
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  // 钩子函数
  created() {
    this.touch = {}
  },
  /*计算属性和监听器 */
  computed: {
    playIcon() { // 播放按钮的样式控制
      return this.playing ? 'icon-pause': 'icon-play';
    },
    miniIcon() { // mini播放器播放按钮控制
      return this.playing ? 'icon-pause-mini': 'icon-play-mini';
    },
    cdCls() { // 圆形唱片的旋转动画
      return this.playing ? 'play' : 'play pause'
    },
    iconMode() { // Mode数据绑定样式
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    disableCls() { // 点击禁用样式
      return this.songReady ? '':'disable'
    },
    percent() { // 百分比
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'currentSong',
      'playList',
      'currentIndex',
      'mode',
     'sequenceList'
    ])
  },
  watch:{
    // 边界条件 如果被切到后台的情况 小程序API的思考情况很多啊
    // 难怪监听的是歌曲而不是列表中的索引号
    currentSong(newSong, oldSong) { // 来了 watch监听函数的底层 只有数据有变动就会执行
      if (newSong.id === oldSong.id) {
        return
      }
      if(this.currentLyric) {
        this.currentLyric.stop()
      }
      // 需要等待audio加载完才可以 原理？
      // 切换到后台的话 js代码不会执行 那APP是如何做到在后台播放的
      // 这里利用的是事件队列机制的关系 定时器会在同步执行完后再执行
      setTimeout(()=> {
        this.$refs.audio.play()
        this.getLyric()
      }, 1000)
      /*
      this.$nextTick(()=>{
        this.$refs.audio.play()
        this.getLyric() // 这里是什么时候变成Song对象的
      })
      */
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
    // 歌词播放相关 这里一直没懂
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric) // 返回的是一个promise对象
        
        if (this.playing) {
          this.currentLyric.play() // 这个函数不是自带的 是后续封装给的
        }
        console.log(this.currentLyric)
      }).catch(() => {
        // 歌词未获取到的情况 凡是与网络/用户操控数据都要考虑到失败
        this.currentLyric = null
        this.playingLyric = ''
        this.currentLineNum = 0
      })
    },
    //  这里的函数看不懂了
    handleLyric({lineNum, txt}) {// 这个传值
      this.currentLineNum = lineNum
      if(lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum -5]
        // 调用子组件的方法
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000)
      }
      this.playingLyric = txt // 把歌词给他 这里封的几个函数完全猜不透
    },
    /* 歌词部分的滑动事件 */
    // Vue的this问题一定很怪啊 如果没有的话 this会自动创建一个变量挂载
    middleTouchStart(e) {
      this.touch.initiated = true // 这个值控制的是谁？ 初始化
      const touch = e.touches[0] // this指向迷啊
      // 存储第一次点击的坐标
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
      console.log(this.touch.initiated)
    },
    middleTouchMove(e) {
      
      if(!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      // 计算出滑动的距离和第一次触碰的距离 来判定是怎么滑的 左滑为负
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if(Math.abs(deltaY) > Math.abs(deltaX)) { // 当向下划远大于X轴滑 不触发
        return
      }
      const left = this.currentShow === 'cd'? 0: -window.innerWidth
      console.log(`当前的范围值${left}`)
      console.log(`当前移动值${deltaX}`)
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX)) // 限制可以滑动的距离
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      console.log(`当前百分比为${this.touch.parcent}`)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)` // 根据滑动的距离修改偏移值
      this.$refs.lyricList.$el.style[transitionDuration] = 0 // 过渡持续事件变0？
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
      
    },
    
    middleTouchEnd() {
      let offsetWidth // 根据偏移宽度计算
      let opacity // 控制是谁的透明度
      console.log(this.currentShow)
      console.log(this.touch.percent)
      if(this.currentShow === 'cd') {
        if(this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          console.log('是你执行了？')
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if(this.touch.percent < 0.9) { // 此时的偏移量 当歌词面显示的时候 percent是10
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300 // 过渡时间 制作动画
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      // 偏移时间 这里需要注意的是几个偏移值 分别打印看看
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
      console.log(`当前偏移值${offsetWidth}`)
      
    },
    
    // 返回按钮相关
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
      if(this.currentLyric) { // 未知方法 大概是切换当前播放状态 让歌词不再滚动
        this.currentLyric.togglePlay()
      }
    },
    // 都依赖于播放功能 内容切换 再次播放
    prev() {
      if (!this.songReady) { // 如果这时的播放状态没准备好 初始化条件
        return
      }
      if (this.playList.length === 1) {
        this.loop()
      } else {
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying() // 如果没有播放 就让他播放
        }
      }
      this.songReady = false
    },
    next() {
      // 如果是false就不执行 禁用按钮 直到自定义事件返回true的时候
      // 手动补了一个异步加载的事件
      // 应该还有一个监听mode的 如果是随机播放 那么next应该是随机变动index的
      if (!this.songReady) { // 如果歌曲没准备好就不执行
        return
      }
      // 边界条件 当只有一首的时候
      if (this.playList.length ===1) {
        this.loop()
      } else {
        let index = this.currentIndex + 1
        // 处理边界情况 最后一首的时候
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying() // 如果没有播放 就让他播放
        }
      }
      
      // 第一首执行完后调整为false 等待下一次加载事件的循环
      this.songReady = false
    },
    end() { // 为啥叫这个名 因为是歌曲播放结束后的事件
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next() //
      }
    },
    loop() {
      this.$refs.audio.currentTime =0
      this.$refs.audio.play()
      // 歌词重置
      if(this.currentLyric){
        this.currentLyric.seek()  // 歌词播放重置
      }
    },
    /*模式切换的三个功能相关 */
    // mode改变其实改变的是播放列表
    changeMode() {
      const mode = (this.mode + 1) % 3 // 点击一次累加但把值域维持在3以内
      this.setPlayMode(mode) // 修改mode
      let list = []
      console.log(typeof(list))
      if (mode === playMode.random) { // 此处playmode来源于外部configJS文件的引入
        console.log(this.sequenceList)
        list = shuffle(this.sequenceList) // 对数组进行乱序
        console.log('切换到随机了')
        console.log(list)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list) // 播放列表改动后 索引不变的话歌曲会被切换
      this.setPlayList(list)
    },
    // 重置此时的ID号
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => { // 可以获取每个元素的Id并进行筛选返回
        return item.id === this.currentSong.id
      })
      console.log(index)
      this.setCurrentIndex(index) // 再把此时播放的ID设置回去
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
      // 获得此时播放的时间数
      this.currentTime = e.target.currentTime
    },
    format(interval) { // 格式化事件
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
    // 子组件派发的事件触发函数 完成了一次数据双向绑定 进度条的时间由进度条百分比控制
    onProgressBarChange(percent) {
      const currentTime = percent * this.currentSong.duration
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying()
      }
      // 歌词 传入百分比控制歌词的播放
      if(this.currentLyric) {
        this.currentLyric.seek(currentTime) // 这个API
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN', // 映射mututaions内的修改数据数据方法拿到此组件使用
      setPlayingState: 'SET_PLAYING_STATE', // 映射修改状态的数据
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
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
        /*这一个歌词又是？这里滑动不会又是依赖插件 而不是手势库*/
        .playing-lyric-wrapper
          width: 80%
          margin: 30px auto 0 auto
          overflow: hidden
          text-align: center
          .playing-lyric
            height: 20px
            line-height: 20px
            font-size: $font-size-medium
            color: $color-text-l
        /*歌词部分 */
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        /**来源于控制组件的样式 */
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
