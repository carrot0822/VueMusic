// 状态管理 存放公用数据
import {playMode} from '../common/js/config'
const state = {
  /* 播放器相关数据 */
  singer: {},
  playing: false, // 暂停/播放
  fullScreen: false, // 是否全屏
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表 因为播放模式的不同两列表有区别
  mode: playMode.sequence, // 播放模式选择
  currentIndex: -1, // 当前播放的索引 当前播放的是哪一首曲子
  /* 相关歌单的数据 */
  disc: {}
}

export default state