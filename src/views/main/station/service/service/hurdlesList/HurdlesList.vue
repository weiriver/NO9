<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit" @click="batchDeal">批量处理</Button>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="dataForm" size="mini"
              ref="dataForm">
          <FormItem label="故障类型" prop="urgentFaultCategory">
            <Select v-model="dataForm.urgentFaultCategory" clearable>
              <Option v-for="item in eqpTypeList" :value="item.id" :key="item.id" :label="item.nameX"></Option>
            </Select>
          </FormItem>
          <FormItem label="所属区域" prop="name">
            <AreaCascader :ruturnAllLevelResultFlag="true" @areaSelectResult="areaSelectResult" ref="as"
                          :stage="3"></AreaCascader>
          </FormItem>
          <FormItem label="报障时间" prop="name">
            <DatePicker
               v-model="dataForm.dataRange"
               type="daterange"
               placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="selDateEvent">
            </DatePicker>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('dataForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableDataFacilities" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn type="selection" width="55"></TableColumn>
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="订单编号" prop="orderCode"></TableColumn>
          <TableColumn label="申请时间" prop="createDate"></TableColumn>
          <TableColumn label="所属区域" prop="regionName"></TableColumn>
          <TableColumn label="申请站点" prop="stationCode"></TableColumn>
          <TableColumn label="故障类型" prop="extInfo"></TableColumn>
          <TableColumn label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.status.value === 'handled'? '已处理': '未处理'}}</span>
            </template>
          </TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" typeOptions>查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
    <!--点击“批量处理”弹出框-->
    <Dialog
       title="批量处理"
       :visible.sync="batchFlag"
       width="30%">
      <div>
        <p>确定要处理所选数据吗？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button type="primary" size="large" long @click="batchDealComfirm()">确定</Button>
      </span>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      // 批量处理modal
      batchFlag: false,
      // 查询列表信息(暂不用)
      Obj: {
        apiCode: 300221,
        content: {
          page: 1
        }
      },
      // 批量处理
      batchObj: {
        apiCode: 300154,
        content: {
          id: '',
          status: 'handled',
          handleResult: '通过'
        }
      },
      // 表单提交数据绑定model
      dataForm: {},
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      totalCount: 0,
      tableHeight: 0,
      msg: '',
      tableDataFacilities: []
    }
  },
  computed: {
    runningstateList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
    }
  },
  watch: {
    typeX(val) {
      console.log('val', val)
      this.search()
    }
  },
  methods: {
    // 选择区域
    areaSelectResult(result) {
      if (result.length > 0) {
        this.searchForm.regionCode = result[result.length - 1].value
        this.searchForm.regionName = result[result.length - 1].label
      } else {
        this.searchForm.regionCode = ''
        this.searchForm.regionName = ''
      }
    },
    // 查看详细
    toDetail(id) {
      this.$router.push(`/service/hurdlesDetail/` + id)
    },
    // 批量处理弹窗
    batchDeal() {
      this.batchFlag = true
    },
    // 批量处理确认
    batchDealComfirm() {
      this.batchFlag = false
      this.postJson('station', this.batchObj).then(res => {
        if (res.code === '0') {
          this.showMsg('批量处理成功')
          this.batchObj.content.id = ''
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
      var apiCode = 300153
      var res = await this.postJson('station', {
        apiCode,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableDataFacilities = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount
      }
    },
    // 报障日期
    selDateEvent(date) {
      this.searchForm.startDate = date[0]
      this.searchForm.endDate = date[1]
    },
    resetForm(formName) {
      this[formName] = {}
      this.searchForm = {}
      this.$refs.as.clear()
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
    // 获取故障类型
    this.postJson('station', {
      apiCode: 300221,
      content: {
        limit: 1000
      }
    }).then(res => {
      if (res.code === '0') {
        this.eqpTypeList = res.content.dataList
      }
    })
  }
}
</script>

<style></style>
