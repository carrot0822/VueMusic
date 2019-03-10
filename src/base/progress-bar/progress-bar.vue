<template>
  <div class="progress-bar" ref="progressBar"  @click.prevent="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div 
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {prefixStyle} from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
  props:{
    // 映射到progress的宽度 来显示进度条
    percent: {
      type: Number,
      default: 0
    }
  },
  watch: {
    // 监听百分比 并给予进度条宽度来视觉展示 控制是否进行这个行为
    // 这里用initiated再次控制事件是否进行 如果正在处于滑动事件 则不会执行这个改变的行为
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        // 是否有必要减去小球的直径
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const offsetWidth = newPercent * barWidth // 进度条和小球应该偏移的位置
        this._offset(offsetWidth)
      }
    }
  },
  created() {
    // 这个数据用于共享？
    this.touch = {}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true // 自定义的标志位 用于控制和检测这个事件的开始和结束
      this.touch.startX = e.touches[0].pageX // 第一个拇指按下所指的距离
      console.log(this.touch.startX)
      this.touch.left = this.$refs.progress.clientWidth // 点击按钮时 进度条当时宽度值
      
    },
    progressTouchMove(e) {
       // 用true来做开关 false就直接不执行 也算一种函数节流
      if(!this.touch.initiated) {
        return
      }
      // 纵向偏移值 每一次移动都会改变
      const deltaX = e.touches[0].pageX - this.touch.startX // 记录第二次拇指触碰距离与第一次位置的偏移量
      // ???这段便宜值的计算 Min左边是进度条的最大值 右边是啥
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0, this.touch.left + deltaX))
      this._offset(offsetWidth)
    },
     // 触碰结束的时候需要派发一个事件 告诉父组件移动到哪里了
    progressTouchEnd(e) {
      this.touch.initiated = false
      this._triggerPercent()
      console.log('触发了吗')
    },
    // 
    progressClick(e) {
      // 这几个获得的值该确认一下了吧
      // 点击按钮的时候offset不对
      const rect = this.$refs.progressBar.getBoundingClientRect() // 离浏览器窗口的距离 有上右下左四个值
      const offsetWidth = e.pageX - rect.left
      console.log(e.rect)
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    // 派发进度百分比给父组件
    _triggerPercent() {
      // 进度条最远的距离
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 此时的进度条的宽度与最远宽度的对比 这个百分比传递给父组件
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
      console.log('触发了吗')
    },
    // 用于设置进度条的背景色和移动按钮的偏移位置
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"
  .progress-bar
    height: 30px;
    .bar-inner
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute;
        height: 100%;
        background: $color-theme;
      .progress-btn-wrapper
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn
          position: relative;
          top: 7px
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
  
</style>

