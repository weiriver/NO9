<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-edit" @click="$router.push('/trainSurvey/PublishQuestion')">
          新增
        </Button>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="问卷名称">
            <Input v-model="searchForm.surveyTitle"/>
          </FormItem>
          <FormItem label="所属区域">
            <AreaCascader ref="as" :ruturnAllLevelResultFlag="true" v-model="searchForm.regionCode"
                          @areaSelectResult="areaSelectResult" :stage="1"></AreaCascader>
          </FormItem>
          <FormItem label="发布方式">
            <Select clearable v-model="searchForm.publishType" placeholder="请选择发布方式">
              <Option v-for="item in publishTypeList" :key="item.value" :value="item.value"
                      :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="发布时间" prop="createDate">
            <DatePicker @change="dataChange" v-model="searchForm.data" range-separator="至" type="daterange"
                        placeholder="选择日期" value-format="yyyy-MM-dd"
            ></DatePicker>
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

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="问卷名称" prop="surveyTitle"></TableColumn>
          <TableColumn label="问卷编号" prop="surveyNo"></TableColumn>
          <TableColumn label="发送方式" width="100">
            <template slot-scope="scope">
              {{ scope.row.publishType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="发起时间" prop="createDate"></TableColumn>
          <TableColumn label="发起人" prop="createByName"></TableColumn>
          <TableColumn label="回收/发送问卷数" prop="repairByName">
            <template slot-scope="scope">
              {{ scope.row.commitCount + '/' + scope.row.stationCount }}
            </template>
          </TableColumn>
          <TableColumn label="回收率" prop="finishRate"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" size="small">详情</Button>
              <Button @click="itemDelete(scope.row)" type="text" typeOptions>删除</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false, // 删除弹出框flag
      deleteId: '', // 删除的id
      confirmSearch: {
        page: 1,
        lastUpdate: '',
        createDateBegin: '',
        createDateEnd: ''
      },
      searchForm: {
        page: 1
      },
      totalCount: 20,
      tableHeight: 0,
      res: '',
      Obj: {},
      msg: '',
      tableData: []
    }
  },
  computed: {
    publishTypeList() {
      return this.$store.state.all_enumDic.TrainEnum$PublishTypeEnum
    }
  },
  methods: {
    // 查询-所属区域改变触发事件
    areaSelectResult(result) {
      // 第一次加载会触发但是 result是空
      if (result.length > 0) {
        this.searchForm.regionCode = result[result.length - 1].value
        // this.searchForm.regionName = result[result.length - 1].label
      } else {
        this.searchForm.regionCode = ''
        // this.searchForm.regionName = ''
      }
      console.log(this.searchForm.regionCode)
      // console.log(this.searchForm.regionName)
    },
    // 查询-日期改变触发事件
    dataChange(val) {
      if (val) {
        this.searchForm.createDateBegin = val[0]
        this.searchForm.createDateEnd = val[1]
      } else {
        this.searchForm.createDateBegin = ''
        this.searchForm.createDateEnd = ''
      }
    },
    // 删除
    itemDelete(item) {
      this.$confirm('确定删除吗？')
        .then(async (_) => {
          let res = await this.postJson('train', {apiCode: 610004, content: {id: item.id}})
          if (res.code == '0') {
            this.showMsg('删除成功')
            setTimeout(() => {
              this.query()
            }, 100)
          } else {
            this.showMsg('删除失败', 'warning')
          }
        })
        .catch(_ => {
          console.log('取消')
        })
    },
    toDetail(id) {
      this.$router.push(`/trainSurvey/statisticAnalysisDetail/${id}`)
    },
    indexFn(index) {
      console.log(index)
      return index
    },
    editItem(id) {
      this.$router.push(`/repair/inventoryInManageDetail/${id}`)
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
      if (this.confirmSearch.lastUpdate) {
        this.confirmSearch.createDateBegin = this.confirmSearch.lastUpdate[0]
        this.confirmSearch.createDateEnd = this.confirmSearch.lastUpdate[1]
      }
      this.query()
    },
    async query() {
      var res = await this.postJson('train', {
        apiCode: 610001,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        console.log(res.content.dataList)
        this.tableData = []
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
      this.$refs.as.clear()
      console.log(this[formName])
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style lang="scss">
  .el-date-editor {
    width: 100% !important;
  }
</style>