<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-edit" @click="$router.push('/sysSetup/systemManage/subsysAdd')"
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
          <TableColumn min-width="80" label="名称" prop="nameX"></TableColumn>
          <TableColumn min-width="120" label="缩写" prop="code"></TableColumn>
          <TableColumn min-width="220" label="前端跳转路由" prop="link"></TableColumn>
          <TableColumn min-width="50" label="类型" prop="typeX"></TableColumn>
          <TableColumn min-width="50" label="排序" prop="seq"></TableColumn>
          <TableColumn label="状态" prop="status" min-width="140" >
            <template slot-scope="scope">
              <RadioGroup v-if="Auth('account:100036')" v-model="scope.row.status"
                          @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="true">启用</RadioButton>
                <RadioButton label="false">停用</RadioButton>
              </RadioGroup>
              <span v-if="!Auth('account:100036')">
                {{ scope.row.state | getTxt }}
              </span>

            </template>
          </TableColumn>
          <TableColumn
            label="操作"
            width="70">
            <template slot-scope="scope">
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
      async statusChange(value, id) {
        console.log('新状态的值', value, id)
        var res = await this.postJson('common', {
          apiCode: 200025,
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
      editItem(id) {
        this.$router.push(`/sysSetup/systemManage/subsysAdd/${id}`)
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
        this.confirmSearch.sysModule = this.sysName
        var res = await this.postJson('common', {
          apiCode: 200021,
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
