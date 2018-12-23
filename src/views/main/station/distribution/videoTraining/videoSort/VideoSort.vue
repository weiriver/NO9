<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit" @click="toAdd">新增</Button>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="dataForm" size="mini"
              ref="dataForm">
          <FormItem label="类别名称" prop="name">
            <Input v-model="dataForm.videoSortName"></Input>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('dataForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableDataFacilities" :height="tableHeight" border style="width: 100%" v-if="tableHeight">

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="视频类别名称" prop="videoSortName"></TableColumn>
          <TableColumn label="状态">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.videoSortStatus.value" typeOptions
                          @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="start">启用</RadioButton>
                <RadioButton label="stop">停用</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
              <Button @click="opendelete(scope.row.id)" type="text" typeOptions>删除</Button>
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
        apiCode: 300281,
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
      this.$router.push(`/distribution/videoSortAdd`)
    },
    toDetail(id) {
      this.$router.push(`/distribution/videoSortDetail/` + id)
    },
    editItem(id) {
      this.$router.push(`/distribution/videoSortAdd/` + id)
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
      var apiCode = 300283
      var res = await this.postJson('station', {
        apiCode,
        content: {
          id: id,
          videoSortStatus: value
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
      var apiCode = 300281
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
