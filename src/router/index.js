import Vue from 'vue'
import Router from 'vue-router'
import Recommand from '../components/recommand/recommand.vue'
import Singer from '../components/singer/singer.vue'
import Rank from '../components/rank/rank.vue'
import Search from '../components/search/search.vue'
import SingerDetail from '../components/singer-detail/singer-detail.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommand'
    },
    {
      path: '/recommand',
      name: 'recommand',
      component: Recommand
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
})
