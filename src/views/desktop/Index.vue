<template>
  <div class="container">
    <Header height="50px">
      <MyHeader :sysInfo="logoInfo" :navList="topNavList"></MyHeader>
    </Header>
    <Container>
      <Main>
        <div class="desktop-main">
          <!--<div>
            <div @click="toSys('/index')">站点管理系统</div>
          </div>
          <div>
            <div @click="toSys('/storeIndex/situation')">仓储管理系统</div>
          </div>
          <div>
            <div @click="toSys('/repair/repairOrder/')">设备维修系统</div>
          </div>
          <div>
            <div @click="toSys('/train/test')">在线培训系统</div>
          </div>-->
          <div class="sys-link-wrap">
            <div class="sys-links" v-for="(item1,index) in sysList" :key="index">
              <div class="sys-link-item" v-for="(item, inner_index) in item1" :key="inner_index">
                <div class="item-wrap pointer"
                     @click="linkEvent(item.sysModule.value, item.accessUrl, item.link, item.typeX.value)">
                  <div class="sys-link-left">
                    <img :src="item.iconShowUrl" class="pointer"/>
                  </div>
                  <div class="sys-link-right">
                    <div class="title"> {{item.nameX}}</div>
                    <div class="msg">
                      <div class="cardBottom orange" v-if="item.num > 0">
                        <Icon type="alert-circled"/>
                        <a @click="jumpToTodo(item.sysModule.value, item.hasPermission, item.hasWaitPermission)">
                          {{item.num}}项待办任务
                        </a>
                        <Icon class="iconfont" type="ios-arrow-forward"/>
                      </div>
                      <div class="cardBottom green" v-else>
                        <Icon type="ios-checkmark" color="success"/>
                        <span>暂无消息！</span>
                        <Icon class="iconfont" type="ios-arrow-forward"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <router-view class="main-view"></router-view>
      </Main>
    </Container>
  </div>
</template>

<script>
import MyHeader from '@/components/header/Header'

export default {
  name: 'Subindex',
  data: function () {
    return {
      msg: '',
      topNavList: [],
      leftNavList: [],
      logoInfo: {
        to: '/desktop',
        name: '新疆福彩运营管理系统'
      }
    }
  },
  methods: {
    toSys(path) {
      this.$router.push(path)
    },
    // 进入子系统的判断，sys-系统 url-http://10.13.0.129:10400   link前端跳转-./stationManage.html  typex-系统类型 内部系统-system 外部系统exterior 内部服务 service
    linkEvent(sys, url, link, typeX) {
      if (sys === 'dss') {
        // 子系统登录，统计分析系统登录的请求
        this.postJsonDss({
          sysModule: sys
        }, url).then(res => {
          if (res.code === '0') {
            location.href = link
          }
        })
      } else {
        if (typeX === 'exterior') {
          console.log('外部')
          location.href = link
        } else {
          this.postJson('account', {
            apiCode: 100002,
            content: {
              sysModule: sys
            }
          }).then(res => {
            if (res.code === '0') {
              // if (window.location.href.includes('localhost') && link.includes('three')) {
              //   let loginInfo = JSON.parse(sessionStorage.getItem('login'))
              //   // 生成和开发跳转兼容处理(新疆兼容时使用)
              //   window.open(`http://localhost:8080?token=${loginInfo.token}&uid=${loginInfo.uid}&to=${link.replace('./three/#/', '')}`, '_self')
              // } else {
              if (sys == 'station') {
                this.$router.push('/index')
              }
              // location.href = link
              // }
            }
          })
        }
      }
    },
    // 初始化数据，1、子系统入口数据；2右边快捷功能列表
    async getData() {
      let sessionLogin = JSON.parse(sessionStorage.getItem('login'))
      let dataList = sessionLogin.subSystems
      for (let i = dataList.length - 1; i >= 0; i--) {
        this.$set(dataList[i], 'num', 0)
        // 假如是服务系统，就把它过滤删除掉
        if (dataList[i].typeX.value === 'service') {
          dataList.splice(i, 1)
        }
      }
      // 定义一个方法，把数组处理成每三个位一组
      let splitArr = function (arr, len) {
        let alen = arr.length
        let result = []
        for (let i = 0; i < alen; i += len) {
          result.push(arr.slice(i, i + len))
        }
        return result
      }
      this.sysList = splitArr(dataList, 3)
      this.sysList.forEach((val) => {
        val.forEach((val1) => {
          this.$set(val1, 'num', 0)
        })
      })
      this.getTodoNum()
      // // 左边快捷功能数据
      this.navList = []
      console.log(sessionLogin)
      sessionLogin.permissions.forEach((val) => {
        this.navList.push({
          name: val.name,
          nameE: val.nameEn,
          link: val.link ? val.link : '/',
          icon: val.icon
        })
      })
      console.log(this.navList)
      let AuthArr = []
      AuthArr = sessionLogin.buttons.map(v => {
        return v.code
      })
      sessionStorage.setItem('Auth', AuthArr)
    },
    // 各子系统图标下方的待办数量请求
    getTodoNum() {
      this.postJson('common', {
        apiCode: 200004,
        content: {}
      }).then(res => {
        if (res.code === '0') {
          this.sysList.forEach((val) => {
            val.forEach((val1) => {
              res.content.waitCountList.forEach((val2) => {
                if (val2.sysModule === val1.sysModule.value) {
                  this.$set(val1, 'num', val2.waitCount)
                }
              })
            })
          })
        }
      })
    }
  },
  async mounted() {
  },
  beforeMount() {
    this.getData()
    // this.fixPageReflash()
  },
  components: {MyHeader}
}
</script>

