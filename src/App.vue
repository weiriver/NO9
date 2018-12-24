<template>
  <div id="app" :class="{full:fullscreenFlag}">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  methods: {},
  mounted() {
  },
  data: function () {
    return {
      fullscreenFlag: false
    }
  },
  async beforeMount() {
  }
}
</script>

<style lang="scss">
  #app {
    height: 100%;
    width: 100%;
    margin: 0 auto;
    min-width: 1024px;
  }

  /*@media screen and (min-width: 1024px) {*/
  /*#app {*/
  /*width: 1024px;*/
  /*font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;*/
  /*color: #606266;*/
  /*}*/
  /*}*/

  /*#app.full {*/
  /*width: 100%;*/
  /*}*/


</style>
