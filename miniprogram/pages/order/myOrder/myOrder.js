// miniprogram/pages/order/myOrder/myOrder.js
var app = getApp()
var common = require("../../../common.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    nomore: false,
    tab: [{
        name: '全部',
        id: 0,
      },
      {
        name: '未付款',
        id: 1,
      },
      {
        name: '已付款',
        id: 2,
      },
      {
        name: '已完成',
        id: 3,
      }
    ],
    tabid: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist();
  },

  //获取订单列表
  getlist() {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/bookstore_war_exploded/servlets/getOrderInfo',
      data: {
        account: app.globalData.userInfo.account,
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.stopPullDownRefresh(); //暂停刷新动作
        that.setData({
          nomore: false,
          page: 0,
          list: res.data,
          allList: res.data,
        })
        wx.hideLoading();
      },
      fail: function (res) {
        console.log(".....fail.....");
      }
    });
  },
  //导航栏切换
  changeTab(e) {
    var that = this;
    var temp =[];
    var tid = e.currentTarget.dataset.id;
    if(tid==0){
      temp = that.data.allList;
    }
    else{
      for (const l in that.data.allList) {
        if(that.data.allList[l].status==that.data.tab[tid].name){
         temp.push(that.data.allList[l]);
        }
     }
    }
    that.setData({
      tabid: e.currentTarget.dataset.id,
      list:temp,
    });
  },

  //订单删除
  deleteOrder(e) {
    var that = this;
    wx.showModal({
      title: '温馨提示',
      content: '确认要删除该订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除...',
          })
          wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/delOrder',
            data: {
              orderID: e.currentTarget.dataset.id
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res);
              wx.hideLoading({});
              wx.showToast({
                title: '删除订单成功！',
              });
              that.getlist();
              that.setData({
                tabid: 0
              });
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          });
        }
      }
    })
  },
  //跳转详情页
  godetail(e) {
    wx.navigateTo({
      url: '/pages/order/detail/detail?id=' + e.currentTarget.dataset.id,
    });
  },




})