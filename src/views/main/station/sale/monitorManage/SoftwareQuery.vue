<template>
  <div class="SoftwareQuery">

    <TablePage :totalCount="totalCount">

      <!--顶部按钮组-->
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="投注站编号" prop="stationId">
            <Autocomplete
                    v-model="searchForm.stationId"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    @select="handleSelect"
            ></Autocomplete>
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
          <FormItem label="投注站类型" prop="StationType">
            <Select v-model="searchForm.StationType" placeholder="请选择" clearable>
              <Option v-for="item in stationTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="版本" prop="StationType">
            <Select v-model="searchForm.StationType" placeholder="请选择" clearable style="width: 50%;">
              <Option v-for="item in stationTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
            <Input v-model="searchForm.startIssue" style="width: 50%;"></Input>
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
          <TableColumn
                  label="序号"
                  width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="系统版本号" prop="osversion"></TableColumn>
          <TableColumn label="软件版本号" prop="versionNo"></TableColumn>
          <TableColumn label="上报时间" prop="reportTime"></TableColumn>
          <TableColumn
                  label="操作"
                  width="100">
            <template slot-scope="scope">
              <Button @click="$router.push('/saleManage/softwareDetail/' + scope.row.stationID)" type="text" typeOptions>查看软件信息</Button>
            </template>
          </TableColumn>
        </Table>

      </div>

    </TablePage>

  </div>
</template>

<script>
  export default {
    name: 'SoftwareQuery',
    data: function () {
      return {
        stationTypeList: [],
        findTypeList: [],
        agentList: [],
        regionIdList: [],
        searchForm: {
          page: 1,
          limit: 20
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
      // 站点编号输入框 变化，搜索出相关的站点编号
      async querySearchAsync(sCode, cb) {
        if (sCode ? sCode.length : '' === 1) {
          this.oneSCode = sCode
        }
        if (sCode === undefined) {
          cb([])
          return
        } else if(sCode === '') {
          sCode = this.oneSCode
        }
        // 根据号码查询所有相关的站点编号
        var res = await this.postJson('station', {
          apiCode: 300019,
          content: {searchKey: sCode}
        })
        res.content.forEach((val) => {
          this.$set(val, 'value', `${val.station_code}-${val.name_x}`)
        })
        let arr = res.content
        cb(arr)
      },
      handleSelect(item) {
        this.searchForm.stationId = item.station_code
        console.log(this.searchForm)
      },
      async getStationType() {
        var res = await this.postJson('station', {
          apiCode: 300014,
          content: {}
        })
        this.stationTypeList = res.content
        this.stationTypeList.unshift({value: '', text: '请选择'})
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
          apiCode: 300165,
          content: this.searchForm
        })
        this.tableData = res.content.stationVersions
        this.totalCount = parseInt(res.content.totalCount)
      },
      resetForm(formName) {
        this[formName] = {
          page: 1
        }
      }
    },
    mounted() {
      this.getStationType()
      this.getAgentList()
      this.getRegionIdList()
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style lang="scss">
</style>