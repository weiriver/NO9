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
        apiCode: 300285,
        content: {
          id
        }
      })
      this.detail = [
        {name: '视频类别', value: res.content.videoSortName},
        {name: '类别状态', value: res.content.videoSortStatus.text}
      ]
    }
  }
</script>