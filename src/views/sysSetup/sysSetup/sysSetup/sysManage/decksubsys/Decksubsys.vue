<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-edit" @click="$router.push('/sysSetup/systemManage/decksubsysAdd')"
                v-if="Auth('account:100033')">新增
        </Button>
        <!--</ButtonGroup>-->
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
          <TableColumn label="系统名称" prop="nameX"></TableColumn>
          <TableColumn label="状态" prop="status" min-width="140">
            <template slot-scope="scope">
              <RadioGroup v-if="Auth('account:100036')" v-model="scope.row.status.value"
                          @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="on">启用</RadioButton>
                <RadioButton label="off">停用</RadioButton>
              </RadioGroup>
              <span v-if="!Auth('account:100036')">
                {{ scope.row.status | getTxt }}
              </span>

            </template>
          </TableColumn>
          <TableColumn label="创建时间" prop="createDate" min-width="140">
            <template slot-scope="scope">
              {{ scope.row.createDate | ToDate }}
            </template>
          </TableColumn>
          <TableColumn
             label="操作"
             width="100">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text">查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" v-if="Auth(500011)">修改</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      confirmSearch: {
        page: 1
      },
      totalCount: 20,
      res: '',
      tableHeight: 0,
      tableData: [],
      searchForm: {
        page: 1
      }
    }
  },
  methods: {
    async statusChange(value, id) {
      console.log('新状态的值', value, id)
      var res = await this.postJson('account', {
        apiCode: 100036,
        content: {
          id: id
        }
      })
      console.log('数据返回', res.content)
      if (res.content.updated == 1) {
        this.showMsg('状态修改成功', 'success')
        this.init()
      }
    },
    toDetail(id) {
      this.$router.push(`/sysSetup/systemManage/decksubsysDetail/${id}`)
    },
    editItem(id) {
      this.$router.push(`/sysSetup/systemManage/decksubsysAdd/${id}`)
    },
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
      var res = await this.postJson('account', {
        apiCode: 100031,
        content: this.confirmSearch
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

<style></style>
