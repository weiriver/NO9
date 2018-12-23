<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="站点编码" prop="stationCode">
            <Input v-model="searchForm.stationCode"/>
          </FormItem>
          <FormItem label="负责人" prop="stationOwner">
            <Input v-model="searchForm.stationOwner"/>
          </FormItem>

          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight"
               ref="tableSelection"
               @select="handleSelect" @select-all="handleSelectAll">
          <TableColumn type="selection" width="55"></TableColumn>
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="站点编号" prop="stationCode"></TableColumn>
          <TableColumn label="负责人" prop="nameX"></TableColumn>
          <TableColumn label="移动电话" prop="mobile"></TableColumn>
          <TableColumn label="经营模式" prop="operateModeName"></TableColumn>
          <TableColumn label="备注" prop="remark"></TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>

export default {
  name: 'SitesChoose',
  data: function () {
    return {
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      totalCount: 20,
      tableHeight: 0,
      tableData: [
        {}
      ],
      checkedItems: [],
      questionlist: []
    }
  },
  props: {
    resetTableHeight: 0
  },
  methods: {
    handleSelectAll(selection) {
      console.log('点击全选的情况', selection)
      this.tableData.forEach((row) => {
        this.handleSelect(selection, row)
      })
    },
    handleSelect(selection, row) {
      console.log('selection, row', selection.includes(row))
      var rowIndex = -1
      this.checkedItems.forEach((item, index) => {
        if (item.stationCode === row.stationCode) {
          rowIndex = index
        }
      })
      if (selection.indexOf(row) > -1 && rowIndex == -1) {
        this.checkedItems.push(row)
      } else if (selection.indexOf(row) == -1 && rowIndex > -1) {
        this.checkedItems.splice(rowIndex, 1)
      }
    },
    initCheckedItems() {
      // 获取到数据时候判定是否是之前 已经勾选的项
      if (this.$refs.tableSelection) {
        this.$refs.tableSelection.clearSelection()
        var rows = this.checkedItems
        console.log(rows)
        if (rows && rows.length > 0) {
          rows.forEach((row) => {
            this.tableData.forEach((nowRow) => {
              if (nowRow.stationCode == row.stationCode) {
                this.$refs.tableSelection.toggleRowSelection(nowRow, true)
              }
            })
          })
        }
      }
    },
    // 列表加载
    async init_list() {
      this.Event.$on('pagechange', async (val) => {
        console.log(val)
        this.confirmSearch.page = val
        await this.query()
        this.initCheckedItems()
      })
      this.search()
    },
    async search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      await this.query()
      this.initCheckedItems()
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
    },
    // 请求调拨单列表
    async query() {
      var res = await this.postJson('station', {
        apiCode: 300002,
        content: this.confirmSearch
      })
      this.tableData = res.content.dataList
      console.log(this.tableData)
      this.totalCount = res.content.dataPage.totalCount
    }
  },
  mounted() {
    if (this.resetTableHeight) {
      this.tableHeight = this.tableHeightCal('el-main', this.resetTableHeight)
    } else {
      this.tableHeight = this.tableHeightCal('el-main', 150)
    }
    this.init_list()
  }
}
</script>

<style lang="scss"></style>
