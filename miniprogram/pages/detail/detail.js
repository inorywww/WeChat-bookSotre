// miniprogram/pages/detail/detail.js
var app = getApp()
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    bookinfo: '',
    buyuserinfo: '',
  },

  onLoad(e) {
    this.setData({
      id: e.scene,
      buyuserinfo: app.globalData.userInfo
    })
    this.getBook(e);
  },

  //下拉刷新时
  onPullDownRefresh(e) {
    this.getuserdetail();
    this.getPublish(this.data.id);
    wx.stopPullDownRefresh({
      complete: (res) => {},
    })
  },

  //获取书籍详情
  getBook(e) {
    var that = this;
    // var id = Number(e.currentTarget.dataset.id);
    wx.request({
      url: 'http://localhost:8080/bookstore_war_exploded/servlets/getBookDetail',
      data: { 
        id: that.data.id,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          bookinfo: res.data
        })
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    });
  },

  //加入购物车
  addCart(e) {
    var that = this;
    console.log(app.globalData.userInfo);
    if (!app.globalData.userInfo) {
      wx.showModal({
        title: '温馨提示',
        content: '该功能需要登录才能使用，是否登录？',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        }
      })
      return false
    } else {
      wx.request({
        url: 'http://localhost:8080/bookstore_war_exploded/servlets/addToCart',
        data: { 
          id: that.data.id,
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.showToast({
            title: '加购物车成功！',
          })
        },
        fail: function (res) {
          console.log(".....fail.....");
        }
      });
    }
  },
})