<template>
  <div id="login">
    <div class="loginTop">
      <div class="loginTopTitle">
        <img src="../../assets/img/login/login_title.png"/>
      </div>
      <div class="loginTopUser">
        <div class="loginInputTop">用户登录</div>
        <input type="text" placeholder="请输入用户名" v-model="count"/>
        <input type="password" placeholder="请输入密码" v-model="psw" @keyup.enter="getData"/>
        <div class="pwd">
          <!-- <Checkbox><span>记住密码</span></Checkbox> -->
          <span class="forget" @click="forgetPSW">忘记密码？</span>
        </div>
        <Button class="loginBtn" type="text" @click="getData()" :loading="loading">登 录</Button>
        <div class="loginNotice">
          <p>欢迎使用本系统，请填写您的帐号、密码，登录系统。</p>
        </div>
        <!--<div class="loginRedNotice">-->
        <!--<p>* 请使用IE浏览器，以便您能正常使用ukey！</p>-->
        <!--<p>* 必须录入密码。</p>-->
        <!--</div>-->
      </div>
    </div>
    <div class="loginBottom">
      Copyright @ 2018 河南省福利彩票发行中心 All Rights Reserved
    </div>
  </div>


</template>

<script>
import Md5 from 'md5'
import {
  // Checkbox,
  Button,
  Notification
  // Message
} from 'element-ui'

export default {
  name: 'login',
  components: {
    // Checkbox,
    // swiper,
    // swiperSlide,
    Button,
    Notification
  },
  data() {
    return {
      loading: false,
      count: '',
      psw: '',
      swiperOption: {
        autoplay: {
          delay: 2500,
          stopOnLastSlide: false,
          disableOnInteraction: false,
          waitForTransition: false
        },
        grabCursor: true,
        parallax: true,
        effect: 'fade',
        loop: true
      }
    }
  },
  methods: {
    // 登录成功，把登录状态保存到sessionstorage
    saveSession() {
      sessionStorage.setItem('login', 'login保存的')
      console.log(sessionStorage.getItem('login'))
      if (sessionStorage.getItem('login')) {
        location.href = './index.html'
      }
    },
    forgetPSW() {
      this.$notify({
        type: 'warning',
        title: '忘记密码',
        duration: 5000,
        dangerouslyUseHTMLString: true,
        message: '<p>请联系系统管理员帮助您重置密码！</p><p>默认密码为：111111</p>'
      })
    },
    getData(username, password) {
      let user = ''
      let pass = ''
      if (username && password) {
        user = username
        pass = password
      } else {
        user = this.count
        pass = Md5(this.psw)
      }
      this.loading = true
      this.postJson('account', {
        apiCode: 100001,
        content: {
          username: user,
          password: pass
        }
      }).then(res => {
        if (res.code == 0) {
          // 登录成功的话吧账户密码存到cookie
          let cookieStr = encodeURIComponent(user + ':' + pass)
          document.cookie = 'user=' + cookieStr + ';'
          // 登录成功，保存到sessionstorage，通过判断sessionstorage判断，跳到首页页面
          let cont = res.content
          sessionStorage.setItem('login', JSON.stringify(cont))
          localStorage.setItem('login', JSON.stringify(cont))
          if (sessionStorage.getItem('login')) {
            location.href = './index.html#/desktop'
          }
        } else {
          if (res.code === '10020') {
            this.showMsg('该用户不存在!', 'error')
          }
        }
        setTimeout(() => {
          this.loading = false
        }, 500)
      })
    }
  },
  computed: {},
  mounted() {
    var arr = document.cookie.split(';')
    console.log(arr)
    arr.forEach(v => {
      if (v.split('=')[0].trim() == 'omisToken' && v.split('=')[1]) {
        console.log(v.split('=')[1])
        // this.$store.state.token = v.split('=')[1]
        sessionStorage.setItem('login', JSON.stringify({token: v.split('=')[1], uid: ''}))
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        document.cookie = 'omisToken="";expires=' + exp.toGMTString()
        this.postJson('account', {
          apiCode: '100004'
        }).then(res => {
          if (res.code == 0) {
            // 登录成功，保存到sessionstorage，通过判断sessionstorage判断，跳到首页页面
            let cont = res.content
            sessionStorage.setItem('login', JSON.stringify(cont))
            if (sessionStorage.getItem('login')) {
              location.href = './index.html'
            }
          }
        })
      }
    })
  },
  beforeMount() {
  }
}
</script>

<style lang="scss">
  #login {
    background-image: url(../../assets/img/login/login_bg.jpg);
    background-size: 100% 100%;
    min-width: 1024px;
    height: 100%;
    min-height: 600px;
    position: relative;
    width: 100%;
    /*left: 0;*/
    /*right: 0;*/
    /*margin: auto;*/
    font-family: Segoe UI;
    .loginTop {
      width: 680px;
      min-height: 280px;
      position: absolute;
      left: 50%;
      top: 44%;
      margin-left: -340px;
      margin-top: -150px;
      .loginTopTitle {
        text-align: center;
        margin-bottom: 48px;
        img {
        }
      }
      .loginTopUser {
        margin: auto;
        padding: 13px 34px;
        width: 365px;
        height: 200px;
        // width: 436px;
        // height: 212px;
        background: rgba(255, 255, 255, 0.9);
        opacity: 0.9;
        .loginInputTop {
          /*width: 80px;*/
          height: 27px;
          font-size: 20px;
          font-weight: 600;
          line-height: 27px;
          color: rgba(7, 35, 74, 1);
        }
        input {
          padding: 8px 11px;
          margin: 4px 0;
          width: 345px;
          height: 15px;
          // width: 369px;
          // height: 30px;
          line-height: 1;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(56, 64, 79, 1);
          border-radius: 4px;
        }
        .pwd {
          // display: inline;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          line-height: 25px;
          color: rgba(7, 35, 74, 1);
          .forget {
            float: right;
            // padding-left: 220px;
            text-decoration: underline;
          }
        }
        .loginBtn {
          width: 369px;
          height: 30px;
          background: rgba(49, 177, 212, 1);
          opacity: 1;
          border-radius: 4px;
          color: rgba(255, 255, 255, 1);
          font-size: 14px;
        }
        .loginNotice {
          height: 14px;
          margin-top: 20px;
          border-left: 2px solid #ddd;
          padding-left: 10px;
          p {
            font-size: 10px;
            font-weight: 600;
            line-height: 15px;
            color: rgba(149, 149, 149, 1);
          }
        }
      }
    }
    .loginBottom {
      border-top: 1px solid rgba(186, 213, 255, 1);
      // width: 800px;
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%, 0);
      box-sizing: content-box;
      width: 300px;
      font-size: 10px;
      font-weight: 400;
      line-height: 14px;
      color: rgba(186, 213, 255, 1);
      text-align: center;
      padding: 10px 200px 0;
    }
    // .loginRedNotice {
    //   margin-top: 20px;
    //   width: 270px;
    //   p {
    //     color: #F80200;
    //     line-height: 22px;
    //     font-size: 16px;
    //   }
    // }
  }
</style>
