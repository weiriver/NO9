import {Main} from './base'

// -------------------------------- 业务办理 ---------------------------------------------
import Sites from '@/views/main/station/businessHandle/businessApply/siteBusiness/Sites' // 站点业务
import SitesAdd from '@/views/main/station/businessHandle/businessApply/siteBusiness/SitesAdd' // 新增站点
import SitesStopBoot from '@/views/main/station/businessHandle/businessApply/siteBusiness/SitesStopBoot' // 站点停开机
import ResumeSiteStatus from '@/views/main/station/businessHandle/businessApply/siteBusiness/ResumeSiteStatus' // 恢复撤站状态申请
import SitesMove from '@/views/main/station/businessHandle/businessApply/siteBusiness/SitesMove' // 站点迁移
import ClearProof from '@/views/main/station/businessHandle/businessApply/siteBusiness/ClearProof' // 站点清标申请
// 固定销售限额设置
import StationRelexSaleApply from '@/views/main/station/businessHandle/businessApply/siteBusiness/StationRelexSaleApply'
// 临时销售限额设置
import TempRelexSaleApply from '@/views/main/station/businessHandle/businessApply/siteBusiness/TempRelexSaleApply'
// 注销票
import StationCancelticket from '@/views/main/station/businessHandle/businessApply/siteBusiness/StationCancelticket'
// 站点信息变更
import SitesInfoChange from '@/views/main/station/businessHandle/businessApply/siteBusiness/SitesInfoChange'
// 快三销售权限管理申请
import K3sale from '@/views/main/station/businessHandle/businessApply/siteBusiness/K3sale'

const StationChange = () => import('@/views/main/station/businessHandle/businessApply/siteBusiness/StationChange') // 站点变更申请
const MessagePublish = () => import('@/views/main/station/businessHandle/businessApply/siteBusiness/MessagePublish') // 消息发布
const StationResponsorChange = () => import('@/views/main/station/businessHandle/businessApply/siteBusiness/StationResponsorChange') // 负责人变更
const StationCancel = () => import('@/views/main/station/businessHandle/businessApply/siteBusiness/StationCancel') // 站点撤销申请
// 站点绑定
const SitesBind = () => import('@/views/main/station/businessHandle/sitesBind/SitesBind') // 站点绑定
const SitesBindAdd = () => import('@/views/main/station/businessHandle/sitesBind/SitesBindAdd') // 站点绑定
// 区域绑定
const AreaBindJK = () => import('@/views/main/station/businessHandle/areaBind/AreaBindJK') // 即开区域绑定

// -------------------------------- 首页 ---------------------------------------------
const Situation = () => import('@/views/main/station/homePage/sysHome/Situation') // 整体概况
const Todos = () => import('@/views/main/station/homePage/workbench/todos//Todos') // 我的代办
// const TodosEdit = () => import('@/views/main/station/homePage/workbench/todos/TodosEdit') // 我的代办-处理
const TodosSitesAdd = () => import('@/views/main/station/homePage/workbench/todos/TodosSitesAdd') // 我的代办-处理--站点新增
const TodosSitesMove = () => import('@/views/main/station/homePage/workbench/todos/TodosSitesMove') // 我的代办-处理--站点迁址
const TodosClearProof = () => import('@/views/main/station/homePage/workbench/todos/TodosClearProof') // 我的代办-处理--站点清标
const TodosResumeSiteStatus = () => import('@/views/main/station/homePage/workbench/todos/TodosResumeSiteStatus') // 处理--恢复撤站申请
const TodosK3sale = () => import('@/views/main/station/homePage/workbench/todos/TodosK3sale') // 我的代办-处理--快三业务
const TodosSitesStopBoot = () => import('@/views/main/station/homePage/workbench/todos/TodosSitesStopBoot') // 我的代办-处理--快三业务
const TodosSitesInfoChange = () => import('@/views/main/station/homePage/workbench/todos/TodosSitesInfoChange') // 我的代办-处理--基本资料变更
const TodosYCTChange = () => import('@/views/main/station/homePage/workbench/todos/TodosYCTChange') // 我的代办-处理--豫彩通变更
const TodosStationRelexSaleApply = () => import('@/views/main/station/homePage/workbench/todos/TodosStationRelexSaleApply') // 我的代办-处理--固定销售限额申请
const TodosTempRelexSaleApply = () => import('@/views/main/station/homePage/workbench/todos/TodosTempRelexSaleApply') // 我的代办-处理--临时销售限额申请
const TodosStationCancel = () => import('@/views/main/station/homePage/workbench/todos/TodosStationCancel') // 我的代办-处理--站点撤销申请
const TodosMessagePublish = () => import('@/views/main/station/homePage/workbench/todos/TodosMessagePublish') // 我的代办-处理--消息发布
const TodosStationResponsorChange = () => import('@/views/main/station/homePage/workbench/todos/TodosStationResponsorChange') // 我的代办-处理--责任人变更
const TodoStationCancelticket = () => import('@/views/main/station/homePage/workbench/todos/TodoStationCancelticket') // 我的代办-处理--站点注销票
const TodosStationChange = () => import('@/views/main/station/homePage/workbench/todos/TodosStationChange') // 我的代办-处理--站点注销票
const Attention = () => import('@/views/main/station/homePage/workbench/attention/Attention') // 我的知会
const AttentionDetail = () => import('@/views/main/station/homePage/workbench/attention/AttentionDetail') // 我的知会
const Apply = () => import('@/views/main/station/homePage/workbench/apply/Apply') // 我的申请
const ApplyDetail = () => import('@/views/main/station/homePage/workbench/apply/ApplyDetail') // 我的申请详情
const Done = () => import('@/views/main/station/homePage/workbench/done/Done') // 我的已办
const File = () => import('@/views/main/station/homePage/workbench/file/File') // 档案

