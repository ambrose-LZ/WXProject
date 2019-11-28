const db = wx.cloud.database({
  env: "lm-web-text-1-t9pu9"
})
// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,  
    value: 0,  //评分
    mes: "",    //输入的内容
    images: [],  //选中的图片
    fileids: [],   //上传图片
    active: 0,
    star:"点击星星评分"
  },
  // 删除图片
  deleteImage: function (e) {
    var that = this;
    var images = that.data.images;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          images.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          images
        });
      }
    })
  },
  // 吐槽
  onMess: function (e) {
    this.setData({
      mes: e.detail
    })
  },
  //上传图片
  send: function () {
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => { var list1 = res.tempFilePaths; console.log(res); this.setData({ images: list1 }) },
    })
  },
  // 评分
  onChange: function (event) {
    console.log(event.detail);
    var value1="";
    if (event.detail == 1) value1 = "很差";
    if (event.detail == 2) value1 = "较差";
    if (event.detail == 3) value1 = "还行";
    if (event.detail == 4) value1 = "推荐";
    if (event.detail == 5) value1 = "太棒了";
    this.setData({
      value: event.detail,
      star:value1
    })
  },
  // 发布
  say: function () {
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
      title: '发布评论中...',
    });
    if (this.data.images.length == 0) { wx.showToast({ title: '目前的评论没有图片', }); return; }
    var rows = [];
    for (var i = 0; i < this.data.images.length; i++) {
      rows.push(new Promise((resolve, reject) => {
        var item = this.data.images[i];
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
    // 向集合添加数据  content 留言  score 分数  movieid 电影id  fielids上传图片id列表
    //成功调用 回调函数后 隐藏加载提示框  提示成功
    Promise.all(rows) 
      .then(res => {
        db.collection("comment")
          .add({
            data: {
              content: this.data.mes,
              score: this.data.value,
              movieid: this.data.id,
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

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ id: options.id });

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