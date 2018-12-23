<template>
  <div id="app" :class="{full:fullscreenFlag}">
    <router-view/>
  </div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: 'App',
  methods: {
    async getDic() {
      // 获取枚举、数字字典
      var res = await this.postJson('base', {
        apiCode: 200001,
        content: {
          sysModule: 'station',
          enumNames: ['ALL'],
          dictTypes: ['ALL']
        }
      })
      if (res.code == 0) {
        this.SET_ENUM_DIC({
          target: 'station_enumDic',
          content: res.content
        })
        sessionStorage.setItem('station_enumDic', JSON.stringify(res.content))
      }
    },
    rediretPath() {
      return new Promise(resolve => {
        if (window.location.search) {
          const arr = window.location.search.substr('1').split('&')
          const token = arr[0].split('=')[1]
          const uid = arr[1].split('=')[1]
          const to = arr[2].split('=')[1]
          if (location.hostname.includes('localhost')) {
            this.SET_TOKEN(token)
            sessionStorage.setItem('loginInfo', JSON.stringify({token, uid}))
            window.location.href = `http://localhost:8080/#/${to}/`
          } else {
            const loginInfo = JSON.parse(sessionStorage.getItem('login'))
            this.SET_TOKEN(loginInfo.token)
            // let origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
            // let origin = 'http://10.13.0.63:9191'
            if (window.base.includes(77)) {
              window.location.href = `${window.base}:8181/three/#/${to}/`
            } else {
              window.location.href = `${window.base}:9191/three/#/${to}/`
            }
          }
        }
        if (this.$store.state.token) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    setToken() {
      return new Promise(resolve => {
        const loginInfo = JSON.parse(sessionStorage.getItem('login'))
        if (loginInfo) {
          this.SET_TOKEN(loginInfo.token)
          setTimeout(() => {
            resolve(true)
          }, 100)
        } else {
          resolve(false)
        }
      })
    },
    // Vuex
    ...mapMutations({
      SET_ENUM_DIC: 'SET_ENUM_DIC',
      SET_TOKEN: 'SET_TOKEN'
    })
  },
  mounted() {
    this.Event.$on('toggleFullScreen', (val) => {
      console.log(val)
      this.fullscreenFlag = val
    })
    // 生成环境切换成全屏
    if (!location.hostname.includes('localhost')) {
      this.fullscreenFlag = true
    }
  },
  data: function () {
    return {
      fullscreenFlag: false
    }
  },
  async beforeMount() {
    // if (await this.setToken() && await this.rediretPath()) {
    if (await this.setToken()) {
      this.getDic()
    }
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

  @media screen and (min-width: 1024px) {
    #app {
      width: 1024px;
      font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
      color: #606266;
    }
  }

  #app.full {
    width: 100%;
  }


</style>
