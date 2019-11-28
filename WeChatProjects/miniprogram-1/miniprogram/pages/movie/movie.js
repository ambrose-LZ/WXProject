


// pages/movie/movie.js
Page({
                                                                     
  data: {
      listmovie:[],
     pno:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore();
  },
  loadMore:function(){
    // 功能：调用云函数并且传递参数
    // 1.调用云函数 movielist1905
    // 2.参数start  count
    var pno = this.data.pno + 1;
    this.setData({ pno: pno })
    var offset=(pno-1)*4
    wx.cloud.callFunction({
      name:"movielist1905",  //云函数名称
      data:{   start:offset,count:5}  //向云函数传递参数 
    })
    .then(res=>{
      // 3.获取云函数返回数据  保存在list中
      // console.log(res); //string
      // 4.json string  ==> js obj 保存
      var rows=JSON.parse(res.result);
      // console.log(rows)
      //5.保存在list
      var list1=this.data.listmovie.concat(rows.subjects)
      this.setData({listmovie:list1})

    })
    .catch(err=>{console.log(err)})
  },
  buy:function(e){
    // console.log(e.target.dataset.id)
    var id = e.target.dataset.id;
    wx.navigateTo({  //redirectTo   关闭跳转  卸载跳转===>navigateTo  保留跳转
      url: '/pages/movieDetails/movieDetails?id='+id
    })
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

    this.loadMore();
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})