// -------------------------------- 2. 站点管理 ---------------------------------------------
const SitesList = () => import('@/views/main/station/manage/info/sitesList/SitesList') // 站点列表
const SitesListDetail = () => import('@/views/main/station/manage/info/sitesList/SitesListDetail') // 站点列表详情
const SitesListModify = () => import('@/views/main/station/manage/info/sitesList/SitesListModify') // 站点列表修改
const SitesChangeDetail = () => import('@/views/main/station/manage/info/sitesChange/SitesChangeDetail') // 站点变更详情
const SitesChange = () => import('@/views/main/station/manage/info/sitesChange/SitesChange') // 站点变更信息
const SitesInfo = () => import('@/views/main/station/manage/info/sitesInfo/SitesInfo') // 站点资料
const SitesInfoDetail = () => import('@/views/main/station/manage/info/sitesInfo/SitesInfoDetail') // 站点资料
const SitesInfoModify = () => import('@/views/main/station/manage/info/sitesInfo/SitesInfoModify') // 站点资料
const SitesGroup = () => import('@/views/main/station/manage/info/sitesGroup/SitesGroup') // 站点分组
const StationSetGroup = () => import('@/views/main/station/manage/info/sitesGroup/StationSetGroup') // 设置分组
const SitesGroupDetail = () => import('@/views/main/station/manage/info/sitesGroup/SitesGroupDetail') // 站点分组--详情
const SitesGroupAdd = () => import('@/views/main/station/manage/info/sitesGroup/SitesGroupAdd') // 站点分组--新增/修改
const JiangCheng = () => import('@/views/main/station/manage/info/jiangCheng/JiangCheng') // 奖惩信息
const JiangChengAdd = () => import('@/views/main/station/manage/info/jiangCheng/JiangChengAdd') // 新增奖惩
const Sales = () => import('@/views/main/station/manage/info/sales/Sales') // 销售员
const SalesAdd = () => import('@/views/main/station/manage/info/sales/SalesAdd') // 新增销售员
const SalesDetail = () => import('@/views/main/station/manage/info/sales/SalesDetail') // 新增销售员
const JkpSite = () => import('@/views/main/station/manage/jkp/jkpSite/JkpSite') // 即开票列表
const JkpSiteAdd = () => import('@/views/main/station/manage/jkp/jkpSite/JkpSiteAdd') // 即开票列表
const JkpSiteDetail = () => import('@/views/main/station/manage/jkp/jkpSite/JkpSiteDetail') // 即开票列表详情
const Show = () => import('@/views/main/station/manage/siteGeology/show/Show') // 站点地理--站点地理展示
const Logo = () => import('@/views/main/station/manage/siteGeology/logo/Logo') // 站点地理--站点标识维护
const LogoAdd = () => import('@/views/main/station/manage/siteGeology/logo/LogoAdd') // 站点地理--站点标识新增/修改
const Info = () => import('@/views/main/station/manage/siteGeology/info/Info') // 站点地理--站点信息维护
const InfoAdjust = () => import('@/views/main/station/manage/siteGeology/info/InfoAdjust') // 站点地理--站点信息维护--纠偏
const Evaluate = () => import('@/views/main/station/manage/info/evaluate/Evaluate') // 站点评估
const AmbientData = () => import('@/views/main/station/manage/zoneAnalysis/ambientData/AmbientData') // 环境数据
const DistributeModel = () => import('@/views/main/station/manage/zoneAnalysis/distributeModel/DistributeModel') // 环境数据
const RunAnalysis = () => import('@/views/main/station/manage/zoneAnalysis/runAnalysis/RunAnalysis') // 经营分析排行
const RunAnalysisDetail = () => import('@/views/main/station/manage/zoneAnalysis/runAnalysis/RunAnalysisDetail') // 经营分析排行
const DevelopAnalysis = () => import('@/views/main/station/manage/zoneAnalysis/developAnalysis/DevelopAnalysis') // 环境数据
const siteAuthorityDetail = () => import('@/views/main/station/manage/siteAuthority/SiteAuthorityDetail') // 站点权限--修改
const SiteAuthority = () => import('@/views/main/station/manage/siteAuthority/SiteAuthority') // 站点权限
const Deposit = () => import('@/views/main/station/manage/siteBusiness/deposit/Deposit') // 销售保证金
const DepositRefund = () => import('@/views/main/station/manage/siteBusiness/deposit/DepositRefund') // 销售保证金退款结算
const ConsignmentManage = () => import('@/views/main/station/manage/siteBusiness/deposit/ConsignmentManage') // 代销费管理
const BussinessStats = () => import('@/views/main/station/manage/siteBusiness/bussinessStats/BussinessStats') // 非撤站停机


