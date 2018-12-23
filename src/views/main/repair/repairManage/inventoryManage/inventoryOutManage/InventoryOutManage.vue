<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="维修单编号" prop="repairOrderId">
            <Input v-model="searchForm.repairOrderId" />
          </FormItem>
          <FormItem label="物品序列号" prop="goodsCode">
            <Input v-model="searchForm.goodsCode" />
          </FormItem>
          <FormItem label="出库时间" prop="lastUpdate">
            <DatePicker type="daterange" placeholder="选择日期" v-model="searchForm.lastUpdate" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
            ></DatePicker>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="维修单编号" prop="repairOrderId"></TableColumn>
          <TableColumn label="物品序列号" prop="goodsCode"></TableColumn>
          <TableColumn
            label="物品类别"
            width="100">
            <template slot-scope="scope">
              {{ scope.row.goodsType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="物品类型" prop="goodsTypeName"></TableColumn>
          <TableColumn label="出库时间" prop="lastUpdate"></TableColumn>
          <TableColumn label="维修员信息" prop="repairByName"></TableColumn>
          <TableColumn
            label="操作"
            width="140">
            <template slot-scope="scope">
              <Button  @click="editItem(scope.row.id)" type="text" size="small">查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
  export default {
    name: 'InventoryOutManage',
    data: function () {
      return {
        confirmSearch: {
          page: 1,
          lastUpdate: ''
        },
        searchForm: {
          page: 1,
          status: ''
        },
        totalCount: 20,
        tableHeight: 0,

        res: '',
        Obj: {},
        msg: '',
        tableData: [
          {}
        ]
      }
    },
    methods: {
      editItem (id) {
        console.log('点击修改', id)
        this.$router.push(`/repair/inventoryOutManageDetail/${id}`)
      },
      async init() {
        this.Event.$on('pagechange', (val) => {
          this.confirmSearch.page = val
          this.query()
        })
        this.search()
      },
      search () {
        this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
        this.Event.$emit('pageInit', 1)
        if (this.confirmSearch.lastUpdate) {
          this.confirmSearch.createDateBegin = this.confirmSearch.lastUpdate[0]
          this.confirmSearch.createDateEnd = this.confirmSearch.lastUpdate[1]
        }
        this.query()
      },
      async query() {
        var res = await this.postJson('eqp', {
          apiCode: 800041,
          content: this.confirmSearch
        })
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
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
  .el-date-editor{
    width: 100% !important;
  }
</style>
