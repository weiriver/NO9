<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-plus" @click="$router.push('/manage/salesAdd')" v-if="Auth(300032)">
          新增
        </Button>
        <Print
           :btnStyle="'border-radius: 0'"
           :tableHeader="tableHeader"
           :printTitle="'销售员信息列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'station'"
           :fileSaveName="'销售员信息列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="工号">
            <Input v-model="searchForm.empNo"/>
          </FormItem>
          <FormItem label="销售员姓名">
            <Input v-model="searchForm.nameX"/>
          </FormItem>
          <FormItem label="所属站点">
            <Input v-model="searchForm.stationCode"/>
          </FormItem>
          <FormItem label="手机号码">
            <Input v-model="searchForm.mobile"/>
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
          <TableColumn label="工号" prop="empNo"></TableColumn>
          <TableColumn label="销售员姓名" prop="nameX"></TableColumn>
          <TableColumn label="所属站点" prop="stationCode"></TableColumn>
          <TableColumn label="手机号码" prop="mobile"></TableColumn>
          <TableColumn label="操作" width="120">
            <template slot-scope="scope">
              <Button @click="viewDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" typeOptions v-if="Auth(300033)">修改</Button>
              <Button @click="deleteItem(scope.row.id)" type="text" typeOptions v-if="Auth(300034)">删除</Button>
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
  name: 'sales',
  data() {
    return {
      dialogVisible: false,
      deleteId: '',
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      searchForm: {
        masterFlag: 'sales',
        page: 1
      },
      confirmSearch: {
        masterFlag: 'sales',
        page: 1
      },
      // 打印表头
      tableHeader: [
        {
          text: '工号',
          value: 'empNo'
        },
        {
          text: '销售员姓名',
          value: 'nameX'
        },
        {
          text: '所属站点',
          value: 'stationCode'
        },
        {
          text: '手机号码',
          value: 'mobile'
        }
      ],
      // 导出弹窗
      checkboxList: [],
      // 导出对象
      exportObj: {
        apiCode: 300036,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '销售员信息列表'
        }
      }
    }
  },
  methods: {
    // 查看
    viewDetail(id) {
      this.$router.push(`/manage/salesDetail/${id}`)
    },
    // 修改
    editItem(id) {
      this.$router.push(`/manage/salesAdd/${id}`)
    },
    // 删除按钮
    deleteItem(id) {
      this.dialogVisible = true
      this.deleteId = id
    },
    // 确认删除
    async confirmDelete() {
      var res = await this.postJson('station', {
        apiCode: 300034,
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
        apiCode: 300031,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
        this.checkboxList = []
        res.content.dataQry.colCNNames.forEach((v, i) => {
          this.checkboxList.push({
            text: v,
            value: res.content.dataQry.colNames[i]
          })
        })
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    resetForm(formName) {
      this[formName] = {
        masterFlag: 'sales',
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