var STORAGE_KEY = 'memos-vuejs-demo'
var memoStorage = {
  fetch: function() {
    var memos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    memos.forEach(function(memo, index) {
      memo.id = index
    })
    memoStorage.uid = memos.length
    return memos
  },
  save: function(memos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
  }
}

// declare var process: {
//   env: {
//       NODE_ENV: string
//   }
// }

const app = new Vue({
  el: "#app",
  data: {
    memos: [],
    options: [
      {value: -1, label: "すべて"},
      {value: 0, label: "挑戦中"},
      {value: 1, label: "成功済み"}
    ],
    current: -1
  },
  computed: {
    computedMemos: function() {
      return this.memos.filter(function(el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },
    labels() {
      return this.options.reduce(function(a, b) {
        return Object.assign(a, { [b.value]: b.label})
      },{})
    }
  },
  // 変化があれば自動でStrageへ保存
  watch: {
    memos: {
      handler: function(memos) {
        memoStorage.save(memos)
      },
      deep: true
    }
  },
  created() {
    this.memos = memoStorage.fetch()
  },
  methods: {
    // 追加処理
    memoAdd: function(event, value) {
      // 要素参照
      var menu = this.$refs.menu
      // 入力なければ戻る
      if(!menu.value.length) {
        return
      }
      this.memos.push({
        id: memoStorage.uid++,
        menu: menu.value,
        state: 0
      })
      menu.value = ""
    },
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1
    },
    doRemove: function(item) {
      var index = this.memos.indexOf(item)
      this.memos.splice(index, 1)
    }
  }
  
})