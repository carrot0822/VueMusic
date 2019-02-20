<template>
  <transition name="slide">
    <music-list
     :title="title"
     :bg-image = "bgImage"
     :songs = "songs"
     >
     </music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerDetail, getSongVkey} from '../../api/singer'
import {ERR_OK} from '../../api/config'
import {createSong} from '../../common/js/song'
import MusicList from '../music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  // 所谓计算属性
  computed: {
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    ...mapGetters([
      'singer'
    ])
  },
  components: {
    MusicList
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() { // 因为此处的VuexID是由点击
      if(!this.singer.mid) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.mid).then((res) => { // 此处的数据似乎被vuex处理后就变成全局了
        if(res.code === ERR_OK) {
           console.log(res.data.list)
          this.songs = this._normalizeSongs(res.data.list)
           console.log(this.songs) // 这里的Vue 好吧指向最顶部 也就是window global
        }
      })
    },
    // 测试数据
    // 数据初始化与过滤化接受来的数据
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => { // 箭头函数会自动返回 返回的并不是ret啊
        let {musicData} = item // 数据解构赋值
        getSongVkey(musicData.songmid).then((res) => {
          // console.log('这首歌的vkey获取到了')
          const vkey = res.data.items[0].vkey
          // console.log(vkey)
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData, vkey))
          }
        })
        /*
        if(musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData)) // 在createSong对象中手动封装了一次数据解构赋值功能
        }
        */
      })
      return ret
      console.log('估计是返回值不对？')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../../common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
