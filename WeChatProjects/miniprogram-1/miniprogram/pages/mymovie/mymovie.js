// pages/mymovie/mymovie.js
const db = wx.cloud.database({
  env: "lm-web-text-1-t9pu9"
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
   moviename:"",
   content:"",
   image:[],
   fileids:[],
   lovemovie:[]
  },
  // 选择的电影名
  onName:function(e){
    this.setData({
      moviename:e.detail
    })
  },
  // 留言--喜欢原因
  onArea:function(e){
    this.setData({
      content: e.detail
    })
  },
  //上传图片
  upload:function(){
    wx.showLoading({
      title: '图片上传中',
    })
       //选择多张图片
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => { var list1 = res.tempFilePaths; this.setData({ image: list1 }); wx.hideLoading();}
    })
  },
  send: function () {
    // 获取评论的信息
    // 上传
    // 用户评论信息与图片 fileid保存到云数据库
    // 云数据库创建集合comment 用户评论信息
    // data  添加属性 fileids 上传文件id
    // 显示加载提示框
    // 创建数组 rows  保存promise对象
    // 循环遍历每张选中的图片
    // 为图片添加promise对象完成上传
    // ---获取当前图片名称  获取后缀  创建新文件名（time+random） 上传一张图片 data添加fileids  成功之后保存fileid  解析
    wx.showLoading({
      title: '数据提交中...',
    });
    if (this.data.image.length == 0) { wx.showToast({ title: '尚未添加照片', }); return; }
    var rows = [];
    for (var i = 0; i < this.data.image.length; i++) {
      rows.push(new Promise((resolve, reject) => {
        var item = this.data.image[i];
        var suffix = /\.\w+$/.exec(item)[0];
        var newFile = new Date().getTime() + Math.floor(Math.random() * 999) + suffix;
        wx.cloud.uploadFile({    //上传函数
          cloudPath: newFile,      //新文件名
          filePath: item,          //原先文件
          success: (res) => {
            var fid = res.fileID;    //成功获取当前fielid
            console.log(fid);
            this.data.fileids.push(fid);   //保存data
            resolve();          //解析
          }
        })
      }))
    }
    // 功能2 ：   将留言/打分/field添加到云数据库
    // 等所有promise对象执行完成  图片全部上传完毕   在使用回调函数 完成功能2
    //在云函数创建集合 comment
    // 程序开始位置创建数据库实例对象  
    // 向集合添加数据  
    //成功调用 回调函数后 隐藏加载提示框  提示成功
    Promise.all(rows)
      .then(res => {
        db.collection("mymovie")
          .add({
            data: {
              content: this.data.content,
              moviename: this.data.moviename,
              fileids: this.data.fileids   
            }
          })
          .then(res => {
            wx.hideLoading();
            wx.showToast({
              title: '评论成功',
            })
          })
      })
  },
  show: function () {
 
    wx.navigateTo({  //redirectTo   关闭跳转  卸载跳转===>navigateTo  保留跳转
      url: '/pages/mymovielist/mymovielist'
    })
   },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})