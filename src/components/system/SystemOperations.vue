<template>
  <div>
    <Popover placement="bottom"
             width="60"
             trigger="hover"
             class="pointer"
             content="">
      <div slot="reference" class="user">
        <img src="./img/user.png" class="user-img"/>
        <!-- 只有在桌面的时候才显示名称 -->
        <span class="user-name" v-if="showUserName" :title="userName">{{userName}}</span>
      </div>
      <div style="text-align: center">
        <div @click="gotoDestop" class="popover-line pointer">返回桌面</div>
        <div @click="modifyPassWord" class="popover-line pointer">修改密码</div>
        <div @click="logout" class="popover-line pointer">退出</div>
      </div>
    </Popover>
    <!--修改密码--弹窗-->
    <Dialog title="修改密码" :visible.sync="modifyPasswordDialogVisible" width="45%">

      <Form :model="Obj" :rules="rules" ref="Obj" label-width="120px">
        <FormItem label="原密码" prop="oldPassword">
          <Input v-model="Obj.oldPassword" type="password"></Input>
        </FormItem>
        <FormItem label="新密码" prop="newPassword">
          <Input v-model="Obj.newPassword" type="password"></Input>
        </FormItem>
        <FormItem label="重复密码" prop="repPSW">
          <Input v-model="Obj.repPSW" type="password"></Input>
        </FormItem>

      </Form>

      <div slot="footer" class="dialog-footer">
        <Button @click="modifyPasswordDialogVisible = false">取 消</Button>
        <Button type="primary" @click="sumbit">确 定</Button>
      </div>
    </Dialog>
  </div>
</template>
<script>

export default {
  name: 'system',
  components: {},
  data() {
    var checkPSW = (rule, value, callback) => {
      if (value !== this.Obj.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      Obj: {},
      modifyPasswordDialogVisible: false,
      rules: {
        oldPassword: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, message: '最少6个字字符', trigger: 'blur'}
        ],
        repPSW: [
          {required: true, message: '请重复新密码', trigger: 'blur'},
          {validator: checkPSW, trigger: 'blur'}
        ]
      },
      showUserName: true
    }
  },
  watch: {
    $route: 'routerChange'
  },
  computed: {
    userName() {
      return JSON.parse(sessionStorage.getItem('login')).nameX
    }
  },
  methods: {
    gotoDestop() {
      if (location.hostname.includes('localhost')) {
        window.open('http://localhost:8081/#/', '_self')
      } else {
        // window.open(`${location.origin}/#/`, '_self')
        if (window.base.includes('77')) {
          window.open(`${window.base}:8181/#/`, '_self')
        } else {
          window.open(`${window.base}:9191/#/`, '_self')
        }
      }
    },
    modifyPassWord() {
      this.modifyPasswordDialogVisible = true
    },
    // 修改密码提交
    async sumbit() {
      this.$refs['Obj'].validate(async (valid) => {
        if (valid) {
          // import Md5 from 'md5'
          let Md5 = require('md5')
          let obj = JSON.parse(JSON.stringify(this.Obj))
          obj.oldPassword = Md5(this.Obj.oldPassword)
          obj.newPassword = Md5(this.Obj.newPassword)
          delete obj.repPSW
          const res = await this.postJson('account', {
            apiCode: 100048,
            content: obj
          })
          if (res.code == 0) {
            if (res.content.updated == 1) {
              this.showMsg('修改密码成功！')
              this.modifyPasswordDialogVisible = false
              this.Obj.oldPassword = ''
              this.Obj.newPassword = ''
            } else {
              this.showMsg('原密码输入错误！', 'error')
            }
          } else {
            this.showMsg(res.msg)
          }
        }
      })
    },
    logout() {
      this.postJson('account', {
        apiCode: 100003,
        content: {}
      }).then(res => {
        if (res.code === '0') {
          sessionStorage.clear()
          // 跳到登录页面
          if (window.location.hostname.includes('localhost')) {
            location.href = './login.html'
          } else {
            location.href = '../login.html'
          }
        }
      })
    },
    routerChange() {
      if (location.hash.includes('desktop')) {
        this.showUserName = true
      } else {
        this.showUserName = false
      }
    }
  },
  mounted() {
    let id = sessionStorage.getItem('login') ? JSON.parse(sessionStorage.getItem('login')).uid : JSON.parse(sessionStorage.getItem('loginInfo')).uid
    this.Obj.id = id
    if(sessionStorage.getItem('login')){
      this.routerChange()
    }
  }
}
</script>

<style lang="scss" scoped>
  .popover-line {
    line-height: 32px;
    &:hover {
      background: $table-bg-color;
    }
  }
  .user{
    background-color: $active-color;
    padding:0 13px;
    .user-img{
      width: 36px;
      height: 36px;
    }
  }
</style>