// -------------------------------- 消息发布 ---------------------------------------------
const VideoSort = () => import('@/views/main/station/distribution/videoTraining/videoSort/VideoSort') // 视频类别管理
const VideoSortAdd = () => import('@/views/main/station/distribution/videoTraining/videoSort/VideoSortAdd') // 视频类别-新增
const VideoSortDetail = () => import('@/views/main/station/distribution/videoTraining/videoSort/VideoSortDetail') // 视频类别-详情
const VideoInfo = () => import('@/views/main/station/distribution/videoTraining/videoInfo/VideoInfo') // 视频信息管理
const VideoInfoAdd = () => import('@/views/main/station/distribution/videoTraining/videoInfo/VideoInfoAdd') // 视频信息-新增
const VideoInfoDetail = () => import('@/views/main/station/distribution/videoTraining/videoInfo/VideoInfoDetail') // 视频信息-详情
const Staticistics = () => import('@/views/main/station/distribution/infoDistribution/staticistics/Staticistics') // 视频类别管理

// -------------------------------- 4. 数据维护 ---------------------------------------------
// 数据维护
const ProtectRadius = () => import('@/views/main/station/dataMaintain/dataMaintain/protectRadius/ProtectRadius') // 保护半径
const ProtectRadiusChangeRecord = () => import('@/views/main/station/dataMaintain/dataMaintain/protectRadius/ProtectRadiusChangeRecord') // 变更记录
const ProtectRadiusAdd = () => import('@/views/main/station/dataMaintain/dataMaintain/protectRadius/ProtectRadiusAdd') // 保护半径--新增
const ZfOnline = () => import('@/views/main/station/dataMaintain/zf/zfOnline/ZfOnline') // 中福在线销售厅管理
const ZfOnlineAdd = () => import('@/views/main/station/dataMaintain/zf/zfOnline/ZfOnlineAdd') // 中福在线销售厅管理--新增
const ZfOnlineDetail = () => import('@/views/main/station/dataMaintain/zf/zfOnline/ZfOnlineDetail') // 中福在线销售厅管理--详情
const ZfSale = () => import('@/views/main/station/dataMaintain/zf/zfSale/ZfSale') // 中福在线销量管理
const ZfSaleAdd = () => import('@/views/main/station/dataMaintain/zf/zfSale/ZfSaleAdd') // 中福在线销量管理--新增
const ZfSaleDetail = () => import('@/views/main/station/dataMaintain/zf/zfSale/ZfSaleDetail') // 中福在线销量管理--详情
const ZfArea = () => import('@/views/main/station/dataMaintain/zf/zfArea/ZfArea') // 中福在线区域管理
const ZfAreaAdd = () => import('@/views/main/station/dataMaintain/zf/zfArea/ZfAreaAdd') // 中福在线区域管理--新增
const ZfAreaDetail = () => import('@/views/main/station/dataMaintain/zf/zfArea/ZfAreaDetail') // 中福在线区域管理--详情


