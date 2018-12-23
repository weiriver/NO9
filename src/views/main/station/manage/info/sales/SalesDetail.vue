<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>

<script>
export default {
  name: 'salesDetail',
  data() {
    return {
      detail: []
    }
  },
  methods: {
    // 加载详情
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300035,
        content: { id }
      })
      if (res.code == 0) {
        const {cultureDegree, sex} = res.content
        this.detail = [
          {name: '业主ID', value: res.content.id},
          {name: '业主姓名', value: res.content.nameX},
          {name: '工号', value: res.content.empNo},
          {name: '电话', value: res.content.mobile},
          {name: '年龄', value: res.content.age},
          {name: '身份证', value: res.content.idCard},
          {name: '户籍地址', value: res.content.hkAddress},
          {name: '学历', value: cultureDegree ? cultureDegree.text : ''},
          {name: '考试成绩', value: res.content.examResult},
          {name: '性别', value: sex ? sex.text : ''},
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