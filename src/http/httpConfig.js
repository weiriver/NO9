import axios from 'axios'
import store from '../store/index'
import {Loading, Message} from 'element-ui'

// axios 配置
axios.defaults.timeout = 35000

let loadingInstance
axios.interceptors.request.use(
  config => {
    // 判断是否需要开启loading
    try {
      if (config.data.loading) {
        loadingInstance = Loading.service({fullscreen: true})
        // Spin.show()
        // LoadingBar.start()
      }
    } catch (e) {
    }
    if ((config.data && config.data.apiCode) || config.url.includes('/fastdfs/upload') || config.url.includes('/dss-web/syncUser') || config.withCredentials == false) {
      config.data.uid = store.state.uid
      config.data.token = store.state.token
      // config.data.token = token
      config.data.ts = getNowFormatDate()
      config.data.digest = ''
    } else {
      // config.headers.token = storage.state.token
      // config.data.token = token
    }
    if (config.data && config.data.content && config.data.content.fileType) {
      config.responseType = 'blob'
    }
    return config
  },
  err => {
    loadingInstance.close()
    // Spin.hide()
    // LoadingBar.error()
    return Promise.reject(err)
  })

axios.interceptors.response.use(
  response => {
    // 拦截token失效的请求
    /*
    * 10021: 记录已经存在
    * 10002: 所属类别typeX没有传
    * 10003: 认证失效
    * 10020: 操作记录不存在（条件查询，没有对应数据）
    * */
    try {
      let request = JSON.parse(response.config.data)
      if (request.loading) {
        loadingInstance.close()
      }
    } catch (e) {
    }
    if (response.data.code === '10005' || response.data.code === '10003') {
      // if (confirm(`${response.data.msg}  是否退出？`)) {
      if (location.hostname.includes('localhost')) {
        Message.warning({
          message: `接口${response.data.apiCode} 报${response.data.msg}`
        })
        // location.href = 'http://localhost:8082/login.html'
        location.href = 'http://localhost:8083/#/login'
        // location.href = 'http://localhost:8084/#/login'
      } else {
        location.href = '../login.html'
      }
      // }
    } else if (response.data.code !== '0' && response.data.code !== '10021' && response.data.code !== '10020' && response.data.msg) {
      Message.warning({
        message: response.data.msg
      })
      // Message.warning({
      //   content: response.data.msg,
      //   duration: 5,
      //   closable: true
      // })
    }
    return response.data
  },
  error => {
    // Spin.hide()
    // LoadingBar.error()
    if (error.response) {
    }
  })

// 时间
function getNowFormatDate() {
  // console.log(storage.state.token)
  var date = new Date()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = date.getFullYear() + month + strDate + date.getHours() + date.getMinutes() + date.getSeconds()
  return currentdate
}

export default axios
