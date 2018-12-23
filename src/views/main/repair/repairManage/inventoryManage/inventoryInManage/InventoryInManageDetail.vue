<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
      <TableColumn label="序号" type="index" width="50"></TableColumn>
      <TableColumn label="物品序列号" prop="goodsCode"></TableColumn>
      <TableColumn label="物品类别">
        <template slot-scope="scope">
          {{ scope.row.goodsType | getTxt }}
        </template>
      </TableColumn>
      <TableColumn label="物品类型" prop="goodsTypeName"></TableColumn>
      <TableColumn label="物品型号" prop="goodsVersionName"></TableColumn>
      <TableColumn label="数量" prop="amount" width="50"></TableColumn>
      <TableColumn label="单位" prop="minUnit" width="50"></TableColumn>
      <TableColumn label="出入库状态">
        <template slot-scope="scope">
          {{ scope.row.transfer | getTxt }}
        </template>
      </TableColumn>
    </Table>
  </div>
</template>

<script>
  export default {
    name: 'InventoryInManageDetail',
    data: function () {
      return {
        res: '',
        Obj: {},
        tableHeight: 0,
        msg: '',
        detail: [],
        tableHeader: [],
        tableData: [
        ],
        searchForm: {
          status: ''
        }
      }
    },
    methods: {
      async init() {
        this.Event.$on('pagechange', (val) => {
          console.log(val)
          this.query(val)
        })
        var res = await this.postJson('eqp', {
          apiCode: 800042,
          content: {
            id: this.$route.params.id
          }
        })
        console.log('数据返回', res.content)
        this.tableData.push(res.content)
        this.detail = [
          {name: '维修单ID ', value: res.content.repairId},
          {name: '维修单编号', value: res.content.repairOrderId},
          {name: '操作时间', value: res.content.lastUpdate},
          {name: '维修员姓名', value: res.content.repairByName}
        ]
      },
      query() {
      },
      search() {
        console.log('查询', this.searchForm)
        this.init()
      },
      resetForm(formName) {
        this[formName] = {
          status: ''
        }
      },
      tabClick(tab, event) {
        console.log(tab, event)
      }
    },
    mounted() {
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style></style>
