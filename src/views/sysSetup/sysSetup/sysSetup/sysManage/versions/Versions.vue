<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-edit" @click="$router.push('/sysSetup/systemManage/versionsAdd')"
                v-if="Auth('account:700001')">新增
        </Button>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="版本号">
            <Input v-model="searchForm.appVersion"/>
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
          <TableColumn min-width="80" label="版本名称" prop="contentName"></TableColumn>
          <TableColumn min-width="120" label="版本号" prop="appVersion"></TableColumn>
          <TableColumn min-width="170" label="创建时间" prop="createDate"></TableColumn>
          <TableColumn min-width="120" label="终端型号" prop="modelType"></TableColumn>
          <TableColumn label="状态" prop="status" min-width="80" >
            <template slot-scope="scope">
              <span>
                {{ scope.row.status === '0' ? '未发布' : '已发布' }}
              </span>

            </template>
          </TableColumn>
          <TableColumn
            label="操作"
            min-width="210">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" >查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" v-if="Auth(700002)">修改</Button>
              <Button @click="deleteItem(scope.row.id)" type="text" v-if="Auth(700005)">删除</Button>
              <Button @click="publishItem(scope.row.id)" type="text" v-if="Auth(700006)">发布</Button>
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
    // 获取系统管理里面最上面一排系统菜单的变化
    computed: {
      sysName() {
        return this.$store.state.sysName ? this.$store.state.sysName : sessionStorage.getItem('sysName')
      }
    },
    // 一旦变化了就实时获取数据
    watch: {
      sysName() {
        this.query()
      }
    },
    methods: {
      async publishItem(id) {
        var res = await this.postJson('ids', {
          apiCode: 700006,
          content: {
            id
          }
        })
        if (res.code == 0) {
          this.showMsg('发布终端版本成功')
          this.init()
        } else {
          this.showMsg('发布终端版本失败', 'warning')
        }
      },
      async deleteItem(id) {
        const isConfirm = await this.$confirm('确定删除吗')
        if (isConfirm == 'confirm') {
          const res = await this.postJson('ids', {
            apiCode: 700005,
            content: {id}
          })
          if (res.code == 0) {
            this.showMsg('删除成功')
            this.init()
          } else {
            this.showMsg('删除失败', 'warning')
          }
        }
      },
      toDetail(id) {
        this.$router.push(`/sysSetup/systemManage/versionsDetail/${id}`)
      },
      editItem(id) {
        this.$router.push(`/sysSetup/systemManage/versionsAdd/${id}`)
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
        var res = await this.postJson('ids', {
          apiCode: 700004,
          content: this.confirmSearch
        })
        this.tableData = res.content.lists
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
