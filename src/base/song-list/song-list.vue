<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" v-for="(song, index) in songs" :key="index" class="item">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    songs: {
      type: Array,
      default: []
    }
  },
  methods: {
    // 非业务组件不处理数据只传递数据告知状态
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    getDesc(song) {
      return `${song.singer}·${song.album}`
    }

  }
}
</script>

<style lang="stylus" scoped>
  @import '../../common/stylus/variable.styl'
  @import '../../common/stylus/mixin.styl'

  .song-list
    .item
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;
      /* 排行榜中有细微的差距 */
      .rank
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        .icon
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme;
          font-size: $font-size-large
      .content
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name
          no-wrap()
          color: $color-text;
        .desc
          no-wrap()
          margin-top: 4px;
          color: $color-text-d
</style>
