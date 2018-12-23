import {Message} from 'element-ui'

// 权限过滤
let Auth
export const authFilter = function (val, arr) {
  if (!Auth) {
    Auth = sessionStorage.getItem('Auth')
  }
  // return Auth.includes(val)
  return true
}


export const changeTrueType = (content) => {
  if (typeof content === 'object' && !Array.isArray(content)) {
    // 如果是对象
    var keys = Object.keys(content)
    keys.forEach(function (key) {
      var value = content[key]
      if (value === true) {
        content[key] = 'true'
      }
      if (value === false) {
        content[key] = 'false'
      }
    })
  } else if (typeof content === 'object' && Array.isArray(content)) {
    content.forEach(function (item) {
      changeTrueType(item)
    })
    // 如果是数组
  }

  // console.log('changeTrueType结束', content)
  return content
}
// table高度
export const tableHeightCal = (className, minus) => {
  var height = document.getElementsByClassName(className)[0].offsetHeight - minus
  return height
}
// 时间戳转日期+时间
export const timestampToTime = function (timestamp) {
  if (!timestamp) {
    return ''
  } else {
    var date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    // var Y = date.getFullYear() + '-'
    // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    // var D = date.getDate() + ' '
    var h = (date.getHours() >= 10 ? date.getHours() : String('0' + date.getHours())) + ':'
    var m = (date.getMinutes() >= 10 ? date.getMinutes() : String('0' + date.getMinutes())) + ':'
    var s = (date.getSeconds() >= 10 ? date.getSeconds() : String('0' + date.getSeconds()))
    return timesTampToDate(timestamp) + h + m + s
  }
}

function add0(m) {
  return m < 10 ? '0' + m : m
}

// 时间戳转日期
export const timesTampToDate = function (value) {
  if (regexp.isDate(value)) {
    return value
  } else {
    if (value) {
      if (regexp.isDateTime(value)) {
        return value.slice(0, 10)
      } else if (typeof value == 'object' || (typeof value == 'number' && (value + '').length == 13)) {
        var time = new Date(value)
        var y = time.getFullYear()
        var m = time.getMonth() + 1
        var d = time.getDate()
        return `${y}-${add0(m)}-${add0(d)}`
      }
    } else {
      return ''
    }
  }
}
// Tree数组处理(Menu.vue里面使用过)
export const treeArrRebuild = function (arr) {
  var newArr = []
  if (arr && arr.length) {
    for (var i = 0; i < arr.length; i++) {
      newArr[i] = {}
      newArr[i].expand = true
      // newArr[i].expand = false
      if (arr[i].children !== null && arr[i].children instanceof Array === false) {
        newArr[i].id = arr[i].children.id
        newArr[i].systemId = arr[i].id
      } else {
        newArr[i].id = arr[i].id
      }
      newArr[i].typeX = arr[i].typeX
      newArr[i].seq = arr[i].seq
      newArr[i].remark = arr[i].remark
      newArr[i].code = arr[i].code
      if (arr[i].title) {
        newArr[i].title = arr[i].title
      } else {
        newArr[i].title = arr[i].nameX
      }
      if (arr[i].checked === true) {
        newArr[i].checked = true
        // newArr[i].selected = true
      } else {
        newArr[i].checked = false
      }
      // 禁用状态 disabled: true-不可操作 false-可以操作 把nocheck数据存入树
      if (arr[i].nocheck === true) {
        newArr[i].disabled = true
        newArr[i].nocheck = true
        // newArr[i].selected = true
      }
      if (arr[i].nocheck === false) {
        newArr[i].disabled = false
        newArr[i].nocheck = false
      }
      // 把userOwn 数据存入树
      if (arr[i].userOwn === true) {
        newArr[i].userOwn = true
      }
      if (arr[i].userOwn === false) {
        newArr[i].userOwn = false
      }
      if (arr[i].status === true) {
        newArr[i].status = true
        // newArr[i].selected = true
      } else {
        newArr[i].status = false
      }
      if (arr[i].children && (typeof arr[i].children === 'object') && arr[i].children.children instanceof Array) {
        newArr[i].children = treeArrRebuild(arr[i].children.children)
        if (arr[i].children.checked === true) {
          newArr[i].children.checked = true
        } else {
          newArr[i].children.checked = false
        }
      } else {
        newArr[i].children = []
      }
      if (arr[i].children && arr[i].children instanceof Array) {
        newArr[i].children = treeArrRebuild(arr[i].children)
      }
    }
  }
  return newArr
}

