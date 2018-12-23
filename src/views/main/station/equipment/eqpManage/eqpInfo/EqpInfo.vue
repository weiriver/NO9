<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit" @click="toAdd">新增</Button>
        <Print
           :btnStyle="'border-radius: 0px '"
           :tableHeader="tableHeader"
           :printTitle="'设备信息列表'"
           :tableData="tableDataFacilities"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'station'"
           :fileSaveName="'设备信息列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" size="mini" :model="dataForm" ref="dataForm">
          <FormItem label="设备编号" prop="deviceCode">
            <Input v-model="dataForm.deviceCode"></Input>
          </FormItem>
          <FormItem label="站点编号" prop="stationCode">
            <Input v-model="dataForm.stationCode"></Input>
          </FormItem>
          <FormItem label="设备类型" prop="deviceTypeId">
            <Select clearable v-model="dataForm.deviceTypeId">
              <Option v-for="item in eqpTypeList" :key="item.id" :value="item.id" :label="item.deviceTypeName"></Option>
            </Select>
          </FormItem>
          <FormItem label="设备型号" prop="modelId">
            <Select clearable v-model="dataForm.modelId">
              <Option v-for="item in modelList" :key="item.id" :value="item.id" :label="item.deviceModelName"></Option>
            </Select>
          </FormItem>
          <FormItem label="所属区域" prop="videoTitle">
            <AreaCascader :ruturnAllLevelResultFlag="true" @areaSelectResult="areaSelectResult" ref="as"
                          :stage="3"></AreaCascader>
          </FormItem>
          <FormItem label="设备状态" prop="deviceStatus">
            <Select clearable v-model="dataForm.deviceStatus">
              <Option v-for="item in deviceStatusList" :key="item.value" :value="item.value"
                      :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="运行状态" prop="deviceRunStatus">
            <Select clearable v-model="dataForm.deviceRunStatus">
              <Option v-for="item in deviceRunStatusList" :key="item.value" :value="item.value"
                      :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="存放位置" prop="deviceLocation">
            <Select clearable v-model="dataForm.deviceLocation">
              <Option v-for="item in deviceLocationList" :key="item.value" :value="item.value"
                      :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search">查询</Button>
            <Button @click="resetForm('dataForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableDataFacilities" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="设备名称" prop="nameX"></TableColumn>
          <TableColumn label="设备类型" prop="typeX"></TableColumn>
          <TableColumn label="设备型号" prop="modelName"></TableColumn>
          <TableColumn label="设备编号" prop="deviceCode"></TableColumn>
          <TableColumn label="价格" prop="price"></TableColumn>
          <TableColumn label="押金" prop="deviceBail"></TableColumn>
          <TableColumn label="区域编号" prop="regionName"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="toDetail(scope.row.id)" type="text" typeOptions>查看</Button>
              <Button @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
              <Button @click="opendelete(scope.row.id)" type="text" typeOptions>删除</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
    <Dialog
       title="提示"
       :visible.sync="dialogVisible"
       width="30%">
      <div>
        此操作将永久删除该记录, 是否继续?
      </div>
      <span slot="footer" class="dialog-footer">
      <Button @click="dialogVisible = false">取 消</Button>
      <Button type="primary" @click="deleteItem">确 定</Button></span>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      dialogVisible: false,// 删除modal框
      loading: false,
      deleteId: '',// 删除记录ID
      // 查询列表信息(暂时不用)
      Obj: {
        apiCode: 300286,
        content: {
          page: 1
        }
      },
      // 删除
      ObjDelete: {
        apiCode: 300074,
        content: {
          id: ''
        }
      },
      // 表单提交数据绑定model
      dataForm: {},
      // 翻页不查询
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      totalCount: 0,
      tableHeight: 0,
      tableHeader: [
        {
          text: '设备编号',
          value: 'deviceCode'
        },
        {
          text: '所属站点',
          value: 'stationCode'
        },
        {
          text: '设备类型',
          value: 'typeX'
        },
        {
          text: '设备名称',
          value: 'nameX'
        },
        {
          text: '价格',
          value: 'price'
        },
        {
          text: '设备型号',
          value: 'modelName'
        },
        {
          text: '保证金',
          value: 'deviceBail'
        }
      ], // 表格头部信息
      // 导出接口配置
      exportObj: {
        apiCode: 300077,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '设备信息列表'
        }
      },
      checkboxList: [], // 导出弹框-展示出来的多选框
      tableDataFacilities: [],
      deviceStatusList: [], // 设备状态
      deviceRunStatusList: [], //运行状态
      deviceLocationList: [], // 存放位置
      eqpTypeList: [], // 设备类型
      modelList: [] //设备型号
    }
  },
  computed: {
    runningstateList() {
      return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
    }
  },
  watch: {},
  methods: {
    areaSelectResult(result) {
      if (result.length > 0) {
        this.searchForm.regionCode = result[result.length - 1].value
        this.searchForm.regionName = result[result.length - 1].label
      } else {
        this.searchForm.regionCode = ''
        this.searchForm.regionName = ''
      }
      console.log('areaSelectResult', result)
      // 第一次加载会触发但是 result是空

      // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
      // console.log('this.regionCode', this.regionCode)
    },
    toAdd() {
      this.$router.push(`/equipment/eqpInfoAdd`)
    },
    toDetail(id) {
      this.$router.push(`/equipment/eqpInfoDetail/` + id)
    },
    editItem(id) {
      this.$router.push(`/equipment/eqpInfoAdd/` + id)
    },
    opendelete(id) {
      this.dialogVisible = true
      // 删除操作
      this.ObjDelete.content.id = id
    },
    async deleteItem() {
      this.postJson('station', this.ObjDelete).then(res => {
        if (res.code === '0') {
          this.showMsg('删除成功')
          this.dialogVisible = false
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
      var apiCode = 300071
      var res = await this.postJson('station', {
        apiCode,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableDataFacilities = res.content.dataList
        this.totalCount = res.content.dataPage.totalCount

        this.checkboxList = []
        res.content.dataQry.colCNNames.forEach((v, i) => {
          this.checkboxList.push({
            text: v,
            value: res.content.dataQry.colNames[i]
          })
        })
      }
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
    // 获取数字字典（设备状态）
    this.deviceStatusList = this.$store.state.station_enumDic.StationEnum$deviceStatusEnum
    // 获取数字字典（运行状态）
    this.deviceRunStatusList = this.$store.state.station_enumDic.StationEnum$deviceRunStatusEnum
    // 获取数字字典（存放位置）
    this.deviceLocationList = this.$store.state.station_enumDic.StationEnum$deviceLocationEnum
    // 获取设备型号列表
    this.postJson('station', {
      apiCode: 300091,
      content: {
        paginated: false
      }
    }).then(res => {
      this.modelList = res.content.dataList
    })
    // 获取设备类型列表
    this.postJson('station', {
      apiCode: 300081,
      content: {
        paginated: false
      }
    }).then(res => {
      this.eqpTypeList = res.content.dataList
    })
  }
}
</script>

<style></style>
