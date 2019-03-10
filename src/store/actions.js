// 异步操作 异步修改 或者调用多个mutations才会封装
import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list) // 写入顺序列表
  // 点击播放之后就要判断此时是不是随机播放
  if (state.mode === playMode.random) { // 随机播放
    let randomList = shuffle(list) // 对列表进行随机
    commit(types.SET_PLAYLIST, randomList) // 提交这次数据修改
    index = findIndex(randomList, list[index]) // 找到正在播放的曲子在更新后列表的位置索引
  } else {
    commit(types.SET_PLAYLIST, list) // 写入更改播放列表
    commit(types.SET_CURRENT_INDEX, index) // 传入点击曲子的索引便于定位
    commit(types.SET_FULL_SCREEN, true) // 点击之后变全屏
    commit(types.SET_PLAYING_STATE, true) // 点击之后开始播放
  }
  console.log('状态已改变')
}
// 播放器工作的顺序 已经完成了双向绑定了 只需要传入数据即可
export const randomPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAY_MODE, playMode.random) // 修改状态 进行数据绑定
  commit(types.SET_SEQUENCE_LIST, list) // 存储此时数据 顺序播放
  let randomList = shuffle(list) // 洗牌
  commit(types.SET_PLAYLIST, randomList) // 随机播放列表
  commit(types.SET_CURRENT_INDEX, 0) // 写入索引
  commit(types.SET_FULL_SCREEN, true) // 写入状态全屏
  commit(types.SET_PLAYING_STATE, true) // 写入状态播放
}