<template>

  <div class="nav-body">
    <Menu :default-active="activeNum" class="el-menu-vertical-demo" @select="handleOpen"
          @close="handleClose"
          :unique-opened="true"
          :collapse="isCollapse">

      <Submenu class="nav-submenu" v-for="item in leftNavList" :key="item.id" :index="item.num">
        <template slot="title">
          <i :class="item.icon?item.icon:'el-icon-news'"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <router-link :to="cItem.link" v-for="cItem in item.children" :key="cItem.id">
          <MenuItem class="nav-item" :index="cItem.num">
            {{cItem.name}}
          </MenuItem>
        </router-link>
      </Submenu>

    </Menu>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data() {
    return {
      // 默认激活第一栏
      activeNum: '1-1',
      first_hash: '',
      navList: [],
      leftNavList: [],
      storeIndexLeftNavList: [
        {
          name: '系统首页',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '我的概况', link: '/storeIndex/situation', num: '1-1'}
          ]
        },
        {
          name: '我的工作台',
          num: '2',
          icon: 'el-icon-news',
          children: [
            {name: '我的待办', link: '/storeIndex/todosList', num: '2-1'},
            {name: '我的已办', link: '/storeIndex/doneList', num: '2-2'}
            // {name: '业务申请', link: '/storeIndex/applyList', num: '1-3'},
            // {name: '档案管理', link: '/storeIndex/fileList', num: '1-4'}
          ]
        }
      ],
      // nav_list 仓库管理
      storeLeftNavList: [
        {
          name: '库存查询',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '库存查询', link: '/store/inventoryInquiry', num: '1-1'}
          ]
        },
        {
          name: '入库管理',
          num: '2',
          icon: 'el-icon-news',
          children: [
            {name: '领用入库开单', link: '/store/warehousingBilling', num: '2-1'},
            {name: '采购入库开单', link: '/store/purchaseBilling', num: '2-2'},
            {name: '入库单管理', link: '/store/warehousing', num: '2-3'}
          ]
        },
        {
          name: '出库管理',
          num: '3',
          icon: 'el-icon-news',
          children: [
            // {name: '出库开单', link: '/store/warehouseoutBilling', num: '3-1'},
            {name: '出库单管理', link: '/store/warehouseout', num: '3-1'}
          ]
        },
        {
          name: '盘点管理',
          num: '4',
          icon: 'el-icon-news',
          children: [
            {name: '物品列表', link: '/store/storeCheck', num: '4-1'}
          ]
        },
        {
          name: '调拨管理',
          num: '5',
          icon: 'el-icon-news',
          children: [
            {name: '调拨开单', link: '/store/allocationBilling', num: '5-1'},
            {name: '调拨单管理', link: '/store/allocation', num: '5-2'}
          ]
        },
        {
          name: '损耗管理',
          num: '6',
          icon: 'el-icon-news',
          children: [
            {name: '损耗申请', link: '/store/consumptionBilling', num: '6-1'},
            {name: '损耗单管理', link: '/store/consumption', num: '6-2'}
          ]
        }
      ],
      // nav_list 报表统计
      storeReportLeftNavList: [
        {
          name: '报表统计',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '分布情况汇总', link: '/storeReport/distribute', num: '1-1'},
            {name: '使用情况汇总', link: '/storeReport/used', num: '1-2'},
            {name: '销售环保指数', link: '/storeReport/saleEnvPro', num: '1-3'}
          ]
        }
      ],
      // nav_list 库存设置
      storeSetLeftNavList: [
        {
          name: '仓库设置',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '新增仓库', link: '/storeSet/storeAdd', num: '1-1'},
            {name: '仓库列表', link: '/storeSet/storeList', num: '1-2'}
          ]
        },
        {
          name: '供应商管理',
          num: '2',
          icon: 'el-icon-news',
          children: [
            {name: '新增供应商', link: '/storeSet/supplierAdd', num: '2-1'},
            {name: '供应商列表', link: '/storeSet/supplierList', num: '2-2'}
          ]
        },
        {
          name: '设备设置',
          num: '3',
          icon: 'el-icon-news',
          children: [
            {name: '新增设备', link: '/storeSet/deviceAdd', num: '3-1'},
            {name: '设备列表', link: '/storeSet/deviceList', num: '3-2'}
          ]
        },
        {
          name: '耗材设置',
          num: '4',
          icon: 'el-icon-news',
          children: [
            {name: '新增耗材', link: '/storeSet/consumableAdd', num: '4-1'},
            {name: '耗材列表', link: '/storeSet/consumableList', num: '4-2'}
          ]
        }
      ],
      // nav_list 设备维修系统--首页
      repairHomeLeftNavList: [
        {
          name: '首页',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '站点概况', link: '/repairHome/situation', num: '1-1'}
          ]
        },
        {
          name: '我在工作台',
          num: '2',
          icon: 'el-icon-news',
          children: [
            {name: '我的待办', link: '/repairHome/todosList', num: '2-1'},
            {name: '我的已办', link: '/repairHome/doneList', num: '2-2'}
          ]
        }
      ],
      // nav_list 设备维修系统--维修管理
      repairLeftNavList: [
        {
          name: '维修工单',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '维修工单', link: '/repair/repairOrder', num: '1-1'},
            {name: '设备列表', link: '/repair/RepairDeviceList', num: '1-2'}

          ]
        },
        {
          name: '出入库管理',
          num: '2',
          icon: 'el-icon-news',
          children: [
            {name: '入库单管理', link: '/repair/inventoryInManage', num: '2-1'},
            {name: '出库单管理', link: '/repair/inventoryOutManage', num: '2-2'}
          ]
        }
      ],
      // nav_list 设备维修系统--报表统计
      repairReportLeftNavList: [
        {
          name: '统计情况',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '设备分布情况', link: '/repairReport/eqDistribution', num: '1-1'},
            {name: '维修情况', link: '/repairReport/maintenance', num: '2-1'}
          ]
        }
      ],
      // nav_list 设备维修系统--维护知识库
      repairKnowledgeLeftNavList: [
        {
          name: '维修智库',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '维护知识库', link: '/repairKnowledge/repository', num: '1-1'},
            {name: '待审核知识库', link: '/repairKnowledge/todoRepository', num: '1-2'}
          ]
        }
      ],
      // nav_list 在线培训系统--培训管理
      trainLeftNavList: [
        {
          name: '培训管理',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '发起培训', link: '', num: '1-1'},
            {name: '培训列表', link: '', num: '1-2'},
            {name: '培训知识库', link: '', num: '1-3'},
            {name: '专项培训', link: '', num: '1-4'}
          ]
        },
        {
          name: '系统管理',
          num: '2',
          icon: 'el-icon-news',
          children: [
            {name: '课程类型管理', link: '', num: '2-1'}
          ]
        }
      ],
      // nav_list 在线培训系统--考试管理
      trainExamLeftNavList: [
        {
          name: '考试管理',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '考试档案', link: '', num: '1-1'},
            {name: '题库管理', link: '', num: '1-2'}
          ]
        }
      ],
      // nav_list 在线培训系统--线下培训
      trainOfflineLeftNavList: [
        {
          name: '线下培训',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '发布培训通知', link: '', num: '1-1'},
            {name: '线下培训管理', link: '', num: '1-2'}
          ]
        }
      ],
      // nav_list 在线培训系统--问卷调查
      trainSurveyLeftNavList: [
        {
          name: '问卷调查',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '发布问卷', link: '', num: '1-1'},
            {name: '统计分析', link: '', num: '1-2'},
            {name: '问卷题库', link: '', num: '1-3'}
          ]
        }
      ],
      // nav_list 在线培训系统--销售员资质管理
      trainSalesLeftNavList: [
        {
          name: '销售员管理',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '销售员列表', link: '', num: '1-1'}
          ]
        }
      ],
      // nav_list 在线培训系统--通知公告
      trainNoticeLeftNavList: [
        {
          name: '通知公告',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '发布新通知', link: '', num: '1-1'},
            {name: '通知公告列表', link: '', num: '1-2'}
          ]
        }
      ],
      // nav_list 在线培训系统--汇总统计
      trainReportLeftNavList: [
        {
          name: '汇总统计',
          num: '1',
          icon: 'el-icon-news',
          children: [
            {name: '在线培训', link: '', num: '1-1'}
          ]
        }
      ]
    }
  },
  props: {
    // 列表数组暂不从父组件传进来，如以后有需要再开放该功能
    // leftNavList1: {
    //   type: Array,
    //   default: function () {
    //     return [
    //       {
    //         name: '入库管理',
    //         num: '1',
    //         icon: 'el-icon-location',
    //         children: [
    //           {name: '孩1', link: '', num: '1-1'},
    //           {name: '孩2', link: '', num: '1-2'},
    //           {name: '孩3', link: '', num: '1-3'}
    //         ]
    //       },
    //       {
    //         name: '出库管理',
    //         num: '2',
    //         icon: 'el-icon-setting',
    //         children: [
    //           {name: '孩1', link: '', num: '2-1'},
    //           {name: '孩2', link: '', num: '2-2'},
    //           {name: '孩3', link: '', num: '2-3'}
    //         ]
    //       }
    //     ]
    //   }
    // }
  },
  computed: {
    isCollapse: {
      get: function () {
        return this.$store.state.navIsCollapse
      },
      set: function () {
      }
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
      // this.activeNum = keyPath[1]
      // sessionStorage.setItem('activeNum', this.activeNum)
      // console.log(this.activeNum)
      // }
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    // 动态收缩左侧nav栏
    updateNavIsCollapse() {
      if (document.body.clientWidth < 1000) {
        // 小于1000则收缩
        this.$store.commit('SET_NAVISCOLLAPSE', true)
      } else {
        // 反之不收缩
        this.$store.commit('SET_NAVISCOLLAPSE', false)
      }
    },
    // 路由改变的时候
    routerChange() {
      const routerFirstName = this.$route.path.split('/')[1]
      // 仓库存储系统
      console.log(routerFirstName)
      if (routerFirstName.includes('store')) {
        if (routerFirstName == 'storeIndex') { // 仓库管理
          this.leftNavList = this.navList[0].permissons
          // this.leftNavList = this.storeIndexLeftNavList
        }
        if (routerFirstName == 'store') { // 仓库管理
          this.leftNavList = this.navList[1].permissons
          // this.leftNavList = this.storeLeftNavList
        }
        if (routerFirstName == 'storeReport') { // 报表统计
          this.leftNavList = this.navList[2].permissons
          // this.leftNavList = this.storeReportLeftNavList
        }
        if (routerFirstName == 'storeSet') { // 库存设置
          this.leftNavList = this.navList[3].permissons
          // this.leftNavList = this.storeSetLeftNavList
        }
      }
      // 设备维修系统
      if (routerFirstName.includes('repair')) {
        // 设备维修系统--首页
        if (routerFirstName == 'repairHome') {
          // this.leftNavList = this.repairHomeLeftNavList
        }
        // 设备维修系统--维修管理
        if (routerFirstName == 'repair') {
          this.leftNavList = this.repairLeftNavList
        }
        // 设备维修系统--维修报表
        if (routerFirstName == 'repairReport') {
          this.leftNavList = this.repairReportLeftNavList
        }
        // 设备维修系统--维修知识库
        if (routerFirstName == 'repairKnowledge') {
          this.leftNavList = this.repairKnowledgeLeftNavList
        }
      }
      // 在线培训系统
      if (routerFirstName.includes('train')) {
        // 培训管理
        if (routerFirstName == 'trainHome') {
          this.leftNavList = this.trainLeftNavList
        }
        // 考试管理
        if (routerFirstName == 'train') {
          this.leftNavList = this.trainExamLeftNavList
        }
        // 线下培训
        if (routerFirstName == 'trainOffline') {
          this.leftNavList = this.trainOfflineLeftNavList
        }
        // 问卷调查
        if (routerFirstName == 'trainSurvey') {
          this.leftNavList = this.trainSurveyLeftNavList
        }
        // 销售员资质管理
        if (routerFirstName == 'trainSales') {
          this.leftNavList = this.trainSalesLeftNavList
        }
        // 通知公告
        if (routerFirstName == 'trainNotice') {
          this.leftNavList = this.trainNoticeLeftNavList
        }
        // 汇总统计
        if (routerFirstName == 'trainReport') {
          this.leftNavList = this.trainReportLeftNavList
        }
      }
      // 更新激活的nav栏目
      this.updateNavActiveNum()
    },
    // 更新激活的nav栏目
    updateNavActiveNum() {
      // let oldHash = sessionStorage.getItem('oldHash')
      // console.log(oldHash)
      // let current_hash = window.location.hash.substr(1)
      // console.log(current_hash)
      // if (oldHash && oldHash != current_hash) {
      //   this.activeNum = '1-1'
      //   sessionStorage.setItem('oldHash', current_hash)
      // } else {
      //   this.activeNum = sessionStorage.getItem('activeNum')
      // }
      // if (hash_value.includes('?')) {
      //   let index = hash_value.indexOf('?')
      //   hash_value = hash_value.substr(0, index)
      // }
      let flag = this.leftNavList.find((v, index) => {
        return v.children.find((val, i) => {
          console.log(this.activeNum)
          let hash_value = window.location.hash.substr(1)
          if (val.link == hash_value) {
            this.activeNum = (index + 1) + '-' + (i + 1)
            return val
          }
        })
      })

      if (!flag) {
        this.leftNavList.find((v, index) => {
          v.children.find((val, i) => {
            console.log(this.activeNum)
            let hash_value = window.location.hash.substr(1)
            if (hash_value.includes(val.link)) {
              this.activeNum = (index + 1) + '-' + (i + 1)
            }
          })
        })
      }
    },
    async getNavList() {
      let sysModule = 'storage'
      const routerFirstName = this.$route.path.split('/')[1]
      if (routerFirstName.includes('store')) {
        sysModule = 'storage'
      } else if (routerFirstName.includes('repair')) {
      } else if (routerFirstName.includes('train')) {
      }
      const res = await this.postJson('account', {apiCode: 100002, content: {sysModule}}, 'account')
      if (res.code == 0) {
        this.navList = res.content.systems
        this.leftNavList = this.navList[0].permissons

        let AuthArr = []
        AuthArr = res.content.buttons.map(v => {
          return v.code
        })
        sessionStorage.setItem('Auth', AuthArr)
      }
    }
  },
  watch: {
    '$route': 'routerChange'
  },
  async mounted() {
    // 更新改变nav的收缩状态
    this.updateNavIsCollapse()
    // 窗口改变的时候，动态改变nav的收缩状态
    window.onresize = () => {
      this.updateNavIsCollapse()
    }
    await this.getNavList()
    this.routerChange()
    // sessionStorage.setItem('oldHash', window.location.hash.substr(1))
  }
}
</script>
<style lang="scss">

  // 去掉原来的右侧边框
  .el-menu {
    border: none;
  }

  .el-submenu__title, .el-submenu .nav-item {
    height: 40px;
    line-height: 40px;
  }

  .nav-body {
    border-right: 1px solid $border-color;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
  }

</style>
