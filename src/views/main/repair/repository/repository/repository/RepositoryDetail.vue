<template>
  <div>

    <div>

      <DetailList :keyName="'name'" :valueName="'value'" :detailList="detail"></DetailList>

      <Table stripe :data="tableData" border style="width: 100%">

        <TableColumn fixed label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{scope.$index+1+(searchForm.page-1)*20}} </span>
          </template>
        </TableColumn>
        <TableColumn label="解决方法描述" prop="answer"></TableColumn>
        <TableColumn label="点赞数" prop="thumbs"></TableColumn>
        <TableColumn label="创建人" prop="createByName"></TableColumn>
        <TableColumn label="创建日期" prop="createDate"></TableColumn>
        <TableColumn label="操作" prop="createDate">
          <template slot-scope="scope">
            <!--<Button type="text" typeOptions @click="itemDetail(scope.row)">查看</Button>-->
            <Button type="text" typeOptions v-if="isFromTodoRepository" @click="itemEdit(scope.row)">修改</Button>
            <Button type="text" typeOptions @click="itemDelete(scope.row)">删除</Button>
          </template>
        </TableColumn>

      </Table>
    </div>

    <!--<Dialog-->
    <!--title="解决方法详情"-->
    <!--:visible.sync="dialogVisible"-->
    <!--width="70%">-->
    <!--<DetailList :keyName="'name'" :valueName="'value'" :detailList="solutionDetail"></DetailList>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<Button type="primary" @click="dialogVisible = false">确 定</Button>-->
    <!--</div>-->
    <!--</Dialog>-->

  </div>
</template>

<script>
export default {
  name: 'RepositoryDetail',
  data: function () {
    return {
      solutionDetail: [],
      isFromTodoRepository: false,
      tableHeight: 0,
      detail: [],
      tableData: [],
      searchForm: {
        page: 1,
        status: ''
      }
    }
  },
  methods: {
    // 查看
    itemDetail(item) {
      console.log('点击查看', item)
      this.dialogVisible = true
      this.solutionDetail = [
        {name: 123, value: 123213}
      ]
    },
    // 修改
    itemEdit(item) {
      console.log('点击修改', item)
      this.$router.push(`/repairKnowledge/todoSolutionAdd/${item.id}`)
    },
    // 删除
    async itemDelete(item) {
      const isConfirm = await this.$confirm('确定删除吗')
      if (isConfirm == 'confirm') {
        let res = await this.postJson('eqp', {apiCode: 800035, content: {id: item.id}})
        if (res.code == 0) {
          this.showMsg('删除成功')
          this.init()
        } else {
          this.showMsg('删除失败', 'warning')
        }
      }
    },
    async init(id) {
      const res = await
        this.postJson('eqp', {apiCode: 800021, content: {id}})
      if (res.code == 0) {
        this.rebuildDetailData(res.content)
        this.tableData = res.content.answerLists
        console.log(this.tableData)
      }
    },
    rebuildDetailData(data) {
      this.detail = [
        {name: '物品类别', value: data.goodsType.text},
        {name: '物品类型', value: data.goodsTypeName},
        {name: '审核状态', value: data.status ? '已审核' : '未审核'},
        {name: '故障描述', value: data.faultProblem}
        // {name: '是否在APP显示', value: data.showApp ? '是' : '否'},
      ]
    }
  },
  mounted() {
    if (this.$route.query.from == 'todoRepository') {
      this.isFromTodoRepository = true
    } else {
      this.isFromTodoRepository = false
    }
    this.tableHeight = this.tableHeightCal('el-main', 150)
    const {id} = this.$route.params
    this.init(id)
  }
}
</script>

<style></style>
