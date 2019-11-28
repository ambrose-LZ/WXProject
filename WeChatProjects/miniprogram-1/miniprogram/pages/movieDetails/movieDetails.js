// pages/movieDetails/movieDetails.js
const db=wx.cloud.database({
  env:"lm-web-text-1-t9pu9"
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aa:["看过","想看","评分"],
    id:0,  //一开始传入id
  },
  
  //跳转评论
  join: function (e) {
    // console.log(e.target.dataset.id)
    var id = e.target.dataset.id;
    wx.navigateTo({  //redirectTo   关闭跳转  卸载跳转===>navigateTo  保留跳转
      url: '/pages/comment/comment?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var id = options.id;
    this.setData({ id: options.id});
    this.loadMore();
  },
 
  loadMore: function (id) {
    wx.showLoading({ //数据加载提示框
      title: '正在加载中...',
    })
   var id = this.data.id;
    wx.cloud.callFunction({
      name: "movie",  
      data: { id:id }  
    })
      .then(res => {
        // console.log(res);
        var rows = JSON.parse(res.result);
         console.log(rows);
         wx.hideLoading();
      this.setData({ list: rows })   
      })
      .catch(err => { console.log(err) })
   
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