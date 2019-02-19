import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, options)
}
// object.assign(target, ...sources) target是目标对象 sources是源对象
// 目标对象中的属性有相同的值 则属性会被源对象覆盖
// 作用 把所有可枚举属性的值从一个或者多个源对象复制到目标对象 同时返回修改后目标对象（名字可能变了但地址还是一样）
export function getSongVkey (songmid) { // 获取歌曲的vkey
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, {
    callback: 'musicJsonCallback',
    loginUin: 0,
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    guid: 9583048168,
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })

  return jsonp(url, data)
}
// 无效函数 但是可以用于分析
export function getMusic(songmid) {
  const url = '/api/music'
  const data = Object.assign({}, commonParams, {
    songmid: songmid,
    filename: 'C400' + songmid + '.m4a',
    guid: 9583048168,
    platform: 'yqq',
    loginUin: 0,
    hostUin: 0,
    needNewCode: 0,
    cid: 205361747,
    uid: 0,
    g_tk: 1928111839,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

