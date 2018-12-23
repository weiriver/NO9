<template>
  <div class="SiteAuthority">
    <TablePage :totalCount="totalCount" ref="tabelPage">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button v-if="true" type="primary" @click="synBtn" icon="el-icon-refresh">同步</Button>
      </div>
      <!-- 查询部分 -->
      <div class="searchBox" slot="query">
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini" ref="searchForm">
          <FormItem label="站点编号">
            <Input v-model="searchForm.stationId"/>
          </FormItem>
          <FormItem label="游戏">
            <Select v-model="searchForm.gameId" clearable>
              <Option v-for="item in gameList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="所属区域">
            <Select v-model="searchForm.regionId" clearable>
              <Option v-for="item in regionIdList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="reset('searchForm', 'confirmSearch')">清空</Button>
          </FormItem>
        </Form>
      </div>
      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="data1" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn label="序号" width="50" type="index" align="center" :index="indexMethod"></TableColumn>
          <TableColumn label="投注站编号" prop="stationId" width="120"></TableColumn>
          <TableColumn label="游戏名称" prop="gameId" width="120">
            <template slot-scope="scope">
              <span>{{gameList.find((item) => item.value === scope.row.gameId).text}}</span>
            </template>
          </TableColumn>
          <TableColumn label="投注权限" prop="wager" width="100"></TableColumn>
          <TableColumn label="注销权限" prop="cancel" width="100"></TableColumn>
          <TableColumn label="兑奖权限" prop="cash" width="100"></TableColumn>
          <TableColumn label="期注销金额上限" prop="issueCancelMoney" width="120"></TableColumn>
          <TableColumn label="期注销次数上限" prop="issueCancelTimes" width="120"></TableColumn>
          <TableColumn label="单票最小金额" prop="minMoneyPerTick" width="120"></TableColumn>
          <TableColumn label="单票最大金额" prop="maxMoneyPerTick" width="100"></TableColumn>
          <TableColumn label="单票最小兑奖金额" prop="minCashPerTick" width="120"></TableColumn>
          <TableColumn label="单票最大兑奖金额" prop="maxCashPerTick" width="120"></TableColumn>
          <TableColumn label="操作" width="80" align="center">
            <template slot-scope="scope">
              <Button
                 @click="$router.push('/manage/siteAuthorityDetail/' + scope.row.stationId + '?gameId=' + scope.row.gameId)"
                 type="text">查看
              </Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>

</template>
<script>
export default {
  name: 'SiteAuthority',
  data() {
    return {
      checkboxList: [], // 导出弹框-展示出来的多选框
      delId: '',
      gameList: [],
      delFlag: false,
      indeterminate: true, // 导出弹框-全选属性
      exportTitle: '', // 导出弹框title
      exportFlag: false, // 导出弹出框与否
      loading: true, // 表格加载
      tableHeight: 0, // 默认是0
      filterStr: '', // 过滤的输入字符
      totalCount: 0,
      regionIdList: [],
      findTypeList: [],
      searchBox_flag: false, // 查询数据开始
      data1: [], // 表格内容信息
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      }
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.confirmSearch.page - 1) * 20
    },
    // 组件关闭modal的广波
    toggleModalFlag(val) {
      this.modalFlag = val
    },
    arrFilter() {
      if (this.filterStr) {
        this.data1 = this.ArrFilter(this.filterStr, this.dataCache, this.data1)
        this.setDataCache(this.data1)
      } else {
        this.query()
      }
    },
    setDataCache(originData) {
      this.dataCache = originData.map((ele) => {
        return {
          stationId: ele.stationId,
          gameId: this.gameList.find((item) => item.value === ele.gameId).text,
          wager: ele.wager,
          cancel: ele.cancel,
          cash: ele.cash,
          issueCancelMoney: ele.issueCancelMoney,
          issueCancelTimes: ele.issueCancelTimes,
          minMoneyPerTick: ele.minMoneyPerTick,
          maxMoneyPerTick: ele.maxMoneyPerTick,
          minCashPerTick: ele.minCashPerTick,
          maxCashPerTick: ele.maxCashPerTick
        }
      })
    },
    // 顶部tab中的同步按钮
    async synBtn() {
      var stationId = this.searchForm.stationId
      var gameId = this.searchForm.gameId
      var regionId = this.searchForm.regionId
      var agentId = this.searchForm.agentId
      var stationType = this.searchForm.stationType
      var gameName = '全部'
      if (gameId) {
        gameName = this.gameList.find((item) => item.value === gameId).text
      }
      if (stationId) {
        if (confirm('确定要将【' + stationId + '】投注站的【' + gameName + '】游戏，进行投注站权限同步吗？')) {
          var res = await this.postJson('station', {
            apiCode: 300503,
            content: {
              stationId,
              gameId
            }
          })
          if (res.code === '0') {
            if (res.content === 'success') {
              this.showMsg('同步成功')
            } else {
              this.showMsg('同步失败', 'error')
            }
            this.query()
          }
        }
      } else {
        var regionName = regionId ? this.regionIdList.find((item) => item.value === regionId).text : '全部'
        var warn = '确定要将'
        if (regionName != null && regionName.length > 0) {
          warn = warn + '区域：【' + regionName + '】'
        }
        if (confirm(warn + '的游戏：' + '【' + gameName + '】' + '进行投注站权限同步吗？')) {
          var res = await this.postJson('station', {
            apiCode: 300503,
            content: {
              gameId,
              regionId,
              agentId,
              stationType
            }
          })
          if (res.code === '0') {
            if (res.content === 'success') {
              this.showMsg('同步成功')
            } else {
              this.showMsg('同步失败', 'error')
            }
          }
          this.query()
        }
      }
    },
    // 清空--重置表单内容
    reset(searchForm, confirmSearch) {
      this[searchForm] = this[confirmSearch] = {
        page: 1
      }
    },
    pageChoice(page) {
      this.searchForm.page = page
      this.query()
    },
    tableEditButtonFlag(flag) {
      if (flag) {
        return 'inline'
      } else {
        return 'none'
      }
    },
    async getRegionIdList() {
      var res = await this.postJson('station', {
        apiCode: 300259,
        content: {}
      })
      console.log(res)
      if (res.code == 0) {
        this.regionIdList = res.content
      }
    },
    async getGameList() {
      var res = await this.postJson('station', {
        apiCode: 300162,
        content: {}
      })
      if (res.code == 0) {
        this.gameList = res.content
      }
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    // 查询
    async query(page) {
      if (page) this.searchForm.page = page
      this.loading = true
      var res = await this.postJson('station', {
        apiCode: 300502,
        sysModule: 'station',
        content: this.confirmSearch
      })
      this.loading = false
      if (res.code == 0) {
        var dataList = res.content.dataList
        this.data1 = dataList
        this.setDataCache(this.data1)
        this.totalCount = res.content.dataPage.totalCount
        this.checkboxList = []
      } else {
        this.showMsg(res.msg, 'warning')
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.getGameList()
    this.getRegionIdList()
    this.init()
  }
}
</script>
<style lang="scss">
</style>
