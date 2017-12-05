//index.js
//获取应用实例
const app = getApp()
var amapFile = require('../../libs/amap-wx.js');


var markersData = [];
Page({
  data: {
    showOrHide:true, //是否显示下部文字
    container_bottom:80,
    userInfo: {},   //用户信息数组
    hasUserInfo: false,     //是否获取了用户信息
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userLocation:{},//用户当前位置信息
    displayInfo:{},//屏幕信息
      toilet:[],    //附近公厕信息
    markers: [],
    controls: [
      {
        id: 0,
        iconPath: '/pages/images/location.png',
        position: {
          left: 0,
          top: 0,
          width: 40,
          height: 40
        },
        clickable: true   //是否可点击
      }]
  },

  //地图控件点事件
  controltap(e) {
    console.log(e);
    var controltapId = e.controlId;
    if (controltapId == 0){
      // 获取用户位置
      wx.getLocation({
        success: res => {
          console.log(res);
          this.setData({
            userLocation: res
          })
        }
      })
    }
  },


  // bindtap(e){
  //   console.log(e); 
  // },

  makertap: function (e) {
    
    var id = e.markerId;
    console.log(e);
    var that = this;
    that.showMarkerInfo(markersData, id);
    that.changeMarkerColor(markersData, id);
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    var that = this;

    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
    // 获取用户位置
    wx.getLocation({
      success: res => {
        that.setData({
          userLocation: res
        })
        getToiletInfo(res);
      }
    })

    //设置地图上的控件位置 
    wx.getSystemInfo({
      success: res => {
        this.setData({
          "controls[0].position.left": res.windowWidth-50,
          "controls[0].position.top":res.windowHeight-155
        })
      },
    })
    
    //获取附近公厕坐标
    function getToiletInfo(w_location){
      console.log(w_location);
      var myAmapFun = new amapFile.AMapWX({ key: '750edfa6ede8eec09370b7a52f8a150d' });
      myAmapFun.getPoiAround({
        iconPath:"/pages/images/iconPath.png",  //未选中的图标
        iconPathSelected:"/pages/images/iconPathSelected.png", //选中的图标
        location: w_location.longitude + "," + w_location.latitude,  //当前位置
        querykeywords: "公共厕所", //关键字
        success: function (data) {
          //成功回调
          console.log(data);
          markersData = data.markers;
          var poisData = data.poisData;
          var markers_new = [];
          markersData.forEach(function (item, index) {
            markers_new.push({
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              iconPath: item.iconPath,
              width: 30,
              height: 30,
              callout:{
                content:item.name,
                display:"BYCLICK",
                padding:5,
                borderRadius:5,
                bgColor:"#f0f0f0"
              }
            })
          })

          if (markersData.length > 0) {
            that.setData({
              markers: markers_new
            });
          }
        },
        fail: function (info) {
          //失败回调
          console.log(info)
        }
      })
    }

  },

  showMarkerInfo: function (data, i) {
    var that = this;
    console.log(data);
    that.setData({
      textData: {
        name: data[i].name,
        desc: data[i].address
      }
    });

    // if (that.data.showOrHide==false){
    //   that.setData({
    //     showOrHide:true,
    //     "controls[0].position.top": that.data.controls[0].position.top - 80
    //   })
    // }
  },

  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        data[j].iconPath = "../images/iconPathSelected.png";
      } else {
        data[j].iconPath = "../images/iconPath.png";
      }
      markers.push({
        id: data[j].id,
        latitude: data[j].latitude,
        longitude: data[j].longitude,
        iconPath: data[j].iconPath,
        width: 30,
        height: 30
      })
    }
    that.setData({
      markers: markers
    });
  }


//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
})


// var amapFile = require('../../libs/amap-wx.js');


// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
    
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     var that = this;
//     var myAmapFun = new amapFile.AMapWX({ key: '750edfa6ede8eec09370b7a52f8a150d' });
//     myAmapFun.getPoiAround({
//       success: function (data) {
//         //成功回调
//         console.log(data);
//       },
//       fail: function (info) {
//         //失败回调
//         console.log(info)
//       }
//     })
//   },


// })