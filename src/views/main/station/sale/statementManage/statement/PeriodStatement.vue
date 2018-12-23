<template>
  <div class="PeriodStatement">

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
            <Select v-model="searchForm.gameId" placeholder="请选择" @change="getIssueByGame">
              <Option v-for="item in gameList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="开始期号" prop="startIssue">
            <Input v-model="searchForm.startIssue"></Input>
          </FormItem>
          <FormItem label="结束期号" prop="endIssue">
            <Input v-model="searchForm.endIssue"></Input>
            <div v-if="showIssueDemo">{{searchForm.gameName}}期号格式范例：{{issueDemo}}</div>
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
      <div class="statementlayout">
        <!--名称-->
        <div class="nameItem">
          <b>【{{searchForm.gameName}}】</b>
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
      <div class="statementlayout" style="margin-bottom:100px">
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

  </div>
</template>

<script>
export default {
  name: 'PeriodStatement',
  data: function () {
    return {
      detailFlag: false,
      detail: [],
      detail2: [],
      detail3: [],
      resData: {},
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
        startIssue: [{
          required: true,
          message: '开始期号不能为空',
          trigger: 'change'
        }],
        endIssue: [{
          required: true,
          message: '结束期号不能为空',
          trigger: 'change'
        }]
      },
      gameList: [],
      showIssueDemo: false,
      issueDemo: '',
      showQueryRes: false,
      searchForm: {
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
        apiCode: 300251,
        content: this.searchForm
      }
      let printObj = {}
      printObj.data = this.resData
      printObj.page = 'periodStatement'
      printObj.query = Obj
      printObj.gameList = []
      sessionStorage.setItem('printObj', JSON.stringify(printObj))
      window.open('./#/printStatementPage')
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
    // 获取游戏当前期
    async getIssueByGame() {
      this.searchForm.gameName = this.gameList.filter(item => item.value === this.searchForm.gameId)[0].text
      if (!this.searchForm.gameId) {
        return
      }
      this.issueDemo = ''
      var res = await this.postJson('biz', {
        apiCode: 200002,
        content: {
          gameId: this.searchForm.gameId
        }
      })
      if (res.code === '0') {
        if (res.content.length > 0) {
          this.showIssueDemo = true
          this.issueDemo = res.content[0].text
        }
      }
    },
    // 获取游戏列表
    async getGameList() {
      var res = await this.postJson('biz', {
        apiCode: 200016,
        content: this.searchForm
      })
      if (res.code === '0') {
        this.gameList = res.content
      }
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
        apiCode: 300251,
        content: this.searchForm
      })
      console.log(res)
      if (res.code !== '0') {
        return
      }
      this.detail = [
        {name: '站点站号', value: this.searchForm.stationId},
        {name: '查询时间', value: this.ToTime(new Date())},
        {name: '期号范围', value: this.searchForm.startIssue + '~' + this.searchForm.endIssue}
      ]
      this.resData = res.content.content
      this.detailFlag = true
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
    }
  },
  mounted() {
    this.getGameList()
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
