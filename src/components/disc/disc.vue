<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from '../../components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from '../../api/recommend'
import {ERR_OK} from '../../api/config'
import {createSong} from '../../common/js/song'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: { // 为什么是在计算属性中使用
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getSongList()
    console.log('NMD?')
  },
  methods:{
    _getSongList() {
      // 边界处理 用户刷新
      if(!this.disc.dissid) {
        this.$router.push('/recommand')
      }
      let dissid = this.disc.dissid
      console.log(dissid)
      getSongList(dissid).then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          console.log(res.cdlist[0].songlist)
          this.songs = this._normalLizeSong(res.cdlist[0].songlist)
          console.log(this.songs)
        }

      })
    },
    // 数据初始化 多的数据最好都封在自己已经要用的数据里 做一层过滤
    _normalLizeSong(list) {
      let ret = []
      list.forEach((musicData) => {
        if(musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData)) // 实例合并的数组
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0,)
</style>

