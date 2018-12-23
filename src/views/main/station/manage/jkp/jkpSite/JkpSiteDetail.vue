<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>

<script>
export default {
  name: 'jkpSiteDetail',
  data() {
    return {
      detail: []
    }
  },
  methods: {
    // 加载详情
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300245,
        content: { id }
      })
      if (res.code == 0) {
        const {sex, setupTime} = res.content
        this.detail = [
          {name: 'ID', value: res.content.id},
          {name: '站点地址', value: res.content.address},
          {name: '站点编号', value: res.content.stationCode},
          {name: '身份证号', value: res.content.idcard},
          {name: '联系人', value: res.content.contactUser},
          {name: '联系人电话', value: res.content.contactMobile},
          {name: '性别', value: sex === 'male' ? '男' : '女'},
          {name: '建站时间', value: this.ToTime(setupTime)}
        ]
      } else {
        this.showMsg(res.msg, 'warning')
      }
    }
  },
  mounted() {
    this.getInfo(this.$route.params.id)
  }
}
</script>

<style scoped>

</style>