// -------------------------------- 5. 系统管理 ---------------------------------------------

const HurdlesType = () => import('@/views/main/station/service/service/hurdlesType/HurdlesType') // 紧急报障类型
const HurdlesTypeAdd = () => import('@/views/main/station/service/service/hurdlesType/HurdlesTypeAdd') // 紧急报障类型--新增
const HurdlesList = () => import('@/views/main/station/service/service/hurdlesList/HurdlesList') // 紧急报障工单
const HurdlesDetail = () => import('@/views/main/station/service/service/hurdlesList/HurdlesDetail') // 紧急报障工单--查看
const HurdlesCount = () => import('@/views/main/station/service/service/hurdlesCount/HurdlesCount') // 紧急报障工单统计
const HurdlesLevel = () => import('@/views/main/station/service/repair/hurdlesLevel/HurdlesLevel') // 故障级别
const HurdlesLevelAdd = () => import('@/views/main/station/service/repair/hurdlesLevel/HurdlesLevelAdd') // 故障级别--新增
const RepairList = () => import('@/views/main/station/service/repair/repairList/RepairList') // 维修工单
const RepairDetail = () => import('@/views/main/station/service/repair/repairList/RepairDetail') // 维修工单-详情
const BillingCount = () => import('@/views/main/station/service/service/billingCount/BillingCount') // 即开票工单统计
const billingRCD = () => import('@/views/main/station/service/service/billingRCD/BillingRCD') // 即开票推荐
const billingRCDAdd = () => import('@/views/main/station/service/service/billingRCD/BillingRCDAdd') // 即开票推荐-新增
const billingRCDDetail = () => import('@/views/main/station/service/service/billingRCD/BillingRCDDetail') // 即开票推荐-新增
const billingSet = () => import('@/views/main/station/service/service/billingSet/BillingSet') // 即开票推荐-新增
const billingOrder = () => import('@/views/main/station/service/service/billingOrder/BillingOrder') // 即开票订单
const billingOrderDetail = () => import('@/views/main/station/service/service/billingOrder/BillingOrderDetail') // 即开票订单详情
const billingOrderAudit = () => import('@/views/main/station/service/service/billingOrder/BillingOrderAudit') // 即开票订单审核
const lotterySense = () => import('@/views/main/station/service/service/lotterySense/LotterySense') // 彩票常识列表
const lotterySenseAdd = () => import('@/views/main/station/service/service/lotterySense/LotterySenseAdd') // 彩票常识新增
const lotterySenseDetail = () => import('@/views/main/station/service/service/lotterySense/LotterySenseDetail') // 彩票常识新增

// -------------------------------- 6. 设备管理 ---------------------------------------------
const EqpInfo = () => import('@/views/main/station/equipment/eqpManage/eqpInfo/EqpInfo') // 设备信息
const EqpInfoAdd = () => import('@/views/main/station/equipment/eqpManage/eqpInfo/EqpInfoAdd') // 设备信息
const EqpInfoDetail = () => import('@/views/main/station/equipment/eqpManage/eqpInfo/EqpInfoDetail') // 设备信息

const EqpModel = () => import('@/views/main/station/equipment/eqpManage/eqpModel/EqpModel') // 设备型号
const EqpModelAdd = () => import('@/views/main/station/equipment/eqpManage/eqpModel/EqpModelAdd') // 设备型号-新增
const EqpModelDetail = () => import('@/views/main/station/equipment/eqpManage/eqpModel/EqpModelDetail') // 设备型号-详情
const EqpType = () => import('@/views/main/station/equipment/eqpManage/eqpType/EqpType') // 设备类型
const EqpTypeAdd = () => import('@/views/main/station/equipment/eqpManage/eqpType/EqpTypeAdd') // 设备类型-新增

