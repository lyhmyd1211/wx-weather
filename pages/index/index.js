Page({
  data:({

  }),
  onReady: function () {
    this.getWeatherData();
  },
  getWeatherData(){
    const listOfCity = this.selectComponent("#listOfCity").properties;
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/forecast?parameters',
      data: {
        location: listOfCity.currentNext+','+listOfCity.currentPrev,
        key: '7f98aea2d6eb4bfda6cc1b801cafe492',
      },
      header: {},
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
  
})