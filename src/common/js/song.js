import {getLyric} from '../../api/song'
import {ERR_OK} from '../../api/config'
import {Base64} from 'js-base64'
// 歌词对象原型
export default class Song {
  constructor({id, mid, guid, vkey, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
    // this.guid = guid
    // this.vkey = vkey
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    // 返回一个新的promise对象 用于获取api然后把结果转码后再次转发 因为是promise对象啊
    return new Promise((resolve, reject) => {
      console.log('NMD?')
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric) // 直接创建的形式
          console.log(this.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

// 实例化一个歌词对象 并对其中的数据进行过滤操作
export function createSong(musicData, vkey) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    // guid: musicData.guid,
    // vkey: musicData.vkey,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://isure.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?&guid=9583048168&vkey=${vkey}&uin=0&fromtag=66`
  })
}



function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
