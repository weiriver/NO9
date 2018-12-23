<template>
  <div class="top">
    <div class="topLogo" v-if="sysInfo.to">
      <!--左侧logo位置处的文字-->
      <router-link :to="sysInfo.to" style="min-width: 156px;">
        <img src="./logo.png" style="transform: translateY(7px); margin-right: 5px;"/>
        {{sysInfo.name}}
      </router-link>
      <!--<a :href="sysInfo.to">{{ sysInfo.name}}</a>-->
      <!--Tags按钮-->
      <div class="topLinkBox" v-if="navList.length>0">
        <router-link
           v-for="item in navList"
           :key="item.id"
           :to="item.permissons[0].children[0].link"
           :class="{'active':mainRouterName==item.link.split('/')[1]}"
        >
          {{item.nameX}}
        </router-link>
        <span @click="toggleFullScreen" style="color: transparent">全屏</span>
      </div>
    </div>

    <!--右侧用户信息和退出等信息-->
    <div class="topRight">
      <UserOperation module="station"></UserOperation>
    </div>
  </div>
</template>

<script>
import UserOperation from '@/components/system/UserOperation'

export default {
  name: 'Header',
  data() {
    return {
      fullscreen: false
    }
  },
  props: {
    // LOGO位置的信息
    sysInfo: {
      type: Object,
      default: function () {
        return {
          to: '/desktop/',
          name: '河南福彩运营管理系统'
        }
      }
    },
    // 头部导航栏数组
    navList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    // '$route': 'routerChange'
  },
  computed: {
    mainRouterName() {
      return this.$route.path.split('/')[1]
    }
  },
  methods: {
    // 开发使用,上生成环境要去掉
    toggleFullScreen() {
      this.fullscreen = !this.fullscreen
      this.Event.$emit('toggleFullScreen', this.fullscreen)
    }
  },
  mounted() {
  },
  components: {UserOperation}
}
</script>

<style lang="scss" scoped>
  .top { // 头部样式
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding: 0 0px 0 10px;
    background: $main-color;
    // background: #2d8cf0;
    overflow: hidden;
    .topLogo {
      float: left;
      height: 50px;
      a {
        font-size: 24px;
        color: #fff;
        line-height: 50px;
        display: inline-block;
        vertical-align: top;
      }
      .topLinkBox {
        display: inline-block;
        height: 100%;
        margin-left: 25px;
        overflow: hidden;
        vertical-align: middle;
        a {
          font-size: 16px;
          margin-top: 2px;
          line-height: 40px;
          // line-height: 46px;
          display: inline-block;
          //border-bottom: 4px solid #fff;
          /*width: 92px;*/
          padding: 0 8px;
          text-align: center;
        }
        a.active, a.router-link-active {
          // border-bottom: 4px solid #fff;
          color: $active-color;
          border-bottom: 1px solid $active-color;
        }
        a:hover {
          // border-bottom: 4px solid #fff;
          color: $active-color;
          border-bottom: 1px solid $active-color;
        }
      }
    }
    .topRight {
    }
  }
</style>
