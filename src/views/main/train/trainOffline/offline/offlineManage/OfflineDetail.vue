<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
  </div>
</template>

<script>
  export default {
    name: 'CourseTypeDetail',
    data() {
      return {
        detail: [],
      }
    },
    methods: {
      async init() {
        var res = await this.postJson('train', {
          apiCode: 660002,
          content: {
            id: this.$route.params.id
          }
        })
        console.log('数据返回', res.content)
        this.detail = [
          {name: '培训主题 ', value: res.content.title},
          {name: '培训对象', value: res.content.trainObject},
          {name: '培训类型', value: this.GetTxt(res.content.trainObjectType)},
          {name: '发布类型', value: this.GetTxt(res.content.publishType)},
          {name: '培训地点', value: res.content.trainAddress},
          {name: '培训说明', value: res.content.description},
          {name: '培训总人数', value: res.content.num},
          {name: '签到数', value: res.content.signNum},
          {name: '培训时间', value: res.content.trainTime},
          {name: '创建人', value: res.content.createByName},
          {name: '创建时间', value: res.content.createDate},
          {name: '备注', value: res.content.extInfo},
        ]
      }
    },
    mounted() {
      this.init()
    }
  }
</script>

<style></style>
