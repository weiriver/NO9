<template>
  <div style="position: relative;">
    <div style="position: absolute;top: 0;right: 0;z-index: 10;">
      <Button @click="$router.go(-1)">返回</Button>
    </div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <div>
      <h3 class="mt10 mb20">
        答案情况如下
      </h3>
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="问题" prop="questionContent"></TableColumn>
          <TableColumn label="选项" prop="answers"></TableColumn>
          <TableColumn label="类型">
            <template slot-scope="scope">
              <span>{{scope.row.answersDetaill}}</span>
            </template>
          </TableColumn>
          <TableColumn label="答案" prop="answersDetaill"></TableColumn>
        </Table>
      </div>
    </div>

  </div>
</template>

<script>

  export default {
    name: 'StatisticAnalysisDetail',
    data: function () {
      return {
        detail: [],
        tableData: [
          {}
        ],
        tableHeight: 0,
        confirmSearch: {
          page: 1,
          lastUpdate: '',
          createDateBegin: '',
          createDateEnd: ''
        }
      }
    },
    methods: {
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('train', {
        apiCode: 610006,
        content: {
          surveySiteId: id
        }
      })
      console.log(res.content)
      this.detail = [
        {name: '问卷编号', value: res.content.surveySite.surveyId},
        {name: '调查站点', value: res.content.surveySite.stationCode},
        {name: '发起时间', value: res.content.surveySite.commitTime},
        {name: '提交状态', value: res.content.surveySite.readFlag ? '是' : '否'}
      ]
      console.log('res.content', res.content)
      this.tableData = res.content.answerList
      this.tableHeight = this.tableHeightCal('el-main', 300)
    }
  }
</script>

<style lang="scss">
</style>
