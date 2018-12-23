<template>
  <div>
    <TablePage>
      <!-- 查询条件 -->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="工号" prop="empNo">
            <Input v-model="searchForm.empNo" placeholder="请输入工号"/>
          </FormItem>
          <FormItem label="销售员姓名" prop="nameX">
            <Input v-model="searchForm.nameX" placeholder="请输入销售员姓名"/>
          </FormItem>
          <FormItem label="所属站点" prop="stationCode">
            <Input v-model="searchForm.stationCode" placeholder="请输入所属站点"/>
          </FormItem>
          <FormItem label="手机号码" prop="mobile">
            <Input v-model="searchForm.mobile" placeholder="请输入手机号码"/>
          </FormItem>
          <FormItem label="销售员资质" prop="salesType">
            <Input v-model="searchForm.salesType" placeholder="请输入销售员资质"/>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 表格 -->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="工号" prop="empNo" sortable></TableColumn>
          <TableColumn label="销售员姓名" prop="nameX" sortable></TableColumn>
          <TableColumn label="所属站点" prop="stationCode" sortable></TableColumn>
          <TableColumn label="手机号码" prop="mobile" sortable></TableColumn>
          <TableColumn label="销售员资质" prop="salesType" sortable></TableColumn>
          <!-- <TableColumn
            label="销售员资质"
            sortable>
            <template slot-scope="scope">
              {{ scope.row.salesType | getTxt }}
            </template>
          </TableColumn> -->
          <TableColumn
            label="操作"
            width="100">
            <template slot-scope="scope">
              <Button @click="launchTrain(scope.row.index)" type="text" size="small">发起培训</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'salesList',
  data() {
    return {
      confirmSearch: {
        page: 1,
        masterFlag: 'sales'
      },
      searchForm: {
        page: 1,
        masterFlag: 'sales'
      },
      totalCount: 20,
      tableHeight: 0,
      tableData: []
    }
  },
  methods: {
    // 发起培训
    async launchTrain(index) {
      console.log('launchTrain', index, this.tableData[index])
      var res = await this.postJson('train', {
        apiCode: 670002,
        // content: this.tableData[index]
        content: {
          id: this.tableData[index].empNo,
          name: this.tableData[index].nameX,
          stationCode: this.tableData[index].stationCode,
          phone: this.tableData[index].mobile,
          salesType: this.tableData[index].salesType,
          regionCode: this.tableData[index].regionCode,
          regionName: this.tableData[index].regionName
        }
      })
      console.log(res)
      if (res.code == 0) {
        this.showMsg("成功发起培训", 'success')
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    // 初始加载
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query_sales()
      })
      this.search()
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query_sales()
    },
    // 请求列表数据
    async query_sales() {
      var res = await this.postJson('station', {
        apiCode: 300031,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        console.log(res)
        this.tableData = []
        let resList = res.content.dataList
        resList.forEach((item, index) => {
          this.tableData.push({
            index: index,
            empNo: item.empNo,
            nameX: item.nameX,
            stationCode: item.stationCode,
            mobile: item.mobile,
            // salesType: {value: 'newcomer', text: '新晋'},
            salesType: 'newcomer',
            regionCode: '650100000000',
            regionName: '乌鲁木齐'
          })
        })
        console.log('tableData', this.tableData)
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    // 重置搜索表单
    resetForm(formRef) {
      this.$refs[formRef].resetFields()
      this.searchForm = {
        page: 1,
        masterFlag: 'sales'
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style scoped>

</style>