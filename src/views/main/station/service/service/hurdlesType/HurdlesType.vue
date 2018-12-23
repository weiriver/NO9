<template>
  <div>
    <TablePage :totalCount="totalCount" :showPowerSearch="false">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit" @click="toAdd">新增</Button>
        <!--</ButtonGroup>-->
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableDataFacilities" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="故障类型" prop="nameX"></TableColumn>
          <TableColumn label="状态">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.status.value" typeOptions
                          @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="on">启用</RadioButton>
                <RadioButton label="off">停用</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
    <Dialog
       title="提示"
       :visible.sync="dialogVisible"
       width="30%">
      <div>
        此操作将永久删除该记录, 是否继续?
      </div>
      <span slot="footer" class="dialog-footer">
      <Button @click="dialogVisible = false">取 消</Button>
      <Button type="primary" @click="deleteItem">确 定</Button></span>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      // 删除modal框
      dialogVisible: false,
      // 查询列表信息(暂不用)
      Obj: {
        apiCode: 300221,
        content: {
          page: 1
        }
      },
      // 删除
      ObjDelete: {
        apiCode: 300284,
        content: {
          id: ''
        }
      },
      // 表单提交数据绑定model
      dataForm: {},
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      totalCount: 0,
      tableHeight: 0,
      msg: '',
      tableDataFacilities: []
    }
  },
  computed: {
    runningstateList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
    }
  },
  watch: {
    typeX(val) {
      console.log('val', val)
      this.search()
    }
  },
  methods: {
    toAdd() {
      this.$router.push(`/service/hurdlesTypeAdd`)
    },
    editItem(id) {
      this.$router.push(`/service/hurdlesTypeAdd/` + id)
    },
    opendelete(id) {
      this.dialogVisible = true
      // 删除操作
      this.ObjDelete.content.id = id
    },
    async deleteItem() {
      this.postJson('station', this.ObjDelete).then(res => {
        if (res.code === '0') {
          this.showMsg('删除成功')
          this.dialogVisible = false
          this.query()
        }
      })
    },
    // 修改状态操作
    async statusChange(value, id) {
      var apiCode = 300226
      var res = await this.postJson('station', {
        apiCode,
        content: {
          id: id,
          status: value
        }
      })
      if (res.code == 0) {
        this.showMsg('状态修改成功', 'success')
        this.init()
      }
    },
    // 初始化查询内容
    initAboutTypeX() {
      this.searchForm = this['dataForm']
      this.searchForm.page = 1
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
      this.initAboutTypeX()
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      console.log('this.confirmSearch', this.confirmSearch)
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      var apiCode = 300221
      var res = await this.postJson('station', {
        apiCode,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableDataFacilities = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    resetForm(formName) {
      this[formName] = {}
      this.searchForm = {}
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style></style>
