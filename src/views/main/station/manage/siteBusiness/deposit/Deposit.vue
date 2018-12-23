<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button type="primary" @click="submit" style="border-radius: 0 4px 4px 0;">
          <span>提交</span>
        </Button>
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="所属区域">
            <AreaCascader ref="as" :ruturnAllLevelResultFlag="true"  :select_any_level_flag="true" v-model="searchForm.regionCode"
                          @areaSelectResult="areaSelectResult" :stage="3"></AreaCascader>
          </FormItem>
          <FormItem label="站点建立时间" prop="createDate">
            <DatePicker @change="dataChange" v-model="searchForm.data" range-separator="至" type="daterange"
                        placeholder="选择日期" value-format="yyyy-MM-dd"
            ></DatePicker>
          </FormItem>
          <FormItem label="保证金确认">
            <Select clearable v-model="searchForm.depositCheckText" placeholder="请选择保证金确认">
              <Option v-for="item in depositCheckList" :key="item.value" :value="item.value"
                      :label="item.text"></Option>
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

          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="站点编号" prop="stationCode">
            <template slot-scope="scope">
              <span>{{scope.row.bizObject.stationCode}}</span>
            </template>
          </TableColumn>
          <TableColumn label="负责人" prop="principal">
            <template slot-scope="scope">
              <span>{{scope.row.bizObject.principal}}</span>
            </template>
          </TableColumn>
          <TableColumn label="销售保证金" prop="deposit">
            <template slot-scope="scope">
              <span>{{scope.row.bizObject.deposit}}</span>
            </template>
          </TableColumn>
          <TableColumn label="状态" min-width="100">
            <template slot-scope="scope">
              <RadioGroup v-model="scope.row.bizObject.depositCheck" typeOptions
                          @change="(value) =>statusChange(value, scope.row.bizObject.id)">
                <RadioButton label="true">已收款</RadioButton>
                <RadioButton label="false">未收款</RadioButton>
              </RadioGroup>
            </template>
          </TableColumn>
          <TableColumn
                  label="操作"
                  width="140">
            <template slot-scope="scope">
              <Button @click="jumpTodo(scope.row)" type="text" typeOptions>处理</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
  export default {
    name: 'Deposit',
    data: function () {
      return {
        searchBox_flag: false, // 查询框显示与否
        bizIdsTrueArray: [],
        bizIdsFalseArray: [],
        // Obj: {
        //   apiCode: 200011,
        //   content: {
        //     page: 1,
        //     regionCode: 0
        //   }
        // },
        depositCheckList: [
          {
            text: '已收款',
            value: 1
          },
          {
            text: '未收款',
            value: 0
          }
        ],
        tableData: [], // 列表数据,
        // 表单提交数据绑定model
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
      // runningstateList() {
      //   return JSON.parse(sessionStorage.getItem('all_enumDic')).StorageEnum$runningstateEnum
      //   // return this.$store.state['all_enumDic'].StorageEnum$runningstateEnum
      // }
    },
    watch: {
      typeX(val) {
        this.search()
      }
    },
    methods: {
      jumpTodo(item) {
        var buz = {}
        buz.flowCode = 'station_add'
        buz.flowId = 4
        buz.flowName = '建站申请'
        buz.nodeCode = 'sheng_zhong_xin_cai_wu_shou_kuan'
        buz.nodeName = '省中心财务收款'
        buz.instanceId = item.instance_id
        buz.bizId = item.biz_id
        buz.id = item.wait_task_id
        sessionStorage.setItem('todosSitesAdd', JSON.stringify(buz))
        this.$router.push('/index/todosSitesAdd')
      },
      // 点击提交
      submit() {
        this.postJson('biz', {
          apiCode: 200012,
          content: {
            bizIdsTrue: this.bizIdsTrueArray.join(','),
            bizIdsFalse: this.bizIdsFalseArray.join(',')
          }
        }).then(res => {
          if (res.code === '0') {
            this.showMsg('提交成功')
          } else {
            this.showMsg('提交失败', 'error')
          }
          this.query()
        })
      },
      // 查询-日期改变触发事件
      dataChange(val) {
        if (val) {
          this.searchForm.startTime = val[0]
          this.searchForm.endTime = val[1]
        } else {
          this.searchForm.startTime = ''
          this.searchForm.endTime = ''
        }
      },
      // 查询-所属区域改变触发事件
      areaSelectResult(result) {
        // 第一次加载会触发但是 result是空
        if (result && result.length > 0) {
          this.searchForm.regionCode = result[result.length - 1].value
        } else {
          this.searchForm.regionCode = ''
        }
        console.log(this.searchForm.regionCode)
      },
      // 修改状态操作
      async statusChange(val, id) {
        var index = -1
        if (val == 'true') {
          index = this.bizIdsFalseArray.indexOf(id)
          this.bizIdsFalseArray.splice(index, 1)
          this.bizIdsTrueArray.push(id)
        } else {
          index = this.bizIdsTrueArray.indexOf(id)
          this.bizIdsTrueArray.splice(index, 1)
          this.bizIdsFalseArray.push(id)
        }
      },
      // 初始化查询内容
      initAboutTypeX() {
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
        this.Event.$emit('pageInit', 1)
        this.query()
      },
      async query() {
        if (this.searchForm.depositCheckText === 1) {
          this.searchForm.depositCheck = true
        } else if (this.searchForm.depositCheckText === 0) {
          this.searchForm.depositCheck = false
        }
        var res = await this.postJson('biz', {
          apiCode: 200011,
          content: this.searchForm
        })
        this.tableData = res.content.dataList
        this.bizIdsTrueArray = []
        this.bizIdsFalseArray = []
        this.tableData.forEach(e => {
          var biz = e.bizObject
          if (biz.depositCheck) {
            this.bizIdsTrueArray.push(biz.id)
          } else {
            this.bizIdsFalseArray.push(biz.id)
          }
        })
        this.totalCount = res.content.dataPage.totalCount
      },
      resetForm(formName) {
        // this[formName] = {}
        this.searchForm = {}
        console.log(this.searchForm)
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
