import originJSONP from 'jsonp'
// 返回了一个新的promise对象resolve和reject明明都没传递怎么就then了 还是说？我忘了？
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data) // 判定提交的数据是以什么符号连接
  return new Promise((resolve, reject) => { // resolve成功执行 reject失败执行
    originJSONP(url, option, (err, data) => { // err 不传递就没事
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
// 对传递的数据进行检测 把data数据拼接到url
function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : '' // 进行非空检测
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : '' // 删掉上面的‘……&
}