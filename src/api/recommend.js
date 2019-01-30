import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

// 只是负责把一些已知的并且可重复调用的接口传入jsonp方法 返回的仍然是一个promise对象
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}