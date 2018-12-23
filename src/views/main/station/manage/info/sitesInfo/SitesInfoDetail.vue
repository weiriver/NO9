<template>
  <div class="SitesInfoDetail">
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>

<script>
export default {
  name: 'SitesInfoDetail',
  data() {
    return {
      detail: []
    }
  },
  methods: {
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300212,
        content: {stationId: id}
      })
      if (res.code == 0 ) {
        res = res.content
        this.detail = [
          {name: '站点编号', value: res.stationId},
          {name: '合同编号', value: res.contractSN},
          {name: '所属区域', value: res.regionName},
          {name: '代销商', value: res.agentName},
          {name: '站点类型', value: res.stationTypeCNName},
          {name: '账户控制类型', value: res.accountTypeCNName},
          {name: '负责人', value: res.responsor},
          {name: '联系电话', value: res.phone},
          {name: '移动电话', value: res.cellPhone},
          {name: '可用余额下限', value: res.accountLimit},
          {name: '票打印地址', value: res.printAddr},
          {name: '联系地址', value: res.address}
        ]
      }
    }
  },
  mounted() {
    // 路由传参
    var {id} = this.$route.params
    this.getInfo(id)
  }
}
</script>

<style lang="scss" scoped>
</style>