/**
 10300: 公共接口 common
 10400: 站点接口 station
 10100: 账户接口 account
 10700: 信息发布接口 ids
 10086: 巡查系统接口 inspect
 10900: 业务相关接口 biz
 10101: 设备维修 repair
 10102: 仓储耗材 storage
 10103: 培训管理 train
 10104: 绩效考核
 10001: 文件服务网关 files
 * */
import Axios from 'axios'
import store from '../store/index'


// let base = 'http://10.13.0.129' // 开发测试
// let base = 'http://218.28.234.14' // 生产环境外网访问地址
let base = 'http://202.105.127.12' // 测试环境外网访问地址
// let base = 'http://10.41.33.125' // 生产环境内网
// let base = 'http://10.9.0.74' // 测试环境
// let base = 'http://10.13.0.124' // 晓露测试环境
// let base = 'http://10.36.0.167' // 卓盛 测试环境
// let base = 'http://10.36.0.189' // 东升 测试环境
// let base = 'http://10.36.0.187'
// let base = 'http://10.36.0.54' // 但鑫测试环境

window.base = base
let urlArr = []

function getUrlArrFromBackend() {
  if (!urlArr.length) {
    let loginInfo = sessionStorage.getItem('login')
    let loginData = loginInfo ? JSON.parse(loginInfo) : {subSystems: []}
    urlArr = loginData.subSystems.map(v => {
      return {
        name: v.sysModule.value,
        value: v.accessUrl
      }
    })
    return urlArr
  } else {
    return urlArr
  }
}

let changeUrl = (url) => {
  if (!sessionStorage.getItem('login')) {
    return base + ':10100'
  }
  let arr = getUrlArrFromBackend()
  let target = arr.find(v => v.name == url)
  if (target) {
    return target.value
  } else {
    return changeUrl('common')
  }
}

// 封装请求
export const postJson = (url, data, responseType = 'json') => {
  let urlStr
  if (url && url.includes('/')) {
    // urlStr = Patrol + url
    urlStr = changeUrl('inspect') + url
  } else {
    urlStr = changeUrl(url)
  }
  return Axios({
    method: 'post',
    url: urlStr,
    data: data,
    headers: {'Content-Type': 'application/json'},
    responseType
  })
}
// 封装请求
export const postJsonWithMask = (url, data, responseType = 'json') => {
  data.loading = true
  return postJson(url, data, responseType)
}
// 封装请求
export const postFile = (url, obj, files) => {
  let data = new FormData()
  data.append('token', store.state.token)
  for (var key in obj) {
    if (typeof obj[key] === 'object') {
      data.append(key, JSON.stringify(obj[key]))
      // data.append(key, obj[key])
    } else {
      data.append(key, obj[key])
    }
  }
  files.forEach((val, key) => {
    console.log(val)
    data.append('files', val.raw)
  })
  if (url == 'common') {
    // 附件以base64形式上传（如：流程里面的高拍仪）
    return Axios({
      method: 'post',
      url: changeUrl('common'),
      data: data,
      // withCredentials: isResful,
      headers: {'Content-Type': 'multipart/form-data'}
    })
  } else {
    // 附件不以base64形式上传
    return Axios({
      method: 'post',
      url: changeUrl('files') + '/fastdfs/upload',
      data: data,
      headers: {'Content-Type': 'multipart/form-data'}
    })
  }
}
// 封装请求
export const postForm = (url, data) => {
  return Axios({
    method: 'post',
    // url: Patrol + url,
    url: changeUrl('inspect') + url,
    data: data,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
    // headers: {'Content-Type': 'multipart/form-data'}
  })
}
// 封装请求
export const putForm = (url, data) => {
  return Axios({
    method: 'put',
    // url: Patrol + url,
    url: changeUrl('inspect') + url,
    data: data,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }]
    // headers: {'Content-Type': 'multipart/form-data'}
  })
}
// 封装请求
export const putJson = (url, data) => {
  let urlStr
  if (url && url.includes('/')) {
    // urlStr = Patrol + url
    urlStr = changeUrl('inspect') + url
  } else {
    urlStr = changeUrl(url)
  }
  return Axios({
    method: 'put',
    url: urlStr,
    data: data,
    headers: {'Content-Type': 'application/json'}
  })
}
// 封装请求
export const getJson = (url, data) => {
  // let urlStr = Patrol + url
  let urlStr = changeUrl('inspect') + url
  return Axios({
    method: 'get',
    url: urlStr,
    params: data,
    headers: {'Content-Type': 'application/json'}
  })
}
export const deleteJson = (url, data) => {
  // let urlStr = Patrol + url
  let urlStr = changeUrl('inspect') + url
  return Axios({
    method: 'delete',
    url: urlStr,
    data: data,
    headers: {'Content-Type': 'application/json'}
  })
}
// 封装请求: 原封装无法兼容 restful api，特修正
export const postRestfull = (url, data) => {
  return Axios({
    method: 'post',
    url: url,
    data: data,
    headers: {'Content-Type': 'application/json'}
  })
}
// 子系统登录，统计分析系统登录的请求
export const postJsonDss = (data, url) => {
  return Axios({
    method: 'post',
    url: url,
    data: data,
    headers: {'Content-Type': 'application/json'}
  })
}

