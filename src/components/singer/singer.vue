<template>
  <div class="singer">
    <list-view :data="singers">

    </list-view>
  </div>
</template>


<script>
import {getSingerList} from '../../api/singer'
import {ERR_OK} from '../../api/config'
import Singer from '../../common/js/singer'
import ListView from '../../base/listview/listview'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = '10'

export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  components:{
    ListView
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers =  this._normallizeSinger(res.data.list)
         
        }
      })
    },
    // 标准化获取的接口数据
    _normallizeSinger(list) {
      let map ={ // 为什么有这个map数组 为什么里面有这几项
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      // 对map数据进行遍历 HOT_SingerLen是因为此处只获取前10条数据
      // 而title为HOT_NAME是热门的排序数据 后面的则是正常的排序数据数组
     list.forEach((item, index) => {
       if (index < HOT_SINGER_LEN) {
         // Singer对象 负责存储img的ID区分号和歌手的name名字 push进设置的map对象
         map.hot.items.push(new Singer({
           mid: item.Fsinger_mid,
           name: item.Fsinger_name
         }))
       }
       const key = item.Findex // Findex在接口数据内代表ABCD 名字分类
       // 如果key分类不在 就创建一个key对象集合来存放按顺序排列的数据集合 即按ABCD顺序把选手信息分开
       if (!map[key]) {
         map[key] = {
           title: key,
           items: []
         }
       }
       //两者存放的数据虽然是一样的 但是后面的操作将改变这个乱序的对象 变为有序的数组
       map[key].items.push(new Singer({
         mid: item.Fsinger_mid,
         name: item.Fsinger_name
       }))
     })
     // map已经生成了 把map变成有序列表 因为此时的map有很多个类名与字母的无序对象
     let hot = []
     let ret = []
     // 对map进行遍历 把类名为字母的放入数组内 再利用sort进行排序 最终得到正常ANCD排序的数组
     // charCOdeAt 利用编码字符占据的数字大小来判定英文字母排序
     for(let key in map) {
       let val = map[key]
       if (val.title.match(/[a-zA-z]/)){
          ret.push(val)
       } else if (val.title === HOT_NAME) {
         hot.push(val)
       }
     }
     ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
     })
     return hot.concat(ret)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position : fixed;
    top : 88px;
    bottom : 0;
    width : 100%;
</style>