// export default function(list, filter) {
//   console.log(arguments)
//   return function () {
//     if (filter) {
//       return list.filter(function(product) {
//         return Object.keys(product).some(function(key) {
//           return String(product[key]).toLowerCase().indexOf(filter) > -1
//         })
//       })
//     }
//     return list
//   }
// }
// 列表页，过滤查询分装（过滤条件，过滤数据-数组）
// export const filterEvent1 = (fil, data) => {
//   let filter = fil.trim()
//   if (filter) {
//     return data.filter(function (product) {
//       return Object.keys(product).some(function (key) {
//         if (product[key] && typeof product[key] === 'object') {
//           var newObj = product[key]
//           return Object.keys(newObj).some(function (newkey) {
//             return String(newObj[newkey]).toLowerCase().indexOf(filter) > -1
//           })
//         }
//         return String(product[key]).toLowerCase().indexOf(filter) > -1
//       })
//     })
//   }
//   return data
// }
// 列表页，过滤查询分装（过滤条件，过滤数据-数组）
// export const filterEvent = (fil, data, dataOrigin) => {
//   let filter = fil.trim()
//   let indexArray = []
//   let returnData = []
//   if (filter) {
//     data.forEach(function (product, index) {
//       let some = Object.keys(product).some(function (key) {
//         if (product[key] && typeof product[key] === 'object') {
//           var newObj = product[key]
//           return Object.keys(newObj).some(function (newkey) {
//             return String(newObj[newkey]).toLowerCase().indexOf(filter) > -1
//           })
//         }
//         return String(product[key]).toLowerCase().indexOf(filter) > -1
//       })
//       if (some) {
//         indexArray.push(index)
//       }
//     })
//   }
//   if (indexArray.length > 0) {
//     indexArray.forEach(function (choseIndex) {
//       returnData.push(dataOrigin[choseIndex])
//     })
//   }
//   return returnData
// }
// 数组筛选
// export const arrFilter = function (val, arr) {
//   var result = ''
//   if (!arr) {
//     return result
//   } else {
//     arr.forEach((obj, key) => {
//       if (obj.value === val || obj.value === (val + '')) {
//         result = obj.text
//       }
//     })
//     return result
//   }
// }
// 禁止/开启tab按键
// document.onkeydown = function () {
//   if (event.keyCode === 9) {
//     return true
//   }
// }

