// 异步操作 异步修改 或者调用多个mutations才会封装
import * as types from './mutation-types'

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // 写入顺序列表
  commit(types.SET_PLAYLIST, list) // 写入更改播放列表
  commit(types.SET_CURRENT_INDEX, index) // 传入点击曲子的索引便于定位
  commit(types.SET_FULL_SCREEN, true) // 点击之后变全屏
  commit(types.SET_PLAYING_STATE, true) // 点击之后开始播放
  console.log('状态已改变')
}