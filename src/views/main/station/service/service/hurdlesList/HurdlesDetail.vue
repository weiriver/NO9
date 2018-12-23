<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>
<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: [],
      }
    },
    methods: {
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300156,
        content: {
          id
        }
      })
      this.detail = [
        {name: '工单编号', value: res.content.orderCode},
        {name: '申请站点', value: res.content.stationCode},
        {name: '故障类别', value: res.content.extInfo},
        {name: '申请时间', value: res.content.createDate},
        {name: '所属区域', value: res.content.regionName},
        {name: '状态', value: res.content.status.text},
        {name: '处理人', value: res.content.handlelBy},
        {name: '处理时间', value: res.content.handlelTime},
        {name: '处理结果', value: res.content.handleResult}
      ]
    }
  }
</script>