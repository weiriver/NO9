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
           :printTitle="'设备类型列表'"
           :tableData="tableDataFacilities"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'station'"
           :fileSaveName="'设备类型列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" size="mini" :model="dataForm" ref="dataForm">
          <FormItem label="设备类型名称" prop="modelName">
            <Input v-model="dataForm.typeX"></Input>
          </FormItem>
          <FormItem label="是否内置" prop="stationCode">
            <Select clearable v-model="dataForm.isEmbeded">
              <Option label="是" value="true"></Option>
              <Option label="否" value="false"></Option>
            </Select>
          </FormItem>
          <FormItem label="是否标配" prop="stationCode">
            <Select clearable v-model="dataForm.isStandard">
              <Option label="是" value="true"></Option>
              <Option label="否" value="false"></Option>
            </Select>
          </FormItem>
          <FormItem label="是否回收" prop="stationCode">
            <Select clearable v-model="dataForm.isRecover">
              <Option label="是" value="true"></Option>
              <Option label="否" value="false"></Option>
            </Select>
          </FormItem>
          <FormItem label="启停状态" prop="stationCode">
            <Select clearable v-model="dataForm.status">
              <Option label="启用" value="on"></Option>
              <Option label="停用" value="off"></Option>
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
          <TableColumn label="类型名称" prop="deviceTypeName"></TableColumn>
          <TableColumn label="是否内置" prop="isEmbeded">
            <template slot-scope="scope">
              <span>{{scope.row.isEmbeded === false ? '否': '是'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="是否标配" prop="isStandard">
            <template slot-scope="scope">
              <span>{{scope.row.isStandard === false ? '否': '是'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="是否回收" prop="isRecover">
            <template slot-scope="scope">
              <span>{{scope.row.isRecover === false ? '否': '是'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="状态" width="150">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.status.value" typeOptions
                          @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="on">启用</RadioButton>
                <RadioButton label="off">停用</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn label="备注" prop="remark"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
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
        apiCode: 300081,
        content: {
          page: 1
        }
      },
      // 删除
      ObjDelete: {
        apiCode: 300084,
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
          text: '类型名称',
          value: 'deviceTypeName'
        },
        {
          text: '是否内置',
          value: 'isEmbeded'
        },
        {
          text: '是否标配',
          value: 'isStandard'
        },
        {
          text: '是否回收',
          value: 'isRecover'
        },
        {
          text: '状态',
          value: 'status'
        },
        {
          text: '备注',
          value: 'remark'
        }
      ], // 表格头部信息
      // 导出接口配置
      exportObj: {
        apiCode: 300086,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '设备类型管理'
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
    // 状态改变
    statusChange(val, params) {
      console.log(params)
      this.postJson('station', {
        apiCode: 300083,
        content: {
          id: params,
          status: val
        }
      }).then(res => {
        if (res.code === '0') {
          this.showMsg('状态更新成功')
        } else {
          this.query()
        }
      })
    },
    toAdd() {
      this.$router.push(`/equipment/eqpTypeAdd`)
    },
    editItem(id) {
      this.$router.push(`/equipment/eqpTypeAdd/` + id)
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
      var apiCode = 300081
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
