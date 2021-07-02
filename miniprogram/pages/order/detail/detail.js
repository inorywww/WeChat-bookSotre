var app = getApp()
var db = wx.cloud.database();
var common = require("../../../common.js");
var _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos:{},
    selluserinfo: '',
    ems: '',
  },
  onLoad: function (e) {
    this.getdetail(e.id);
    this.setData({
      sellid: e.id
    })
  },
  //回到首页
  home() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  //下拉刷新
  onPullDownRefresh() {
    this.getdetail(sellid);
    wx.stopPullDownRefresh({
      complete: (res) => {},
    })
  },
  //获取订单详情
  getdetail(_id) {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/bookstore_war_exploded/servlets/getOrderDetail',
      data: { 
        orderID:_id
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          infos: res.data,
        })
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    })
  },
  

  //删除订单
  delete() {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '您确认要删除此订单吗',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除...',
          });
          wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/delOrder',
            data: { 
              orderID:that.data.infos.order.orderID
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.navigateTo({
                url: '/pages/order/myOrder/myOrder',
              })
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          })
         
        }
      }
    })
  },
})