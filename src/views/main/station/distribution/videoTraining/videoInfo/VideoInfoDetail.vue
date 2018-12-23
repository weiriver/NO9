<template>
    <div>
        <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
        <DetailList :title="'附件记录'"></DetailList>
        <!--表格-->
        <div slot="TableSlot">
            <Table stripe :data="detail1" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
                <TableColumn fixed label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
                    </template>
                </TableColumn>
                <TableColumn label="ID" prop="id"></TableColumn>
                <TableColumn label="视频名称" prop="fileName"></TableColumn>
                <TableColumn label="视频格式" prop="fileType"></TableColumn>
                <TableColumn label="视频大小" prop="fileSize"></TableColumn>
                <TableColumn label="上传人" prop="createByName"></TableColumn>
                <TableColumn
                        label="操作"
                        width="140">
                    <template slot-scope="scope">
                        <Button @click="toDownLoad(scope.row.id)" type="text" typeOptions>下载</Button>
                    </template>
                </TableColumn>
            </Table>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        tableHeight: '200',
        confirmSearch: {
          page: 1
        },
        detail: [],
        detail1: []
      }
    },
    methods: {
    },
    toDownLoad () {
      // window.open(params.row.httpUrl, 'blank')
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300290,
        content: {
          id
        }
      })
      this.detail = [
        {name: '视频标题', value: res.content.videoDetailInfo.videoTitle},
        {name: '视频状态', value: res.content.videoDetailInfo.videoStatus.text},
        {name: '上传人', value: res.content.videoDetailInfo.videoUpPerson},
        {name: '视频类别', value: '无'},
        {name: '备注', value: res.content.videoDetailInfo.videoRemark},
        {name: '上传时间', value: res.content.videoDetailInfo.videoUpTime},
        {name: '视频介绍', value:res.content.videoDetailInfo.videoIntro}
      ]
      this.detail1 = [
        // {id: '34', fileName: '海报--汉文.jpg', fileType: 'jpg', fileSize: '512', createByName: '慕容'},
        // {id: '56', fileName: '年会.png', fileType: 'png', fileSize: '1024', createByName: '筹备'}
      ]
      this.detail1 = res.content.videoDetailInfo.isRecommend
    }
  }
</script>

<style></style>
