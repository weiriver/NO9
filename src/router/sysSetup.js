import {SysSetup} from './base'

const SystemManage = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/SystemManage') // 系统管理的公共部分
const SystemUserManage = () => import('@/views/sysSetup/sysSetup/sysSetup/userManage/SystemUserManage') // 用户管理
const Decksubsys = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/decksubsys/Decksubsys') // 系统管理-桌面管理-桌面系统管理
const DecksubsysAdd = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/decksubsys/DeckSubsysAdd') // 系统管理-桌面管理-桌面系统管理-新增
const DeckSubsysDetail = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/decksubsys/DecksubsysDetail') // 系统管理-桌面管理-桌面系统管理详情

const Menu = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/menu/Menu') // 菜单管理
const Authorize = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/authorize/Authorize') // 授权管理
const Subsys = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/subsys/Subsys') // 子系统管理
const SubsysAdd = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/subsys/SubsysAdd') // 子系统管理
const Keywords = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/keywords/Keywords') // 可编辑字段

const Versions = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/versions/Versions') // 终端版本管理
const VersionsAdd = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/versions/VersionsAdd') // 终端版本管理
const VersionsDetail = () => import('@/views/sysSetup/sysSetup/sysSetup/sysManage/versions/VersionsDetail') // 终端版本管理
let routerArr = [
  {
    path: '/sysSetup',
    name: '系统设置',
    component: SysSetup,
    children: [
      // 系统管理
      {
        path: 'systemManage',
        component: SystemManage,
        children: [
          {
            path: 'decksubsys',
            component: Decksubsys
          },
          {
            path: 'decksubsysAdd',
            component: DecksubsysAdd
          },
          {
            path: 'decksubsysAdd/:id',
            component: DecksubsysAdd
          },
          {
            path: 'deckSubsysDetail/:id',
            component: DeckSubsysDetail
          },
          {
            path: 'keywords',
            component: Keywords
          },
          {
            path: 'versions',
            component: Versions
          },
          {
            path: 'versionsAdd',
            component: VersionsAdd
          },
          {
            path: 'versionsAdd/:id',
            component: VersionsAdd
          },
          {
            path: 'versionsDetail/:id',
            component: VersionsDetail
          },
          {
            path: 'menu',
            component: Menu
          },
          {
            path: 'authorize',
            component: Authorize
          },
          {
            path: 'subsys',
            component: Subsys
          },
          {
            path: 'subsysAdd',
            component: SubsysAdd
          },
          {
            path: 'subsysAdd/:id',
            component: SubsysAdd
          }
        ]
      },
      // 用户管理
      {
        path: 'systemUserManage',
        component: SystemUserManage
      },
      // {
      //   path: 'inventoryOutManageDetail/:id',
      //   component: InventoryOutManageDetail
      // },
      {path: '*', redirect: '/sysSetup/systemManage/decksubsys'}
    ]
  }
]

export default routerArr

