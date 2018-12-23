<template>
  <div class="monentStatement">

    <TablePage :showPagination="false" :firstIsCollapse="true">

      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit"
                @click="$router.push('/dataMaintain/zfSaleAdd')">新增
        </Button>
        <Dropdown trigger="click" @command="printEvent"
                  placement="bottom-start">
          <Button type="primary" style="border-radius: 0 4px 4px 0" icon="el-icon-caret-bottom">
            打印
          </Button>
          <DropdownMenu slot="dropdown">
            <DropdownItem command="0">打印当前页</DropdownItem>
          </DropdownMenu>

        </Dropdown>

        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" :rules="rules" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="站点编号" prop="stationId">
            <Autocomplete
               v-model="searchForm.stationId"
               :fetch-suggestions="querySearchAsync"
               placeholder="请输入内容"
               @select="handleSelect"
            ></Autocomplete>
          </FormItem>
          <FormItem label="游戏名称" prop="gameId">
            <Select v-model="searchForm.gameId" placeholder="请选择" disabled>
              <Option value="-1" label="全部游戏"></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line" label="时间段" prop="date1">
            <DatePicker type="daterange" placeholder="选择日期" @change="dateChange" v-model="searchForm.date1"
                        value-format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

    </TablePage>
    <!--表格-->
    <div v-if="detailFlag">
      <DetailList :title="''" :keyName="'name'" :valueName="'value'" :detailList="detail"
                  style="padding-top: 20px;"></DetailList>
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
      <div class="statementlayout" style="margin-bottom:100px">
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

  </div>
</template>

<script>
export default {
  name: 'monentStatement',
  data: function () {
    return {
      detailFlag: false,
      detail: [],
      detail2: [],
      detail3: [],
      resData: {},
      gameList: [],
      oneSCode: '',
      rules: {
        stationId: [{
          required: true,
          message: '站点编号不能为空',
          trigger: 'change'
        }],
        gameId: [{
          required: true,
          message: '游戏不能为空',
          trigger: 'change'
        }],
        date1: [
          {
            // type: 'date',
            required: true,
            message: '时间段不能为空',
            trigger: 'change'
          }
          // {validator: validator1, required: true, trigger: 'change'}
        ]
      },
      showIssueDemo: false,
      issueDemo: '',
      showQueryRes: false,
      searchForm: {
        gameId: '-1',
        page: 1
      },
      confirmSearch: {
        page: 1
      }
    }
  },
  methods: {
    printEvent() {
      let Obj = {
        apiCode: 300252,
        content: this.searchForm
      }
      let printObj = {}
      printObj.data = this.resData
      printObj.page = 'momentStatement'
      printObj.query = Obj
      printObj.gameList = []
      sessionStorage.setItem('printObj', JSON.stringify(printObj))
      window.open('./#/printStatementPage')
    },
    dateChange(val) {
      this.searchForm.startTime = val ? val[0] : ''
      this.searchForm.endTime = val ? val[1] : ''
    },
    // 站点编号输入框 变化，搜索出相关的站点编号
    async querySearchAsync(sCode, cb) {
      if (sCode ? sCode.length : '' === 1) {
        this.oneSCode = sCode
      }
      if (sCode === undefined) {
        cb([])
        return
      } else if (sCode === '') {
        sCode = this.oneSCode
      }
      // 根据号码查询所有相关的站点编号
      var res = await this.postJson('station', {
        apiCode: 300019,
        content: {searchKey: sCode}
      })
      res.content.forEach((val) => {
        this.$set(val, 'value', `${val.station_code}-${val.name_x}`)
      })
      let arr = res.content
      cb(arr)
    },
    handleSelect(item) {
      this.searchForm.stationId = item.station_code
      console.log(this.searchForm)
    },
    // 校验输入的必填项和规则
    async validate() {
      var check = false
      await this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          check = true
        } else {
          this.showMsg('请输入正确的必填信息', 'error')
          check = false
        }
      })
      return check
    },
    async search() {
      // 做验证，通过验证代码继续往下执行，否则停止往下执行
      var flag = await this.validate()
      if (!flag) {
        return
      }
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {

      var res = await this.postJson('station', {
        apiCode: 300252,
        content: this.searchForm
      })
      if (res.code !== '0') {
        return
      }
      this.detail = [
        {name: '站点站号', value: this.searchForm.stationId},
        {name: '查询时间', value: this.ToTime(new Date())},
        {name: '日期范围', value: this.searchForm.startTime + '~' + this.searchForm.endTime}
      ]
      this.resData = res.content.content
      this.gameList = this.resData.timeRptDetails
      this.detailFlag = true
    },
    resetForm(formName) {
      this[formName] = {
        page: 1,
        gameId: -1
      }
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss">
  .statementlayout {
    width: 100%;
    /*display: flex;*/
    /*flex-wrap: wrap;*/
    border: 0;
    border-top: 1px solid #e5e5e5;
    margin-top: 10px;
    padding: 20px 50px 0px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
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
</style>
