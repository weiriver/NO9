<template>
  <div>
    <DetailList :title="'销量基本信息'" :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>

<script>
  export default {
    name: 'ZfSaleDetail',
    data() {
      return {
        detail: []
      }
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300111,
        content: {
          id
        }
      })
      this.detail = [
        {name: '销量ID', value: res.content.id},
        {name: '游戏类型', value: res.content.gameTypeName},
        {name: '大厅编码', value: res.content.hallCode},
        {name: '销售时间', value: res.content.saleDate},
        {name: '销售额', value: res.content.sales}
      ]
      console.log('res.content', res.content)
    }
  }
</script>

<style scoped>

</style>