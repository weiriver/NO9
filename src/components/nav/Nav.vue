<template>
  <div class="nav-body">
    <Menu class="el-menu-vertical-demo"
          :unique-opened="true"
          :collapse="isCollapse1"
          :default-active="activeName"
          background-color="#012139"
          text-color="#fff"
          active-text-color="#F5A624">
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
<script>
export default {
  data() {
    return {
      isCollapse1: false,
      activeName: '4-1' // 左侧导航栏的子菜单项目高亮
    }
  },
  props: {
    // 列表数组暂不从父组件传进来，如以后有需要再开放该功能
    leftNavList: {
      type: Array,
      default: function () {
        return []
      }
    }
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
    // 动态收缩左侧nav栏
    updateNavIsCollapse() {
      if (document.body.clientWidth < 1000) {
        // 小于1000则收缩
        this.$store.commit('SET_NAVISCOLLAPSE', true)
      } else {
        // 反之不收缩
        this.$store.commit('SET_NAVISCOLLAPSE', false)
      }
    }
  },
  watch: {
  },
  async mounted() {
    // 更新改变nav的收缩状态
    this.updateNavIsCollapse()
    // 窗口改变的时候，动态改变nav的收缩状态
    window.onresize = () => {
      this.updateNavIsCollapse()
    }
    this.Event.$on('breadActive', (activeName) => {
      this.activeName = activeName
    })
  }
}
</script>
<style lang="scss">

  // 去掉原来的右侧边框
  .el-menu {
    border: none;
  }

  .el-menu-item.is-active {
    background: $active-bg-color !important;
    border-left: 3px solid $active-color;
  }

  .el-submenu__title, .el-submenu .nav-item {
    height: 40px;
    line-height: 40px;
  }

  .el-submenu.is-active .el-submenu__title {
    background: $active-bg-color !important;
    color: $active-color !important;
    i {
      color: $active-color !important;
    }
  }

  .nav-body {
    border-right: 1px solid $border-color;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
  }

</style>
