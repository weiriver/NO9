<template>
  <div>
    <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>
    <Table stripe :data="testQuestionList"  border style="width: 100%"
           ref="tableSelection">
      <TableColumn type="index" label="序号" width="50"></TableColumn>
      <TableColumn label="题目类型" prop="questionType">
        <template slot-scope="scope">
          {{ scope.row.questionType | getTxt }}
        </template>
      </TableColumn>
      <TableColumn label="题号" prop="id"></TableColumn>
      <TableColumn label="题目" prop="testQuestionName"></TableColumn>
      <TableColumn label="选项">
        <template slot-scope="scope">
          {{ scope.row.answers  }}
        </template>
      </TableColumn>
      <TableColumn label="正确答案" prop="rightAnswers"></TableColumn>
      <TableColumn label="所属课程" prop="courseName"></TableColumn>
      <TableColumn label="操作" width="120">
        <template slot-scope="scope">
          <Button @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
          <Button @click="deleteItem(scope.row.id)" type="text" typeOptions>删除</Button>
        </template>
      </TableColumn>
    </Table>

  </div>
</template>

<script>
  export default {
    name: 'Subindex',
    data: function () {
      return {
        detail: [],
        testQuestionList: []
      }
    },
    methods: {
    },
    async mounted() {
      let id = this.$route.params.id
      var res = await this.postJson('train', {
        apiCode: 650001,
        content: {
          id
        }
      })
      var resData = res.content.dataList
      this.detail = [
        {name: '课程名称', value: resData.courseName},
        {name: '课件类型', value: this.GetTxt(resData.coursewareType)},
        {name: '课件名称', value: resData.courseware},
        {name: '课题类型', value: resData.courseTypeName},
        {name: '供应商名称', value: resData.courseName},
        {name: '状态', value: this.GetTxt(resData.status)},
        {name: '新建人名称', value: resData.createByName},
        {name: '新建时间', value: resData.createDate},
        {name: '修改人名称', value: resData.updateByName},
        {name: '最后修改时间', value: resData.lastUpdate},

        {name: '单选题数', value: resData.singleNum},
        {name: '多选题数', value: resData.multiNum},
        {name: '已发布成功单选题数', value: resData.singleIssuedNum},
        {name: '已发布成功多选题数', value: resData.multiIssuedNum},
      ]
      this.testQuestionList = resData.testQuestionPageList
     }
  }
</script>

<style></style>
