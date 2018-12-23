<template>
  <div class="Attention">
    <TablePage :totalCount="totalCount" ref="tabelPage">
      <!-- 查询部分 -->
      <div class="searchBox" slot="query">
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="业务标题">
            <Input v-model="searchForm.bizTitle"/>
          </FormItem>
          <FormItem label="业务类型">
            <Select v-model="searchForm.flowId" clearable>
              <Option v-for="item in flowList" :value="item.id" :key="item.id" :label="item.flowName"></Option>
            </Select>
          </FormItem>
          <FormItem label="申请日期">
            <DatePicker type="daterange" v-model="selectDateValue" @change="selDateEvent" value-format="yyyy-MM-dd"></DatePicker>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm', 'confirmSearch')">清空</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 表格部分 -->
      <div slot="TableSlot">
        <Table stripe :data="data1" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn label="序号" width="50" type="index" align="center" :index="indexMethod"></TableColumn>
          <TableColumn label="业务标题" prop="bizTitle" minWidth="240" sortable></TableColumn>
          <TableColumn label="业务类型" prop="flowName" minWidth="170" sortable></TableColumn>
          <TableColumn label="处理时间" prop="applyDate" minWidth="110" sortable>
            <template slot-scope="scope">
              <span>{{scope.row.createDate ? scope.row.createDate.substr(0, 10) : ''}}</span>
            </template>
          </TableColumn>
          <TableColumn label="当前处理人" prop="currentByName" minWidth="170" sortable></TableColumn>
          <TableColumn label="当前步骤" prop="nodeName" minWidth="170" sortable></TableColumn>
          <TableColumn label="操作" minWidth="110">
            <template slot-scope="scope">
              <Button @click="viewDetail(scope.row)" type="text">查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'Attention',
  data() {
    return {
      flowList: [],
      loading: true, // 表格加载
      tableHeight: 0, // 默认是300
      filterStr: '', // 过滤的输入字符
      selectDateValue: '',// 日期
      totalCount: 0,
      data1: [],// 表格内容信息
      confirmSearch: {
        sysModule: 'station',
        page: 1,
        limit: 20
      },
      searchForm: {
        sysModule: 'station',
        page: 1,
        limit: 20
      },
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.confirmSearch.page - 1) * 20
    },
    resetForm(formName, comfirmName) {
      this[formName] = this[comfirmName] = {
        page: 1,
        limit: 20,
        sysModule: 'station'
      }
      this.selectDateValue = ''
    },
    async getFlowList() {
      var res = await this.postJson('common', {
        apiCode: 200127,
        content: {
          paginated: false
        }
      })
      if (res.code && res.code == 0) {
        this.flowList = res.content.dataList
      }
    },
    arrFilter() {
      if (this.filterStr) {
        this.data1 = this.ArrFilter(this.filterStr, this.dataCache)
      } else {
        this.query()
      }
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
    // 查询
    async query() {
      this.loading = true
      var res = await this.postJson('common', {
        apiCode: 200064,
        content: this.confirmSearch
      })
      this.loading = false
      if (res.code && res.code == 0) {
        var dataList = res.content.dataList
        this.data1 = this.dataCache = dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    // 申请日期
    selDateEvent(date) {
      this.searchForm.createDateStart = date[0]
      this.searchForm.createDateEnd = date[1]
    },
    tableEditButtonFlag(flag) {
      if (flag) {
        return 'inline'
      } else {
        return 'none'
      }
    },
    viewDetail(item) {
      item.referer = 'attention'
      item.currentNodeName = item.nodeName
      sessionStorage.setItem('applyDetail', JSON.stringify(item))
      this.$router.push('/index/applyDetail?from=attention')
    }
  },
  mounted: function () {
    this.getFlowList()
    this.init()
    this.tableHeight = this.tableHeightCal('el-main', 150)
  },
}
</script>

<style scoped>

</style>