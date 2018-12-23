import Vuex from 'vuex'
import Vue from 'vue'
import mutations from './mutations'
import actions from './actions'
import stationState from './station-state'


Vue.use(Vuex)
let login = sessionStorage.getItem('login') ? JSON.parse(sessionStorage.getItem('login')) : JSON.parse(sessionStorage.getItem('loginInfo'))
let state = {
  token: login ? login.token : '',
  uid: login ? login.uid : '1',
  navIsCollapse: false, // nav栏目是否收缩
  currentPage: 1, // 当前页码，默认为1
  sysName: '',
  station_enumDic: {
    CommonEnum$eduEnum: []
  },
  all_enumDic: {
    StorageEnum$goodsTypeEnum: [], // 商品类型
    StorageEnum$wareHouseTypeEnum: [], // 仓库类型
    FlowEnum$flowTypeEnum: [] // 流程类型
  }
}

state = Object.assign(state, stationState)
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters: {
    breadcrumbItemList: state => {
      return state.breadcrumb
    }
  }
})
