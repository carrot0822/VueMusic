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
    probeType: {
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
      this.scroll = new BScroll(this.$refs.wrapper,{
        probeType: this.probeType,
        click: this.click
      })
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }

  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
        console.log(1)
      },20)
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
