import {Main} from './base'


// const Test = () => import('@/views/main/test/Test')
const Repository = () => import('@/views/main/repair/repository/repository/repository/Repository') // 知识库
const RepositoryDetail = () => import('@/views/main/repair/repository/repository/repository/RepositoryDetail') // 知识库常见问题--详情
const TodoRepository = () => import('@/views/main/repair/repository/repository/todoRepository/TodoRepository') // 待审核知识库--列表
const TodoRepositoryAdd = () => import('@/views/main/repair/repository/repository/todoRepository/TodoRepositoryAdd') // 待审核知识库--修改
const TodoRepositoryDetail = () => import('@/views/main/repair/repository/repository/todoRepository/TodoRepositoryDetail') // 待审核知识库--详情
const TodoSolutionAdd = () => import('@/views/main/repair/repository/repository/todoRepository/TodoSolutionAdd') // 待审核常见问题解决方法--修改

// 首页
// const Situation = () => import('@/views/main/repair/homePage/sysHome/situation/Situation') // 入库管理
// const DoneList = () => import('@/views/main/repair/homePage/workbench/done/DoneList') //
// const TodosList = () => import('@/views/main/repair/homePage/workbench/todos/TodosList') //

// 维修管理
// 维修工单
const RepairOrder = () => import('@/views/main/repair/repairManage/repairOrder/repairOrder/RepairOrder') //  维修工单
const RepairOrderDetail = () => import('@/views/main/repair/repairManage/repairOrder/repairOrder/RepairOrderDetail') //  维修工单

// 设备列表
const RepairDeviceList = () => import('@/views/main/repair/repairManage/repairOrder/repairDeviceList/RepairDeviceList') //  设备列表
const RepairDeviceListDetail = () => import('@/views/main/repair/repairManage/repairOrder/repairDeviceList/RepairDeviceListDetail') //  设备详情
const RepairDeviceListCv = () => import('@/views/main/repair/repairManage/repairOrder/repairDeviceList/RepairDeviceListCv') //  设备履历

const InventoryInManage = () => import('@/views/main/repair/repairManage/inventoryManage/inventoryInManage/InventoryInManage') // 入库单管理
const InventoryInManageDetail = () => import('@/views/main/repair/repairManage/inventoryManage/inventoryInManage/InventoryInManageDetail') // 入库单详情
const InventoryOutManage = () => import('@/views/main/repair/repairManage/inventoryManage/inventoryOutManage/InventoryOutManage') // 出库单管理
const InventoryOutManageDetail = () => import('@/views/main/repair/repairManage/inventoryManage/inventoryOutManage/InventoryOutManageDetail') // 出库单详情


// 报表统计
const EqDistribution = () => import('@/views/main/repair/repairReport/statistics/eqDistribution/EqDistribution') //  设备分布情况

const Maintenance = () => import('@/views/main/repair/repairReport/statistics/maintenance/Maintenance') //  维修情况

let routerArr = [
  {
    path: '/repair',
    name: '维修管理',
    component: Main,
    children: [
      {
        path: 'test',
        component: InventoryInManage
      },
      {
        path: 'inventoryInManage',
        component: InventoryInManage
      },
      {
        path: 'inventoryInManageDetail',
        component: InventoryInManageDetail
      },
      {
        path: 'inventoryInManageDetail/:id',
        component: InventoryInManageDetail
      },
      {
        path: 'repairOrder',
        component: RepairOrder
      },
      {
        path: 'repairOrderDetail/:id',
        component: RepairOrderDetail
      },
      {
        path: 'repairDeviceList',
        component: RepairDeviceList
      },
      {
        path: 'repairDeviceListDetail/:id',
        component: RepairDeviceListDetail
      },
      {
        path: 'repairDeviceListCv/:id',
        component: RepairDeviceListCv
      },
      {
        path: 'inventoryOutManage',
        component: InventoryOutManage
      },
      {
        path: 'inventoryOutManageDetail',
        component: InventoryOutManageDetail
      },
      {
        path: 'inventoryOutManageDetail/:id',
        component: InventoryOutManageDetail
      },
      {path: '*', redirect: '/repair/inventoryInManage'}
    ]
  },
  // 设备维修系统--报表统计
  {
    path: '/repairReport',
    name: '报表统计',
    component: Main,
    children: [
      {
        path: 'eqDistribution',
        component: EqDistribution
      },
      {
        path: 'maintenance',
        component: Maintenance
      },
      {path: '*', redirect: '/repairReport/eqDistribution'}
    ]
  },
  // 设备维修系统--维护知识库
  {
    path: '/repairKnowledge',
    name: '维护知识库',
    component: Main,
    children: [
      {path: 'repository', component: Repository}, // 知识库
      {path: 'repositoryDetail/:id', component: RepositoryDetail}, // 知识库常见问题--详情
      {path: 'todoRepository', component: TodoRepository}, // 待审核知识库--列表
      {path: 'todoRepositoryAdd/:id', component: TodoRepositoryAdd}, // 待审核知识库--修改
      {path: 'todoRepositoryDetail/:id', component: TodoRepositoryDetail}, // 待审核知识库--查看
      {path: 'todoSolutionAdd/:id', component: TodoSolutionAdd}, // 待审核常见问题解决方法--修改,
      {path: '*', redirect: '/repair/repository'}
    ]
  }
]

export default routerArr