<style lang="scss">
  .desktop-main {
    flex: 1;
    display: flex;
    min-width: 1000px;
    width: 68%;
    margin: auto;
    flex-direction: column;
    .sys-link-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      .sys-links {
        margin-top: 10%;
        display: flex;
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        .sys-link-item {
          min-width: 33%;
          -ms-flex-align: center;
          align-items: center;
          display: -ms-flexbox;
          display: flex;
          height: 84px;
          justify-content: center;
          .item-wrap {
            background: white;
            display: -ms-flexbox;
            display: flex;
            max-width: 246px;
            border-radius: 4px;
            border: 1px solid #eef3f6;
            overflow: hidden;
            .sys-link-left {
              width: 67px;
              height: 84px;
              background: #FE8D6F;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 50px;
                height: 50px;
              }
            }
            .sys-link-right {
              background: white;
              height: 100%;
              width: 180px;
              .title {
                margin-top: 10px;
                text-align: center;
                height: 42px;
                font-size: 24px;
                font-family: 汉仪综艺体简;
                font-weight: 400;
                line-height: 40px;
                color: rgba(54, 71, 79, 1);
                opacity: 1;
              }
              .msg {
                padding-right: 10px;
                font-size: 14px;
                font-family: Segoe UI;
                font-weight: 400;
                color: #36474f;
                opacity: 1;
                line-height: 64px;
                text-align: left;
                text-indent: 10px;
                .cardBottom {
                  text-align: left;
                  line-height: 30px;
                  font-size: 14px;
                  position: relative;
                  .iconfont {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #36474F;
                  }
                  a {
                    color: #ff9800;
                  }
                  &.orange {
                    color: #ff9800;
                  }
                  &.green {
                    color: #12c36b;
                  }
                }
              }
            }
          }
        }
      }
    }
    .sys-links:nth-of-type(1) {
      .sys-link-item:nth-of-type(2) .item-wrap .sys-link-left {
        background: #F8B444;
      }
      .sys-link-item:nth-of-type(3) .item-wrap .sys-link-left {
        background: #3DC5CE;
      }
    }
    .sys-links:nth-of-type(2) {
      .sys-link-item:nth-of-type(1) .item-wrap .sys-link-left {
        background: #02ACEB;
      }
      .sys-link-item:nth-of-type(2) .item-wrap .sys-link-left {
        background: #7D78B5;
      }
      .sys-link-item:nth-of-type(3) .item-wrap .sys-link-left {
        background: #84C76C;
      }
    }
    /*.shortcut-link {*/
    /*height: 136px;*/
    /*display: flex;*/
    /*justify-content: center;*/
    /*align-items: center;*/
    /*!*每一个快捷功能盒子*!*/
    /*.fastFunc {*/
    /*margin: 0 4px;*/
    /*width: 70px;*/
    /*!*height: 65px;*!*/
    /*cursor: pointer;*/
    /*display: flex;*/
    /*flex-direction: column;*/
    /*justify-content: center;*/
    /*align-items: center;*/
    /*.imgBox {*/
    /*width: 35px;*/
    /*height: 35px;*/
    /*img {*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*}*/
    /*}*/
    /*.textBox {*/
    /*p {*/
    /*font-size: 13px;*/
    /*line-height: 38px;*/
    /*color: #36474F;*/
    /*}*/
    /*}*/
    /*}*/
    /*.fastFunc:hover {*/
    /*background: #eaf7ff;*/
    /*}*/
    /*a {*/
    /*.imgBox.notice {*/
    /*background: url("../../assets/img/desk/notice.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.departmentManage {*/
    /*background: url("../../assets/img/desk/departmentManage.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.systemUserManage {*/
    /*background: url("../../assets/img/desk/systemUserManage.png") no-repeat !important;*/
    /*background-size: 100% 100% !important;*/
    /*}*/
    /*.imgBox.areaManage {*/
    /*background: url("../../assets/img/desk/areaManage.png") no-repeat !important;*/
    /*background-size: 100% 100% !important;*/
    /*}*/
    /*.imgBox.systemManage {*/
    /*background: url("../../assets/img/desk/systemManage.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.feedback {*/
    /*background: url("../../assets/img/desk/feedback.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.stamp {*/
    /*background: url("../../assets/img/desk/stamp.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.apk {*/
    /*background: url("../../assets/img/desk/apk.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.attachment {*/
    /*background: url("../../assets/img/desk/attachment.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.roles {*/
    /*background: url("../../assets/img/desk/roles.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.dataDic {*/
    /*background: url("../../assets/img/desk/dataDic.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*.imgBox.process {*/
    /*background: url("../../assets/img/desk/process.png") no-repeat;*/
    /*background-size: 100% 100%;*/
    /*}*/
    /*}*/
    /*}*/
  }
</style>
