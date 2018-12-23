<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">
      <div class="filter-div" slot="btn_groups">
        <Input v-model="searchForm.fuzzyColumn"></Input>
        <Button type="primary" @click="search">搜索</Button>
      </div>

      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="物品类别" width="100">
            <template slot-scope="scope">
              {{ scope.row.goodsType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="物品名称" prop="goodsTypeName"></TableColumn>
          <TableColumn label="故障描述" prop="faultProblem"></TableColumn>
          <TableColumn label="操作" width="180">
            <template slot-scope="scope">
              <Button @click="itemDetail(scope.row)" type="text" typeOptions>查看</Button>
              <Button @click="itemEdit(scope.row)" type="text" typeOptions v-if="Auth(800022)">修改</Button>
              <Button @click="itemReview(scope.row)" type="text" typeOptions v-if="Auth(800023)">审核</Button>
              <Button @click="itemDelete(scope.row)" type="text" typeOptions v-if="Auth(800024)">删除</Button>
            </template>
          </TableColumn>
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
      totalCount: '',
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      }
    }
  },

  methods: {
    // 查看
    itemDetail(item) {
      console.log('点击查看', item)
      this.$router.push(`/repairKnowledge/todoRepositoryDetail/${item.id}?from=todoRepository`)
    },
    // 修改
    itemEdit(item) {
      console.log('点击修改', item)
      this.$router.push(`/repairKnowledge/todoRepositoryAdd/${item.id}`)
    },
    // 删除
    async itemDelete(item) {
      const isConfirm = await this.$confirm('确定删除吗')
      if (isConfirm == 'confirm') {
        let res = await this.postJson('eqp', {apiCode: 800024, content: {id: item.id}})
        if (res.code == 0) {
          this.showMsg('删除成功')
          this.query()
        } else {
          this.showMsg('删除失败', 'warning')
        }
      }
      // this.$router.push('/repairKnowledge/todoRepositoryAdd/' + item.id)
    },
    // 审核
    async itemReview(item) {
      const isConfirm = await this.$confirm('确定审核吗')
      if (isConfirm == 'confirm') {
        let res = await this.postJson('eqp', {apiCode: 800023, content: {id: item.id}})
        if (res.code == 0) {
          this.showMsg('审核成功')
          this.query()
        } else {
          this.showMsg('审核失败', 'warning')
        }
      }
      // this.$router.push('/repairKnowledge/todoRepositoryAdd/' + item.id)
    },
    // 初始化
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
        apiCode: 800026,
        content: this.confirmSearch
      })
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
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
