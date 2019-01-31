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
