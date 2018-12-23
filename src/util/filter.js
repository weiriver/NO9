import Vue from 'vue'
import {timesTampToDate, timestampToTime, getTxt, authFilter, changeTrueType, regexp} from './util'

Vue.prototype.ToDate = timesTampToDate
Vue.prototype.ToTime = timestampToTime
Vue.prototype.BooleanToString = changeTrueType
Vue.prototype.Auth = authFilter
Vue.prototype.GetTxt = getTxt
Vue.prototype.Regexp = regexp
Vue.filter('ToDate', timesTampToDate)
Vue.filter('ToTime', timestampToTime)
// Vue.filter('ArrFilter', arrFilter)
Vue.filter('GetTxt', getTxt)
Vue.filter('GetTxt', getTxt)
Vue.filter('Auth', authFilter)
export default Vue
