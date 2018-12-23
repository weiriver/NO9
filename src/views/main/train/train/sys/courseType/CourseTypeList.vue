<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button type="primary" icon="el-icon-plus" @click="addItem" v-if="true">新增</Button>
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="课程类型" prop="courseTypeName">
            <Input v-model="searchForm.courseTypeName" placeholder="请输入课程类型"/>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>
      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="课程类型" prop="courseTypeName"></TableColumn>
          <TableColumn label="添加分类人员" prop="createByName"></TableColumn>
          <TableColumn label="添加时间" prop="createDate"></TableColumn>
          <TableColumn label="说明" prop="description"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="viewDetail(scope.row.id)" type="text" size="small">详情</Button>
              <Button @click="editItem(scope.row.id)" v-if="true" type="text" size="small">修改</Button>
              <Button @click="deleteItem(scope.row.id)" v-if="true" type="text" size="small">删除</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
    <!-- 删除对话框 -->
    <Dialog title="确认删除？" :visible.sync="dialogVisible" width="50%">
      <span>删除后无法恢复，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <Button @click="dialogVisible = false">取消</Button>
        <Button type="danger" @click="confirmDelete">确认删除</Button>
      </span>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'CourseTypeList',
  data() {
    return {
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
        // status: ''
      },
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      dialogVisible: false,
      deleteId: ''
    }
  },
  methods: {
    // 详情
    viewDetail(id) {
      this.$router.push(`/train/courseTypeDetail/${id}`)
    },
    // 新增
    addItem() {
      this.$router.push('/train/courseTypeAdd/')
    },
    // 修改
    editItem(id) {
      this.$router.push(`/train/courseTypeAdd/${id}`)
    },
    // 弹出删除对话框
    deleteItem(id) {
      this.dialogVisible = true
      this.deleteId = id
    },
    // 确认删除
    async confirmDelete() {
      var res = await this.postJson('train', {
        apiCode: 630011,
        content: {
          id: this.deleteId
        }
      })
      if (res.code == 0) {
        this.showMsg('删除成功', 'success')
        this.dialogVisible = false
        this.init()
      }
    },
    // 初始加载
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    // 请求列表数据
    async query() {
      var res = await this.postJson('train', {
        apiCode: 630009,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        console.log(res.content.dataList)
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    resetForm(formRef) {
      this.$refs[formRef].resetFields()
      this.searchForm = {
        page: 1
      }
    },
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style lang="scss">
  .el-date-editor {
    width: 100% !important;
  }
</style>