// 显示Message信息
export const showMsg = (content, type = 'success') => {
  // Message.close()
  Message[type]({
    message: content
  })
}
// 正则校验
export const regexp = {
  // 手机号验证
  isMobile: function (val) {
    return /^1[34578]\d{9}$/.test(val)
    // return /^1\d{10}$/.test(val)
    // return /^[1][0-9]{10}$ /.test(val)
  },
  // 身份证验证
  isIDCard: function (val) {
    return /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(val)
  },
  isNumber: function (val) {
    return /^[0-9]*$/.test(val)
  },
  // 整数类型
  isInt: function (val) {
    return /^[0-9]*[1-9][0-9]*$/.test(val)
  },
  // 允许负数
  isMPNumber: function (val) {
    return /^(-)?[0-9]*$/.test(val)
  },
  // 2位小数点
  isTwoPointNumber: function (val) {
    return /^\d+(\.\d{0,2})?$/.test(val)
  },
  // 日期格式如：2018-10-23
  isDate: function (val) {
    return /^\d{4}-\d{1,2}-\d{1,2}$/.test(val)
  },
  isDateTime: function (val) {
    return /^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(val)
  },
  // 数字和字母(只允许数字和字母组合)
  isNumLetters: function (val) {
    return /^[0-9a-zA-Z]+$/.test(val)
  },
  // 包含特殊字符
  includeSpecialStr: function (val) {
    /* eslint-disable */
    // var type = '[`~!@#$%^&*()=|{}\';\',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；”“\'。，、？]'
    let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im
    let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
    if (regEn.test(val) || regCn.test(val)) {
      console.log('包含了特殊字符.')
      return true
    } else {
      return false
    }
  }
}
// 获得本周本月本年的开始日期
export const GetDateStart = {
  getDateDetail(now) {
    var nowDayOfWeek = now.getDay() // 今天本周的第几天
    nowDayOfWeek = nowDayOfWeek === 0 ? 7 : nowDayOfWeek
    var nowDay = now.getDate() // 当前日
    var nowMonth = now.getMonth() // 当前月
    var nowYear = now.getYear() // 当前年
    nowYear += (nowYear < 2000) ? 1900 : 0 //
    return {
      nowYear,
      nowMonth,
      nowDay,
      nowDayOfWeek
    }
  },
  // 格局化日期：yyyy-MM-dd
  formatDate(date) {
    var myyear = date.getFullYear()
    var mymonth = date.getMonth() + 1
    var myweekday = date.getDate()

    if (mymonth < 10) {
      mymonth = '0' + mymonth
    }
    if (myweekday < 10) {
      myweekday = '0' + myweekday
    }
    return (myyear + '-' + mymonth + '-' + myweekday)
  },
  // 获得本周的开端日期(周一）
  getWeekStartDate(now) {
    var {nowDayOfWeek} = this.getDateDetail(now)
    var timestampOfDay = 1000 * 60 * 60 * 24
    var weekStartDate = +now - (nowDayOfWeek - 1) * timestampOfDay
    return this.formatDate(new Date(weekStartDate))
  },

  // 获得本月的开端日期
  getMonthStartDate(now) {
    var {nowYear, nowMonth} = this.getDateDetail(now)
    var monthStartDate = new Date(nowYear, nowMonth, 1)
    return this.formatDate(monthStartDate)
  },

  // 获得近三个月的开端日期
  getNearlyThreeStartDate(now) {
    var {nowYear, nowMonth} = this.getDateDetail(now)
    var threeMonthBefore = ((nowMonth - 2) + 12) % 12
    if (threeMonthBefore > nowMonth) {
      nowYear--
    }
    var quarterStartDate = new Date(nowYear, threeMonthBefore, 1)
    return this.formatDate(quarterStartDate)
  },

  // 获得本年的开端日期
  getYearStartDate(now) {
    var {nowYear} = this.getDateDetail(now)
    var yearStartDate = new Date(nowYear, 0, 1)
    return this.formatDate(yearStartDate)
  }
}
// 去除对象包裹
export const getTxt = function (val) {
  if (val && typeof val == 'object' && val.text) {
    return val.text
  }
  if (val === true || val === 'true') {
    return '是'
  }
  if (val === false || val === 'false') {
    return '否'
  }
  return val
}
// 面包屑
export const getBreadcrumbList = function (navList) {
  var openName = '1' // 左侧导航栏的第几级开关
  var activeName = '1-1' // 左侧导航栏的子菜单项目高亮
  var breadcrumbItemList = []
  // 页面刷新后，记录左侧导航栏的点击位置。
  var hash = location.hash.substr(1) // 获取hash值
  if (!hash.includes('apply')) {
    hash = hash.split('?')[0]
  }
  // console.log('hash', hash)
  if (navList) {
    for (var n = 0; n < navList.length; n++) {
      var nav = navList[n]
      var subNavList = nav.children
      if (subNavList) {
        for (var i = 0; i < subNavList.length; i++) {
          var subnav = subNavList[i]
          if (hash === subnav.link) {
            // console.log('第二层选中', subnav.link)
            activeName = subnav.num // 获得菜单项的序号编码，如'2-1'
            openName = nav.num // 获得菜单项的父级序号编码，如‘2’
            breadcrumbItemList = [
              {name: nav.name, to: ''},
              {name: subnav.name, to: subnav.link}
            ] // 设置面包屑
            // console.log('第二层选中返回值', {
            //   openName,
            //   activeName,
            //   breadcrumbItemList
            // })
            return {
              openName,
              activeName,
              breadcrumbItemList
            }
          }
          // 从描述字段里面拿到第三层的数据
          var lastNavList = []
          if (!subnav.childrenArray) {
            subnav.childrenArray = []
            var remark = subnav.remark
            var pathNameArray = remark ? remark.split(';') : []
            pathNameArray.forEach(function (e) {
              var pathName = e.split(':')
              var name = pathName[0]
              var link = pathName[1]
              subnav.childrenArray.push({
                name,
                link
              })
            })
          }
          lastNavList = subnav.childrenArray
          // 面包屑的第三层
          if (lastNavList && lastNavList.length > 0) {
            for (var j = 0; j < lastNavList.length; j++) {
              var lastNav = lastNavList[j]
              if (hash === lastNav.link) {
                activeName = subnav.num // 获得菜单项的序号编码，如'2-1'
                openName = nav.num // 获得菜单项的父级序号编码，如‘2’
                breadcrumbItemList = [
                  {name: nav.name, to: ''},
                  {name: subnav.name, to: subnav.link},
                  {name: lastNav.name, to: hash}
                ] // 设置面包屑
                return {
                  openName,
                  activeName,
                  breadcrumbItemList
                }
              }
              // /a/b/:id 的路由
              // if ((hash.indexOf(lastNav.link) > -1) && (lastNav.link.split('/').length === hash.split('/').length)) {
              //   activeName = subnav.num  // 获得菜单项的序号编码，如'2-1'
              //   openName = nav.num // 获得菜单项的父级序号编码，如‘2’
              //   breadcrumbItemList = [
              //     {name: nav.name, to: ''},
              //     {name: subnav.name, to: subnav.link},
              //     {name: lastNav.name, to: hash}
              //   ] // 设置面包屑
              // }
              var link = lastNav.link
              if (link.slice(-1) === '/') {
                link += '\\d+'
              }
              var regex = new RegExp(link)
              if (regex.test(hash)) {
                activeName = subnav.num // 获得菜单项的序号编码，如'2-1'
                openName = nav.num // 获得菜单项的父级序号编码，如‘2’
                breadcrumbItemList = [
                  {name: nav.name, to: ''},
                  {name: subnav.name, to: subnav.link},
                  {name: lastNav.name, to: hash}
                ] // 设置面包屑
              }
            }
          }
        }
      } else {
        // 系统设置的部分
      }
    }
  }
  return {
    openName,
    activeName,
    breadcrumbItemList
  }
}

