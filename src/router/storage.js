import {Main} from './base'

const Test = () => import('@/views/main/test/Test')
const TestAdd = () => import('@/views/main/test/TestAdd')
// 首页
const Situation = () => import('@/views/main/storage/homePage/sysHome/situation/Situation')

const ApplyList = () => import('@/views/main/storage/homePage/workbench/apply/ApplyList') // 我的申请
const DoneList = () => import('@/views/main/storage/homePage/workbench/done/DoneList') // 我的已办
const DoneDetail = () => import('@/views/main/storage/homePage/workbench/done/DoneDetail') // 已办详情
const TodosList = () => import('@/views/main/storage/homePage/workbench/todos/TodosList') // 我的待办
const TodosListDetail = () => import('@/views/main/storage/homePage/workbench/todos/TodosListDetail') // 我的待办--处理
// const FileList = () => import('@/views/main/storage/homePage/workbench/file/FileList') // 我的档案

const WarehousingDetail = () => import('@/views/main/storage/storeManage/warehousing/warehousing/WarehousingDetail') // 入库管理
const Warehousing = () => import('@/views/main/storage/storeManage/warehousing/warehousing/Warehousing') // 入库详情
const WarehousingBilling = () => import('@/views/main/storage/storeManage/warehousing/warehousing/WarehousingBilling') // 入库开单
const PurchaseBilling = () => import('@/views/main/storage/storeManage/warehousing/warehousing/PurchaseBilling') // 入库开单

const WarehouseoutDetail = () => import('@/views/main/storage/storeManage/warehouseout/warehouseout/WarehouseoutDetail') // 出库详情
const Warehouseout = () => import('@/views/main/storage/storeManage/warehouseout/warehouseout/Warehouseout') // 出库管理
const WarehouseoutBilling = () => import('@/views/main/storage/storeManage/warehouseout/warehouseout/WarehouseoutBilling') // 出库开单

const StoreCheck = () => import('@/views/main/storage/storeManage/storeCheck/storeCheck/StoreCheck') // 盘点管理
const StoreCheckCensus = () => import('@/views/main/storage/storeManage/storeCheck/storeCheck/StoreCheckCensus') // 盘点统计

const allocationDetail = () => import('@/views/main/storage/storeManage/allocation/allocation/AllocationDetail') // 调拨详情
const allocation = () => import('@/views/main/storage/storeManage/allocation/allocation/Allocation') // 调拨管理
const allocationBilling = () => import('@/views/main/storage/storeManage/allocation/allocation/AllocationBilling') // 调拨开单

const consumptionDetail = () => import('@/views/main/storage/storeManage/consumption/consumption/consumptionDetail') // 损耗详情
const consumption = () => import('@/views/main/storage/storeManage/consumption/consumption/consumption') // 损耗管理
const consumptionBilling = () => import('@/views/main/storage/storeManage/consumption/consumption/consumptionBilling') // 损耗开单

const InventoryInquiry = () => import('@/views/main/storage/storeManage/inventoryInquiry/inventoryInquiry/InventoryInquiry') // 库存查询
const InventoryInquiryDetail = () => import('@/views/main/storage/storeManage/inventoryInquiry/inventoryInquiry/InventoryInquiryDetail') // 库存详情
const InventoryInquiryFlow = () => import('@/views/main/storage/storeManage/inventoryInquiry/inventoryInquiry/InventoryInquiryFlow') // 库存详情相关流程

// 报表统计
const Distribute = () => import('@/views/main/storage/storeReport/report/distribute/Distribute') // 分布情况
const Used = () => import('@/views/main/storage/storeReport/report/used/Used') // 使用情况
const SaleEnvPro = () => import('@/views/main/storage/storeReport/report/saleEnvPro/SaleEnvPro') // 使用情况
// 库存设置
const StoreList = () => import('@/views/main/storage/storeSet/storeList/storeList/StoreList') // 仓库列表
const StoreAdd = () => import('@/views/main/storage/storeSet/storeList/storeList/StoreAdd') // 新增仓库

const SupplierList = () => import('@/views/main/storage/storeSet/supplierList/supplierList/SupplierList') // 供应商列表
const SupplierAdd = () => import('@/views/main/storage/storeSet/supplierList/supplierList/SupplierAdd') // 新增供应商
const SupplierDetail = () => import('@/views/main/storage/storeSet/supplierList/supplierList/SupplierDetail') // 供应商详情


