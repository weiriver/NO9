<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button type="primary" icon="el-icon-edit" @click="$router.push('/service/hurdlesLevelAdd')" v-if="Auth(300233)">
          新增
        </Button>
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
          <TableColumn label="故障级别" prop="nameX"></TableColumn>
          <TableColumn label="地市处理时限" prop="cityDealDatetime"></TableColumn>
          <TableColumn label="中心处理时限" prop="centerDealDatetime"></TableColumn>
          <TableColumn label="操作" width="120">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.id)" type="text" typeOptions v-if="Auth(300234)">修改</Button>
              <Button @click="deleteItem(scope.row.id)" type="text" typeOptions v-if="Auth(300235)">删除</Button>
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
  name: 'hurdlesLevel',
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
    // 修改
    editItem(id) {
      this.$router.push(`/service/hurdlesLevelAdd/${id}`)
    },
    // 删除按钮
    deleteItem(id) {
      this.dialogVisible = true
      this.deleteId = id
    },
    // 确认删除
    async confirmDelete() {
      var res = await this.postJson('station', {
        apiCode: 300235,
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
        apiCode: 300231,
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