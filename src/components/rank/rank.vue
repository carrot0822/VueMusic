<template>
  <div class="rank">
    <scroll :data="topList" class="toplist">
      <ul
        <li class="item" v-for="(item, index) of topList" :key='index'>
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) of item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.singername}} -- {{song.songname}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">正在加载中</div>
    </scroll>
    <router-view></router-view>
  </div>
</template>


<script>
import {ERR_OK} from '../../api/config'
import {getTopList} from '../../api/rank'
import Loading from '../../base/loading/loading'
import Scroll from '../../base/scroll/scroll'
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
    }
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
