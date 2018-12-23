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
           :printTitle="'设备信息列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'ws'"
           :fileSaveName="'设备信息列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="设备类型" prop="goodsId">
            <Select clearable v-model="searchForm.goodsId" placeholder="请选择设备类型" @change="deviceTypeChange">
              <Option v-for="item in deviceTypeList" :key="item.id" :value="item.id" :label="item.nameX"></Option>
            </Select>
          </FormItem>
          <FormItem label="设备型号" prop="dversionId">
            <Select clearable v-model="searchForm.dversionId" placeholder="请选择设备型号" :disabled="deviceTypeSelected">
              <Option v-for="item in modelTypeList" :key="item.id" :value="item.id" :label="item.nameX"></Option>
            </Select>
          </FormItem>
          <FormItem label="设备序列号" prop="code">
            <Input v-model="searchForm.code"></Input>
          </FormItem>
          <FormItem label="设备状态" prop="isGood">
            <Select clearable v-model="searchForm.isGood" placeholder="请选择设备状态">
              <Option label="正常" value="true"></Option>
              <Option label="故障" value="false"></Option>
            </Select>
          </FormItem>
          <FormItem label="运行状态" prop="runningState">
            <Select clearable v-model="searchForm.runningState" placeholder="请选择运行状态">
              <Option v-for="item in runningstateList" :key="item.value" :value="item.value"
                      :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="存放位置" prop="warehouseId">
            <Select clearable v-model="searchForm.warehouseId" placeholder="请选择存放位置">
              <Option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.nameX"></Option>
            </Select>
          </FormItem>


          <FormItem label="投入使用日期" prop="useDate">
            <DatePicker
               v-model="searchForm.useDate"
               type="date"
               placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </DatePicker>
          </FormItem>
          <FormItem label="到期日期" prop="expireDate">
            <DatePicker
               v-model="searchForm.expireDate"
               type="date"
               placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </DatePicker>
          </FormItem>
          <FormItem label="所属区域" prop="regionCode">
            <AreaCascader ref="as" :ruturnAllLevelResultFlag="true" v-model="searchForm.regionCode"
                          @areaSelectResult="areaSelectResult" :stage="2" :res="regionCode"></AreaCascader>
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
          <TableColumn label="设备类型" prop="deviceTypeName"></TableColumn>
          <TableColumn label="设备型号" prop="deviceVersionName"></TableColumn>
          <TableColumn label="设备序列号" prop="code"></TableColumn>
          <TableColumn label="所属区域" prop="regionName"></TableColumn>
          <TableColumn label="存放位置" prop="warehouseName"></TableColumn>
          <TableColumn
             label="运行状态"
             width="100">
            <template slot-scope="scope">
              {{ scope.row.runningState | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
             label="设备状态"
             width="100">
            <template slot-scope="scope">
              {{ scope.row.isGood ? '正常' : '故障' }}
            </template>
          </TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.id)" type="text" size="small">查看</Button>
              <!--审核根据身份决定是否显示-->
              <Button @click="toCv(scope.row.code)" type="text" size="small">履历
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
  name: 'Subindex',
  data: function () {
    return {
      deviceTypeSelected: true,
      tableHeader: [
        {
          text: '设备类型',
          value: 'deviceTypeName'
        },
        {
          text: '设备型号',
          value: 'deviceVersionName'
        },
        {
          text: '设备序列号',
          value: 'code'
        },
        {
          text: '所属区域',
          value: 'regionName'
        },
        {
          text: '存放位置',
          value: 'warehouseName'
        },
        {
          text: '运行状态',
          value: 'runningState'
        },
        {
          text: '设备状态是否正常',
          value: 'isGood'
        }
      ], // 表格头部信息
      checkboxList: [], // 导出弹框-展示出来的多选框
      exportObj: {
        apiCode: 501106,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '设备信息列表'
        }
      },
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
      modelTypeList: [],
      deviceTypeList: [],
      storeList: [],
      regionCode: ''
    }
  },
  computed: {
    runningstateList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
    }
  },
  methods: {
    async getStoreList() {
      var res = await this.postJson('ws', {
        apiCode: 500004,
        content: {
          paginated: false
        }
      })
      if (res.code == 0) {
        console.log('getStoreList', res.content)
        this.storeList = res.content.dataList
      }
    },
    async getModelType() {
      var res = await this.postJson('ws', {
        apiCode: 501307,
        content: {
          typeId: this.searchForm.goodsId
        }
      })
      if (res.code == 0) {
        this.modelTypeList = res.content
        this.deviceTypeSelected = false
      }
    },
    async getDeviceType() {
      var res = await this.postJson('ws', {
        apiCode: 501008,
        content: {
          type: 'device'
        }
      })
      if (res.code == 0) {
        this.deviceTypeList = res.content
      }
    },
    deviceTypeChange(val) {
      console.log('val', val)
      this.deviceTypeSelected = true
      this.getModelType()
    },
    toCv(code) {
      this.$router.push(`/repair/repairDeviceListCv/${code}`)
    },
    areaSelectResult(result) {
      console.log('areaSelectResult', result)
      // 第一次加载会触发但是 result是空
      this.searchForm.regionCode = result[result.length - 1].value
      this.searchForm.regionName = result[result.length - 1].label
      // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
      // console.log('this.regionCode', this.regionCode)
    },
    editItem(id) {
      this.$router.push(`/repair/repairDeviceListDetail/${id}`)
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.getDeviceType()
      this.getStoreList()
      this.search()
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      var res = await this.postJson('ws', {
        apiCode: 501104,
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
