<template>
  <div class="music-list">
    <!-- 返回按钮 点击后返回上层 -->
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length" class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 用于占位的图层 图片未加载就占好位置以防位置突变 padding -->
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 用于遮挡背景层达到骗眼的效果 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 歌单和歌手列表 -->
    <scroll 
    :data="songs"
    :probe-type="probeType"
    :listen-scroll="listenScroll" 
    @scroll="scroll"
    class="list" 
    ref="list"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs">

        </song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../base/scroll/scroll.vue'
import SongList from '../../base/song-list/song-list'
import Loading from '../../base/loading/loading'
import {prefixStyle} from '../../common/js/dom'
const RESERVED_HEIGHT = 40 // 常量限制歌单列表滚动的高度
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop')
export default {
  props: {
    bgImage: { // 不接受横线命名
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    }
  },
  watch: {
    // 监听newY的值/scrollY/滚动的距离/由scroll组件传递
    scrollY(newY) {
      // console.log(newY)
      let translateY = Math.max(this.minTranslateY, newY)
      let zIndex = 0
      let scale = 1
      let blur = 0
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`
      
      
      const percent = Math.abs(newY / this.imageHeight)
      if (newY > 0) {
        scale = 1 + percent
        zIndex = 10
      }else{
        // 只要往上推就开始模糊
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.filter.style['backdrop-filter'] = `blur(${blur})` // ios独有？ 模糊应该有其他的吧
      this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur})`
      if (newY < this.minTranslateY) { // 注意此处两个值都为负数 是滚动距离超过图片高度了
       // console.log('执行了')
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      } else {
       // console.log('执行了吗')
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      
    }
  },
  mounted() {
    // 这些this是直接挂载在这个vue实例的吗= =
    this.imageHeight = this.$refs.bgImage.clientHeight // 图片高度
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT // bg-layer最大Y轴偏移值
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable.styl"
  @import "../../common/stylus/mixin.styl"
  
  .music-list
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background
    .back
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme
    .title
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 88%;
      no-wrap()
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    .bg-image
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      /*播放器的样式 */
      .play-wrapper
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play
          box-sizing: border-box
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0
          .icon-play
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: $font-size-medium-x
          .text
            display: inline-block;
            vertical-align: middle;
            font-size: $font-size-small;
      .filter
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative;
      width: 100%;
      height: 100%;
      background: $color-background;
    /**betterScroll组件缺点 外层包裹文件必须是fiexd */
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px;
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
