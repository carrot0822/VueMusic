<template>
  <scroll 
    ref="listview"
    :data="data"
    :listenScroll = "listenScroll"
    :probe-type="probeType"
    @scroll="scroll" 
    class="listview">
    <ul>
      <li v-for="(group, index) in data" 
      :key="index" 
      class="list-group"
      ref="listGroup"
      >
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" 
              v-for="(item, index) in group.items" 
              :key="index"
              @click="selectItem(item)"
              >
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 右侧固定栏-->
    <div class="list-shortcut" 
    @touchstart="onShortcutTouchStart"
    @touchmove.prevent="onShortcutTouchMove"
    >
      <ul>
        <li v-for="(item,index) in shortcutList" 
        :key="index"
        :data-index="index"
        :class="{'current': currentIndex === index}"
        class="item"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll'
import Loading from '../../base/loading/loading'
import {getData} from '../../common/js/dom'

const ANCHOR_HEIGHT = 18 // 锚点高度 也就说ABCD的那个灰色图层的高度
const TITLE_HEIGHT = 30 // title高度 固定的title 热门的高度

export default {
  created() {
    this.probeType = 3  // 传递用于告知scroll子组件要实时监听
    this.listHeight = [] // 用于存放各个gourp的总高度 以便于计算滚动所处的区间->计算索引->绑定样式
    this.listenScroll = true // 传递给子组件 告知子组件需要监听滚动
    this.touch = {} // data域里的值写入对象会自动添加一个set和get来观察 这里只是当获取用
  },
  data() {
    return{
      scrollY: -1, // 代表滚动停止时的Y轴高度
      currentIndex: 0 // 此时滚动到位置所对应的group的索引
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  computed: {
    // ???监听什么？
    shortcutList() {
      return this.data.map((group) => {
        return group.title.substr(0,1)
      })
    },
    // 此处scrollY是负值 大于0说明未往下滑 检测的究竟是什么
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title: ''
    }
  },
  methods: {
    // 2/16 用于数据传递 子组件不含有业务相关 只负责传送数据和事件
    selectItem(item) {
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index') // 获取索引值
      console.log(anchorIndex)
      let firstTouch = e.touches[0] // 获取第一次触摸的对象
      this.touch.y1 = firstTouch.pageY // 获取第一次触摸的Y轴高度 即height
      this.touch.anchorIndex = anchorIndex // 把第一次点击的索引传递到全局data里 以供后续调用
      // 调用组件内的方法 传入dom节点
      console.log(this.touch)
      this._scrollTo(anchorIndex) // 滚动到相应位置？
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0] // 获取第一个滚动的触摸对象
      this.touch.y2 = firstTouch.pageY // 获取Y轴距离
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 根据Y轴距离差确定在那个字母 也就是差的索引
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta // 传入值的数据类型是数字而不是字符串
      this._scrollTo(anchorIndex) // 传入对应索引进行滑动  索引这个滑动函数需要获取的参数 就是上面所做的事情
      console.log(this.touch)
    },
    _scrollTo(index) {
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      // 第二个参数 是否需要滚动动画的时间
    },
    // 这个滚动函数的参数是来源于子组件吗？ pos.y传递给scrollY 然后根据这个判定位置
    scroll(pos) {
      this.scrollY = pos.y // 监听了scroll事件 然后传递了值上来
      // console.log(pos.y)
      // console.log(pos.y) 传递过来的值是负数
    },
    // 用于计算每个group的物理高度 用于判定滚动区域所处的位置
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i =0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight // 这里是利用每个group高度来累加而非坐标来计算的
        this.listHeight.push(height)
        // console.log(height)
      }
    }

  },
  // 监听data的变化 延时计算的目的是 数据变化到DOM变化是需要时间
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      },20)
    },
    // newY是哪里来的？ 这里传入的参数是变化的数据吗
    scrollY(newY) {
      const listHeight = this.listHeight
      // console.log(newY) 与上述的值相等 也就是滚动的值
      // 当滚动到顶部，newY>0 滚动的区域分为三块
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if( -newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY // 差值 group2总高度-滚动的高度= 最顶部高度与group底部的距离
          // console.log(this.currentIndex)
          // console.log(this.diff)
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2 // 比右侧多一个？ 其实还是索引
    },
    // 滚动到一定位置后隐藏导航条或者固定新的导航条 diff是监听的差值
    // 这些this究竟指向何处？ 有了let还指向外部吗 有些数据根本没命名啊
    diff(newVal) {
      console.log(newVal)
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/variable"

  .listview
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background
    .list-group
      padding-bottom: 30px;
      .list-group-title
        height: 30px;
        line-height: 30px;
        padding-left: 30px;
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar
          width: 50px;
          height: 50px;
          border-raduis: 50%;
        .name
          margin-left: 20px;
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-raduis: 10px;
      text-align: center;
      background: $color-background-d
      font-family: Arial, Helvetica, sans-serif
      .item
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current
          color: $color-theme;
    .list-fixed
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
    .loading-container
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%)    
</style>