const DeviceList = () => import('@/views/main/storage/storeSet/deviceList/deviceList/DeviceList') // 设备列表
const DeviceAdd = () => import('@/views/main/storage/storeSet/deviceList/deviceList/DeviceAdd') // 新增设备
const DeviceDetail = () => import('@/views/main/storage/storeSet/deviceList/deviceList/DeviceDetail') // 设备详情
const DeviceListCv = () => import('@/views/main/storage/storeSet/deviceList/deviceList/DeviceListCv') // 设备列表
const ConsumableList = () => import('@/views/main/storage/storeSet/consumableList/consumableList/ConsumableList') // 耗材列表
const ConsumableAdd = () => import('@/views/main/storage/storeSet/consumableList/consumableList/ConsumableAdd') // 新增耗材
const ConsumableDetail = () => import('@/views/main/storage/storeSet/consumableList/consumableList/ConsumableDetail') // 耗材详情


let routerArr = [
  // 仓储管理系统---首页
  {
    path: '/storeIndex',
    name: '库存首页',
    component: Main,
    children: [
      // {path: 'fileList', component: FileList},
      {path: 'situation', component: Situation},
      {path: 'applyList', component: ApplyList},
      {path: 'doneList', component: DoneList},
      {path: 'doneDetail', component: DoneDetail},
      {path: 'todosList', component: TodosList},
      {path: 'todosListDetail', component: TodosListDetail},
      {path: '*', redirect: '/storeIndex/situation'}
    ]
  },
  // 仓储管理系统---库存管理
  {
    path: '/store',
    name: '库存管理',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'testAdd', component: TestAdd},
      {path: 'inventoryInquiry', component: InventoryInquiry},
      {path: 'warehousingBilling', component: WarehousingBilling},
      {path: 'purchaseBilling', component: PurchaseBilling},
      {path: 'warehousing', component: Warehousing},
      {path: 'warehousingDetail/:id', component: WarehousingDetail},
      {path: 'warehouseoutBilling/:id', component: WarehouseoutBilling},
      {path: 'warehouseout', component: Warehouseout},
      {path: 'warehouseoutDetail/:id', component: WarehouseoutDetail},
      {path: 'storeCheck', component: StoreCheck},
      {path: 'storeCheckCensus', component: StoreCheckCensus},
      {path: 'allocationDetail/:id', component: allocationDetail},
      {path: 'allocation', component: allocation},
      {path: 'allocationBilling', component: allocationBilling},
      {path: 'consumptionDetail/:id', component: consumptionDetail},
      {path: 'consumption', component: consumption},
      {path: 'consumptionBilling', component: consumptionBilling},
      {path: 'InventoryInquiryDetail/:id', component: InventoryInquiryDetail},
      {path: 'inventoryInquiryFlow/:id', component: InventoryInquiryFlow},
      {path: '*', redirect: '/store/inventoryInquiry'}
    ]
  },
  // 仓储管理系统---库存报表
  {
    path: '/storeReport',
    component: Main,
    children: [
      {path: 'distribute', component: Distribute}, // 分布情况
      {path: 'used', component: Used}, // 使用情况
      {path: 'saleEnvPro', component: SaleEnvPro}, // 使用情况,
      {path: '*', redirect: '/storeReport/distribute'}
    ]
  },
  // 仓储管理系统---库存设置
  {
    path: '/storeSet',
    component: Main,
    children: [
      {path: 'test', component: Test},
      {path: 'storeList', component: StoreList},
      {path: 'storeAdd', component: StoreAdd},
      {path: 'storeAdd/:id', component: StoreAdd},
      {path: 'supplierList', component: SupplierList},
      {path: 'supplierAdd/:id', component: SupplierAdd},
      {path: 'supplierDetail/:id', component: SupplierDetail},
      {path: 'supplierAdd', component: SupplierAdd},
      {path: 'deviceList', component: DeviceList},
      {path: 'deviceAdd', component: DeviceAdd},
      {path: 'deviceAdd/:id', component: DeviceAdd},
      {path: 'deviceDetail/:id', component: DeviceDetail},
      {path: 'deviceListCv/:id', component: DeviceListCv},
      {path: 'consumableList', component: ConsumableList},
      {path: 'consumableAdd', component: ConsumableAdd},
      {path: 'consumableAdd/:id', component: ConsumableAdd},
      {path: 'consumableDetail/:id', component: ConsumableDetail},
      {path: '*', redirect: '/storeSet/storeAdd'}
    ]
  }
]

export default routerArr
// export {storeIndexRouter, storeManageRouter, storeReportRouter, storeSetRouter}

