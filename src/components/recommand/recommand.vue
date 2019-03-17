<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <loading class="loading-container" v-show="!recommends.length"></loading>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="(item,index) in recommends" :key="index">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" @load="loadImg">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item,index) in discList" @click="selectItem(item)" class="item" :key="index">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60"/>
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>


<script>
import Scroll from '../../base/scroll/scroll'
import Slider from '../../base/slider/slider'
import Loading from '../../base/loading/loading'
import {getRecommend,getDiscList} from '../../api/recommend'
import {ERR_OK} from '../../api/config'
import {playListMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'


export default {
  mixins: [playListMixin],
  data() {
    return {
      recommends : [],
      discList: []
    }
  },
  created(){
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    // 这里也是为了使mini播放器下方兼容 这里也要回头看看scoll组件 更要看看betterScroll插件
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) { // 小程序传递参数给子页面 子页面根据ID参数去获取相应数据渲染
      this.$router.push({
        path:`/recommand/${item.dissid}` //把索引传递给路由 告知创建一个路由文件
      })
      // 这点跟小程序的实现是不一样的
      this.setDisc(item) // 数据写入到公有区域 不过为啥不根据索引号发请求
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
          // console.log(res.data.slider)
        }
      })
      
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data)
          this.discList = res.data.list
        }
      })
      
    },
    loadImg() {
      if (!this.checkLoaded) { // 这个checkLoaded的数据是哪里来的？
        this.checkLoaded = true
        this.$refs.scroll.refresh()
      }
      
    },
    ...mapMutations({ // 映射改动数据的方法
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
.recommend
  position : fixed;
  width : 100%;
  top : 88px;
  bottom : 0;
  .recommend-content
    height : 100%;
    overflow : hidden;
    .slider-wrapper
      position : relative;
      width : 100%
      overflow : hidden;
    .recommend-list
      .list-title
        height : 65px;
        line-height : 65px;
        text-align : center;
        font-size : $font-size-medium;
        color : $color-theme;
      .item
        display : flex;
        box-sizing : border-box;
        align-items : center;
        padding : 0 20px 20px 20px;
        .icon
          flex : 0 0 60px;
          width : 60px;
          padding-right: 20px;
        .text
          display : flex;
          flex-direction : column;
          justify-content : center;
          flex : 1;
          line-height : 20px;
          overflow : hidden;
          font-size : $font-size-medium
          .name
            margin-bottom : 10px;
            color : $color-text;
          .desc
            color : $color-text-d;
    .loading-container
      position : absolute;
      width : 100%;
      top : 50%;
      transform : translateY(-50%)
</style>
