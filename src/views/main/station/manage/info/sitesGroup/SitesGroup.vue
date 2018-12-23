<template>
  <div class="SitesGroup">
    <TablePage :totalCount="totalCount" ref="tabelPage">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button v-if="true" type="primary" icon="el-icon-plus"
                @click="$router.push('/manage/sitesGroupAdd')">新增
        </Button>
      </div>
      <!-- 查询部分 -->
      <div class="searchBox" slot="query">
        <div class="search-detail">
          <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
                ref="searchForm">
            <FormItem label="组名称">
              <Input v-model="searchForm.nameX"/>
            </FormItem>
            <FormItem label="创建人">
              <Input v-model="searchForm.createByName"/>
            </FormItem>
            <FormItem class="full-line">
              <Button type="primary" @click="search()">查询</Button>
              <Button @click="reset('searchForm','confirmSearch')">清空</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn label="序号" width="50" type="index" align="center" :index="indexMethod"></TableColumn>
          <TableColumn label="分组名称" prop="nameX"></TableColumn>
          <TableColumn label="是否公告组" prop="isPublic">
            <template slot-scope="scope">
              <span>{{scope.row.isPublic? '是':'否'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="分组描述" prop="groupDesc"></TableColumn>
          <TableColumn label="操作" width="200">
            <template slot-scope="scope">
              <Button @click="$router.push('/manage/sitesGroupDetail/' + scope.row.id)" type="text">查看</Button>
              <Button @click="$router.push('/manage/sitesGroupAdd/' + scope.row.id)" type="text" v-if="Auth(300043)">修改</Button>
              <Button @click="delGroup(scope.row.id)" type="text" v-if="Auth(300044)">删除</Button>
              <Button @click="showPartition(scope.row.id)" type="text">站点划分</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
    <!--站点划分-->
    <Dialog title="站点信息" :visible.sync="setGroupFlag" width="70%">
      <SetGroup :group-id="groupId"></SetGroup>
      <div slot="footer" class="dialog-footer setGroupFoot">
        <Button type="text" @click="closeGroupDialog">取 消</Button>
        <Button type="primary" @click="closeGroupDialog">确 定</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import SetGroup from './StationSetGroup'

export default {
  name: 'SitesGroup',
  data() {
    return {
      tableData: [],
      tableHeight: 0,
      totalCount: 20,
      searchBox_flag: false, // 查询数据开始
      searchForm: {
        page: 1
      },
      setGroupFlag: false,// 站点划分弹窗
      groupId: 12,
      confirmSearch: {
        page: 1
      }
    }
  },
  components: {
    SetGroup
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.confirmSearch.page - 1) * 20
    },
    closeGroupDialog() {
      this.setGroupFlag = false
      this.Event.$on('pagechange')
    },
    async delGroup(id) {
      const flag = await this.$confirm('您确定要删除分组吗?').catch(() => {})
      if (flag == 'confirm') {
        var res = await this.postJsonWithMask('station', {
          apiCode: 300044,
          content: {id}
        })
        if (res.code === '0') {
          this.query()
          this.showMsg('删除成功')
        }
      }
    },
    //查询
    searchBack() {
      let tablePageObg = this.$refs['tabelPage']
      tablePageObg.isCollapse = !tablePageObg.isCollapse
    },
    // 重置
    reset(formName, confirmName) {
      this[formName] = this[confirmSearch] = {
        page: 1
      }
    },
    // 站点划分
    showPartition(id) {
      this.setGroupFlag = true
      this.groupId = id
      this.Event.$off('pagechange')
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
      this.loading = true
      var res = await this.postJson('station', {
        apiCode: 300041,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.loading = false
        this.tableData = res.content.dataList
        // var dataList = res.content.dataList
        // this.data1 = this.dataCache = dataList
        // this.data1 = dataList
        // this.setDataCache(this.data1)
        this.totalCount = res.content.dataPage.totalCount
      } else {
        this.showMsg(res.msg, 'warning')
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style lang="scss" scoped>
  //查询
  .searchBox {
    position: relative;
    .search-top .backBtn {
      position: absolute;
      right: 0;
      top: -45px;
    }
  }

  // 删除弹出框
  .del-body {
    text-align: center;
  }

  .delFoot {
    display: inline-block;
    width: 100%;
    button {
      width: 100%;
      padding: 10px 15px;
      background-color: #ed3f14;
      border-color: #ed3f14;
    }
  }
</style>