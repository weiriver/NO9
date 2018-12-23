<template>
  <div>

    <Tabs class="_blue-header" type="border-card" @tab-click="tabClick">
      <TabPane label="业务详情">
        <div>
          <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
          <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

            <TableColumn fixed label="序号" type="index" width="50" align="center"></TableColumn>
            <TableColumn label="物品编号" prop="goodsId"></TableColumn>
            <TableColumn label="物品名称" prop="goodsName"></TableColumn>
            <TableColumn label="数量">
              <template slot-scope="scope">
                <div v-if="scope.row.amountMax">
                  {{ scope.row.amountMax }}{{ scope.row.maxUnit }}
                </div>
                <div v-if="scope.row.amountMin">
                  {{ scope.row.amountMin }}{{ scope.row.minUnit }}
                </div>
              </template>
            </TableColumn>
            <TableColumn label="单价" prop="price"></TableColumn>
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
        <Mysteps :nodeList='nodeList'></Mysteps>
      </TabPane>
    </Tabs>

  </div>
</template>

<script>
import Mysteps from '../../../../../../components/mysteps/MySteps'

export default {
  name: 'Subindex',
  data: function () {
    return {
      res: '',
      Obj: {},
      tableHeight: 0,
      msg: '',
      detail: [
        {name: '单据编号', value: 'xxx'}
      ],
      tableHeader: [],
      tableData: [],
      nodeList: [],
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
      var res = await this.postJson('ws', {
        apiCode: 501404,
        content: {
          id: this.$route.params.id
        }
      })
      console.log('数据返回', res.content)
      let arr = this.$store.state['all_enumDic'].FlowEnum$flowTypeEnum
      let flowId = arr.find(v => {
        return v.text == 'dispatch_flow'
      }).value
      this.getFlowInfo(flowId)
      this.tableData = res.content.detailList
      let detailData = res.content.stDispatchBiz.content
      this.detail = [
        {name: '单据编号', value: detailData.bizId},
        {name: '单据主题', value: detailData.title},
        {name: '出库人员', value: detailData.createByName},
        {name: '出库日期', value: detailData.createDate},
        {name: '调出仓库', value: detailData.fromWarehouseName},
        {name: '调入仓库', value: detailData.toWarehouseName},
        {name: '备注', value: detailData.remark}
      ]
    },
    // 获取流程图
    getFlowInfo(flowId) {
      this.postJsonWithMask('common', {
        apiCode: 200053,
        content: {
          flowId: 38,
          sysModule: 'storage'
        }
      }).then(res => {
        const nodelist = res.content.nodeList
        this.nodeList = nodelist
      })
    },
    tabClick(tab, event) {
      console.log(tab, event)
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  },
  components: {Mysteps}
}
</script>

<style></style>
