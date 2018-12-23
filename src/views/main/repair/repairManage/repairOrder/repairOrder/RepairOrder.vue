<!--库存查询-->
<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">

        <!--<ButtonGroup>-->
        <Print
           :btnStyle="'border-radius: 4px 0 0 4px '"
           :tableHeader="tableHeader"
           :printTitle="'维修工单列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'eqp'"
           :fileSaveName="'维修工单列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="工单编号" prop="orderId">
            <Input v-model="searchForm.orderId"></Input>
          </FormItem>
          <FormItem label="故障级别" prop="faultLevel">
            <Select clearable v-model="searchForm.faultLevel" placeholder="请选择故障级别">
              <Option v-for="item in faultLevelList" :key="item.value" :value="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="物品类别" prop="goodsType">
            <Select clearable v-model="searchForm.goodsType" placeholder="请选择设备类型" @change="typeChange">
              <Option v-for="item in goodsTypeList" :key="item.value" :value="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="物品类型" prop="goodsTypeId">
            <Select clearable v-model="searchForm.goodsTypeId" placeholder="请选择物品类型" :disabled="typeSelected">
              <Option v-for="item in typeList" :key="item.id" :value="item.id" :label="item.nameX"></Option>
            </Select>
          </FormItem>
          <FormItem label="维修工单状态" prop="status">
            <Select clearable v-model="searchForm.status" placeholder="请选择维修工单状态">
              <Option v-for="item in repairOrderStatusList" :key="item.value" :value="item.value"
                      :label="item.text"></Option>
            </Select>
          </FormItem>

          <FormItem label="是否需要市州审核" prop="needAudit">
            <Radio v-model="searchForm.needAudit" label="true">是</Radio>
            <Radio v-model="searchForm.needAudit" label="false">否</Radio>
          </FormItem>
          <FormItem label="故障原因" prop="faultReason">
            <Input v-model="searchForm.faultReason"></Input>
          </FormItem>
          <FormItem label="站点编号" prop="stationCode">
            <Input v-model="searchForm.stationCode"></Input>
          </FormItem>
          <FormItem label="区域" prop="regionCode">
            <AreaCascader ref="as" :ruturnAllLevelResultFlag="true" v-model="searchForm.regionCode"
                          @areaSelectResult="areaSelectResult" :stage="2" :res="regionCode"></AreaCascader>
          </FormItem>
          <FormItem label="维修员姓名" prop="repairByName">
            <Input v-model="searchForm.repairByName"></Input>
          </FormItem>

          <FormItem label="报修时间" prop="createDate">
            <DatePicker type="daterange" placeholder="选择日期" v-model="searchForm.createDate" value-format="yyyy-MM-dd"
            ></DatePicker>
          </FormItem>
          <FormItem label="维修时间" prop="repairDate">
            <DatePicker type="daterange" placeholder="选择日期" v-model="searchForm.repairDate" value-format="yyyy-MM-dd"
            ></DatePicker>
          </FormItem>
          <FormItem label="是否超时" prop="timeout">
            <Radio v-model="searchForm.timeout" label="true">是</Radio>
            <Radio v-model="searchForm.timeout" label="false">否</Radio>
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
          <TableColumn label="工单编号" prop="orderId"></TableColumn>
          <TableColumn
             label="报修物品种类"
          >
            <template slot-scope="scope">
              {{ scope.row.goodsType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="物品名称" prop="goodsTypeName"></TableColumn>
          <TableColumn
             label="故障级别"
          >
            <template slot-scope="scope">
              {{ scope.row.faultLevel | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
             label="维修工单状态"
          >
            <template slot-scope="scope">
              {{ scope.row.status | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="站点编号" prop="stationCode"></TableColumn>
          <TableColumn label="区域" prop="regionName"></TableColumn>
          <TableColumn label="维修员姓名" prop="repairByName"></TableColumn>
          <TableColumn label="报修时间" prop="createDate"></TableColumn>
          <TableColumn label="维修时间" prop="repairDate"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.id)" type="text" size="small">查看</Button>
              <!--审核根据身份决定是否显示-->
              <Button v-if="scope.row.needAudit" @click="openAudit(scope.row.id)" type="text" size="small">审核
              </Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
    <Dialog
       title="提示"
       :visible.sync="dialogVisible"
       width="500px">
      <Form ref="auditForm" label-width="140px" :model="auditForm" size="mini" :rules="rules">
        <FormItem label="审核意见" prop="auditReason" class="full-line">
          <Input type="textarea" v-model="auditForm.auditReason"></Input>
        </FormItem>
        <FormItem label="是否纳入评分考核" prop="needEvaluate">
          <Radio v-model="auditForm.needEvaluate" label="true">是</Radio>
          <Radio v-model="auditForm.needEvaluate" label="false">否</Radio>
        </FormItem>
      </Form>
      <span slot="footer" class="dialog-footer">
    <Button @click="dialogVisible = false">取 消</Button>
    <Button type="primary" @click="audit">确 定</Button>
  </span>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      tableHeader: [
        {
          text: '工单编号',
          value: 'orderId'
        },
        {
          text: '报修物品种类',
          value: 'goodsType'
        },
        {
          text: '物品名称',
          value: 'goodsTypeName'
        },
        {
          text: '故障级别',
          value: 'faultLevel'
        },
        {
          text: '维修工单状态',
          value: 'status'
        },
        {
          text: '站点编号',
          value: 'stationCode'
        },
        {
          text: '区域',
          value: 'regionName'
        },
        {
          text: '维修员姓名',
          value: 'repairByName'
        },
        {
          text: '报修时间',
          value: 'firstRepairDate'
        },
        {
          text: '维修时间',
          value: 'repairDate'
        }
      ], // 表格头部信息
      checkboxList: [], // 导出弹框-展示出来的多选框
      exportObj: {
        apiCode: 800014,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '维修工单列表'
        }
      },
      dialogVisible: false,
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1,
        limit: 20
      },
      searchForm: {
        page: 1,
        limit: 20
      },
      lotterList: [],
      warehouseList: [],
      regionCode: '',
      auditForm: {},
      rules: {
        auditReason: [
          {required: true, message: '请输入审核意见', trigger: 'blur'}
        ]
      },
      typeList: [],
      typeSelected: true
    }
  },
  computed: {
    repairOrderStatusList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StationMasterEnum$orderStatusEnum
    },
    goodsTypeList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$goodsTypeEnum
    },
    faultLevelList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$faultLevelEnum
    }
  },
  methods: {
    typeChange(val) {
      this.$set(this.searchForm, 'goodsTypeId', '')
      this.typeSelected = true
      if (val) {
        this.typeSelected = true
        this.getType(val)
      }
    },
    async getType(type) {
      var res = await this.postJson('ws', {
        apiCode: 501008,
        content: {
          type
        }
      })
      if (res.code == 0) {
        this.typeList = res.content
        if (this.typeList.length > 0) {
          this.typeSelected = false
        }
      }
    },
    async audit() {
      this.$refs['auditForm'].validate(async (valid) => {
        if (valid) {
          var res = await this.postJson('eqp', {
            apiCode: 800013,
            content: this.auditForm
          })
          if (res.code == '0') {
            this.dialogVisible = false
            this.showMsg('操作成功', 'success')
          } else {
            this.showMsg('操作失败', 'warning')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })

    },
    openAudit(id) {
      this.auditForm.id = id
      this.auditForm.needEvaluate = 'true'
      this.dialogVisible = true
    },
    areaSelectResult(result) {
      console.log('areaSelectResult', result)
      // 第一次加载会触发但是 result是空
      if (result.length > 0) {
        this.searchForm.regionCode = result[result.length - 1].value
        this.searchForm.regionName = result[result.length - 1].label
      } else {
        this.searchForm.regionCode = ''
        this.searchForm.regionName = ''
      }
      // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
      // console.log('this.regionCode', this.regionCode)
    },
    editItem(id) {
      this.$router.push(`/repair/repairOrderDetail/${id}`)
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
      console.log('searchForm', this.searchForm.createDate, this.searchForm.repairDate)
      if (this.searchForm.createDate) {
        this.searchForm.createDateBegin = this.searchForm.createDate[0]
        this.searchForm.createDateEnd = this.searchForm.createDate[1]
      }
      if (this.searchForm.repairDate) {
        this.searchForm.repairDateBegin = this.searchForm.repairDate[0]
        this.searchForm.repairDateEnd = this.searchForm.repairDate[1]
      }
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      var res = await this.postJson('eqp', {
        apiCode: 800010,
        content: this.confirmSearch
      })
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
      this.checkboxList = []
      res.content.dataQry.colCNNames.forEach((v, i) => {
        this.checkboxList.push({
          text: v,
          value: res.content.dataQry.colNames[i]
        })
      })
    },
    resetForm(formName) {
      this[formName] = {
        page: 1,
        limit: 20
      }
      this.typeSelected = true
      this.$refs.as.clear()
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style></style>
