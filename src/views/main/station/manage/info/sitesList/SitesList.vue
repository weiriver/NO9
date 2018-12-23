<template>
  <div class="ZFOnline">

    <TablePage :totalCount="totalCount">

      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <!--<Button v-if="true" type="primary" icon="el-icon-edit"-->
        <!--@click="$router.push('/dataMaintain/zfSaleAdd')">新增-->
        <!--</Button>-->
        <ImportFile :btnStyle="'border-radius: 0 ;'"
                    :conf="conf"
                    @uploadResult="uploadResult"
                    :showAreaSelect="true"
                    :recordObj="recordObj"
                    :downloadObj="downloadObj"
                    :type="['xlsx']"
                    :exportTitle="'导入站点列表信息'"
                    :tabPaneLabel="'站点导入'"
                    :uploadApiCode="300015">
          <Button v-if="true" type="primary" icon="el-icon-edit">导入
          </Button>
        </ImportFile>
        <Print
           :btnStyle="'border-radius: 0px '"
           :tableHeader="tableHeader"
           :printTitle="'站点列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0' "
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'train'"
           :fileSaveName="'站点列表'"
           :btnName="'导出'"
           :isOther="true"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="站点编号" prop="stationCode">
            <Autocomplete
               v-model="searchForm.stationCode"
               :fetch-suggestions="querySearchAsync"
               placeholder="请输入内容"
               @select="handleSelect"
            ></Autocomplete>
          </FormItem>
          <FormItem label="区域选择" prop="regionCode">
            <AreaCascader ref="as" :stage="1" :selectstageFlag="true" :allFlag="true"
                          :disabled="false"
                          @areaSelectResult="areaSelectResult"></AreaCascader>
          </FormItem>
          <FormItem label="经营模式" prop="operateModeId">
            <Select clearable v-model="searchForm.operateModeId">
              <Option v-for="item in operateModeList" :value="item.value" :key="item.value" :label="item.text">
              </Option>
            </Select>
          </FormItem>
          <FormItem label="负责人" prop="stationOwner">
            <Input v-model="searchForm.stationOwner"></Input>
          </FormItem>
          <FormItem label="站点状态" prop="stationStatus">
            <Select clearable v-model="searchForm.stationStatus">
              <Option v-for="item in stationStatusList" :value="item.value" :key="item.value" :label="item.text">
              </Option>
            </Select>
          </FormItem>
          <FormItem label="站点星级" prop="stationStar">
            <Rate v-model="searchForm.stationStar"></Rate>
          </FormItem>
          <FormItem label="协议时间" prop="xieyidate">
            <DatePicker v-model="xieyidate" type="daterange" value-format="yyyy-MM-dd"
                        @change="xieyiDateEvent"></DatePicker>
          </FormItem>
          <FormItem label="建站时间" prop="jianzhandate">
            <DatePicker v-model="jianzhandate" type="daterange" value-format="yyyy-MM-dd"
                        @change="jianzhanDateEvent"></DatePicker>
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
          <TableColumn label="负责人" prop="nameX"></TableColumn>
          <TableColumn label="移动电话" prop="mobile"></TableColumn>
          <TableColumn label="经营模式" prop="operateModeName" min-width="100"></TableColumn>
          <TableColumn label="所属区域" prop="regionName"></TableColumn>
          <TableColumn label="设立时间" prop="setUpTime"></TableColumn>
          <TableColumn label="房产性质" prop="houseType"></TableColumn>
          <TableColumn label="状态" prop="status">
            <template slot-scope="scope">
              {{ scope.row.stationStatus | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
             label="操作" width="100px">
            <template slot-scope="scope">
              <Button @click="$router.push('/manage/sitesListModify/' + scope.row.stationID)" type="text" typeOptions>
                修改
              </Button>
              <Button @click="$router.push('/manage/sitesListDetail/' + scope.row.stationID)" type="text" typeOptions>
                查看
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
  name: 'ZfSale',
  data: function () {
    return {
      recordObj: {apiCode: 200105, sysModule: 'station', tableName: 'station'},
      downloadObj: {hostBizObj: 'station', hostBizId: 'templete_xlsx'},
      searchForm: {
        page: 1
      },
      // 上传附件基本配置
      conf: {
        // tooltips: [1, 2],
        uploadUrl: ''
      },
      deleteId: '', // 删除的id
      dialogVisible: false, // 删除弹窗flag
      xieyidate: '', // 协议时间
      jianzhandate: '', // 建站时间
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      checkboxList: [],
      operateModeList: [], // 经营模式数组
      exportObj: {
        apiCode: 300016,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '站点列表'
        }
      },
      tableHeader: [
        {
          text: '站点编号',
          value: 'stationCode'
        },
        {
          text: '负责人',
          value: 'nameX'
        },
        {
          text: '移动电话',
          value: 'mobile'
        },
        {
          text: '经营模式',
          value: 'operateModeName'
        },
        {
          text: '所属区域',
          value: 'regionName'
        },
        {
          text: '设立时间',
          value: 'setUpTime'
        },
        {
          text: '房产性质',
          value: 'houseType'
        },
        {
          text: '状态',
          value: 'stationStatus'
        }
      ],
      confirmSearch: {
        page: 1
      }
    }
  },
  computed: {
    stationStatusList() {
      // return this.$store.state.station_enumDic.MisEnum$statusEnum
      return this.$store.state.station_enumDic.StationEnum$statusEnum
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
      } else if (sCode === '') {
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
    uploadResult(file) {
      console.log('我是上传结果', file)
    },
    // 协议日期
    xieyiDateEvent(date) {
      console.log(date)
      this.searchForm.contractSignBeginTime = date[0]
      this.searchForm.contractSignEndTime = date[1]
    },
    // 建站日期
    jianzhanDateEvent(date) {
      console.log(date)
      this.searchForm.signUpBeginTime = date[0]
      this.searchForm.signUpEndTime = date[1]
    },
    // 点击删除
    async deleteFile(id) {
      const flag = await this.$confirm(`确定移除?`)
      if (flag == 'confirm') {
        const res = await this.postJson('station', {
          apiCode: 300110,
          content: {id}
        })
        if (res.code == 0) {
          this.tableData = this.tableData.filter(file => {
            return file.id != id
          })
          this.showMsg('删除成功')
        }
      }
    },
    // 所属区域结果
    areaSelectResult(val) {
      console.log(val)
      // if (val[0]) {
      this.searchForm.regionCode = val.value
      // this.searchForm.acceptByName = val[0].label
      // }
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    handleSelect(item) {
      this.searchForm.stationId = item.station_code
      console.log(this.searchForm)
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      console.log(this.confirmSearch)
      var res = await this.postJson('station', {
        apiCode: 300002,
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
        page: 1
      }
      this.$refs.as.clear()
      this.xieyidate = '' // 清空协议时间
      this.jianzhandate = '' // 清空建站时间
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.operateModeList = this.$store.state.station_enumDic.operateMode
    this.init()
  }
}
</script>

<style lang="scss">
</style>
