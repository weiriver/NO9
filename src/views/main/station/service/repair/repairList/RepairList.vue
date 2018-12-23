<template>
  <div class="RepairList">

    <TablePage :totalCount="totalCount">

      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit"
                @click="handle(selectIds)">批量处理
        </Button>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="站点编号" prop="stationCode">
            <Input v-model="searchForm.stationCode"></Input>
          </FormItem>
          <FormItem label="所属区域" prop="regionCode">
            <div v-model="searchForm.regionCode">
              <AreaCascader ref="as" @areaSelectResult="areaSelectResult" :stage="3" :res="searchForm.regionCode"
                            :select_any_level_flag="true" :ruturnAllLevelResultFlag="true"></AreaCascader>
            </div>
          </FormItem>
          <FormItem label="设备类型" prop="equDeviceTypeId">
            <Select v-model="searchForm.equDeviceTypeId" placeholder="请选择" clearable>
              <Option v-for="item in equDeviceTypeList" :value="item.id" :key="item.id"
                      :label="item.deviceTypeName"></Option>
            </Select>
          </FormItem>
          <FormItem label="故障级别" prop="faultLevelId">
            <Select v-model="searchForm.faultLevelId" placeholder="请选择" clearable>
              <Option v-for="item in faultLevelList" :value="item.id" :key="item.id" :label="item.nameX"></Option>
            </Select>
          </FormItem>
          <FormItem label="状态" prop="status">
            <Select v-model="searchForm.status" placeholder="请选择" clearable>
              <Option v-for="item in statusList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight"
               @selection-change="handleSelectionChange">
          <TableColumn type="selection" width="55" :selectable="selectAbleFn"></TableColumn>
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="订单编号" prop="orderCode"></TableColumn>
          <TableColumn label="申请时间" prop="createDate"></TableColumn>
          <TableColumn label="申请站点" prop="stationCode"></TableColumn>
          <TableColumn label="故障级别" prop="faultLevelName"></TableColumn>
          <TableColumn label="故障描述" prop="remark"></TableColumn>
          <TableColumn label="状态" prop="status"></TableColumn>
          <TableColumn
             label="操作"
             width="170">
            <template slot-scope="scope">
              <Button @click="$router.push('/service/repairDetail/' + scope.row.id)" type="text" typeOptions>查看</Button>
              <Button @click="handle([scope.row.id])" type="text" typeOptions v-if="scope.row.status.text==='待处理'">处理
              </Button>
            </template>
          </TableColumn>
        </Table>

      </div>

    </TablePage>

  </div>
</template>

<script>
export default {
  name: 'RepairList',
  data: function () {
    return {
      searchForm: {
        page: 1
      },
      equDeviceTypeList: [], // 设备类型
      faultLevelList: [], // 故障级别
      statusList: [], // 状态
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      selectIds: [],
      confirmSearch: {
        page: 1
      }
    }
  },
  methods: {
    // 所属区域结果
    areaSelectResult(val) {
      if (val.length > 0) {
        this.searchForm.regionCode = val[val.length - 1].value
      } else {
        this.searchForm.regionCode = ''
      }
    },
    async getEquDeviceTypeList() {
      var res = await this.postJson('station', {
        apiCode: 300081,
        content: {limit: 32767}
      })
      console.log(res)
      this.equDeviceTypeList = res.content.dataList
    },
    async getFaultLevelList() {
      var res = await this.postJson('station', {
        apiCode: 300231,
        content: {limit: 32767}
      })
      this.faultLevelList = res.content.dataList
    },
    getStatusList() {
      this.statusList = this.$store.state.station_enumDic.StationEnum$maintenanceOrderStatusEnum
    },
    // 勾选触发的事件
    handleSelectionChange(val) {
      console.log(val)
      this.selectIds = []
      val.forEach((value) => {
        this.selectIds.push(value.id)
      })
      console.log(this.selectIds)
    },
    async handle(handleIds) {
      if (!handleIds || handleIds.length == 0) {
        this.showMsg('请选择需要处理的工单', 'error')
        return
      }
      let id = handleIds.join(',')
      var res = await this.postJson('station', {
        apiCode: 300332,
        content: {id}
      })
      if (res.code === '0') {
        this.showMsg('处理成功')
        this.init()
      }
    },
    // 勾选选择可以操作与否的判断
    selectAbleFn(row, index) {
      if (row.status.text === '待处理') {
        return true
      } else {
        return false
      }

    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.searchForm.page = val
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
      var res = await this.postJson('station', {
        apiCode: 300330,
        content: this.searchForm
      })
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
      this.$refs.as.clear()
    }
  },
  mounted() {
    this.getEquDeviceTypeList()
    this.getFaultLevelList()
    this.getStatusList()
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style lang="scss">
</style>