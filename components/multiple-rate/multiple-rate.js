/*
 * Author: simsir-lin
 * Github: https://github.com/simsir-lin
 * Email: 15986907592@163.com
 */
 
Component({
    behaviors: [],
    properties: {
      rate: {
        type: String,
        value: '0'
      },
      icon: {
        type: String,
        value: 'star'
      },
      disabled: {
        type: String,
        value: false
      }
    },
    data: {
      starArr: []
    },
  
    attached: function () {
    },
    ready:function(){
      this.getStarArr()
    },
    moved: function () {
    },
    detached: function () {
    },
  
    methods: {
      getStarArr: function () {
        let starArr = [];
        let rate = Math.floor(Number(this.data.rate)) / 2
        for (var i = 0; i < rate; i++) {
          starArr.push(this.data.icon);
        }
        for (let j = 0; j < 5 - rate; j++) {
          starArr.push(this.data.icon + '-o');
        }
        this.setData({
          starArr: starArr
        })
      },
      handleTap: function (e) {
        let disabled = this.data.disabled === 'true'
        if (disabled) {
          return;
        }
        console.log(e.currentTarget.dataset.index)
        this.setData({
          rate: (Number(e.currentTarget.dataset.index) + 1) * 2
        })
        this.triggerEvent('change', { value: Number(e.currentTarget.dataset.index) + 1 });
        //<multiple-rate rate="{{itemObj.rating.average}}" bindchange="change" disabled="false"></multiple-rate>
        //自定义一个事件，并触发，事件定义在父组件page中'change'与bindchange对应
        this.getStarArr()
      }
    }
  })