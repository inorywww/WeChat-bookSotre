var common = require("common.js");
//app.js
App({
  openid: '',
  userInfo: '',
  canReflect: true,

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.systeminfo = wx.getSystemInfoSync();
     this.globalData = {
       userInfo: '',
       openid: '',
       usernum:'',
       mensum:'',
       ordersum:'',
       onordersum:'',
       inordersum:'',
       doneordersum:'',
       canclordersum:'',
     }

    var that = this
    wx.getStorage({
      key: 'userInfo',
      success(res) { 
         that.globalData.userInfo = res.data
         console.log(that.globalData.userInfo)
      }
    });
    wx.getStorage({
      key: 'openid',
      success(res){
        that.globalData.openid = res.data
        console.log(that.globalData.openid)
      }
    })
  },
})