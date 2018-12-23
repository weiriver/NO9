<template>
  <div>

    <div>
      <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
      <!---->
      <div class="mb20" v-if="tableData && tableData.length > 0">
        <div class="content_title mb20">
          置换物品清单
        </div>
        <Table stripe :data="tableData" border style="width: 100%" >

          <TableColumn fixed label="序号" width="50" align="center" type="index">
          </TableColumn>
          <TableColumn
            label="物品类别">
            <template slot-scope="scope">
              {{ scope.row.goodsType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="物品类型名称" prop="goodsTypeName"></TableColumn>
          <TableColumn label="物品型号名称" prop="goodsVersionName"></TableColumn>
          <TableColumn label="数量" prop="amount"></TableColumn>
          <TableColumn label="物品序列号" prop="goodsCode"></TableColumn>
          <TableColumn
            label="出入库类型	"
          >
            <template slot-scope="scope">
              {{ scope.row.transfer | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="出入库单位" prop="minUnit"></TableColumn>
        </Table>
      </div>

    </div>

    <!--<Tabs class="_blue-header" type="border-card" @tab-click="tabClick">-->
    <!--<TabPane label="业务详情">-->
    <!---->
    <!--</TabPane>-->
    <!--<TabPane label="流程图">-->
    <!--<div>-->
    <!--流程图-->
    <!--</div>-->
    <!--</TabPane>-->


    <!--</Tabs>-->

  </div>
</template>

<script>
  export default {
    name: 'Subindex',
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
      formatList(list) {
        if (list) {
          var arr = list.map((item) => {
            return item.faultProblem
          })
          return arr.join(',')
        } else {
          return ''
        }

      },
      async getData(id) {
        var res = await this.postJson('eqp', {
          apiCode: 800012,
          content: {
            id
          }
        })
        console.log('res.content', res.content)
        this.tableData = res.content.replaceList
        this.detail = [
          {name: '工单编号', value: res.content.orderId},
          {name: '故障物品类别', value: this.GetTxt(res.content.goodsType)},
          {name: '物品类型', value: res.content.goodsTypeName},
          {name: '故障级别', value: this.GetTxt(res.content.faultLevel)},
          {name: '故障原因', value: res.content.faultReason},
          {name: '工单状态', value: this.GetTxt(res.content.status)},
          {name: '是否需要市州审核', value: this.GetTxt(res.content.needAudit)},
          {name: '站点编号', value: res.content.stationCode},
          {name: '区域名称', value: res.content.regionName},
          {name: '维修人', value: res.content.repairByName},
          {name: '维修原因', value: res.content.repairReason},
          {name: '是否纳入考评', value: this.GetTxt(res.content.needEvaluate)},
          {name: '审核人', value: res.content.auditByName},
          {name: '审核意见', value: res.content.auditReason},
          {name: '是否超时', value: this.GetTxt(res.content.timeout)},
          {name: '是否有配件更换', value: this.GetTxt(res.content.isReplace)},
          {name: '评分人', value: res.content.appraiseName},
          {name: '评分意见', value: res.content.appraiseReason},
          {name: '评分星级', value: this.GetTxt(res.content.score)},
          {name: '报修人', value: res.content.createByName},
          {name: '创建时间', value: res.content.createDate},
          {name: '最后更新人', value: res.content.updateByName},
          {name: '最后更新时间', value: res.content.lastUpdate},
          {name: '开始维修日期', value: res.content.firstRepairDate},
          {name: '维修完成日期', value: res.content.repairDate},
          {name: '审核日期', value: res.content.auditDate},
          {name: '选择的故障原因', value: this.formatList(res.content.questionList)}
        ]
      },
    },
    mounted() {
      let id = this.$route.params.id
      this.getData(id)
    }
  }
</script>

<style></style>