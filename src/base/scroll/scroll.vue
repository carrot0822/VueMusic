<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  // 接收的数据API需要查阅BscrollApi
  props: {
    probeType: { // 是否需要实时监听
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null // 数据是动态的 防止滑动后滑不下去 refresh滚动条
    },
    listenScroll: { // 是否要监听滚动事件
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => { // 必须要在数据渲染完之后再调用
      this._initScroll()
    },20)
  },
  methods: {
    _initScroll() { // 滚动组件初始化函数 用于节点刚挂载的时候
      if (!this.$refs.wrapper) { // 检测dom渲染节点后才能使用
        return
      }
      // 这里的两个参数用于？ 默认创建一个scroll对象啊
      this.scroll = new BScroll(this.$refs.wrapper,{
        probeType: this.probeType, // 是否实时滚动
        click: this.click
      })
      // 根据传递的参数来确定是否监听滚动事件
      if (this.listenScroll) {
        let me = this
        // 如果有则给这个scroll对象绑定一个匿名函数并传入破事 用于emit这个？
        // 监听滚动事件 向上传递一个scroll事件 由父组件接收这个数据 子组件向父组件传值
        // 这个函数是真的不知道 这里只是传递了一个数据给父组件 那这个数据是哪里来的 估计是函数内API
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
        console.log(1)
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 这几个函数的效果
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },

  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      },20)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
