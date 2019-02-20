export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split('')
  newClass.push(className)
  el.className = newClass.join('')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
// 这个方法？ el：Dom节点 name：获取的data-数据 val是扩展符如果有就是添加没有就是获取
export function getData(el, name, val) {
  const prefix = 'data-'
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(prefix + name)
  }
}
// 创建一个DOM节点
let elementStyle = document.createElement('div').style
// 这里检测浏览器厂商的属性？
let vendor = (() => {
  let transforNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transforNames) {
    // 创建节点后检测浏览器属性是否存在来判定浏览器的类别
    if (elementStyle[transforNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }
  // 这里是把样式首字母大写 好像是书写问题 浏览器专属符号后样式首字母要大写
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}