<template>
  <div class="music-list">
    <!-- 返回按钮 点击后返回上层 -->
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 用于占位的图层 图片未加载就占好位置以防位置突变 padding -->
      <div class="filter"></div>
    </div>
    <!-- 歌单和歌手列表 -->
    <scroll :data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs">

        </song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../base/scroll/scroll.vue'
import SongList from '../../base/song-list/song-list'
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
  components: {
    Scroll,
    SongList
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted() {
    // 这些this是直接挂载在这个vue实例的吗= =
    this.imageHeight = this.$refs.bgImage.clientHeight
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
      .filter
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative;
      top: 0;
      bottom: 0;
      width: 100%;
      background: $color-background;
    /**betterScroll组件缺点 外层包裹文件必须是fiexd */
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      z-index: -1;
      .song-list-wrapper
        padding: 20px 30px;
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>