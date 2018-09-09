import { wxRequest } from '../../requests/request'
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    movies:[],
    actorsArr:[],
    directors:[],
    genres:[],
    round:0,
    count:20,
    total:0
  },
  onPullDownRefresh: function(){
    this.setData({
      round:0
    })
    this.requestNew('refresh')
  },
  onReachBottom:function(){
    var round = this.data.round
    var count = this.data.count
    var total = this.data.total
    var isNoMoreDate = total / count > (round + 1)
    if(!isNoMoreDate){ return }
    round++
    this.setData({
      round:round
    })
    this.requestNew('push')
  },
  onLoad: function () {
    this.requestNew('refresh')//onLoad中写只加载一次，有缓存不调接口，onShow中每次页面展示都执行即调接口，适用于更新量大急于展示新内容，缺点不作处理每次回到第一页
  },
  requestNew:function(type){
    // console.log('请求return')
    // return
    var _this = this
    var count = this.data.count
    var start = this.data.round * count
    var url = "/v2/movie/in_theaters";
    var method = "GET";
    var data = {
      start:start,
      count:count
    };
    return wxRequest(url,method,{ "Content-Type":"json" },data).then(res => {
      console.log('res-----',res)
      var actorsArr = type === 'refresh' ? [] : _this.data.actorsArr
      res.data.subjects && res.data.subjects.forEach((val,ind) => {
        actorsArr.push(val.casts.map(val=>val.name).join('，'))
      })
      var directors = type === 'refresh' ? [] : _this.data.directors
      res.data.subjects && res.data.subjects.forEach((val,ind) => {
        directors.push(val.directors.map(val=>val.name).join('，'))
      })
      var genres = type === 'refresh' ? [] : _this.data.genres
      res.data.subjects && res.data.subjects.forEach((val,ind) => {
        genres.push(val.genres.join('／'))
      })
      var movies = type === 'refresh' ? (res.data.subjects || []) :  _this.data.movies.concat(res.data.subjects || [])
      _this.setData({
        movies:movies,
        actorsArr:actorsArr,
        directors:directors,
        genres:genres,
        total:res.data.total || 0
      })
      if(type === 'refresh'){
        wx.stopPullDownRefresh()
      }
    })
  },
  godetail(event){
    var index = event.currentTarget.dataset['index']
    wx.setStorageSync('dataObj',{type:'movie',obj:this.data.movies[index]})
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  onShow: function() {
    
  }
})