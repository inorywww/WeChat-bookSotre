// miniprogram/pages/login/login.js

var db = wx.cloud.database();
var app = getApp();
var common = require("../../common.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ids: -1,
    account: '',
    password: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //各种账号输入
  accountInput(e) {
    this.setData({
      account: e.detail.value,
    })
  },
  //各种账号输入
  passwordInput(e) {
    this.setData({
      password: e.detail.value,
    })
  },


  //获取用户信息
  getUserInfo(e) {
    var that = this;
    that.setData({
      userInfo: e.detail.userInfo
    })
    //进行输入信息校验
    that.check();
  },

  check() {
    var that = this;
    console.log(that.data.account);
    console.log(that.data.password);
    wx.showLoading({
      title: '正在登录中...',
    });
    wx.request({
      url: 'http://localhost:8080/bookstore_war_exploded/servlets/login',
      data: {
        account: that.data.account,
        password: that.data.password
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data == "success") {
          app.globalData.userInfo = that.data ;
          wx.setStorage({
            key: 'userInfo',
            data: that.data,
          });
          wx.showToast({
            title: '登录成功！',
          });
          setTimeout(function () {
            wx.navigateBack({})
          }, 500)
        } else {
          wx.showToast({
            title: '登录失败！',
            icon: 'error',
          })
        }
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    });
  },
})