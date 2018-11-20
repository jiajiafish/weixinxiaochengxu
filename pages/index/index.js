const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
Page({
  data: {
    message: "jiaxiaole",
    nowWeather: "",
    nowTemp: "",
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){
    this.getNow()
  },
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: '上海市',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        let result = res.data.result
        let weather = result.now.weather
        let temp = result.now.temp
        console.log(temp,weather)
        this.setData({
          nowWeather: weatherMap[weather],
          nowTemp: temp +"°", 
          nowWeatherBackground: '/images/' + weather +'-bg.png' 

        })
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: weatherColorMap[weather],
        })
      },
      complete:()=>{
        callback && callback()
      }
    })
  }

})
