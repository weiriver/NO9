<template>
  <div class="container">
    <Header height="50px">
      <MyHeader :navList="topNavList"></MyHeader>
    </Header>
    <Container>
      <div class="desk-left-nav shortcut-link">
        <router-link v-for="(item, key) in navList" :to="item.link" :key="key">
          <div class="fastFunc">
            <div :class="['imgBox', item.icon]"></div>
            <div class="textBox">
              <P>{{item.name}}</P>
            </div>
          </div>
        </router-link>
      </div>
      <Main class="ml20 mr20">
        <router-view class="main-view desk-main-view"></router-view>
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
        newPermissions: [], // 改造期间使用
        topNavList: [],
        navList: [],
      }
    },
    watch: {
    },
    methods: {
      async getNavList() {
        // JSON.parse(sessionStorage.getItem('login')).permissions 的值，因为会改动数据库，暂时使用固定值
        this.newPermissions = [
          {"name":"系统管理","nameEn":"System Management","num":"1","icon":"systemManage","code":"menu:system",
            "link":"/sysSetup/systemManage/decksubsys","remark":null,
            "children":[
              {"name":"桌面管理","nameEn":"account","num":"1-1","icon":null,"code":"menu:sub:desk",
                "link":null,"remark":null,
                "children":[{"name":"桌面系统管理","nameEn":null,"num":"1-1-1","icon":null,"code":"menu:sub:desk:100031",
                  "link":"/systemManage/decksubsys","remark":null,"children":null},
                  {"name":"授权管理","nameEn":null,"num":"1-1-2","icon":null,"code":"menu:sub:desk:200041",
                    "link":"/systemManage/authorize","remark":null,"children":null},
                  {"name":"菜单管理","nameEn":null,"num":"1-1-3","icon":null,"code":"menu:sub:desk:200045",
                    "link":"/systemManage/menu","remark":null,"children":null}]},
              {"name":"站点管理","nameEn":"station","num":"1-2","icon":null,"code":"menu:sub:sta",
                "link":null,"remark":null,
                "children":[{"name":"子系统管理","nameEn":null,"num":"1-2-1","icon":null,"code":"menu:sub:sta:200021",
                  "link":"/systemManage/subsys","remark":null,"children":null},
                  {"name":"授权管理","nameEn":null,"num":"1-2-2","icon":null,"code":"menu:sub:sta:200041",
                    "link":"/systemManage/authorize","remark":null,"children":null},
                  {"name":"流程可编辑字段","nameEn":null,"num":"1-2-3","icon":null,"code":"menu:sub:sta:200116",
                    "link":"/systemManage/keywords","remark":null,"children":null},
                  {"name":"菜单管理","nameEn":null,"num":"1-2-4","icon":null,"code":"menu:sub:sta:200045",
                    "link":"/systemManage/menu","remark":null,"children":null}]},
              {"name":"信息发布","nameEn":"ids","num":"1-3","icon":null,"code":"menu:sub:ips",
                "link":null,"remark":null,
                "children":[{"name":"子系统管理","nameEn":null,"num":"1-3-1","icon":null,"code":"menu:sub:ips:200021",
                  "link":"/systemManage/subsys","remark":null,"children":null},
                  {"name":"授权管理","nameEn":null,"num":"1-3-2","icon":null,"code":"menu:sub:ips:200041",
                    "link":"/systemManage/authorize","remark":null,"children":null},
                  {"name":"终端版本管理","nameEn":null,"num":"1-3-3","icon":null,"code":"menu:sub:ips:700004",
                    "link":"/systemManage/versions","remark":null,"children":null},
                  {"name":"终端日志管理","nameEn":null,"num":"1-3-4","icon":null,"code":"menu:sub:ips:700009",
                    "link":"/systemManage/log","remark":null,"children":null},
                  {"name":"菜单管理","nameEn":null,"num":"1-3-5","icon":null,"code":"menu:sub:ips:200045",
                    "link":"/systemManage/menu","remark":null,"children":null}]},
              {"name":"巡查管理","nameEn":"inspect","num":"1-4","icon":null,"code":"menu:sub:inspect",
                "link":null,"remark":null,
                "children":[{"name":"子系统管理","nameEn":null,"num":"1-4-1","icon":null,"code":"menu:sub:inspect:200021",
                  "link":"/systemManage/subsys","remark":null,"children":null},
                  {"name":"授权管理","nameEn":null,"num":"1-4-2","icon":null,"code":"menu:sub:inspect:200041",
                    "link":"/systemManage/authorize","remark":null,"children":null},
                  {"name":"菜单管理","nameEn":null,"num":"1-4-3","icon":null,"code":"menu:sub:inspect:200045",
                    "link":"/systemManage/menu","remark":null,"children":null}]}]},
          {"name":"用户管理","nameEn":"User Management","num":"2","icon":"systemUserManage","code":"100041",
            "link":"/sysSetup/systemUserManage","remark":null,"children":null},
          {"name":"角色管理","nameEn":"Role Management","num":"3","icon":"roles","code":"200011",
            "link":"/roles","remark":null,"children":null},
          {"name":"部门管理","nameEn":"Dept Management","num":"4","icon":"departmentManage","code":"100017",
            "link":"/departmentManage","remark":null,"children":null},
          {"name":"区域管理","nameEn":"Regional Management","num":"5","icon":"areaManage","code":"100027",
            "link":"/areaManage","remark":null,"children":null},
          {"name":"数据字典","nameEn":"Data Dictionary","num":"6","icon":"dataDic","code":"200031",
            "link":"/dataDic","remark":null,"children":null},
          {"name":"附件管理","nameEn":"Attachment management","num":"7","icon":"attachment","code":"200071",
            "link":"/attachment","remark":null,"children":null},
          {"name":"提醒管理","nameEn":"Notice Management","num":"8","icon":"notice","code":"200080",
            "link":"/notice","remark":null,"children":null},
          {"name":"印章管理","nameEn":"Seal Management","num":"9","icon":"stamp","code":"100056",
            "link":"/stamp","remark":null,"children":null},
          {"name":"流程管理","nameEn":"Process Management","num":"10","icon":"process","code":"200052",
            "link":"/process","remark":null,"children":null},
          {"name":"用户反馈","nameEn":"User FeedBack","num":"11","icon":"feedback","code":"200131",
            "link":"/feedback","remark":null,"children":null},
          {"name":"APK 版本管理","nameEn":"APK Management","num":"12","icon":"apk","code":"200101",
            "link":"/apk","remark":null,"children":null}]

        this.topNavList = []
        // this.leftNavList = JSON.parse(sessionStorage.getItem('login')).permissions
        this.navList = []
        this.newPermissions.forEach((val) => {
          this.navList.push({
            name: val.name,
            nameE: val.nameEn,
            link: val.link ? val.link : '/',
            icon: val.icon
          })
        })
        }

    },
    async mounted() {
      await this.getNavList()
    },
    components: {MyHeader}
  }
