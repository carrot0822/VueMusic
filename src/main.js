// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VuelazyLoad from 'vue-lazyload'
import '../src/common/stylus/index.styl'

fastclick.attach(document.body)
Vue.config.productionTip = false
Vue.use(VuelazyLoad, {
  loading: require('../src/common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
