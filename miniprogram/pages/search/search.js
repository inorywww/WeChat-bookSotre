// miniprogram/pages/search/search.js
var app = getApp()
var db = wx.cloud.database();
var common = require("../../common.js");
var _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    list: [],
    key: '',
    blank: false,
    hislist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  //跳转详情
  detail(e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
    })
  },

  //搜索结果
  search(n) {
    var that = this;
    var key = that.data.key;
    if (key == '') {
      wx.showToast({
        title: '请输入关键词',
      })
      return false;
    }
    wx.setNavigationBarTitle({
      title: '"' + that.data.key + '" 的搜索结果',
    })
    wx.showLoading({
      title: '搜索中...',
    })
    wx.request({
      url: 'http://localhost:8080/bookstore_war_exploded/servlets/SearchBook',
      data: { 
        searchContent:key
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
          console.log(res.data);
          wx.hideLoading();
          that.setData({
            blank: true,
            page: 0,
            list: res.data,
            nomore: false,
          })
          wx.setStorage({
            data: key,
            key: 'keyHistory',
          })
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    });
  },
  keyInput(e) {
    this.data.key = e.detail.value
  },

})