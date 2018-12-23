<template>
  <div class="SitesInfo">
    <!--顶部按钮组-->
    <div class="btn_groups SIGroup">
      <Button type="primary" @click="searchBtn" icon="el-icon-search" class="searchBtn">查询</Button>
      <Button type="primary" @click="synBtn" class="synBtn" icon="el-icon-refresh">同步</Button>
    </div>
    <!-- 查询部分 和同步部分-->
    <div class="makeMiddle">
      <!-- 查询部分 -->
      <div class="boxItem searchBox" v-show="searchBox_flag">
        <div class="search-top">
          <h3>查询条件</h3>
        </div>
        <div class="search-detail">
          <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini" ref="searchForm">
            <FormItem label="站点编号">
              <Input v-model="searchForm.qureyStationID"/>
            </FormItem>
            <FormItem label="所属区域">
              <Select v-model="searchForm.regionID" clearable>
                <Option v-for="item in regionIdList" :value="item.value" :key="item.value" :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem label="代销商">
              <Select v-model="searchForm.agentID" clearable>
                <Option v-for="item in agentList" :value="item.value" :key="item.value" :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem label="站点状态">
              <Select v-model="searchForm.stationStat" clearable>
                <Option v-for="item in stationStateList" :value="item.value" :key="item.value"
                        :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem label="站点类型">
              <Select v-model="searchForm.stationType" clearable>
                <Option v-for="item in stationTypeList" :value="item.value" :key="item.value"
                        :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem label="联系地址">
              <Input v-model="searchForm.addr"/>
            </FormItem>
            <FormItem label="站点名称">
              <Input v-model="searchForm.stationName"/>
            </FormItem>
            <FormItem class="full-line">
              <Button type="primary" @click="search()">查询</Button>
              <Button @click="reset('searchForm', 'confirmSearch')">清空</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <!--同步选项-->
      <div class="boxItem synBox" v-show="synBox_flag">
        <div class="search-top">
          <h3>同步选项</h3>
        </div>
        <div class="search-detail">
          <Form :inline="true" class="form-inline" label-width="140px" :model="synObj.content" size="mini"
                ref="synForm">
            <FormItem label="站点编号">
              <Input v-model="synObj.content.qureyStationID"/>
            </FormItem>
            <FormItem label="所属区域">
              <Select v-model="synObj.content.regionID" clearable>
                <Option v-for="item in regionIdList" :value="item.value" :key="item.value" :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem label="代销商">
              <Select v-model="synObj.content.agentID" clearable>
                <Option v-for="item in agentList" :value="item.value" :key="item.value" :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem label="站点状态">
              <Select v-model="synObj.content.stationStat" clearable>
                <Option v-for="item in stationStateList" :value="item.value" :key="item.value"
                        :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem label="站点类型">
              <Select v-model="synObj.content.stationType" clearable>
                <Option v-for="item in stationTypeList" :value="item.value" :key="item.value"
                        :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem label="是否更新已有站点">
              <Select v-model="synObj.content.overlap" clearable>
                <Option v-for="item in overlapList" :value="item.value" :key="item.value" :label="item.text"></Option>
              </Select>
            </FormItem>
            <FormItem class="full-line">
              <Button type="primary" @click="syn()" size="small">开始同步</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>

    <TablePage :totalCount="pageTotal" ref="tabelPage" :showPowerSearch="false">
      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="data1" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn label="序号" width="50" type="index" align="center" :index="indexMethod">
          </TableColumn>
          <TableColumn label="站点编号" prop="stationId" :sortable="true" min-width="130"></TableColumn>
          <TableColumn label="开关状态" prop="stationStatCNName" :sortable="true" min-width="100"></TableColumn>
          <TableColumn label="站点类型" prop="stationTypeCNName" :sortable="true" min-width="100"></TableColumn>
          <TableColumn label="省份" prop="provName" :sortable="true" min-width="100"></TableColumn>
          <TableColumn label="区域名称" prop="regionName" :sortable="true" min-width="130"></TableColumn>
          <TableColumn label="代销商名称" prop="agentName" :sortable="true" min-width="130"></TableColumn>
          <TableColumn label="负责人" prop="responsor" :sortable="true" min-width="130"></TableColumn>
          <TableColumn label="票打印地址" prop="printAddr" :sortable="true" min-width="150"></TableColumn>
          <TableColumn label="操作" width="90">
            <template slot-scope="scope">
              <Button @click="$router.push('/manage/sitesInfoDetail/' + scope.row.stationId)" type="text">查看</Button>
              <Button @click="$router.push('/manage/sitesInfoModify/' + scope.row.stationId)" type="text" v-if="Auth(300213)">修改</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'SitesInfo',
  data() {
    return {
      synBox_flag: false,
      searchBox_flag: false, // 查询数据开始
      showSearchOrSyn: true,// 控制查询或者同步面板：默认是搜索面板
      checkboxList: [], // 导出弹框-展示出来的多选框
      delId: '',
      delFlag: false,
      downloadObj: {hostBizObj: 'station', hostBizId: 'templete_xlsx'},
      checkAll: false, // 导出弹框-全选属性
      indeterminate: true, // 导出弹框-全选属性
      exportTitle: '', // 导出弹框title
      exportFlag: false, // 导出弹出框与否
      loading: true, // 表格加载
      tableHeight: 0, // 默认是300
      filterStr: '', // 过滤的输入字符
      pageSize: 20, // 每页显示条数
      pageTotal: 0,
      agentList: [],
      regionIdList: [],
      stationTypeList: [],
      stationStateList: [],
      overlapList: [
        {value: 'update', text: '更新'},
        {value: 'keep', text: '不更新'}
      ],
      synObj: {
        apiCode: 300214,
        sysModule: 'station',
        content: {
          overlap: 'keep'
        }
      },
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      data1: [] // 表格内容信息
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
      this.dataCache = originData.map(ele => {
        return {
          stationId: ele.stationId,
          contractSN: ele.contractSN,
          stationTypeCNName: ele.stationTypeCNName,
          provName: ele.provName,
          regionName: ele.regionName,
          agentName: ele.agentName,
          responsor: ele.responsor,
          printAddr: ele.printAddr
        }
      })
    },
    async getAgentList() {
      var res = await this.postJson('station', {
        apiCode: 300161,
        content: {}
      })
      this.agentList = res.content
    },
    // 顶部tab中的查询按钮
    searchBtn() {
      this.searchBox_flag = !this.searchBox_flag
      this.synBox_flag = false
    },
    synBtn() {
      this.synBox_flag = !this.synBox_flag
      this.searchBox_flag = false
    },
    async syn() {
      if (confirm('同步时请不要做其他操作,耐心等待,点击[确定]开始同步！')) {
        var res = await this.postJson('station', {
          apiCode: this.synObj.apiCode,
          content: this.synObj.content
        })
        if (res.code === '0') {
          let successCount =
            parseInt(res.content.updateCount) +
            parseInt(res.content.addCount)
          this.showMsg(
            '此次成功同步' +
            successCount +
            '个站点！' +
            '更新' +
            res.content.updateCount +
            '个站点,共耗时' +
            res.content.time +
            '秒！'
          )
          this.query()
        }
      }
    },
    // 重置
    reset(formName, confirmSearch) {
      this[formName] = this[confirmSearch] = {
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
    async getStationType() {
      var res = await this.postJson('station', {
        apiCode: 300014,
        content: {}
      })
      this.stationTypeList = res.content
    },
    getStationStateList() {
      this.stationStateList = this.$store.state[
        'station_enumDic'
        ].MisEnum$statusEnum
    },
    async getRegionIdList() {
      var res = await this.postJson('station', {
        apiCode: 300259,
        content: {}
      })
      this.regionIdList = res.content
    },
    viewSoftwareInfo(id) {
      let url = '/saleManage/softwareDetail/' + id
      this.$router.push(url)
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
    async query() {
      this.loading = true
      var res = await this.postJson('station', {
        apiCode: 300211,
        sysModule: 'station',
        content: this.confirmSearch
      })
      this.loading = false
      if (res.code == 0) {
        var dataList = res.content.dataList
        this.data1 = dataList
        this.setDataCache(this.data1)
        this.pageTotal = res.content.dataPage.totalCount
        this.checkboxList = []
      } else {
        this.showMsg(res.msg, 'warning')
      }
    }
  },
  mounted() {
    this.getStationType()
    this.getAgentList()
    this.getRegionIdList()
    this.getStationStateList()
    this.init()
    this.tableHeight = this.tableHeightCal('el-main', 150)
  }
}
</script>

<style scoped lang="scss">
  .SIGroup{
    .searchBtn{
      border-radius: 3px 0px 0px 3px;
      border-right-color: rgba(255, 255, 255, 0.5);
    }
    .synBtn{
      margin-left: 0;
      border-radius: 0 3px 3px 0px;
    }
  }
  .boxItem {
    margin: 24px 0 12px 0;
    border: 1px solid #dddee1;
    border-radius: 4px;
    position: relative;
    padding: 0 10px;
    .backBtn {
      float: right;
    }
  }
</style>