// miniprogram/pages/my/my.js
var app = getApp();
var common = require("../../common.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //showShare: false,
    poster: JSON.parse(common.data).share_poster,
    userInfo:{}
  },
  
onShow(){
  console.log(this.data.userInfo)

  this.setData({
    userInfo:app.globalData.userInfo
  })
  console.log("hello");
  console.log(this.data.userInfo)
},
   
  //判断是否需要注册
  go(e) {
    if (e.currentTarget.dataset.status == '1') {
      if (!app.globalData.userInfo) {
        wx.showModal({
          title: '温馨提示',
          content: '该功能需要登录，是否登录？',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/login/login',
              })
            }
          }
        })
        return false
      }
    }
    wx.navigateTo({
      url: e.currentTarget.dataset.go
    })
  },
  goRegister(e) {
    wx.navigateTo({
      url: '/pages/register/register',
    })
   },
  //展示分享弹窗
  showShare() {
    this.setData({
      showShare: true,
    })
  },

  //关闭分享弹窗
  closeShare() {
    this.setData({
      showShare: false,
    })
  },

  //退出登录
  outLogin(){
      app.globalData.userInfo = '';
      this.setData({
        userInfo:''
      })
      wx.clearStorage({
      })
    console.log(this.data.userInfo)
  },

  //进入管理员登录界面
  adminLogin(){
    wx.navigateTo({
      url: '/pages/admin/admin',
    })
  }


})