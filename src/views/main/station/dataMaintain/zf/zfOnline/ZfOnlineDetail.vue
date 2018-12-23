<template>
  <div>
    <DetailList :title="'站点基本信息'" :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <DetailList :title="'电脑票投注机编号列表'" :keyName="'name'" :valueName="'value'"></DetailList>
    <p>{{codeList}}</p>
  </div>
</template>

<script>
export default {
  name: 'zfOnlineDetail',
  data() {
    return {
      detail: [],
      codeList: ''
    }
  },
  async mounted() {
    let id = this.$route.params.id
    var res = await this.postJson('station', {
      apiCode: 300100,
      content: {
        id
      }
    })
    this.detail = [
      {name: '销售厅ID', value: res.content.id},
      {name: '销售厅机器台数', value: res.content.deviceNum},
      {name: '管理机设备类型名称', value: res.content.deviceTypeName},
      {name: '销售厅域名账号', value: res.content.domainAccount},
      {name: '销售厅地址', value: res.content.hallAddress},
      {name: '销售厅面积', value: res.content.hallArea},
      {name: '销售厅所属区域', value: res.content.hallCityCode},
      {name: '销售厅编号', value: res.content.hallCode},
      {name: '销售厅名称', value: res.content.hallName},
      {name: '销售厅开建时间', value: res.content.hallOpentime ? res.content.hallOpentime.split(' ')[0] : ''},
      {name: '销售厅电话(座机)', value: res.content.hallPhone},
      {name: '值班经理电话', value: res.content.managerMobile},
      {name: '销售厅值班经理', value: res.content.managerName},
      {name: '销售厅人员数量', value: res.content.peopleNum},
      {name: '技术员联系方式', value: res.content.technicalMobile},
      {name: '技术人员', value: res.content.technicalName},
      {name: '幸运彩投注机编号列表', value: res.content.xycDeviceCodes},
      {name: '即开票投注机编号列表', value: res.content.jkpDeviceCodes}
    ]
    this.codeList = res.contentdnpDeviceCodes
    console.log('res.content', res.content)
  }
}
</script>

<style scoped>

</style>