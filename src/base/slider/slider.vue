<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>

      </slot>
    </div>
    <div class="dots">

    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from '../../common/js/dom'
export default {
  props: {
    loop: {
      type: Boolean,
      default : true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initSlider()
    },20)
  },
  methods: {
    _setSliderWidth() {
      this.children = this.$refs.sliderGroup.children // 抓取sliderGroup的子节点

      let width =0;
      let sliderWidth = this.$refs.slider.clientWidth //抓取slider的宽度
      for (let i = 0; i < this.children.length; i++ ){
        let child = this.children[i]
        addClass(child, 'slider-item') // 给每个child节点添加上这个样式

        child.style.width = sliderWidth + 'px' //使每个child节点的宽度与设置的slider宽度一直
        console.log(child.style.width)
        width += sliderWidth
      }

      if (this.loop) {
        width += 2*sliderWidth // 如果设置为true 则width为两倍宽度
      }
      this.$refs.sliderGroup.style.width = width + 'px' //宽度赋予给外层的sliderGroup 若未设置宽度则不浮动
      console.log(this.$refs.sliderGroup.style.width)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        click: true
      })
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  }

}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"

  .slider
    min-height : 1px;
    .slider-group
      position : relative;
      overflow : hidden;
      white-space : nowrap;
      .slider-item
        float : left;
        box-sizing : border-box;
        overflow : hidden;
        text-align : center;
        a
          display : block;
          width : 100%;
          overflow : hidden;
          text-decoration : none;
        img
          display : block;
          width : 100%;
    .dots
      position : absolute;
      right : 0;
      left : 0;
      bottom : 12px;
      text-align : center;
      font-size : 0;
      width : 20px;
      border-radius : 5px;
      background : $color-text-ll;

</style>
