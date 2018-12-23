<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">
      <div class="filter-div" slot="btn_groups">
        <!--<ButtonGroup>-->
        <Export
           :btnStyle="'border-radius:4px;margin-right:12px;'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'eqp'"
           :fileSaveName="'维护知识库'"
        ></Export>
        <!--</ButtonGroup>-->
        <Input v-model="searchForm.fuzzyColumn" placeholder="模糊搜索" style="margin-bottom: 2px"></Input>
        <Button type="primary" @click="search">搜索</Button>
      </div>

      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn
             label="物品类别"
             width="100">
            <template slot-scope="scope">
              {{ scope.row.goodsType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="物品名称" prop="goodsTypeName"></TableColumn>
          <TableColumn label="故障描述" prop="faultProblem"></TableColumn>
          <TableColumn
             label="操作"
             width="150">
            <template slot-scope="scope">
              <Button @click="itemDetail(scope.row)" type="text" typeOptions>查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'Repository',
  data: function () {
    return {
      totalCount: '',
      tableHeight: 0,
      tableData: [],
      confirmSearch: {},
      searchForm: {
        page: 1
      },
      checkboxList: [], // 导出弹框-展示出来的多选框
      exportObj: {
        apiCode: 800025,
        content: {
          status: true,
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '维护知识库'
        }
      }
    }
  },
  methods: {
    itemDetail(item) {
      console.log('点击查看', item)
      this.$router.push('/repairKnowledge/repositoryDetail/' + item.id)
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
    async query() {
      var res = await this.postJson('eqp', {
        apiCode: 800020,
        content: this.confirmSearch
      })
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
      this.checkboxList = []
      res.content.dataQry.colCNNames.forEach((v, i) => {
        this.checkboxList.push({
          text: v,
          value: res.content.dataQry.colNames[i]
        })
      })
      console.log('this.tableData,', this.tableData)
      console.log(this.totalCount)
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style></style>
