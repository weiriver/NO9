<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <DetailList :title="'银行信息'" :keyName="'name'" :valueName="'value'" :detailList="detail1"></DetailList>
    <DetailList :title="'其他'" :keyName="'name'" :valueName="'value'" :detailList="detail2"></DetailList>
  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: [],
        detail1: [],
        detail2: [],
      }
    },
    methods: {
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('ws', {
        apiCode: 500014,
        content: {
          id
        }
      })
      this.detail = [
        {name: '供应商名称', value: res.content.supplierName},
        {name: '负责人', value: res.content.contactUser},
        {name: '手机号码', value: res.content.mobile},
        {name: '电话号码', value: res.content.phone},
        {name: '省市', value: res.content.regionName},
        {name: '邮箱', value: res.content.email},
        {name: '详细地址', value: res.content.address}
      ]
      this.detail1 = [
        {name: '开户银行', value: res.content.bank},
        {name: '银行账户', value: res.content.bankNum}
      ]
      this.detail2 = [
        {name: '备注', value: res.content.remark}
      ]
      console.log('res.content', res.content)
    }
  }
</script>

<style></style>
