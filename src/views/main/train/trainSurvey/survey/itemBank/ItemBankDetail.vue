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
      var res = await this.postJson('train', {
        apiCode: 620003,
        content: {
          id: this.$route.params.id
        }
      })
      console.log('res.content-detail', res.content)
      this.detail = [
        {name: '题目编号', value: res.content.id},
        {name: '题目', value: res.content.questionContent},
        {name: '选项A', value: res.content.answersList[0]},
        {name: '选项B', value: res.content.answersList[1]},
        {name: '选项C', value: res.content.answersList[2]},
        {name: '选项D', value: res.content.answersList[3]},
        {name: '题目类型', value: this.GetTxt(res.content.questionType)}
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
