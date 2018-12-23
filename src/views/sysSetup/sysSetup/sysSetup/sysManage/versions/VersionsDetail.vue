<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>

<script>
  export default {
    name:'ItemBankDetail',
    data() {
      return {
        detail: []
      }
    },
    methods: {
      async init() {
        var res = await this.postJson('account', {
          apiCode: 100032,
          content: {
            id: this.$route.params.id
          }
        })
        console.log('res.content-detail', res.content)
        this.detail = [
          {name: '名称', value: res.content.nameX},
          {name: '英文名称', value: res.content.nameEn},
          {name: '登录链接', value: res.content.accessUrl},
          {name: '系统路由', value: res.content.link},
          {name: '系统模块', value: this.GetTxt(res.content.sysModule)},
          {name: '系统类型', value: this.GetTxt(res.content.typeX)},
          {name: '详细描述', value: res.content.remark}
        ]
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style>

</style>
