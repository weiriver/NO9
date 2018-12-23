<template>
  <div class="AbnormalCommission">

    <TablePage :totalCount="totalCount">

      <!--顶部按钮组-->
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="游戏名称" prop="gameID">
            <Select v-model="searchForm.gameID" placeholder="请选择" clearable>
              <Option v-for="item in gameList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="代理商" prop="agentID">
            <Select v-model="searchForm.agentID" placeholder="请选择" clearable>
              <Option v-for="item in agentList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="代销费率" prop="commission">
            <Select v-model="searchForm.commission" placeholder="请选择" clearable>
              <Option v-for="item in commissionList" :value="item.value" :key="item.value" :label="item.text"></Option>
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
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn
                  label="序号"
                  width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="投注站编号" prop="stationID"></TableColumn>
          <TableColumn label="站点名称" prop="stationName"></TableColumn>
          <TableColumn label="游戏名称" prop="gameName"></TableColumn>
          <TableColumn label="站点名称" prop="stationName"></TableColumn>
          <TableColumn label="代销费率" prop="saleCommission"></TableColumn>
          <TableColumn label="站点地址" prop="address"></TableColumn>
          <TableColumn label="负责人" prop="responsor"></TableColumn>
          <TableColumn label="联系人" prop="linkMan"></TableColumn>
          <TableColumn label="联系电话" prop="phone"></TableColumn>
          <TableColumn label="移动电话" prop="cellPhone"></TableColumn>
        </Table>
      </div>
    </TablePage>

  </div>
</template>

<script>
  export default {
    name: 'AbnormalCommission',
    data: function () {
      return {
        commissionList: [],
        gameList: [],
        findTypeList: [],
        agentList: [],
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
      toDetail(stationID, termType) {
        let url = '/saleManage/hardwareDetail/' + stationID
        this.$router.push({path: url, query: {termType: termType}})
      },
      async getGameList() {
        var res = await this.postJson('station', {
          apiCode: 300162,
          content: {}
        })
        this.gameList = res.content
        this.gameList.unshift({value: '', text: '请选择'})
      },
      async getAgentList() {
        var res = await this.postJson('station', {
          apiCode: 300161,
          content: {}
        })
        this.agentList = res.content
        this.agentList.unshift({value: '', text: '请选择'})
      },
      getCommissionList() {
        this.commissionList = this.$store.state.station_enumDic.commissionRate
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
          apiCode: 300164,
          content: this.searchForm
        })
        this.tableData = res.content.saleCommissions
        this.totalCount = parseInt(res.content.totalCount)
      },
      resetForm(formName) {
        this[formName] = {
          page: 1
        }
      }
    },
    mounted() {
      this.getGameList()
      this.getAgentList()
      this.getCommissionList()
      this.tableHeight = this.tableHeightCal('el-main', 150)
      this.init()
    }
  }
</script>

<style lang="scss">
</style>