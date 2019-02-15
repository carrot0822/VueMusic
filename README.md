# musict

> music

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
1/31日
 = =这个git的使用还不是很熟练 解决本地与远程文件出现冲突还是没法好好解决 git应该再回去看一看
 compnenets：recommend组件完成了基础的dom结构 //css方面 flex布局和rem布局需要注意 这个似乎并未做浏览器适配 
 common/js：jsonp文件 再封装了一个新的promise对象  //promise的写法有些遗忘 需要再回头看一下 jsonp的实现需要自己去封装一下
 config.js //ES6的AMD规范稍微忘了一些
 api:recommend.js //object.assgin的含义是？
 2/1日
 首先是封装了一个基础的dom操作 添加样式 在添加样式前应检测这个样式是否存在 这里使用了正则表达式
 再就是循环输出接口的数据 这里的数据处理异步函数的jsonp
 新的滚动库 better-scroll可以去看看api 然后就是注意使用组件时 插槽组件的钩子函数可能是执行完之后
 才会去渲染插槽里的内容 就会使得钩子函数无效 因为获取数据这里是个异步的过程 所以要用v-if判定一下
 数据是否接收到 跟上面的非空检测是一样的内容
 这个老师还有个课程也可以去看看
 2/9日
 教程涉及的步骤点 步骤之后的目的  衍生的内容 XMind要写一份思维导图 第四章结束后小小总结一下
 4-7：优化点
  1.slider keepalive包裹router标签 不会重复发请求
  2.定时器要记得销毁
  操作点：封装API->recomand.js--getDisclist函数(用于请求推荐歌单列表数据)
  反向代理获取接口数据的操作 由于vuecli3.0与2.0的不同 导致暴露了各种问题
  express的问题 webpack的问题等等 后台反向代理发起请求
  4-8：先暂时套用接口数据 调用数据操控数据才是重点
  歌单推荐组件部分图片块多出3px原因未知 文字块高度与图片块不一致导致无法平行 原因未知 不使用rem 原因未知 flex黑科技？
  4-9：封装一个简单的scroll组件 监听传递进来的数据 变化之后才随之刷新 否则会出现无法滚动的结果
    但仍然遇到了无法滚动鼠标滚轮可以滚动？ NMD wsm？ 随后发现是缓存问题- -
    百度之后发现的第一个坑：使用scroll组件后 父组件定位方式必须是fixed 子类（即scroll组件div）必须是overflow：hidden height也要设定：100% 另外在钩子函数中初始化以及watch监听数据的方法真的很拥有 应该可以在destroy函数中销毁定时器来提高性能
  4-10：
  为什么scroll组件传递的是dataClist？ 因为这个接口响应速度比另一个快 由于接口响应是个异步的过程
  如果想使用计算属性来监听这两个数组的变化刷新 实际是有个坑的 因为这个slider组件高度是由图片撑开的
  数据是拿到了但是并不会知道图片是何时渲染出来的 如果图片未渲染出不刷新的话会导致scroll组件高度不对
  导致无法滑到底部（少的就是这张图的高度）所以要监听图片的load事件 当载入完成时调用refresh函数对sroll组件进行刷新（高度的刷新）
  而这里有个疑问就是this.checked不是data作用域的 也没用命名过 也可以直接生成直接调用吗 还是说ES6的函数或者说Vue支持直接生成一个暂时的变量 并且不挂载到data域中实时刷新
  这里是一个优化的技巧 只渲染或者说只调用一次的技巧
  4-11：
  better-scroll的渲染原理：调用的时候一定要保证这个dom是渲染完成的 如果变化了一定要refresh
  优化：首屏加载一部分  剩余的懒加载 vue-lazyload
  needsclick better-scroll与fast-click冲突的时候需要设置这个classname让fastclick放全
  4-12：loading组件的开发 于recommend组件中使用 感觉上面的轮播图也可以这样用
  2/10/0.33
  暂时做一个小小总结
  做了的事情 html/css/js层面
  数据获取：后端反向代理获取接口数据
  数据使用：使用v-for等指令渲染数据
  视觉交互：使用better-scroll插件封装了scroll组件 实现了定屏滚动
  性能优化：使用lazyload懒加载技术 减少首屏http的请求
  用户体验：loading组件的封装提高用户体验
  初次跳坑：稍微写一下X-mind和推荐页面的总结吧 然后提交一下
  2/11
  5-1-2
  获取了歌手信息列表的接口数据 奇怪的是 现在已经无法探测到这个接口了
  由于是jsonp的接口与上面的推荐一样需要写参数 只是很奇怪的是不能直接访问
  只能用服务器来取接口吗 = =现在渲染页面第一件事是获取接口了
  接口获取到了才能布局
  另外 如何调用使用接口来的数据 对数据的使用和截取
  2/12
  5-3:标准化接口而来的数据 改成适合我们的数据结构
  对象的遍历是无序的 要变成一个有序的数组
  map 对象 数据排序 排序算法来了
  首先需要复习一下 新的数据结构map set array
  其次是要复习一下操作数组的各类内置方法 这块初级算法有涉及
  暗示单词 
  map是数据的抓取 存储
  后续转移数组是数据的 运算
  返回数组则是 输出数据
  程序 安排上了
  数据处理 charAtCode来进行ABCD的排序 这是正则的使用吧
  2/13
  5-4listView组件
  犯下的低级错误
    1：组件位置改变后 引入的相对路径也会变化 所以最好改成绝对路径就不会这么多事了 这是前期工作
    2：上面的数组拼接数组忘记返回了导致是个空值
    3：V-for调用的数据渲染输出 以及flex布局真是太好用了
    4：需要书写一个pc页面并对仪器进行检测转为对应的移动端页面是那个meta我忘记了
    完成了：页面一部分的htmlcss结构和数据接入 动态交互效果好像没这么做 这里似乎都没做手势的对应交互
    接着不要忘记使用懒加载 因为在入口文件使用了v-lazy 所以可以直接用
  5-5右侧入口的实现 其实比较重要的是上面的搜索匹配 而去哪儿教程还使用了vuex做状态管理 
  数据倒了全局
  DOM操作需要回去看看js高程的基础知识了太久没看了 以前的公用组件也需要封一下了
  2/14
  手势切换路由？
  我觉得可以模仿去哪儿网那样做一个搜索的功能
  1：左侧的列表渲染输出
  2：交互 完成触碰后滑到相应的位置 封装一个dom函数用于获取index（index用于确认点到的是第几个字符串 根据字符串确认位置并跳转）
  这里有个有意思的知识点 就是在created创建的data 以及在同组件不同函数如何传递数据的方法 全局变量
  scroll组件内的两个函数
  touchmove感觉还少了个离开的判定  判定在哪里离开后再次滑动
  获取索引 用于获取dom 再获取指定的y轴 最后在scoll过去
  5-6
  两端列表联动 左侧滑动的位置对应右边的位置 如何实现？ 这个不就是楼梯滚动效果吗..
  需要一个符号用于区分哪些是子组件派发给父组件的 计算属性多看一下了
  scroll基础组件添加了一个listenscroll事件 用于接受父组件的数据来判定是否监听滚动 滚动则分发数据给父组件 即滚动的高度 为负数
  父组件监听这个滚动的高度 与数组内已经得到的 各个group的高度做对比 来判定这个组件位于哪个group的区间 并得到索引值
  再用索引值来与每个字母item的index对比 相等则加上样式
  listview组件新传递了参数probe-type（数字类型） 告知子组件是否需要实时刷新
  函数：封装了一个获取所有高度的函数
  数据：this.listHeight = [] //
        this.listenScroll = true
        新增加
  每次提交应注明某些数据 某些函数 某些功能是哪个时间点添加 完成了什么功能
  5-7
  

  