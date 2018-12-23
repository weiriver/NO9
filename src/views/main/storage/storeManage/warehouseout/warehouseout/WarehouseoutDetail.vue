<template>
  <div>

    <Tabs class="_blue-header" type="border-card" >
      <TabPane label="业务详情">
        <div>
          <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
          <Table stripe :data="tableData" border style="width: 100%" >
            <TableColumn type="index" label="序号" width="50" align="center"></TableColumn>
            <TableColumn label="物品编号" prop="goodsId" ></TableColumn>
            <TableColumn label="物品名称" prop="goodsName"></TableColumn>
            <TableColumn label="数量">
              <template slot-scope="scope">
                <div>
                  {{ scope.row.amountMax }}{{ scope.row.maxUnit }}
                </div>
                <div v-if="scope.row.minUnit">
                  {{ scope.row.amountMin }}{{ scope.row.minUnit }}
                </div>
              </template>
            </TableColumn>
            <!--<TableColumn label="大小单位转换值" prop="unitValue" ></TableColumn>-->
            <TableColumn label="单价" prop="price" ></TableColumn>
            <TableColumn label="金额">
              <template slot-scope="scope">
                <span v-if="scope.row.unitValue">
                  {{ scope.row.amountMax * scope.row.price + scope.row.amountMin * scope.row.price / scope.row.unitValue }}
                </span>
                <span v-if="!scope.row.unitValue">
                  {{ scope.row.amountMax * scope.row.price }}
                </span>
              </template>
            </TableColumn>
            <TableColumn label="备注" prop="remark"></TableColumn>
          </Table>
        </div>
      </TabPane>
      <TabPane label="流程图">
        <div>
          流程图
        </div>
      </TabPane>


    </Tabs>

  </div>
</template>
<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: [],
        tableData: []
      }
    },
    methods: {
    },
    async mounted() {
      let id = this.$route.params.id
      var state = location.hash.split('?')[1].split('=')[1]
      var apiCode = 501403
      if (state === 'todo') {
        apiCode = 501404
      } else {
        apiCode = 501406
      }
      var res = await this.postJson('ws', {
        apiCode,
        content: {
          id
        }
      })
      var flowData
      if (state === 'todo') {
        flowData = res.content.stDispatchBiz.content
      } else {
        flowData = res.content.stInventoryBiz.content
      }
      this.detail = [
        {name: '单据编号', value: flowData.id},
        {name: '单据主题', value: flowData.title},
        {name: '出库人员', value: flowData.createByName},
        {name: '出库日期', value: flowData.createDate},
        {name: '出库仓库', value: flowData.fromWarehouseName},
        {name: '入库仓库', value: flowData.toWarehouseName},
        {name: '关联单据', value: flowData.bizId},
        {name: '备注', value: flowData.remark}
      ]
      this.tableData = res.content.detailList
    }
  }
</script>

<style></style>
