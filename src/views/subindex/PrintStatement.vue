<template>
  <div class="container">
    <h2 class="printTop">
      <!--<img height="20px" src="../../assets/img/logo.png" valign="center"/>-->
      {{printPage == 'periodStatement'?'期报表':'时段报表'}}

    </h2>
    <!--<Table border :columns="columns5" :data="data5"></Table>-->

    <div style="margin-top: 20px;" v-if="printPage == 'periodStatement'">
      <div class="statementlayout">
        <!--名称-->
        <div class="autoLayoutItem item50">
          <div class="autoLeft">
            站点站号：
          </div>
          <div class="autoRight">
            {{Obj.content.stationId}}
          </div>
        </div>
        <div class="autoLayoutItem item50">
          <div class="autoLeft">
            查询时间：
          </div>
          <div class="autoRight">
            {{new Date() | ToTime}}
          </div>
        </div>
        <div class="autoLayoutItem item50">
          <div class="autoLeft">
            期号范围：
          </div>
          <div class="autoRight">
            {{Obj.content.startIssue}} ~ {{Obj.content.endIssue}}
          </div>
        </div>
      </div>

      <div class="statementlayout">
        <!--名称-->
        <div class="nameItem">
          <b>【{{Obj.content.gameName}}】</b>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            销 售：
          </div>
          <div class="autoRight">
            {{resData.saleCount}}
          </div>
          <div class="autoRight">
            {{resData.saleAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            注销：
          </div>
          <div class="autoRight">
            {{resData.cancelCount}}
          </div>
          <div class="autoRight">
            {{resData.cancelAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            中心注销：
          </div>
          <div class="autoRight">
            {{resData.centerCancelCount}}
          </div>
          <div class="autoRight">
            {{resData.centerCancelAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            冲 正：
          </div>
          <div class="autoRight">
            {{resData.rollbackCount}}
          </div>
          <div class="autoRight">
            {{resData.rollbackAmount}}
          </div>
        </div>
      </div>

      <div class="statementlayout" style="margin-bottom:20px">
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            实 销：
          </div>
          <div class="autoRight">
            {{resData.realSaleCount}}
          </div>
          <div class="autoRight">
            {{resData.realSaleAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            兑 奖：
          </div>
          <div class="autoRight">
            {{resData.cashCount}}
          </div>
          <div class="autoRight">
            {{resData.cashAmount}}
          </div>
        </div>
      </div>
    </div>




    <div style="margin-top: 20px;"  v-if="printPage == 'momentStatement'">

      <div class="statementlayout">
        <!--名称-->
        <div class="autoLayoutItem item50">
          <div class="autoLeft">
            站点站号：
          </div>
          <div class="autoRight">
            {{Obj.content.stationId}}
          </div>
        </div>
        <div class="autoLayoutItem item50">
          <div class="autoLeft">
            查询时间：
          </div>
          <div class="autoRight">
            {{new Date() | ToTime}}
          </div>
        </div>
        <div class="autoLayoutItem item50">
          <div class="autoLeft">
            日期范围：
          </div>
          <div class="autoRight">
            {{Obj.content.startTime}} ~ {{Obj.content.endTime}}
          </div>
        </div>
      </div>

      <div class="statementlayout" v-for="(game,index) in gameList" :key="index">
        <!--名称-->
        <div class="nameItem">
          <b>【{{game.gameName}}】</b>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            销 售：
          </div>
          <div class="autoRight">
            {{game.saleCount}}
          </div>
          <div class="autoRight">
            {{game.saleAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            注销：
          </div>
          <div class="autoRight">
            {{game.cancelCount}}
          </div>
          <div class="autoRight">
            {{game.cancelAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            中心注销：
          </div>
          <div class="autoRight">
            {{game.centerCancelCount}}
          </div>
          <div class="autoRight">
            {{game.centerCancelAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            冲 正：
          </div>
          <div class="autoRight">
            {{game.rollbackCount}}
          </div>
          <div class="autoRight">
            {{game.rollbackAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            实 销：
          </div>
          <div class="autoRight">
            {{game.realSaleCount}}
          </div>
          <div class="autoRight">
            {{game.realSaleAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item100">
          <div class="autoLeft">
            兑 奖：
          </div>
          <div class="autoRight">
            {{game.cashCount}}
          </div>
          <div class="autoRight">
            {{game.cashAmount}}
          </div>
        </div>
      </div>

      <div class="statementlayout" style="margin-bottom:20px">
        <!--名称-->
        <div class="autoLayoutItem item50">
          <div class="autoLeft">
            实时余额：
          </div>
          <div class="autoRight">
            {{resData.realTimeAmount}}
          </div>
        </div>
        <div class="autoLayoutItem item50">
          <div class="autoLeft">
            应交款：
          </div>
          <div class="autoRight">
            {{resData.shouldPayAmount}}
          </div>
        </div>
      </div>

    </div>


    <div class="printBottom" style="padding-top: 12px;">
      <span>打印人：{{printMan}}</span>
      <span style="float: right;">打印日期：{{printDate}}</span>
    </div>
  </div>

</template>

<script>

  export default {
    name: 'printStatement',
    data() {
      return {
        printTitle: '日志列表',
        printMan: '系统',
        printDate: '2018-7-20',
        Obj: {
          content: {}
        },
        gameList: [],
        resData: {},
        printPage: ''
      }
    },
    methods: {
    },
    components: {
    },
    computed: {},
    mounted() {
    },
    beforeMount() {
      let printObj = JSON.parse(sessionStorage.getItem('printObj'))
      console.log(printObj)
      this.resData = printObj.data
      this.printPage = printObj.page
      this.Obj = printObj.query
      this.gameList = printObj.gameList
      this.printMan = JSON.parse(sessionStorage.getItem('login')).nameX
      this.printDate = this.ToDate(new Date())
      this.printTitle = printObj.printTitle
    }
  }
</script>

<style lang="scss">
  body {
    background: #fff !important;
  }

  .container {
    width:850px;
    /*width: 100%;*/
    box-sizing: border-box;
    margin-right:auto;
    margin-left:auto;
    padding-right:15px;
    padding-left:15px;
    .printTop {
      text-align: center;
      font-size: 30px;
      line-height: 40px;
      padding: 10px 0;
      img {
        height: auto;
        max-width: 100%;
        vertical-align: middle;
        border: 0;
      }
    }
  }
  .statementlayout {
    width: 100%;
    box-sizing: border-box;
    /*display: flex;*/
    /*flex-wrap: wrap;*/
    border: 0;
    border-top: 1px solid #e5e5e5;
    margin-top: 10px;
    padding: 20px 20px 0px;
    .autoLayoutItem {
      flex: 1;
      margin: 0px 20px 0 0;
      position: relative;
      font-size: 15px;
      height: 35px;
      display: flex;
      .autoLeft {
        width: 100px;
        text-align: center;
        line-height: 33px;
        /*font-weight: 900;*/
        padding-right: 20px;
        text-align: left;
      }
      .autoRight {
        flex: 1;
        line-height: 33px;
        padding-left: 20px;
        /*text-indent: 20px;*/
      }
    }
  }

  /*@media (min-width:768px){*/
    /*.container{*/
      /*width:750px*/
    /*}*/
  /*}*/

  /*@media (min-width:992px){*/
    /*.container{*/
      /*width:970px*/
    /*}*/
  /*}*/

  /*@media (min-width:1200px){*/
    /*.container{*/
      /*width:1170px*/
    /*}*/
  /*}*/
</style>
