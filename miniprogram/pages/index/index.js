//index.js
var app = getApp();
var db = wx.cloud.database();
var common = require("../../common.js");
var _ = db.command;

Page({
  data: {
    category: JSON.parse(common.data).college,
    categoryCur: -2,
    showList: false,
    scrollTop: 0,
    list: [],
    allBook: [],
    iscard: false,
    imgFlag:[],
  },

  onLoad() {
    //this.listkind();
    this.getList();
  },

  //跳转搜索
  search() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

   //类别选择
   categorySelect(e) {
    console.log(e.currentTarget.dataset.id);
      this.setData({
        categoryCur: e.currentTarget.dataset.id - 1,
        scrollLeft: (e.currentTarget.dataset.id - 3) * 100,
        showList: false,
        list:this.data.allBook[e.currentTarget.dataset.id].contents
      });
  },

  //选择全部
  selectAll() {
    this.setData({
      categoryCur: -2,
      scrollLeft: -200,
      showList: false,
    })
    this.getList();
  },

  //展示列表小面板
  showlist() {
    var that = this;
    if (that.data.showList) {
      that.setData({
        showList: false,
      })
    } else {
      that.setData({
        showList: true,
      })
    }
  },

  getList() {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/bookstore_war_exploded/servlets/getBookInfo',
      data: {},
      method: 'POST',
      header: {
        //'content-type': 'application/json' // 默认值
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.stopPullDownRefresh(); //暂停刷新动作
        console.log(res)
        if (res.data.length == 0) {
          that.setData({
            list: [],
            allBook: []
          })
          return false;
        } else {
          var tempList = [];
          for (var i = 0; i < res.data.length; i++) {
              tempList = tempList.concat(res.data[i].contents)
          }
          that.setData({
            page: 0,
            list: tempList,
            allBook: res.data,
          });
          that.imgFlag = tempList;
        }
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    });
  },

  //下拉刷新
  onPullDownRefresh() {
    this.getList();
  },

  //监测屏幕滚动
  onPageScroll: function (e) {
    this.setData({
      scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
    })
  },

  //回到顶部
  goTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  //到书籍详情页
  detail(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
    })
  },

  goRent() {
    wx.navigateTo({
      url: '../rent/rent',
    })
  },

  goReview() {
    wx.navigateTo({
      url: '../review/review',
    })
  },

})