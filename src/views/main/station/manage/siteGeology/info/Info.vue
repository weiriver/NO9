<template>
  <TablePage :totalCount="totalCount">
    <!--查询条件-->
    <div slot="query">
      <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
      <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
            ref="searchForm">
        <FormItem label="站点编号">
          <Input v-model="searchForm.stationCode"/>
        </FormItem>
        <FormItem label="负责人">
          <Input v-model="searchForm.stationOwner"/>
        </FormItem>
        <FormItem label="所属区域">
          <AreaCascader ref="as" :ruturnAllLevelResultFlag="true" :res="searchForm.regionCode"
                        @areaSelectResult="areaSelectResult" :stage="2" :select_any_level_flag="true">
          </AreaCascader>
        </FormItem>
        <FormItem label="经营模式">
          <Select v-model="searchForm.operateModeId">
            <Option v-for="item in operateModeEnum"
                    :value="item.value"
                    :key="item.value"
                    :label="item.text">
            </Option>
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
        <TableColumn label="站点编号" prop="stationCode"></TableColumn>
        <TableColumn label="负责人" prop="stationOwner"></TableColumn>
        <TableColumn label="经营方式" prop="operateModelName"></TableColumn>
        <TableColumn label="所属区域" prop="regionName"></TableColumn>
        <TableColumn label="操作" width="120">
          <template slot-scope="scope">
            <Button @click="adjust(scope.row)" type="text" typeOptions v-if="Auth(300065)">纠偏</Button>
          </template>
        </TableColumn>
      </Table>
    </div>
  </TablePage>
</template>

<script>
export default {
  name: 'info',
  data() {
    return {
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      searchForm: {
        page: 1
      },
      confirmSearch: {
        page: 1
      }
    }
  },
  computed: {
    operateModeEnum() {
      return this.$store.state.station_enumDic.operateMode
    }
  },
  methods: {
    // 区域选择结果
    areaSelectResult(result) {
      console.log(result)
      if (result.length > 0) {
        this.searchForm.regionCode = result[result.length - 1].value //最后一级
      } else {
        this.searchForm.regionCode = ''
      }
    },
    // 纠偏按钮
    adjust(rowParam) {
      console.log(rowParam)
      sessionStorage.setItem('info_stationCode', rowParam.stationCode)
      this.$router.push('/manage/infoAdjust/' + rowParam.mapID)
    },
    // 初始加载
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
        apiCode: 300061,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableData = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
      this.$refs.as.clear()
    }
  },
  mounted() {
    this.init()
    this.tableHeight = this.tableHeightCal('el-main', 190)
  }
}
</script>

<style scoped>

</style>