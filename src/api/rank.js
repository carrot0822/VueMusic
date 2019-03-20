import {commonParams} from './config'
import axios from 'axios'
export function getTopList() {
  const url = '/api/getTopList'

  const data = Object.assign({}, commonParams, {
    _: 1553089412119,
    g_tk: 5381,
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    console.log('没有经过转发')
    return Promise.resolve(res.data)
  })
  /*
  return axios.get(url, {
    params: data
  }).then((res) => {
    console.log(res.data)
    return Promise.resolve(res.data) // 将返回的data对象转化为一个新的promise对象 便于转换 这里等价
     resolve的作用在于请求成功的时候把数据传递跟下一个then 并把状态改变成已完成 reject则是相反 then才是会被放到事件队列去执行的 类似回调函数
    无限链式then？
    return new Promise ((resolve) =>{
       resolve('res.data')
    })   
  })
  */
}