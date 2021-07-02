// miniprogram/pages/admin/admin.js
import * as echarts from '../../ec-canvas/echarts';
var app = getApp()
var db = wx.cloud.database();
var common = require("../../common.js");
var _ = db.command;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        admin: true,
        adminMenu: false,
        adminName:"",
        adminPass:"",
        tab: [{
                name: '用户管理',
                id: 0,
            },
            {
                name: '书籍管理',
                id: 1,
            },
            {
                name: '订单管理',
                id: 2,
            },
        ],
        tabid: 0,
    
        userMenu: true,
        bookMenu: false,
        orderMenu: false,
    },

    onLoad: function (options) {
        var that = this;
        that.userList();
        that.bookList();
      
    },

    adminNameInput(e) {
        this.setData({
            adminName: e.detail.value
        })
    },
    adminPassInput(e) {
        this.setData({
            adminPass: e.detail.value
        })
    },

    //管理员登录
    adminLogin() {
        var that = this;
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/login',
            data: {
              account: that.data.adminName,
              password: that.data.adminPass
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data == "success" && that.data.adminName == "root") {
                console.log('管理员登录成功');
                that.setData({
                    admin: false,
                    adminMenu: true
                });
                wx.showToast({
                    title: '登录成功！',
                })
              } else {
                wx.showToast({
                  title: '登录失败！',
                  icon: 'error',
                });
                return false;
              }
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          });
    },

    //第一层导航栏切换
    changeTab(e) {
        var that = this;
        that.setData({
            tabid: e.currentTarget.dataset.id
        })
        if (that.data.tabid == 0) {
            that.userList();
            that.setData({
                userMenu: true,
                bookMenu: false,
                orderMenu: false,
            })

        }
        if (that.data.tabid == 1) {
            that.setData({
                userMenu: false,
                bookMenu: true,
                orderMenu: false,
            })
            that.bookList();

        }
        if (that.data.tabid == 2) {
              that.orderList();
            that.setData({
                userMenu: false,
                bookMenu: false,
                orderMenu: true,
            })
        }
    },


    //获取用户
    userList() {
        var that = this;
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/getAllUser',
            data: { 
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res.data);
                that.setData({
                    userList: res.data
                })
                app.globalData.usersum = that.data.userList.length;
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          });
    },

    //删除用户
    deleteUser: function (e) {
        var that = this;
        wx.showModal({
            title: '温馨提示',
            content: '确认要删除此用户吗？',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '正在删除...',
                    });
                    wx.request({
                        url: 'http://localhost:8080/bookstore_war_exploded/servlets/delUser',
                        data: { 
                            account: e.currentTarget.dataset.account
                        },
                        method: 'POST',
                        header: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            console.log(res);
                            console.log('删除用户成功！');
                            wx.hideLoading({});
                            wx.showToast({
                                title: '删除该用户成功！',
                            });
                            that.userList();
                        },
                        fail: function (res) {
                          console.log(".....fail.....");
                        }
                      });
                }
            }
        })
    },

    //获取书籍
    bookList() {
        var that = this;
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/getAllBooks',
            data: { 
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log("----------------");  
              console.log(res.data);
                that.setData({
                    bookList: res.data,
                    length: res.data.length
                })
                var arr = res.data;
                var length = res.data.length;

                var xiaoshuo = [];
                var jisuanji = [];
                var lishi  =[];
                var zhexue = [];
                var huaxue = [];
                
                for (var i = 0; i < length; i++) {
                    if (arr[i].category == "小说") {
                        xiaoshuo.push(arr[i])
                    };
                    if (arr[i].category == "计算机") {
                        jisuanji.push(arr[i])
                    };
                    if (arr[i].category == "历史") {
                        lishi.push(arr[i])
                    };
                    if (arr[i].category == "哲学") {
                        zhexue.push(arr[i])
                    };
                    if (arr[i].category == "化学") {
                        huaxue.push(arr[i])
                    };
                }
                app.globalData.xiaoshuosum = xiaoshuo.length;
                app.globalData.jiausnjisum = jisuanji.length;
                app.globalData.lishisum = lishi.length;
                app.globalData.zhexuesum = zhexue.length;
                app.globalData.huaxuesum = huaxue.length;          
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          });
        //that.check()
    },

    onReachBottom() {
        var that = this;
        if (that.data.tabid == 0) {
            that.userMore();
        }
        if (that.data.tabid == 1) {
            that.bookMore();
        }
        if (that.data.tabid == 2) {
            this.orderMore();
        }
    },

    //回到顶部
    goTop() {
        wx.pageScrollTo({
            scrollTop: 0
        })
    },

    //删除书籍
    deleteBook(e) {
        var that = this;
        wx.showModal({
            title: '温馨提示',
            content: '确认要删除该书籍吗？',
            success(res) {
                if (res.confirm) {
                    wx.showLoading({
                        title: '正在删除...',
                    })
                    wx.request({
                        url: 'http://localhost:8080/bookstore_war_exploded/servlets/delBook',
                        data: { 
                            id:e.currentTarget.dataset.id
                        },
                        method: 'POST',
                        header: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            console.log(res);
                            console.log('删除书籍成功！');
                            wx.hideLoading({});
                            wx.showToast({
                                title: '删除书籍成功！',
                            });
                            that.bookList();
                        },
                        fail: function (res) {
                          console.log(".....fail.....");
                        }
                      });       
                }
            }
        })
    },

    //订单获取
    orderList() {
        var that = this;
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/getAllOrder',
            data: { 
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res.data);
                that.setData({
                    orderList: res.data
                })
            },
            fail: function (res) {
              console.log(".....fail.....");
            }
          });
    },

   
    //订单删除
    deleteOrder(e) {
        var that = this;
        console.log(e.currentTarget.dataset.id)
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
                            orderID:e.currentTarget.dataset.id
                        },
                        method: 'POST',
                        header: {
                          'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            console.log(res);
                            console.log('删除订单成功！');
                            wx.hideLoading({});
                            wx.showToast({
                                title: '删除订单成功！',
                            });
                            that.orderList();
                        },
                        fail: function (res) {
                          console.log(".....fail.....");
                        }
                      });
                }
            }
        })
    },

   
})
