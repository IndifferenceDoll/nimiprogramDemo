import { wxRequest } from '../../requests/request'

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    searchKey:'',
    round:0,
    count:20,
    total:0,
    books:[]
  },
  //事件
  onLoad: function () {
    this.requestBooks('refresh')
  },
  godetail(event){
    var index = event.currentTarget.dataset['index']
    wx.setStorageSync('dataObj',{type:'book',id:this.data.books[index].id})
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  clearSearch:function(){
    this.setData({
      searchKey:''
    })
  },
  searchInput:function(e){
    this.setData({
      searchKey:e.detail.value
    })
  },
  searchBooks:function(){
    this.setData({
      round:0
    })
    this.requestBooks('refresh')
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
    this.requestBooks('push')
  },
  requestBooks:function(type){
    console.log('请求return')
    return
    var _this = this
    var count = this.data.count
    var start = this.data.round * count
    var url = '/v2/book/search'
    var method = 'GET'
    var header = { "Content-Type":"json" }
    var data = {
      q:this.data.searchKey || ' ',//关键字
      tag:'',//图书标识
      start:start,//从哪条开始
      count:count//获取多少条
    }
    return wxRequest(url,method,header,data).then(res => {
      console.log(res)
      var books = type === 'refresh' ? (res.data.books || []) :  _this.data.books.concat(res.data.books || [])
      _this.setData({
        books:books,
        total:res.data.total || 0
      })
    })
  }
})
