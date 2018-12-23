<template>
  <div class="ZFOnline">

    <TablePage :totalCount="totalCount">

      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit"
                @click="$router.push('/dataMaintain/zfOnlineAdd')">新增
        </Button>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="销售厅编号" prop="hallCode">
            <Input v-model="searchForm.hallCode	"></Input>
          </FormItem>
          <FormItem label="销售厅名称" prop="hallName">
            <Input v-model="searchForm.hallName"></Input>
          </FormItem>
          <FormItem label="区域编号" prop="cityCode">
            <Input v-model="searchForm.cityCode"></Input>
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
          <TableColumn label="销售厅编号" prop="hallCode"></TableColumn>
          <TableColumn label="销售厅名称" prop="hallName"></TableColumn>
          <TableColumn label="区域编号" prop="hallCityCode"></TableColumn>
          <TableColumn
             label="操作"
             width="170">
            <template slot-scope="scope">
              <Button @click="$router.push('/dataMaintain/zfOnlineAdd/' + scope.row.id)" type="text" typeOptions>修改
              </Button>
              <Button @click="$router.push('/dataMaintain/zfOnlineDetail/' + scope.row.id)" type="text" typeOptions>
                查看详情
              </Button>
              <Button @click="deleteFile(scope.row.id)" type="text" typeOptions v-if="true">删除</Button>
            </template>
          </TableColumn>
        </Table>

      </div>

    </TablePage>

  </div>
</template>

<script>
export default {
  name: 'ZFOnline',
  data: function () {
    return {
      searchForm: {
        page: 1
      },
      deleteId: '', // 删除的id
      dialogVisible: false, // 删除弹窗flag
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1
      }
    }
  },
  methods: {
    // 点击删除
    async deleteFile(id) {
      const flag = await this.$confirm(`确定移除?`)
      if (flag == 'confirm') {
        const res = await this.postJson('station', {
          apiCode: 300099,
          content: {id}
        })
        if (res.code == 0) {
          this.tableData = this.tableData.filter(file => {
            return file.id != id
          })
          this.showMsg('删除成功')
        }
      }
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.searchForm.page = val
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
        apiCode: 300096,
        content: this.searchForm
      })
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style lang="scss">
</style>