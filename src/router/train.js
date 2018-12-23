import {Main} from './base'

const Test = () => import('@/views/main/test/Test')
// 首页
const TodosList = () => import('@/views/main/train/homePage/workbench/todos/TodosList') // 我的待办
const DoneList = () => import('@/views/main/train/homePage/workbench/done/DoneList') // 我的已办
// 培训管理
const LaunchTrain = () => import('@/views/main/train/train/trainManage/launchTrain/LaunchTrain') // 发起培训
// 课程管理
const CourseTypeList = () => import('@/views/main/train/train/sys/courseType/CourseTypeList') // 课程类型列表
const CourseTypeDetail = () => import('@/views/main/train/train/sys/courseType/CourseTypeDetail') // 课程类型详情
const CourseTypeAdd = () => import('@/views/main/train/train/sys/courseType/CourseTypeAdd') // 课程类型新增
const TagsList = () => import('@/views/main/train/train/sys/tags/TagsList') // 标签列表
const TagsAdd = () => import('@/views/main/train/train/sys/tags/TagsAdd') // 新增标签
const CourseList = () => import('@/views/main/train/train/sys/course/CourseList') // 课程列表
const CourseDetail = () => import('@/views/main/train/train/sys/course/CourseDetail') // 课程详情
const CourseAdd = () => import('@/views/main/train/train/sys/course/CourseAdd') // 课程新增
// 考试管理
const ExamFiles = () => import('@/views/main/train/trainExam/exam/examFiles/ExamFiles') // 考试档案
const ExamItemBankManage = () => import('@/views/main/train/trainExam/exam/examItemBankManage/ExamItemBankManage') // 题库管理
const ExamItemBankAdd = () => import('@/views/main/train/trainExam/exam/examItemBankManage/ExamItemBankAdd') // 题库新增

// 问卷调查
const PublishQuestion = () => import('@/views/main/train/trainSurvey/survey/publishQuestion/PublishQuestion') // 发布问卷
const StatisticAnalysis = () => import('@/views/main/train/trainSurvey/survey/statisticAnalysis/StatisticAnalysis') // 统计分析
const StatisticAnalysisDetail = () => import('@/views/main/train/trainSurvey/survey/statisticAnalysis/StatisticAnalysisDetail') // 统计分析详情
const StatisticAnalysisList = () => import('@/views/main/train/trainSurvey/survey/statisticAnalysis/StatisticAnalysisList') // 统计分析-列表
const StatisticAnalysisListDetail = () => import('@/views/main/train/trainSurvey/survey/statisticAnalysis/StatisticAnalysisListDetail') // 统计分析-列表详情
const ItemBank = () => import('@/views/main/train/trainSurvey/survey/itemBank/ItemBank') // 问卷题库
const ItemBankDetail = () => import('@/views/main/train/trainSurvey/survey/itemBank/ItemBankDetail') // 问卷题库详情
const ItemBankAdd = () => import('@/views/main/train/trainSurvey/survey/itemBank/ItemBankAdd') // 问卷题库新增
// 线下培训管理
const OfflineManage = () => import('@/views/main/train/trainOffline/offline/offlineManage/OfflineManage') // 线下培训管理
const OfflineAdd = () => import('@/views/main/train/trainOffline/offline/offlineManage/OfflineAdd') // 线下培训管理新增
const OfflineDetail = () => import('@/views/main/train/trainOffline/offline/offlineManage/OfflineDetail') // 线下培训管理详情
// 销售员资质
const SalesList = () => import('@/views/main/train/trainSales/sales/salesList/SalesList') // 发布培训通知
// 通知公告
const NoticeList = () => import('@/views/main/train/trainNotice/notice/noticeList/NoticeList') // 通知公告列表
const ReleaseNotice = () => import('@/views/main/train/trainNotice/notice/releaseNotice/ReleaseNotice') // 发布新通知
// 汇总统计
const TrainOnline = () => import('@/views/main/train/trainReport/report/trainOnline/TrainOnline') // 在线培训

