import {mapGetters} from 'vuex'

export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() { // DOM 渲染的时候触发
    this.handlePlaylist(this.playList)
  },
  activated() { // keep-alive 路由切换触发的钩子函数
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('组件必须引入这个handleplayList方法')
    }
  }
}