// -------------------------------- 7. 销售管理 ---------------------------------------------
const periodStatement = () => import('@/views/main/station/sale/statementManage/statement/PeriodStatement')
const momentStatement = () => import('@/views/main/station/sale/statementManage/statement/MomentStatement')
const sitesStatus = () => import('@/views/main/station/sale/monitorManage/SitesStatus') // 站状态监控
const abnormalCommission = () => import('@/views/main/station/sale/monitorManage/AbnormalCommission') // 异常代销费
const softwareQuery = () => import('@/views/main/station/sale/monitorManage/SoftwareQuery') // 软件查询
const softwareDetail = () => import('@/views/main/station/sale/monitorManage/SoftwareDetail') // 软件信息详情
const hardwareQuery = () => import('@/views/main/station/sale/monitorManage/HardwareQuery') // 硬件查询
const hardwareDetail = () => import('@/views/main/station/sale/monitorManage/HardwareDetail') // 硬件查询
const SaleTask = () => import('@/views/main/station/sale/saleTask/SaleTask') // 销量目标
const SaleTaskAdd = () => import('@/views/main/station/sale/saleTask/SaleTaskAdd') // 销量目标--新增


const routerArr = [
  {
    path: '/index',
    name: '站点首页',
    component: Main,
    children: [
      {path: 'situation', component: Situation}, // 整体概况
      {path: 'todos', component: Todos}, // 我的待办
      // {path: 'todosEdit', component: TodosEdit}, // 我的待办-处理
      {path: 'todosSitesAdd', component: TodosSitesAdd}, // 我的待办-处理--站点新增
      {path: 'todosSitesMove', component: TodosSitesMove}, // 我的待办-处理--站点迁址
      {path: 'todosClearProof', component: TodosClearProof}, // 我的待办-处理--站点清标
      {path: 'todosResumeSiteStatus', component: TodosResumeSiteStatus}, // 我的待办-处理--回复撤站申请
      {path: 'todosK3sale', component: TodosK3sale}, // 我的待办-处理--站点新增
      {path: 'todosSitesStopBoot', component: TodosSitesStopBoot}, // 我的待办-处理--停开机
      {path: 'todosSitesInfoChange', component: TodosSitesInfoChange}, // 我的待办-处理--基本资料变更
      {path: 'todosYCTChange', component: TodosYCTChange}, // 我的待办-处理--豫彩同变更
      {path: 'todosStationRelexSaleApply', component: TodosStationRelexSaleApply}, // 我的待办-处理--固定销售限额申请
      {path: 'todosTempRelexSaleApply', component: TodosTempRelexSaleApply}, // 我的待办-处理--临时销售限额申请
      {path: 'todosStationCancel', component: TodosStationCancel}, // 我的待办-处理--站点撤销申请
      {path: 'todosMessagePublish', component: TodosMessagePublish}, // 我的待办-处理--消息发布
      {path: 'todosStationResponsorChange', component: TodosStationResponsorChange}, // 我的待办-处理--
      {path: 'todoStationCancelticket', component: TodoStationCancelticket}, // 我的待办-处理--站点注销票
      {path: 'todosStationChange', component: TodosStationChange}, // 我的待办-处理--站点注销票
      {path: 'attention', component: Attention}, // 我的知会
      {path: 'attentionDetail/:id', component: AttentionDetail}, // 我的知会
      {path: 'apply', component: Apply}, // 我的申请
      {path: 'applyDetail', component: ApplyDetail}, // 我的申请详情
      {path: 'done', component: Done}, // 我的已办
      // {path: 'doneDetail/:id', component: DoneDetail}, // 我的已办详情
      {path: 'file', component: File}, // 档案
      // {path: 'fileDetail/:id', component: FileDetail} // 档案详情
      // {path: '*', redirect: '/index/situation'}
      {path: '*', redirect: '/index/situation'}
    ]
  },
  {
    path: '/distribution',
    component: Main,
    children: [
      {path: 'videoSort', component: VideoSort}, //  视频类别管理
      {path: 'videoSortAdd', component: VideoSortAdd}, // 视频类别新增
      {path: 'videoSortAdd/:id', component: VideoSortAdd}, // 视频类别修改
      {path: 'videoSortDetail/:id', component: VideoSortDetail}, // 视频类别详情
      {path: 'videoInfo', component: VideoInfo}, //  视频信息管理
      {path: 'videoInfoAdd', component: VideoInfoAdd}, // 视频信息新增
      {path: 'videoInfoAdd/:id', component: VideoInfoAdd}, // 视频信息修改
      {path: 'videoInfoDetail/:id', component: VideoInfoDetail}, // 视频信息详情
      {path: 'staticistics', component: Staticistics} //  阅读统计
      // {path: '*', redirect: '/distribution/videoSort'}
    ]
  },
  {
    path: '/service',
    component: Main,
    children: [
      {path: 'hurdlesType', component: HurdlesType}, // 紧急报障类型
      {path: 'hurdlesTypeAdd', component: HurdlesTypeAdd}, // 紧急报障类型--新增
      {path: 'hurdlesTypeAdd/:id', component: HurdlesTypeAdd}, // 紧急报障类型--修改
      {path: 'hurdlesList', component: HurdlesList}, // 紧急报障工单
      {path: 'hurdlesDetail/:id', component: HurdlesDetail}, // 紧急报障工单
      {path: 'hurdlesCount', component: HurdlesCount}, // 紧急报障工单统计
      // {path: 'feedback', component: Feedback}, // 意见反馈
      // {path: 'feedbackEdit/:id/:type', component: FeedbackEdit}, // 意见反馈--处理
      {path: 'hurdlesLevel', component: HurdlesLevel}, // 故障级别
      {path: 'hurdlesLevelAdd', component: HurdlesLevelAdd}, // 故障级别--新增
      {path: 'hurdlesLevelAdd/:id', component: HurdlesLevelAdd}, // 故障级别--修改
      {path: 'repairList', component: RepairList}, // 维修工单
      {path: 'repairDetail/:id', component: RepairDetail}, // 维修工单-详情
      {path: 'billingCount', component: BillingCount}, // 即开票工单统计
      {path: 'billingRCD', component: billingRCD}, // 即开票推荐列表
      {path: 'billingRCDAdd', component: billingRCDAdd}, // 即开票推荐-新增
      {path: 'billingRCDAdd/:id', component: billingRCDAdd}, // 即开票推荐列表-修改
      {path: 'billingRCDDetail/:id', component: billingRCDDetail}, // 即开票推荐列表-详情
      {path: 'billingSet', component: billingSet}, // 即开票预定
      {path: 'billingOrder', component: billingOrder}, // 即开票订单
      {path: 'billingOrderDetail/:id', component: billingOrderDetail}, // 即开票订单详情
      {path: 'billingOrderAudit/:id', component: billingOrderAudit}, // 即开票订单审核
      {path: 'lotterySense', component: lotterySense}, // 彩票常识
      {path: 'lotterySenseAdd', component: lotterySenseAdd}, // 彩票常识新增
      {path: 'lotterySenseAdd/:id', component: lotterySenseAdd}, // 彩票常识新增
      {path: 'lotterySenseDetail/:id', component: lotterySenseDetail} // 彩票常识新增
      // {path: '*', redirect: '/service/hurdlesType'}
    ]
  },
  {
    path: '/manage', // 设站管理
    component: Main,
    children: [
      /* 站点信息 */
      // 站点列表
      {path: 'sitesList', component: SitesList},
      // 站点详情
      {path: 'sitesListDetail/:id', component: SitesListDetail},
      // 站点修改
      {path: 'sitesListModify/:id', component: SitesListModify},
      // 站点变更
      {path: 'sitesChange', component: SitesChange},
      // 站点变更详情
      {path: 'sitesChangeDetail/:id', component: SitesChangeDetail},
      // 站点资料
      {path: 'sitesInfo', component: SitesInfo},
      // 站点资料详情
      {path: 'sitesInfoDetail/:id', component: SitesInfoDetail},
      // 站点资料修改
      {path: 'sitesInfoModify/:id', component: SitesInfoModify},
      // 奖惩信息
      {path: 'jiangCheng', component: JiangCheng},
      // 站点分组
      {path: 'sitesGroup', component: SitesGroup},
      // 设置分组
      {path: 'stationSetGroup', component: StationSetGroup},
      // 站点分组--详情
      {path: 'sitesGroupDetail/:id', component: SitesGroupDetail},
      // 站点分组--新增
      {path: 'sitesGroupAdd', component: SitesGroupAdd},
      // 站点分组--修改
      {path: 'sitesGroupAdd/:id', component: SitesGroupAdd},
      // 新增奖惩
      {path: 'jiangChengAdd', component: JiangChengAdd},
      // 销售员
      {path: 'sales', component: Sales},
      // 新增销售员
      {path: 'salesAdd', component: SalesAdd},
      // 修改销售员
      {path: 'salesAdd/:id', component: SalesAdd},
      // 销售员详情
      {path: 'salesDetail/:id', component: SalesDetail},
      // 即开票列表
      {path: 'jkpSite', component: JkpSite},
      // 即开票列表--新增
      {path: 'jkpSiteAdd', component: JkpSiteAdd},
      // 即开票列表--修改
      {path: 'jkpSiteAdd/:id', component: JkpSiteAdd},
      // 即开票列表--详情
      {path: 'jkpSiteDetail/:id', component: JkpSiteDetail},
      // 修改奖惩
      {path: 'JiangChengAdd/:id', component: JiangChengAdd},
      // 站点评估
      {path: 'evaluate', component: Evaluate},
      // 站点地理展示
      {path: 'show', component: Show},
      // 站点标识维护
      {path: 'logo', component: Logo},
      // 站点标识新增
      {path: 'logoAdd', component: LogoAdd},
      // 站点标识修改
      {path: 'logoAdd/:id', component: LogoAdd},
      // 站点信息维护
      {path: 'info', component: Info},
      // 站点信息维护--纠偏
      {path: 'infoAdjust/:id', component: InfoAdjust},
      // 环境数据
      {path: 'ambientData', component: AmbientData},
      // 站点分布模型
      {path: 'distributeModel', component: DistributeModel},
      // 区域发展分析
      {path: 'developAnalysis', component: DevelopAnalysis},
      // 经营分析排行
      {path: 'runAnalysis', component: RunAnalysis},
      {path: 'runAnalysisDetail/:areaCode', component: RunAnalysisDetail},
      // 站点权限
      {path: 'siteAuthority', component: SiteAuthority},
      {path: 'siteAuthorityDetail/:id', component: siteAuthorityDetail},
      {path: 'deposit', component: Deposit},
      {path: 'depositRefund', component: DepositRefund},
      {path: 'consignmentManage', component: ConsignmentManage},
      {path: 'bussinessStats', component: BussinessStats}
      // {path: '*', redirect: '/manage/sitesList'}
    ]
  },
  {
    path: '/businessHandle',
    component: Main,
    children: [
      {path: 'sitesBind', component: SitesBind}, // 站点绑定
      {path: 'sitesBindAdd', component: SitesBindAdd}, // 站点绑定
      {path: 'sitesBindAdd/:id', component: SitesBindAdd}, // 站点绑定
      {path: 'areaBindJK', component: AreaBindJK}, // 站点绑定
      {path: 'sites', component: Sites}, // 站点业务
      {path: 'sitesAdd', component: SitesAdd}, // 站点业务
      {path: 'sitesStopBoot', component: SitesStopBoot}, // 站点停开机
      {path: 'resumeSiteStatus', component: ResumeSiteStatus}, // 恢复撤站状态申请
      {path: 'sitesMove', component: SitesMove}, // 站点迁移
      {path: 'clearProof', component: ClearProof}, // 清标申请
      {path: 'k3sale', component: K3sale}, // 快三销售权限管理申请
      {path: 'stationRelexSaleApply', component: StationRelexSaleApply}, // 固定销售限额设置
      {path: 'tempRelexSaleApply', component: TempRelexSaleApply}, // 临时销售限额设置
      {path: 'stationCancelticket', component: StationCancelticket}, // 临时销售限额设置
      {path: 'sitesInfoChange', component: SitesInfoChange}, // 基本资料变更申请
      {path: 'stationChange', component: StationChange}, // 基本资料变更申请
      {path: 'messagePublish', component: MessagePublish}, // 基本资料变更申请
      {path: 'stationResponsorChange', component: StationResponsorChange}, // 基本资料变更申请
      {path: 'stationCancel', component: StationCancel} // 站点撤销申请
    ]
  },
  {
    path: '/dataMaintain',
    component: Main,
    children: [
      {path: 'protectRadius', component: ProtectRadius}, // 保护半径
      {path: 'protectRadiusAdd', component: ProtectRadiusAdd}, // 保护半径
      {path: 'protectRadiusChangeRecord/:id', component: ProtectRadiusChangeRecord}, // 保护半径
      {path: 'zfOnline', component: ZfOnline}, // 中福在线销售厅管理
      {path: 'zfOnlineAdd', component: ZfOnlineAdd}, // 中福在线销售厅管理--新增
      {path: 'zfOnlineAdd/:id', component: ZfOnlineAdd}, // 中福在线销售厅管理--修改
      {path: 'zfOnlineDetail/:id', component: ZfOnlineDetail}, // 中福在线销售厅管理--详情
      {path: 'zfSale', component: ZfSale}, // 中福在线销售厅管理
      {path: 'zfSaleAdd', component: ZfSaleAdd}, // 中福在线销量管理--新增
      {path: 'zfSaleAdd/:id', component: ZfSaleAdd}, // 中福在线销量管理--修改
      {path: 'zfSaleDetail/:id', component: ZfSaleDetail}, // 中福在线销量管理--详情
      {path: 'zfArea', component: ZfArea}, // 中福在线销售厅管理
      {path: 'zfAreaAdd', component: ZfAreaAdd}, // 中福在线区域管理--新增
      {path: 'zfAreaAdd/:id', component: ZfAreaAdd}, // 中福在线区域管理--修改
      {path: 'zfAreaDetail/:id', component: ZfAreaDetail} // 中福在线区域管理--详情
      // {path: '*', redirect: '/dataMaintain/areaSet'}
    ]
  },
  {
    path: '/saleManage', // 销售管理
    component: Main,
    children: [
      {path: 'periodStatement', component: periodStatement}, // 期报表
      {path: 'momentStatement', component: momentStatement}, // 时刻报表
      {path: 'sitesStatus', component: sitesStatus}, // 站状态监控
      {path: 'abnormalCommission', component: abnormalCommission}, // 异常代销费
      {path: 'softwareQuery', component: softwareQuery}, // 软件查询
      {path: 'softwareDetail/:id', component: softwareDetail}, // 软件信息详情
      {path: 'hardwareQuery', component: hardwareQuery}, // 硬件查询
      {path: 'hardwareDetail/:id', component: hardwareDetail}, // 硬件查询
      {path: 'saleTask', component: SaleTask}, // 销量目标
      {path: 'saleTaskAdd', component: SaleTaskAdd}, // 销量目标--新增
      {path: 'saleTaskAdd/:id', component: SaleTaskAdd} // 销量目标--修改
    ]
  },
  {
    path: '/equipment',
    component: Main,
    children: [
      {path: 'eqpInfo', component: EqpInfo}, // 设备信息
      {path: 'eqpInfoAdd', component: EqpInfoAdd}, // 设备信息-新增
      {path: 'eqpInfoAdd/:id', component: EqpInfoAdd}, // 设备信息-修改
      {path: 'eqpInfoDetail/:id', component: EqpInfoDetail}, // 设备信息-查看
      {path: 'eqpModel', component: EqpModel}, // 设备型号
      {path: 'eqpModelAdd', component: EqpModelAdd}, // 设备型号-新增
      {path: 'eqpModelAdd/:id', component: EqpModelAdd}, // 设备型号-修改
      {path: 'eqpModelDetail/:id', component: EqpModelDetail}, // 设备型号-修改
      {path: 'eqpType', component: EqpType}, // 设备类型
      {path: 'eqpTypeAdd', component: EqpTypeAdd}, // 设备类型-新增
      {path: 'eqpTypeAdd/:id', component: EqpTypeAdd} // 设备类型-修改
    ]
  }

]
export default routerArr

