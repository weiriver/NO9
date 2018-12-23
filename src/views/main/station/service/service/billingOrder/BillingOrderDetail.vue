<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <h3 class="mt10 mb20">
      订单信息
    </h3>
    <!--表格-->
    <div slot="TableSlot">
      <Table stripe :data="orderList" border style="width: 100%">
        <TableColumn fixed label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+1}} </span>
          </template>
        </TableColumn>
        <TableColumn label="即开票编号" prop="jkpCode"></TableColumn>
        <TableColumn label="即开票名称" prop="jkpName"></TableColumn>
        <TableColumn label="序列号" prop="batchCode"></TableColumn>
        <TableColumn label="包号" prop="packageCode"></TableColumn>
        <TableColumn label="申请数量" prop="applyNumber"></TableColumn>
        <TableColumn label="实发数量" prop="outboundNumber"></TableColumn>
      </Table>
    </div>
    <br/>
  </div>
</template>
<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: [],
        orderList: []
      }
    },
    methods: {
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300146,
        content: {
          id
        }
      })
      this.detail = [
        {name: '站点编号', value: res.content.stationCode},
        {name: '订单总额', value: res.content.feeTotal+ '元'},
        {name: '订单编码', value: res.content.orderCode},
        {name: '订单状态', value: res.content.state.text},
        {name: '处理人', value: res.content.userName},
        {name: '申请时间', value: res.content.createDate},
        {name: '出库时间', value: res.content.deliveryDate},
        {name: '发放说明', value: res.content.remark},
        {name: '撤销时间', value: res.content.cancelDate}
      ]
      if (res.content.details) {
        this.orderList = res.content.details
      }
    }
  }
</script>