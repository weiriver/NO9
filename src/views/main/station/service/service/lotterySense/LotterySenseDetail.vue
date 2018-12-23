<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <h3 class="mt10 mb20">
      图片信息
    </h3>
    <div style="width: 150px;height: 150px;" v-if="showImg">
      <img style="width: 100%;height: 100%;" :src="detailImg" />
    </div>
    <h3 class="mt10 mb20">
      介绍信息
    </h3>
    <div v-html="introduction"></div>
    <br/>
  </div>
</template>
<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: [],
        awardList: [],
        detailImg: '',
        introduction: '',
        showImg: false
      }
    },
    methods: {
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300265,
        content: {
          id
        }
      })
      if (res.content.imgUrl && res.content.imgUrl != null) {
        this.showImg = true
      }
      this.detailImg = res.content.imgUrl
      this.introduction = res.content.introduction
      this.detail = [
        {name: '标题', value: res.content.commonSenseTitle},
        {name: '类别', value: res.content.commonSenseType? res.content.commonSenseType.text : ''},
        {name: '是否广告', value: res.content.isAdv? '是' : '否'},
        {name: '区域', value: res.content.regionName},
        {name: '状态', value: res.content.commonSenseStatus? res.content.commonSenseStatus.text: ''},
        {name: '发布时间', value: res.content.publishTime}
      ]
    }
  }
</script>