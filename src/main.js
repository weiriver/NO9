import Vue from 'vue'

import App from './App'
import filter from './util/filter'
import router from './router/index'
import store from './store/index'
import './plugins/element.js'
// import './assets/css/element-variables.scss'
import '@/assets/css/normalize.css'
import '@/assets/css/common.scss'
import {postJson, postFile, postJsonWithMask} from '@/http/ajax'
import {tableHeightCal, showMsg, getTxt, treeArrRebuild} from '@/util/util'
import TablePage from '@/components/tablePage/TablePage'
import axios from '@/http/httpConfig'
import ECharts from 'vue-echarts'
import DetailList from '@/components/detailList/DetailList'
import Pagination from '@/components/pagination/Pagination'
import ConfirmUpload from '@/components/upload/confirmUpload/ConfirmUpload'
import ModalUpload from '@/components/upload/modalUpload/ModalUpload'
import ImportFile from '@/components/upload/importFile/ImportFile'
import flowchart from 'vue-flowplan'
import AreaCascader from '@/components/areaCascader/AreaCascader'
import Export from '@/components/export/Export'
import Print from '@/components/print/Print'
import AreauserSelect from '@/components/areauserSelect/AreauserSelect'
import Antecedents from '@/components/antecedents/Antecedents'
import MySteps from '@/components/mysteps/MySteps'

Vue.config.productionTip = false

Vue.prototype.tableHeightCal = tableHeightCal
Vue.prototype.showMsg = showMsg
Vue.prototype.TreeArrRebuild = treeArrRebuild
Vue.prototype.axios = axios
Vue.prototype.postJson = postJson
Vue.prototype.postJsonWithMask = postJsonWithMask
Vue.prototype.postFile = postFile
Vue.prototype.getTxt = getTxt
// 以下为非element项目组件
Vue.use(flowchart) // 流程图组件
Vue.component('DetailList', DetailList)
Vue.component('TablePage', TablePage) // 列表页组件
Vue.component('Pagination', Pagination) // 分页组件
Vue.component('ConfirmUpload', ConfirmUpload) // 上传组件（带确认按钮）
Vue.component('ModalUpload', ModalUpload) // 上传组件（Modal）
Vue.component('ImportFile', ImportFile) // 导入组件（Modal）
Vue.component('AreaCascader', AreaCascader) // 区域选择
Vue.component('v-chart', ECharts)
Vue.component('Export', Export) // 导出
Vue.component('Print', Print) //  打印
Vue.component('AreauserSelect', AreauserSelect) //  用户选择
Vue.component('Antecedents', Antecedents) // 履历
Vue.component('MySteps', MySteps) // 流程图


Vue.prototype.Event = new Vue()
new Vue({
  router,
  store,
  filter,
  render: h => h(App)
}).$mount('#app')
