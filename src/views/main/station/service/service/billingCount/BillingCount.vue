<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit" @click="query('area')">按区域统计</Button>
        <Button v-if="true" type="primary" icon="el-icon-edit" @click="query('station')">按站点统计</Button>
        <!--</ButtonGroup>-->
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableDataFacilities" :height="tableHeight" border style="width: 100%" v-if="showtable">
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="区域名称" prop="regionName"></TableColumn>
          <TableColumn label="区域编码" prop="regionCode"></TableColumn>
          <TableColumn label="站点编码" prop="stationCode"></TableColumn>
          <TableColumn label="即开票类型名称" prop="jkpName"></TableColumn>
          <TableColumn label="即开票类型编码" prop="jkpCode"></TableColumn>
          <TableColumn label="申请总数" prop="num"></TableColumn>
        </Table>
        <Table stripe :data="tableDataFacilities" :height="tableHeight" border style="width: 100%" v-if="!showtable">
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="区域名称" prop="regionName"></TableColumn>
          <TableColumn label="区域编码" prop="regionCode"></TableColumn>
          <TableColumn label="站点编码" prop="stationCode"></TableColumn>
          <TableColumn label="即开票类型名称" prop="jkpName"></TableColumn>
          <TableColumn label="即开票类型编码" prop="jkpCode"></TableColumn>
          <TableColumn label="申请总数" prop="num"></TableColumn>
          <TableColumn label="箱数" prop="boxCount"></TableColumn>
          <TableColumn label="本数" prop="bookCount"></TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      // 删除modal框
      dialogVisible: false,
      // 切换表格显示
      showtable: true,
      // 查询列表信息(默认)
      Obj: {
        apiCode: 300148,
        content: {
          page: 1
        }
      },
      // 表单提交数据绑定model
      dataForm: {},
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      totalCount: 0,
      tableHeight: 0,
      msg: '',
      tableDataFacilities: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.query()
    },
    async query(flag) {
      if (flag === 'area') {
        this.showtable = true
        this.Obj.apiCode = 300148
      } else if (flag === 'station') {
        this.showtable = false
        this.Obj.apiCode = 300149
      }
      var res = await this.postJson('station', {
        apiCode: this.Obj.apiCode,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableHeight = this.tableHeightCal('el-main', 150)
        this.tableDataFacilities = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style></style>
