<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from '../music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from '../../api/rank'
import {ERR_OK} from '../../api/config'
export default {
  data() {
    return{
      songs:[]
    }
  },
  computed:{
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      return this.topList.picUrl
    },
    ...mapGetters([ //mapgetters是一个数组
      'topList'
    ])
  },
  components:{
    MusicList
  },
  /*todo：请求数据未完成 接口改为post提交需要重新转换 
  songs数据未获取 songlist数据内包含另一些数据 这些数据的流向和作用应该需要明白
   vkey未获取 vkey关联着播放源
   这就是接口文档的作用
   再就是需要的数据 也是需要思考的
   前端是数据映射到页面上
   数据的类型格式
   数据的获取（请求） 数据的输入（过滤后绑定到data） 数据的输出 绑定到结构上渲染
   不过这里可以通过pc的接口获取明天自己照着以前写的写一遍
  */
  methods:{
    _getMusicList() {
      getMusicList(this.topList.id).then((res) => {
        if(res.code === ERR_OK) {
          console.log(res.songlist)
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      
    }
  }
}
</script>

<style lang="stylus">
  .slide-enter-active .slide-leave-active
    transition: all 0.3s ease
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>



