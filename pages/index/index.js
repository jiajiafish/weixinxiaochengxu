const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2
const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""


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
    nowWeatherBackground: "",
    nowTemp: "",
    hourlyWeather: [],
    todayTemp: "",
    todayDate: "",
    // locationTipsText:"点击获取当前位置",
    locationTipsText: UNPROMPTED_TIPS,
    locationAuthType: UNPROMPTED,
    city:"广州市"
  },
  onPullDownRefresh() {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },
  onLoad() {
    
    this.getNow()
    this.qqmapsdk = new QQMapWX({
      key: '7IEBZ-5KG3U-KLIVN-42RT2-ABGIH-ENFFB'
    })
  },
  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now', //仅为示例，并非真实的接口地址
      data: {
        city: this.data.city,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log(res.data)
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)

      },
      complete: () => {
        callback && callback()
      }
    })
  },
  setNow(result) {
    let weather = result.now.weather
    let temp = result.now.temp
    console.log(temp, weather)
    this.setData({
      nowWeather: weatherMap[weather],
      nowTemp: temp + "°",
      nowWeatherBackground: '/images/' + weather + '-bg.png'

    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourlyWeather(result) {
    //set forecast
    let forecast = result.forecast
    let hourlyWeather = []
    let nowHour = new Date().getHours()


    for (let i = 0; i < 24; i += 3) {
      hourlyWeather.push({
        time: (i + nowHour) % 24 + "时",
        iconpath: '/images/' + forecast[i / 3].weather + '-icon.png',
        temp: forecast[i / 3].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },
  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
  onTapDayWeather() {
wx.navigateTo({
  url: '/pages/list/list?city='+ this.data.city,
})
  },
  onTapLocation(){
    wx.getLocation({
      success: res =>{
        console.log(res.latitude,res.longitude);
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            console.log(res)
            let city = res.result.address_component.city
            console.log(city)
            this.setData({
              city:city,
              locationTipsText:""
            })
            this.getNow()
          },

          complete: function (res) {
            wx.showToast({
            })
          }
        })
        console.log("666")
      },
      
    })
  },
})