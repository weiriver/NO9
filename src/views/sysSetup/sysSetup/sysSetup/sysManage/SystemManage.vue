<template>
  <div>
    <Tabs type="card" @tab-click="systemChange" v-model="sysName">
      <TabPane :label="item.name" :name="item.nameEn" v-for="(item, key) in navList" :key="key">
        <Tabs @tab-click="sysNavLink" v-model="sysMenuName">
          <TabPane :label="item1.name" :name="item1.link?item1.link.split('/')[2]:'/'"
                   v-for="(item1, key1) in item.children" :key="key1">
            <div>
            </div>
          </TabPane>
        </Tabs>
      </TabPane>
      <router-view class="sysMView"></router-view>
    </Tabs>

  </div>
</template>

<script>
  export default {
    name: 'sysManage',
    data() {
      return {
        sysName: '',
        sysMenuName: '', // 第二级tab的头部导航，对应的是哪个name选中
        navList: [], // tabs导航的树形结构数据
      }
    },
    methods: {
      // 改变system
      systemChange(item) {
        console.log('上一行系统name', item.name)
        if (item.name === 'account') {
          // 桌面管理的第一个是桌面系统管理
          this.sysMenuName = 'decksubsys'
          this.$router.push('/sysSetup/systemManage/decksubsys')
        } else {
          // 其他系统的第一个是子系统管理
          this.sysMenuName = ''
          this.sysMenuName = 'subsys'
          this.$router.push('/sysSetup/systemManage/subsys')
        }
        this.$store.commit('SET_SYSNAME', item.name)
        sessionStorage.setItem('sysName', item.name)
        sessionStorage.setItem('sysMenuName', this.sysMenuName)
      },
      // 跳到table页， 注意name的命名标准
      sysNavLink(item) {
        console.log('下一行菜单name', item.name)
        sessionStorage.setItem('sysMenuName', item.name)
        this.$router.push('/sysSetup/systemManage/' + item.name)
      },
      // 请求
      getData() {
        let sessionLogin = JSON.parse(sessionStorage.getItem('login'))
        // 之后把菜单管理里面系统管理的前端路由部分改成/sysSetup/systemManage/decksubsys
        // sessionLogin.permissions.forEach((val) => {
        //   if (val.link === '/sysSetup/systemManage/decksubsys') {
        //     this.navList = val.children
        //   }
        // })
        // 未改菜单管理之前的代码
        this.navList = sessionLogin.permissions[0].children
        // console.log(this.navList)
      }
    },
    mounted () {
      this.sysName = sessionStorage.getItem('sysName') ? sessionStorage.getItem('sysName') : 'account'
      this.sysMenuName = sessionStorage.getItem('sysMenuName') ? sessionStorage.getItem('sysMenuName') : 'decksubsys'
      console.log('页面进来', this.sysName, this.sysMenuName)
      this.getData()
    },
    beforeMount() {
    }
  }
</script>

<style scoped>

</style>