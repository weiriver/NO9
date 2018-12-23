<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-plus" @click="addItem" v-if="true">新增</Button>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'train'"
           :fileSaveName="'签到表'"
           :btnName="'导出签到表'"
           :isOther="true"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="标题" prop="title">
            <Input v-model="searchForm.title" placeholder="请输入课程类型"/>
          </FormItem>
          <FormItem label="培训地址" prop="trainAddress">
            <Input v-model="searchForm.trainAddress" placeholder="请输入课程类型"/>
          </FormItem>
          <FormItem label="培训时间" prop="courseTypeName">
            <DatePicker type="daterange" placeholder="选择日期" v-model="searchForm.createDate" value-format="yyyy-MM-dd"
            ></DatePicker>
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
          <TableColumn label="培训主题" prop="title"></TableColumn>
          <TableColumn label="培训时间" prop="trainTime"></TableColumn>
          <TableColumn label="培训地点/签到地点" prop="trainAddress"></TableColumn>
          <TableColumn label="培训参与人数/签到人数" prop="description">
            <template slot-scope="scope">
              {{ scope.row.num }} / {{ scope.row.signNum }}
            </template>
          </TableColumn>
          <TableColumn
             label="二维码"
          >
            <template slot-scope="scope">
              {{ }}
            </template>
          </TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="viewDetail(scope.row.id)" type="text" size="small">详情</Button>
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
      checkboxList: [], // 导出弹框-展示出来的多选框
      exportObj: {
        apiCode: 660006,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '签到表'
        }
      },
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
      this.$router.push(`/trainOffline/offlineDetail/${id}`)
    },
    // 新增
    addItem() {
      this.$router.push('/trainOffline/offlineAdd')
    },
    // 弹出删除对话框
    deleteItem(id) {
      this.dialogVisible = true
      this.deleteId = id
    },
    // 确认删除
    async confirmDelete() {
      var res = await this.postJson('train', {
        apiCode: 660004,
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
      if (this.searchForm.createDate) {
        this.searchForm.trainStartTime = this.searchForm.createDate[0]
        this.searchForm.trainEndTime = this.searchForm.createDate[1]
      }
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    // 请求列表数据
    async query() {
      var res = await this.postJson('train', {
        apiCode: 660003,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        console.log(res.content.dataList)
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    async initExportList() {
      var res = await this.postJson('train', {
        apiCode: 660005,
        content: {}
      })
      if (res.code == 0) {
        this.checkboxList = []
        res.content.dataQry.colCNNames.forEach((v, i) => {
          this.checkboxList.push({
            text: v,
            value: res.content.dataQry.colNames[i]
          })
        })
      }
    },
    resetForm(formRef) {
      this.$refs[formRef].resetFields()
      this.searchForm = {
        page: 1
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
    this.initExportList()
  }
}
</script>

<style lang="scss">
  .el-date-editor {
    width: 100% !important;
  }
</style>
