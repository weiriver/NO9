<template>
  <div class="ZFOnline">

    <TablePage :totalCount="totalCount">

      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Print
           :btnStyle="'border-radius: 0px '"
           :tableHeader="tableHeader"
           :printTitle="'站点变更信息'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'train'"
           :fileSaveName="'站点变更信息'"
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
          <FormItem label="变更类型" prop="flowCode">
            <Select clearable v-model="searchForm.flowCode">
              <Option v-for="item in changTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="变更内容" prop="changeField">
            <Select v-model="searchForm.changeField">
              <Option v-for="(item, index) in changeContentList" :key="index" :value="item.value"
                      :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="变更日期" prop="xieyidate">
            <DatePicker v-model="changeDate" type="daterange" value-format="yyyy-MM-dd"
                        @change="selDateEvent"></DatePicker>
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
          <TableColumn label="内容" prop="changeContent"></TableColumn>
          <TableColumn label="旧值" prop="oldText"></TableColumn>
          <TableColumn label="新值" prop="newText" min-width="100"></TableColumn>
          <TableColumn label="变更类型" prop="flowName"></TableColumn>
          <TableColumn label="变更日期" prop="changeTime"></TableColumn>
          <TableColumn
             label="操作" width="100px">
            <template slot-scope="scope">
              <Button type="text" typeOptions disabled>相关流程</Button>
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
      deleteId: '', // 删除的id
      dialogVisible: false, // 删除弹窗flag
      changeDate: '', // 变更日期范围
      totalCount: 20,
      tableHeight: 0,
      changeContentList: [], // 变更内容
      changTypeList: [], // 变更类型
      tableData: [],
      checkboxList: [],
      operateModeList: [], // 经营模式数组
      exportObj: {
        apiCode: 300024,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '站点列表'
        }
      },
      // 表格头部信息
      tableHeader: [
        {
          text: '站点编号',
          value: 'stationCode'
        },
        {
          text: '内容',
          value: 'changeContent'
        },
        {
          text: '旧值',
          value: 'oldText'
        },
        {
          text: '新值',
          value: 'newText'
        },
        {
          text: '变更类型',
          value: 'flowName'
        },
        {
          text: '变更日期',
          value: 'changeTime'

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
    // 变更日期
    selDateEvent(date) {
      this.searchForm.changeBeginTime = new Date(date[0])
      this.searchForm.changeEndTime = new Date(date[1])
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
    // // 所属区域结果
    // areaSelectResult(val) {
    //     console.log(val)
    //     // if (val[0]) {
    //     this.searchForm.regionCode = val.value
    //     // this.searchForm.acceptByName = val[0].label
    //     // }
    // },
    // 变更内容下拉框
    getChangeContentList() {
      this.postJson('station', {
        apiCode: 300022
      }).then(res => {
        this.changeContentList = res.content
      })
    },
    // 变更类型下拉框
    getChangTypeList() {
      this.postJson('station', {
        apiCode: 300023
      }).then(res => {
        this.changTypeList = res.content
      })
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
        apiCode: 300021,
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
      this.changeDate = '' // 清空变化日期
      // this.jianzhandate = '' // 清空建站时间
    }
  },
  mounted() {
    this.getChangeContentList()
    this.getChangTypeList()
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.operateModeList = this.$store.state.station_enumDic.operateMode
    this.init()
  }
}
</script>

<style lang="scss">
</style>
