<template>
  <div class="dataDicEdit tabBox" style="padding: 0 10px">
    <!--分组基本信息-->
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <!-- 所属站点 -->
    <div class="siteBelone">
      <h3 class="mb20">
        所管辖站点
      </h3>
      <div class="belone-detail">
        <Tag color="#fff" closable size="medium"
            @close="handleClose(item.stationCode)"
            v-for="item in stationGroups" :key="item.id">
          {{item.stationCode}}
        </Tag>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "sitesGroupDetail",
  data() {
    return {
      detail: [],
      groupId: "",
      stationGroups: []
    };
  },
  methods: {
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300045,
        content: { id }
      })
      if (res.code == 0) {
        var res = res.content
        this.stationGroups = res.stationGroups
        this.detail = [
          {name: '分组名称', value: res.nameX},
          {name: '是否公共组', value: res.isPublic ? '是':'否'},
          {name: '分组描述', value: res.groupDesc},
          {name: '创建时间', value: res.createDate}
        ]
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    async handleClose(stationCode) {
      if (this.Auth(300046)) {
        var res = await this.postJsonWithMask('station', {
          apiCode: 300046,
          content: {
            groupId: this.groupId,
            stationCode
          }
        })
        if (res.code === '0') {
          this.showMsg('删除成功')
          this.getInfo(this.groupId)
        } else {
          this.showMsg(res.msg, 'warning')
        }
      } else {
        this.showMsg('您没有删除该站点的权限', 'wraning')
      }
    }
  },
  mounted() {
    // 路由传参
    const { id } = this.$route.params;
    this.groupId = id;
    this.getInfo(id);
  }
};
</script>

<style lang="scss" scoped>
.el-tag{
  border: 1px solid #e9eaec;
  color: #495060;
  margin: 2px 4px 2px 0;
}
</style>