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
    passwordRE:''
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

  passwordInput(e) {
    this.setData({
      password: e.detail.value,
    })
  },

  passwordReInput(e) {
    this.setData({
      passwordRe: e.detail.value,
    })
  },
  //获取用户信息
  registerUser(e){
    var that = this;
    console.log(that.data.account);
    console.log(that.data.password);
    console.log(that.data.passwordRe);
    wx.showLoading({
      title: '正在注册中...',
    });
    wx.request({
      url: 'http://localhost:8080/bookstore_war_exploded/servlets/register',
      data: {
        account: that.data.account,
        password: that.data.password,
        passwordRe: that.data.passwordRe
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.data == "success") {
          wx.showToast({
            title: '注册成功！',
          });
          setTimeout(function () {
            wx.navigateBack({})
          }, 500)
        } else {
          wx.showToast({
            title:  res.data,
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