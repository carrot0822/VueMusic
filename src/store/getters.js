// state映射文件 通过mapgetter获取这些数据
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playList = state => state.playList

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex
// 根据current索引值来获取列表中正在播放的曲子 然后只需要改变这个索引就能渲染出相应的曲子
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}

export const disc = state => state.disc