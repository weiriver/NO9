<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button type="primary" icon="el-icon-plus" @click="$router.push('/manage/jkpSiteAdd')">
          新增
        </Button>
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="站点编号" prop="stationCode">
            <Input v-model="searchForm.stationCode" />
          </FormItem>
          <FormItem label="站点地址" prop="address">
            <Input v-model="searchForm.address" />
          </FormItem>
          <FormItem label="联系人" prop="contactUser">
            <Input v-model="searchForm.contactUser" />
          </FormItem>
          <FormItem label="联系电话" prop="contactMobile">
            <Input v-model="searchForm.contactMobile" />
          </FormItem>
          <FormItem label="建站时间" prop="setupTime">
            <DatePicker v-model="searchForm.setupTime" @change="dateEvent"
                        type="daterange" value-format="yyyy-MM-dd" style="width: 100%"
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
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="站点编号" prop="stationCode"></TableColumn>
          <TableColumn label="站点地址" prop="address"></TableColumn>
          <TableColumn label="身份证号" prop="idcard"></TableColumn>
          <TableColumn label="联系人" prop="contactUser"></TableColumn>
          <TableColumn label="联系人电话" prop="contactMobile"></TableColumn>
          <TableColumn label="性别" prop="sex">
            <template slot-scope="scope">
              {{ scope.row.sex === null ? '' : (scope.row.sex === 'male' ? '男' : '女') }}
            </template>
          </TableColumn>
          <TableColumn label="建站时间">
            <template slot-scope="scope">
              {{ scope.row.setupTime | ToDate }}
            </template>
          </TableColumn>
          <TableColumn label="操作" width="120">
            <template slot-scope="scope">
              <Button @click="viewDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
              <Button @click="deleteItem(scope.row.id)" type="text" typeOptions>删除</Button>
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
  name: 'jkpSite',
  data() {
    return {
      dialogVisible: false,
      deleteId: '',
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      searchForm: {
        page: 1
      },
      confirmSearch: {
        page: 1
      }
    }
  },
  methods: {
    // 日期转换
    dateEvent(date) {
      this.searchForm.beginSetupTime = date[0]
      this.searchForm.endSetupTime = date[1]
    },
    // 查看
    viewDetail(id) {
      this.$router.push(`/manage/jkpSiteDetail/${id}`)
    },
    // 修改
    editItem(id) {
      this.$router.push(`/manage/jkpSiteAdd/${id}`)
    },
    // 删除按钮
    deleteItem(id) {
      this.dialogVisible = true
      this.deleteId = id
    },
    // 确认删除
    async confirmDelete() {
      var res = await this.postJson('station', {
        apiCode: 300244,
        content: {
          id: this.deleteId
        }
      })
      if (res.code == 0) {
        this.showMsg('删除成功', 'success')
        this.dialogVisible = false
        this.init()
      } else {
        this.showMsg(res.msg, 'warning')
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
    async query() {
      var res = await this.postJson('station', {
        apiCode: 300241,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
    }
  },
  mounted() {
    this.init()
    this.tableHeight = this.tableHeightCal('el-main', 190)
  }
}
</script>

<style scoped>

</style>