<template>
  <div class="SitesStatus">

    <TablePage :totalCount="totalCount">

      <!--顶部按钮组-->
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="站点状态" prop="StationType">
            <Select v-model="searchForm.StationType" placeholder="请选择" clearable>
              <Option v-for="item in StationType" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="所属区域" prop="regionID">
            <Select v-model="searchForm.regionID" placeholder="请选择" clearable>
              <Option v-for="item in regionIdList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="代理商" prop="agentID">
            <Select v-model="searchForm.agentID" placeholder="请选择" clearable>
              <Option v-for="item in agentList" :value="item.value" :key="item.value" :label="item.text"></Option>
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
        <table style="width: 100%;text-align: center;font-size: 14px">
          <thead>
          <tr>
            <th>终端总数: {{stationCount}}</th>
            <th>停机数: {{stopStationCount}}</th>
            <th>注销数: {{cancelStationCount}}</th>
            <th>在线终端数: {{onlineStationCount}}</th>
            <th>离线终端数: {{offlineStationCount}}</th>
          </tr>
          </thead>
        </table>
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn
                  label="序号"
                  width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="站点编号" prop="stationID"></TableColumn>
          <TableColumn label="投注站类型" prop="stationType"></TableColumn>
          <TableColumn label="投注站状态" prop="stat"></TableColumn>
          <TableColumn label="区域" prop="hallCityCode">
            <template slot-scope="scope">
              <span>{{this.getTxt(this.regionIdList.find((item) => item.value === scope.row.regionID))}}</span>
            </template>
          </TableColumn>
          <TableColumn label="代理商编号" prop="hallCityCode">
            <template slot-scope="scope">
              <span>{{this.getTxt(this.agentList.find((item) => item.value === scope.row.agentID))}}</span>
            </template>
          </TableColumn>
        </Table>

      </div>

    </TablePage>

  </div>
</template>

<script>
  export default {
    name: 'SitesStatus',
    data: function () {
      return {
        stationCount: '',
        stopStationCount: '',
        cancelStationCount: '',
        onlineStationCount: '',
        offlineStationCount: '',
        StationType: [],
        agentList: [],
        regionIdList: [],
        searchForm: {
          page: 1,
          StationType: 'zero'
        },
        totalCount: 20,
        tableHeight: 0,
        tableData: [],
        confirmSearch: {
          page: 1
        }
      }
    },
    methods: {
      async getStationType() {
        var res = await this.postJson('common', {
          apiCode: 200001,
          content: {
            sysModule: 'station',
            enumNames: ['StationEnum$stationStatusTypeEnum']
          }
        })
        console.log(res)
        this.StationType = res.content.StationEnum$stationStatusTypeEnum
        this.StationType.unshift({value: '', text: '请选择'})
      },
      async getAgentList() {
        var res = await this.postJson('station', {
          apiCode: 300161,
          content: {}
        })
        this.agentList = res.content
        this.agentList.unshift({value: '', text: '请选择'})
      },
      async getRegionIdList() {
        var res = await this.postJson('station', {
          apiCode: 300259,
          content: {}
        })
        this.regionIdList = res.content
        this.regionIdList.unshift({value: '', text: '请选择'})
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
        var res = await this.postJson('station', {
          apiCode: 300163,
          content: this.searchForm
        })
        this.tableData = res.content.status
        this.totalCount = Number(res.content.recordCount)
      },
      async queryCount() {
        var res = await this.postJson('station', {
          apiCode: 300260,
          content: {}
        })
        this.stationCount = res.content.recordCount
        this.stopStationCount = res.content.stopStationCount
        this.cancelStationCount = res.content.cancelStationCount
        this.onlineStationCount = res.content.onlineStationCount
        this.offlineStationCount = parseInt(this.stationCount) - parseInt(this.onlineStationCount) -
          parseInt(this.cancelStationCount) - parseInt(this.stopStationCount)
      },
      resetForm(formName) {
        this[formName] = {
          page: 1
        }
      }
    },
    mounted() {
      this.queryCount()
      this.getStationType()
      this.getAgentList()
      this.getRegionIdList()
      this.tableHeight = this.tableHeightCal('el-main', 170)
      this.init()
    }
  }
</script>

<style lang="scss">
</style>