</script>

<style lang="scss">
  .desk-left-nav {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 172px;
    flex-shrink: 0;
    overflow: auto;
    padding: 0 0 20px 10px;
    justify-content: flex-start;
    border-right: 2px solid #ebecee;
    & > a {
      flex: 1;
      display: block;
      width: 100%;
    }
    /*每一个快捷功能盒子*/
    .fastFunc {
      margin: 8px 0px;
      width: 100%;
      /*height: 65px;*/
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .imgBox {
        width: 35px;
        height: 35px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .textBox {
        flex: 1;
        text-align: left;
        p {
          font-size: 14px;
          line-height: 38px;
          color: #36474F;
          padding-left: 10px;
          font-weight: 600;
          margin: 0;
        }
      }
    }

    .fastFunc:hover {
      background: #eaf7ff;
    }

    a {
      .imgBox.notice {
        background: url("../../assets/img/desk/notice.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.departmentManage {
        background: url("../../assets/img/desk/departmentManage.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.systemUserManage {
        background: url("../../assets/img/desk/systemUserManage.png") no-repeat !important;
        background-size: 100% 100% !important;
      }
      .imgBox.areaManage {
        background: url("../../assets/img/desk/areaManage.png") no-repeat !important;
        background-size: 100% 100% !important;
      }
      .imgBox.systemManage {
        background: url("../../assets/img/desk/systemManage.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.feedback {
        background: url("../../assets/img/desk/feedback.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.stamp {
        background: url("../../assets/img/desk/stamp.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.apk {
        background: url("../../assets/img/desk/apk.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.attachment {
        background: url("../../assets/img/desk/attachment.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.roles {
        background: url("../../assets/img/desk/roles.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.dataDic {
        background: url("../../assets/img/desk/dataDic.png") no-repeat;
        background-size: 100% 100%;
      }
      .imgBox.process {
        background: url("../../assets/img/desk/process.png") no-repeat;
        background-size: 100% 100%;
      }
    }

  }
  .desk-main-view {
    margin-top: 10px;
  }

</style>
