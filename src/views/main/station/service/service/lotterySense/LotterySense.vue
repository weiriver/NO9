<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button v-if="true" type="primary" icon="el-icon-edit" @click="toAdd">新增</Button>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" size="mini" :model="dataForm" ref="dataForm">
          <FormItem label="标题">
            <Input v-model="dataForm.commonSenseTitle"></Input>
          </FormItem>
          <FormItem label="状态">
            <Select clearable v-model="dataForm.commonSenseStatus">
              <Option v-for="item in statusList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="是否广告">
            <Select clearable v-model="dataForm.isAdv">
              <Option v-for="item in isAdv" :value="item.value" :key="item.value" :label="item.label"></Option>
            </Select>
          </FormItem>
          <FormItem label="所属区域">
            <AreaCascader :ruturnAllLevelResultFlag="true" @areaSelectResult="areaSelectResult" ref="as"
                          :stage="3"></AreaCascader>
          </FormItem>
          <FormItem label="类型">
            <Select clearable v-model="dataForm.commonSenseType">
              <Option v-for="item in commonSenseType" :value="item.value" :key="item.value"
                      :label="item.label"></Option>
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
          <TableColumn label="标题" prop="commonSenseTitle"></TableColumn>
          <TableColumn label="发布时间" prop="publishTime"></TableColumn>
          <TableColumn label="所属类别" prop="commonSenseType">
            <template slot-scope="scope">
              <span>{{scope.row.commonSenseType.text}}</span>
            </template>
          </TableColumn>
          <TableColumn label="所属区域" prop="regionName"></TableColumn>
          <TableColumn label="状态" width="150">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.commonSenseStatus.value" typeOptions
                          @change="(value) =>statusChange(value, scope.row.id)">
                <RadioButton label="on">启用</RadioButton>
                <RadioButton label="off">停用</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn label="是否广告" prop="isEmbeded">
            <template slot-scope="scope">
              <span>{{scope.row.isAdv === false ? '否': '是'}}</span>
            </template>
          </TableColumn>
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
      deleteId: '',// 删除记录ID
      // 查询列表信息(暂时不用)
      Obj: {
        apiCode: 300261,
        content: {
          page: 1
        }
      },
      // 删除
      ObjDelete: {
        apiCode: 300264,
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
      tableDataFacilities: [],
      statusList: [],
      commonSenseType: [
        {
          value: 'playIndroduction',
          label: '玩法介绍'
        },
        {
          value: 'gameIndroduction',
          label: '游戏介绍'
        },
        {
          value: 'cashGuide',
          label: '兑奖指南'
        },
        {
          value: 'manageRules',
          label: '管理条例'
        },
        {
          value: 'news',
          label: '新闻资讯'
        }
      ],
      isAdv: [
        {
          value: 'true',
          label: '是'
        },
        {
          value: 'false',
          label: '否'
        }
      ]
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
    // 状态改变
    statusChange(val, params) {
      console.log(params)
      this.postJson('station', {
        apiCode: 300266,
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
      this.$router.push(`/service/lotterySenseAdd`)
    },
    toDetail(id) {
      this.$router.push(`/service/lotterySenseDetail/` + id)
    },
    editItem(id) {
      this.$router.push(`/service/lotterySenseAdd/` + id)
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
      var apiCode = 300261
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
    // 获取数字字典（状态）
    this.statusList = this.$store.state.station_enumDic.CommonEnum$statusEnum
    // 获取数字字典（运行状态）
    this.deviceRunStatusList = this.$store.state.station_enumDic.StationEnum$deviceRunStatusEnum
    // 获取数字字典（存放位置）
    this.deviceLocationList = this.$store.state.station_enumDic.StationEnum$deviceLocationEnum
  }
}
</script>

<style></style>
