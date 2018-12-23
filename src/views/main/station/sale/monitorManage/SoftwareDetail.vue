<template>
  <div class="SoftwareDetail">

    <TablePage :totalCount="totalCount" :showPowerSearch="false">

      <!--顶部按钮组-->

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn label="投注站编号" prop="stationID"></TableColumn>
          <TableColumn label="系统版本号" prop="osVersion"></TableColumn>
          <TableColumn label="APP版本号" prop="appVersion"></TableColumn>
          <TableColumn label="子模块文件名" prop="modelName"></TableColumn>
          <TableColumn label="子模块版本号" prop="modelVersion"></TableColumn>
        </Table>
      </div>
    </TablePage>

  </div>
</template>

<script>
  export default {
    name: 'SoftwareDetail',
    data: function () {
      return {
        searchForm: {
          transStation: '',
          page: 1,
          limit: 20
        },
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
          this.searchForm.page = val
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
        var res = await this.postJson('station', {
          apiCode: 300166,
          content: this.searchForm
        })
        console.log(res)
        this.tableData = res.content.terminalSoftInfo
        this.totalCount = parseInt(res.content.count ? res.content.count : 0)
      },
      resetForm(formName) {
        this[formName] = {
          page: 1
        }
      }
    },
    mounted() {
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style lang="scss">
</style>