let routerArr = [
  // 在线培训系统--首页
  {
    path: '/trainHome',
    name: '培训首页',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'todosList', component: TodosList}, // 我的待办
      {path: 'doneList', component: DoneList}, // 我的已办
      {path: '*', redirect: '/trainHome/test'}
    ]
  },
  // 在线培训系统--培训管理
  {
    path: '/train',
    name: '培训管理',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'launchTrain', component: LaunchTrain}, // 发起培训
      {path: 'courseTypeList', component: CourseTypeList}, // 课程类型列表
      {path: 'courseTypeDetail/:id', component: CourseTypeDetail}, // 课程类型详情
      {path: 'courseTypeAdd', component: CourseTypeAdd}, // 课程类型新增
      {path: 'courseTypeAdd/:id', component: CourseTypeAdd}, // 课程类型修改
      {path: 'tagsList', component: TagsList}, // 标签列表
      {path: 'tagsAdd', component: TagsAdd}, // 新增标签
      {path: 'tagsAdd/:id', component: TagsAdd}, // 标签修改
      {path: 'courseList', component: CourseList}, // 课程列表
      {path: 'courseAdd', component: CourseAdd}, // 新增课程
      {path: 'courseDetail/:id', component: CourseDetail}, // 课程详情
      {path: '*', redirect: '/train/test'}
    ]
  },
  // 在线培训系统--考试管理
  {
    path: '/trainExam',
    name: '考试管理',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'examFiles', component: ExamFiles}, // 考试档案
      {path: 'examItemBankManage', component: ExamItemBankManage}, // 题库管理
      {path: 'examItemBankAdd', component: ExamItemBankAdd}, // 题库新增
      {path: 'examItemBankAdd/:id', component: ExamItemBankAdd}, // 题库修改
      {path: '*', redirect: '/trainExam/test'}
    ]
  },
  // 在线培训系统--线下培训
  {
    path: '/trainOffline',
    name: '线下培训',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'offlineManage', component: OfflineManage}, // 线下培训管理
      {path: 'offlineAdd', component: OfflineAdd}, // 线下培训管理
      {path: 'offlineDetail/:id', component: OfflineDetail}, // 线下培训管理,
      {path: '*', redirect: '/trainOffline/test'}
    ]
  },
  // 在线培训系统--问卷调查
  {
    path: '/trainSurvey',
    name: '问卷调查',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'publishQuestion', component: PublishQuestion}, // 发布问卷
      {path: 'statisticAnalysis', component: StatisticAnalysis}, // 统计分析
      {path: 'statisticAnalysisDetail/:id', component: StatisticAnalysisDetail}, // 统计分析详情
      {path: 'statisticAnalysisList/:id', component: StatisticAnalysisList}, // 统计分析-列表
      {path: 'statisticAnalysisListDetail/:id', component: StatisticAnalysisListDetail}, // 统计分析-列表详情
      {path: 'itemBank', component: ItemBank}, // 问卷题库
      {path: 'itemBankDetail/:id', component: ItemBankDetail}, // 问卷题库详情
      {path: 'itemBankAdd', component: ItemBankAdd}, // 问卷题库新增
      {path: 'itemBankAdd/:id', component: ItemBankAdd}, // 问卷题库修改,
      {path: '*', redirect: '/trainSurvey/test'}
    ]
  },
  // 在线培训系统--销售员资质管理
  {
    path: '/trainSales',
    name: '销售员资质管理',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'salesList', component: SalesList}, // 销售员列表,
      {path: '*', redirect: '/trainSales/test'}
    ]
  },
  // 在线培训系统--通知公告
  {
    path: '/trainNotice',
    name: '通知公告',
    component: Main,
    children: [
      {path: 'ReleaseNotice', component: ReleaseNotice}, // 发布新通知
      {path: 'noticeList', component: NoticeList}, // 通知公告列表
      {path: 'test', component: Test},
      {path: '*', redirect: '/trainNotice/test'}
    ]
  },
  // 在线培训系统--汇总统计
  {
    path: '/trainReport',
    name: '汇总统计',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'trainOnline', component: TrainOnline},
      {path: '*', redirect: '/trainReport/test'}
    ]
  }
]

export default routerArr
