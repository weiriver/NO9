<template>
  <div class="container">
    <Header height="50px">
      <MyHeader :navList="topNavList"></MyHeader>
    </Header>
    <Container>
      <Nav :left-nav-list="leftNavList"></Nav>
      <Main>
        <MyBreadcrumb :breadcrumbItemList="breadcrumbItemList"></MyBreadcrumb>
        <router-view class="main-view"></router-view>
      </Main>
    </Container>
  </div>
</template>

<script>
import Nav from '@/components/nav/Nav'
import MyBreadcrumb from '@/components/breadcrumb/Breadcrumb'
import MyHeader from '@/components/header/Header'
import {getBreadcrumbList} from '../../util/util'

export default {
  name: 'Subindex',
  data: function () {
    return {
      newPermissions: [], // 改造期间使用
      msg: '',
      topNavList: [],
      leftNavList: [],
      logoInfo: {},
      activeName: '1-1', // 左侧导航栏的子菜单项目高亮
      breadcrumbItemList: []
    }
  },
  watch: {
    '$route': 'routerChange'
  },
  methods: {
    updateNavList() {
      if (this.leftNavList) {
        var result = getBreadcrumbList(this.leftNavList)
        this.activeName = result.activeName
        this.breadcrumbItemList = result.breadcrumbItemList
        this.Event.$emit('breadActive', this.activeName)
      }
    },
    routerChange() {
      let routerFirstName = this.$route.path.split('/')[1]
      if (routerFirstName !== 'sysSetup') {
        var index = this.topNavList.findIndex(v => {
          console.log(v.link)
          return v.link === routerFirstName
        })
        this.leftNavList = this.topNavList[index].permissons
      }
      this.updateNavList()
    },
    async getNavList() {
      let sysModule = 'storage'
      const routerFirstName = this.$route.path.split('/')[1]
      if (routerFirstName.includes('store')) {
        sysModule = 'storage'
      } else if (routerFirstName.includes('repair')) {
        sysModule = 'repair'
      } else if (routerFirstName.includes('train')) {
        sysModule = 'train'
      } else {
        sysModule = 'station'
      }
      const res = await this.postJson('account', {apiCode: 100002, content: {sysModule}})
      if (res.code == 0) {
        this.topNavList = res.content.systems
        console.log(this.topNavList)
        this.leftNavList = this.topNavList[0].permissons

        let AuthArr = []
        AuthArr = res.content.buttons.map(v => {
          return v.code
        })
        sessionStorage.setItem('Auth', AuthArr)
      }
    }
  },
  async mounted() {
    await this.getNavList()
    this.routerChange()
  },
  components: {Nav, MyBreadcrumb, MyHeader}
}
</script>

<style lang="scss"></style>
