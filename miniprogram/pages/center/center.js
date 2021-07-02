var app = getApp()
var db = wx.cloud.database();
var common = require("../../common.js");
var _ = db.command;
Page({

    /**
     * 页面的初始数据
     */
    data: {
       info:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
       this.getInfo();
    },
  
    getInfo: function (e) {
        var that = this;
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/getUserInfo',
            data: { 
                account:app.globalData.userInfo.account
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                that.setData({
                    info: res.data
                  })
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          });
    },
    //至顶
    gotop() {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },
    //监测屏幕滚动
    onPageScroll: function (e) {
        this.setData({
            scrollTop: parseInt((e.scrollTop) * wx.getSystemInfoSync().pixelRatio)
        })
    },

    //下拉刷新
    onPullDownRefresh(){
        this.getnum();
        wx.stopPullDownRefresh({

        })
    }
})