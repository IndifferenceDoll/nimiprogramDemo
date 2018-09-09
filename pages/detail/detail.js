import { wxRequest } from '../../requests/request'

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    itemObj:{},
    type:'',
    descrObj:{},
    commentObj:{},
    round:0,
    count:4,
    total:0
  },
  onLoad: function () {

  },
  onShow:function () {
    var dataObj = wx.getStorageSync('dataObj')
    console.log('dataObj------',dataObj)
    this.setData({
      type:dataObj.type
    })
    if(dataObj.type === 'movie'){
      //{type:xxx,obj:xxx})
      this.setData({
        itemObj:dataObj.obj//缓存中的数据对象就是详情对象，直接赋值于itemObj
      })
      this.requestDescription(dataObj.obj.id)//包含电影简介　的数据对象

      this.requestComment(dataObj.obj.id,'refresh')//包含评论的数据对象
    }else if(dataObj.type === 'book'){
      //{type:xxx,id:xxx})
      //图书详情参数dataObj.id，请求结果详情对象赋值给itemObj
      this.requestBookDetail(dataObj.id)
    }
  },
  onReachBottom:function(){//电影模块下拉触底增加加载更多评论
    var dataObj = wx.getStorageSync('dataObj')
    var round = this.data.round
    var count = this.data.count
    var total = this.data.total
    var isNoMoreDate = total / count > (round + 1)
    if(!isNoMoreDate){ return }
    round++
    this.setData({
      round:round
    })
    this.requestComment(dataObj.obj.id,'push')
  },
  onHide:function(){
    wx.removeStorageSync('dataObj')
  },
  //图书详情相关的请求
  requestBookDetail:function(id){
    var url = `/v2/book/${id}`
    return wxRequest(url,"GET",{},{}).then(res => {
      console.log(res)
      this.setData({
        itemObj:res.data//缓存中的数据对象就是详情对象，直接赋值于itemObj
      })
    })
  },
  //电影详情相关的请求
  requestComment:function(id,type){
    var url = `/rexxar/api/v2/movie/${id}/interests`;//评论
    var count = this.data.count
    var start = this.data.round * count　
    var data = {
      start:start,
      count:count,
      order_by:'hot',
      ck:' ',
      for_mobile:1
    }
    return wxRequest(url,"GET",{},data).then(res => {
      console.log(res)
      var commentObj = type === 'refresh' ? (res.data || []) :  this.data.commentObj.concat(res.data || [])
      this.setData({
        commentObj:commentObj//缓存中的数据对象就是详情对象，直接赋值于itemObj
      })
    })　　
  },
  requestDescription:function(id){
    var url = `/rexxar/api/v2/elessar/subject/${id}`//简介
    return wxRequest(url,"GET",{},{}).then(res => {
      console.log(res)
      this.setData({
        descrObj:res.data//缓存中的数据对象就是详情对象，直接赋值于itemObj
      })
    })
  }
})
