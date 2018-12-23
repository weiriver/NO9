<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">
      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn
                  label="序号"
                  width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="站点区域等级" prop="stationAreaLevel"></TableColumn>
          <TableColumn label="旧值" prop="oldLimitRadius"></TableColumn>
          <TableColumn label="新值" prop="newLimitRadius"></TableColumn>
          <TableColumn label="修改时间" prop="lastUpdate"></TableColumn>
          <TableColumn label="修改人" prop="updateByName"></TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'protectRadiusChangeRecord',
  data() {
    return {
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1
      }
    }
  },
  methods: {
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.query()
    },
    async query() {
      var res = await this.postJson('station', {
        apiCode: 300127,
        content: this.confirmSearch
      })
      console.log(res)
      this.tableData = res.content.dataList
      for (let i = 0; i < this.tableData.length; i++) {
        this.tableData[i].inputStatus = false
      }
      this.totalCount = res.content.dataPage.totalCount
    },
  },
  mounted() {
    this.confirmSearch.id = this.$route.params.id
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style scoped>

</style>