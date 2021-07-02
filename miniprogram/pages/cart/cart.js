// miniprogram/pages/cart/cart.js
var app = getApp();
var common = require("../../common.js");

Page({
    /**
     * 页面的初始数据
     */
    data: {
        cart: [],
        iscart: false,
        totalPrice: 0, // 总价，初始为0
        selectAllStatus: false, // 全选状态，默认非全选
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCart()
    },
    getCart() {
        var that = this;
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/getCartInfo',
            data: {
                account: app.globalData.userInfo.acount,
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var arr = res.data;
                console.log(arr);
                for (var i = 0; i < arr.length; i++) { // 循环列表得到每个数据
                    arr[i].selected = false;
                }
                that.setData({
                    cart: arr
                });
                if (that.data.cart.length != 0) {
                    that.setData({
                        iscart: true
                    })
                }
            },
            fail: function (res) {
                console.log(".....fail.....");
            }
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getCart()
    },

    //到书籍详情页
    detail(e) {
        wx.navigateTo({
            url: '/pages/detail/detail?scene=' + e.currentTarget.dataset.id,
        })
    },

    //下拉刷新
    onPullDownRefresh() {
        this.getCart();
        wx.stopPullDownRefresh({})
    },

    //选中商品
    selectList(e) {
        var index = Number(e.currentTarget.dataset.index);
        var cart = this.data.cart;
        var selected = cart[index].selected;
        cart[index].selected = !selected;
        this.setData({
            cart: cart,
        });
        this.getTotalPrice();
    },

    getTotalPrice() {
        var cart = this.data.cart; // 获取购物车列表
        var total = 0;
        for (var i = 0; i < cart.length; i++) { // 循环列表得到每个数据
            if (cart[i].selected) { // 判断选中才会计算价格
                total += Number(cart[i].price) * Number(cart[i].buy_num);
            }
        }
        this.setData({ // 最后赋值到data中渲染到页面
            cart: cart,
            totalPrice: total
        });
    },
    /* 加数 */
    addCount: function (e) {
        var index = Number(e.currentTarget.dataset.index);
        this.data.cart[index].buy_num++;
        this.changeNum('+', this.data.cart[index].id)
        this.setData({
            cart: this.data.cart
        });
    },
    /* 减数 */
    delCount: function (e) {
        var index = Number(e.currentTarget.dataset.index);
        if (this.data.cart[index].buy_num > 1) {
            this.data.cart[index].buy_num--;
            this.changeNum('-', this.data.cart[index].id)
        }
        this.setData({
            cart: this.data.cart
        });
    },

    changeNum: function (way, id) {
        var that = this;
        var cart = that.data.cart;
        var tempSelect=[];
        for (var i = 0; i < cart.length; i++) { // 循环列表得到每个数据
            tempSelect.push(cart[i].selected);
        }
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/changeCartNum',
            data: {
                way: way,
                id: id
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                var arr = res.data;
                for (var i = 0; i < arr.length; i++) { // 循环列表得到每个数据
                    arr[i].selected = tempSelect[i];
                }
                that.setData({
                    cart: arr
                });
                that.getTotalPrice();
            },
            fail: function (res) {
                console.log(".....fail.....");
            }
        });
    },
    //商品全选
    selectAll(e) {
        var selectAllStatus = this.data.selectAllStatus;
        selectAllStatus = !selectAllStatus;
        var cart = this.data.cart;

        for (var i = 0; i < cart.length; i++) {
            cart[i].selected = selectAllStatus;
        }
        this.setData({
            selectAllStatus: selectAllStatus,
            cart: cart
        });
        this.getTotalPrice();
    },

    //删除商品
    deleteList(e) {
        var that = this
        var index = e.currentTarget.dataset.index;
        var cart = that.data.cart;
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/delCartBook',
            data: {
                id: cart[index].id
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                wx.setStorageSync('cart', cart)
                that.setData({
                    cart: res.data
                });
                if (!cart.length) {
                    that.setData({
                        iscart: false
                    });
                } else {
                    that.getTotalPrice();
                }
            },
            fail: function (res) {
                console.log(".....fail.....");
            }
        });
    },

    //提交订单
    paypost() {
        var that = this;
        var cart = that.data.cart;
        wx.showLoading({
            title: '正在下单中...',
        });
        wx.request({
            url: 'http://localhost:8080/bookstore_war_exploded/servlets/submitOrder',
            data: {
                account: app.globalData.userInfo.account,
                way: 'submitOrder',
            },
            method: 'POST',
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                that.setData({
                    cart: res.data
                });
                if (!cart.length) {
                    that.setData({
                        iscart: false
                    });
                } else {
                    that.getTotalPrice();
                }
                wx.showToast({
                    title: '提交成功！',
                })
            },
            fail: function (res) {
                console.log(".....fail.....");
            }
        });
    },
})