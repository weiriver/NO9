const mutations = {
  // 公共方法：设置枚举对象和数据字典
  SET_ENUM_DIC: (state, data) => {
    const {target, content} = data
    state[target] = content
  },
  SET_TOKEN: (state, data) => {
    state.token = data
  },
  // 设置nav栏目的收缩状态
  SET_NAVISCOLLAPSE: (state, data) => {
    state.navIsCollapse = data
  },
  // 设置nav栏目的收缩状态
  SET_SYSNAME: (state, data) => {
    state.sysName = data
  },
  // 设置页码
  SET_CURRENTPAGE: (state, data) => {
    state.currentPage = data
  },
  SET_BREADCRUMB_LAST: (state, data) => {
    state.breadcrumb[2] = {}
    state.breadcrumb[2] = data
  },
  DEL_BREADCRUMB_LAST: (state) => {
    state.breadcrumb.splice(2)
  }
}
export default mutations
