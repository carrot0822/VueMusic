<template>
  <div class="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="(item, index) of topList" :key='index'>
          <!-- 左侧封面 -->
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <!-- 歌词列表 -->
          <ul class="songlist">
            <li @click="selectItem(item)" class="song" v-for="(song, index) of item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.singername}} -- {{song.songname}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- loading加载 -->
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>


<script>
import {ERR_OK} from '../../api/config'
import {getTopList} from '../../api/rank'
import Loading from '../../base/loading/loading'
import Scroll from '../../base/scroll/scroll'
import {playlistMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  created() {
      this._getTopList()
  },
  data(){
    return {
      topList:[]
    }
  },
  components:{
    Loading,
    Scroll
  },
  methods:{
    _getTopList() {
      console.log('111')
      getTopList().then((res)=>{
        if(res.code === ERR_OK) {
          this.topList = res.data.topList
          console.log(res.data.topList)
        }
      })
    },
    handlePlay(playlist) {
      const bottom = play.length ? '60px': ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh() // 父组件调用子组件的方法 子组件调用父组件的方法
    },
    selectItem(item) {
      // 这里只是完成了页面跳转 并没有缓存数据 都放在vuex内传递吗
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item) // 数据传递
    },
    ...mapMutations({ // 是一个对象 数据类型
      setTopList: 'SET_TOP_LIST'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"
@import "../../common/stylus/mixin"

  .rank
    position:fixed
    width: 100%
    top: 88px;
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex;
        margin: 0 20px
        padding-top: 20px;
        height: 100px
        &:last-child
          padding-bottom: 20px;
        .icon
          flex: 0 0 100px;
          width: 100px;
        .songlist
          flex: 1
          flex-direction:column;
          justify-content: center
          padding: 0 20px;
          height: 100px;
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px;
    .loading-wrapper
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%)


</style>
