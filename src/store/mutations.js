// 放置用于改变数据的方法 更待store的唯一方法就是通过mutations
import * as types from './mutation-types'

// mutation的修改方法 每个mutation都有一个types 一个句柄
const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  }
}

export default mutations