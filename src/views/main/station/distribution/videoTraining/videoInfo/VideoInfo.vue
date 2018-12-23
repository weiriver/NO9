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
        <Form :inline="true" class="form-inline" label-width="140px" size="mini" :model="dataForm" ref="dataForm">
          <FormItem label="视频标题" prop="name">
            <Input v-model="dataForm.videoTitle"></Input>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search">查询</Button>
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
          <TableColumn label="视频标题" prop="videoTitle"></TableColumn>
          <TableColumn label="视频介绍" prop="videoIntro"></TableColumn>
          <TableColumn label="视频状态" prop="videoStatus">
            <template slot-scope="scope">
              <span>{{scope.row.videoStatus.text}}</span>
            </template>
          </TableColumn>
          <TableColumn label="备注" prop="videoRemark"></TableColumn>
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
      dialogVisible: false,// 删除modal框
      loading: false,
      deleteId: '',// 删除记录ID
      // 查询列表信息(暂时不用)
      Obj: {
        apiCode: 300286,
        content: {
          page: 1
        }
      },
      // 删除
      ObjDelete: {
        apiCode: 300289,
        content: {
          id: ''
        }
      },
      // 表单提交数据绑定model
      dataForm: {},
      // 翻页不查询
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      totalCount: 0,
      tableHeight: 0,
      tableDataFacilities: []
    }
  },
  computed: {
    runningstateList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
    }
  },
  watch: {},
  methods: {
    toAdd() {
      this.$router.push(`/distribution/videoInfoAdd`)
    },
    toDetail(id) {
      this.$router.push(`/distribution/videoInfoDetail/` + id)
    },
    editItem(id) {
      this.$router.push(`/distribution/videoInfoAdd/` + id)
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
      var apiCode = 300286
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
