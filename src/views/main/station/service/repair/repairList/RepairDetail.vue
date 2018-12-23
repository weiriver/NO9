<template>
  <div>
    <DetailList :title="'基本信息'" :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <DetailList :title="'故障解决方法'" :keyName="'name1'" :valueName="'value1'" :detailList="[]"></DetailList>
    <Table stripe :data="tableData"border style="width: 100%">
      <TableColumn
              label="序号"
              type="index"
              width="50">
      </TableColumn>
      <TableColumn label="描述" prop="description" sortable></TableColumn>
      <TableColumn label="解决方法" prop="solution" sortable></TableColumn>
    </Table>
  </div>
</template>

<script>
  export default {
    name: 'RepairDetail',
    data() {
      return {
        detail: [],
        tableData: []
      }
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300331,
        content: {
          id
        }
      })
      this.detail = [
        {name: '站点编号', value: res.content.stationCode},
        {name: '工单编号', value: res.content.orderCode},
        {name: '设备类型', value: res.content.equDeviceTypeName},
        {name: '故障描述', value: res.content.remark},
        {name: '当前状态', value: res.content.status.text},
        {name: '维修评价', value: res.content.evaluation},
        {name: '评分', value: res.content.score},
        {name: '申请时间', value: res.content.createDate},
        {name: '维修完成时间', value: res.content.handlelTime},
        {name: '评价时间', value: res.content.evaluationDate}
      ]
      this.tableData = res.content.faultItemSolutionDetail
      console.log('res.content', res.content)
    }
  }
</script>

<style scoped>

</style>