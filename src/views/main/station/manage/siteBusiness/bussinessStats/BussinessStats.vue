<template>
  <div class="bussinessStats wrapper">
    <TablePage :showPagination="false" :firstIsCollapse="true">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Button type="primary" @click="daochu" icon="el-icon-caret-bottom" style="border-radius: 0 4px 4px 0;">导出</Button>
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="业务类型">
            <CheckboxGroup class="crBox" v-model="checkAllGroup" @change="checkAllGroupChange">
              <Checkbox :indeterminate="indeterminate"
                        :value="checkAll"
                        @click.prevent.native="handleCheckAll">全选
              </Checkbox>
              <Checkbox :label="item.id+''" v-for="item in flowList" :key="item.id">{{item.flowName}}</Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="时间粒度">
            <RadioGroup v-model="Obj.content.timeLevel">
              <Radio label="YEAR">按年</Radio>
              <Radio label="HALF">按半年</Radio>
              <Radio label="QUARTER">按季</Radio>
              <Radio label="MONTH">按月</Radio>
              <Radio label="DAY">按日</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="时间范围">
            <!--按年-->
            <div v-if="Obj.content.timeLevel=='YEAR'">
              <DatePicker
                      v-model="Obj.content.startStr"
                      type="year"
                      placeholder="选择年">
              </DatePicker>
              至
              <DatePicker
                      v-model="Obj.content.endStr"
                      type="year"
                      placeholder="选择年">
              </DatePicker>
            </div>
            <!--按半年-->
            <div v-if="Obj.content.timeLevel=='HALF'">
              <DatePicker
                      v-model="Obj.content.startStr"
                      type="year"
                      placeholder="选择年">
              </DatePicker>
              <Select clearable v-model="Obj.content.startHalf" style="width: 89px;">
                <Option v-for="item in timeOpions1" :value="item.value" :key="item.value" :label="item.label"></Option>
              </Select>
              至
              <DatePicker
                      v-model="Obj.content.endStr"
                      type="year"
                      placeholder="选择年">
              </DatePicker>
              <Select clearable v-model="Obj.content.endHalf" style="width: 89px;">
                <Option v-for="item in timeOpions1" :value="item.value" :key="item.value" :label="item.label"></Option>
              </Select>
            </div>
            <!--按季度-->
            <div v-if="Obj.content.timeLevel=='QUARTER'">
              <DatePicker
                      v-model="Obj.content.startStr"
                      type="year"
                      placeholder="选择季度">
              </DatePicker>
              <Select clearable v-model="Obj.content.startQuarter" style="width: 89px;">
                <Option v-for="item in timeOpions2" :value="item.value" :key="item.value" :label="item.label"></Option>
              </Select>
              至
              <DatePicker
                      v-model="Obj.content.endStr"
                      type="year"
                      placeholder="选择季度">
              </DatePicker>
              <Select clearable v-model="Obj.content.endQuarter" style="width: 89px;">
                <Option v-for="item in timeOpions2" :value="item.value" :key="item.value" :label="item.label"></Option>
              </Select>
            </div>
            <!--按月份-->
            <div v-if="Obj.content.timeLevel=='MONTH'">
              <DatePicker
                      v-model="Obj.content.startStr"
                      format="yyyy-MM"
                      value-format="yyyy-MM"
                      type="month"
                      placeholder="选择月">
              </DatePicker>
              至
              <DatePicker
                      v-model="Obj.content.endStr"
                      format="yyyy-MM"
                      value-format="yyyy-MM"
                      type="month"
                      placeholder="选择月">
              </DatePicker>
            </div>
            <!--按日-->
            <div v-if="Obj.content.timeLevel=='DAY'">
              <DatePicker
                      v-model="dayTime"
                      @change="selDateEvent"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd">
              </DatePicker>
            </div>
          </FormItem>
          <FormItem label="所属区域" prop="regionCode" style="width: 360px;">
            <AreaCascader ref="as" :ruturnAllLevelResultFlag="true" :select_any_level_flag="true" v-model="Obj.content.regionCode"
                          @areaSelectResult="areaSelectResult" :stage="3" :res="regionCode"></AreaCascader>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="query">查询</Button>
          </FormItem>
        </Form>
      </div>
    </TablePage>
    <div class="box">
      <div class="makeMiddle">
        <!--表格-->
        <div class="table_box" v-if="showTable">

          <!--非按日筛选-->
          <table class="_table" v-if="Obj.content.processTypeNames && Obj.content.timeLevel != 'DAY'">
            <thead>
            <tr>
              <td></td>
              <td colspan="3" v-for="item in Obj.content.processTypeNames" :key="item.id">{{item}}</td>
              <td></td>
            </tr>
            <tr>
              <td class="table_title">时间</td>
              <td v-for="(item,index) in Obj.content.processTypeNames.length*3" :key="item.id">
                {{index%3==0?'数量':(index%3==1?'同比':'环比')}}
              </td>
              <td>合计</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="tritem in data" :key="tritem.id" v-if="tritem.bizTypeList">
              <td>{{tritem.bizDate}}</td>
              <td v-for="(item,_index) in tritem.bizTypeList.length*3" :key="item.id">
                <div :class="{pointer:tritem.bizTypeList[parseInt(_index/3)].number}"
                     @click="showFileModal(tritem.bizTypeList[parseInt(_index/3)],tritem.bizDate)">
                  {{
                  _index%3==0?
                  tritem.bizTypeList[parseInt(_index/3)].number:
                  _index%3==1?
                  tritem.bizTypeList[parseInt(_index/3)].tongbi:
                  tritem.bizTypeList[parseInt(_index/3)].huanbi
                  }}
                </div>
              </td>
              <td>{{tritem.total}}</td>
            </tr>
            </tbody>
          </table>
          <!--按日-->
          <table class="_table" v-if="data[0].bizTypeList && Obj.content.timeLevel == 'DAY'">
            <thead>
            <tr>
              <td></td>
              <td v-for="item in Obj.content.processTypeNames" :key="item.id">{{item}}</td>
              <td></td>
            </tr>
            <tr>
              <td class="table_title">时间</td>
              <td v-for="(item,index) in Obj.content.processTypeNames" :key="item.id">
                数量
              </td>
              <td>合计</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="tritem in data" :key="tritem.id">
              <td>{{tritem.bizDate}}</td>
              <td v-for="(item,index) in tritem.bizTypeList" :key="item.id">
                {{ tritem.bizTypeList[index].number }}
              </td>
              <td>{{tritem.total}}</td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
    <!-- 点击弹出框 -->
    <Dialog title="档案列表" :visible.sync="fileFlag" width="53%">
      <p>12123123</p>
      <File ref="file"></File>
      <div slot="footer" class="dialog-footer">
        <Button @click="fileFlag=false">取 消</Button>
        <Button @click="fileFlag=false" type="primary">确 定</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import File from '../../../homePage/workbench/file/File'
  var FileSaver = require('file-saver')
export default {
  name: 'bussinessStats',
  components: {
    File
  },
  data() {
    return {
      fileFlag: false,
      dayTime: '',
      timeOpions1: [
        {
          value: 'firstHalf',
          label: '上半年'
        },
        {
          value: 'secondHalf',
          label: '下半年'
        }
      ],
      timeOpions2: [
        {
          value: 'firstQuarter',
          label: '第一季度'
        },
        {
          value: 'secondQuarter',
          label: '第二季度'
        },
        {
          value: 'thirdQuarter',
          label: '第三季度'
        },
        {
          value: 'fourthQuarter',
          label: '第四季度'
        }
      ],
      regionCode: '',
      Obj: {
        apiCode: 300311,
        content: {regionCode: '', timeLevel: 'YEAR', startStr: '2018', endStr: '2018', startQuarter: '', endQuarter: '', processTypeIds: []}
      },
      flowList: [],
      checkAllList: [],
      checkboxList: [],
      indeterminate: false,
      checkAll: false,
      searchForm: {},
      checkAllGroup: [],
      showTable: false,
      data: [
        {
          name: '2018/07/31',
          bizTypeList1: [
            {
              title: '站点新增',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88,
              href: 'id'
            },
            {
              title: '站点站点迁址',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            },
            {
              title: '站点转让',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            },
            {
              title: '站点撤销',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            },
            {
              title: '站点停开机',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            }
          ],
          bizTypeList: [],
          count: '1024'
        },
        {
          name: '合计',
          tableList: [
            {
              title: '站点新增',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            },
            {
              title: '站点站点迁址',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            },
            {
              title: '站点转让',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            },
            {
              title: '站点撤销',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            },
            {
              title: '站点停开机',
              tongbi: 123,
              huangbi: 321,
              shuliang: 88
            }
          ],
          count: '1024'
        }
      ],
    }
  },
  methods: {
    daochu() {
      this.validate().then(flag => {
        if (flag) {
          let obj = JSON.parse(JSON.stringify(this.Obj))
          if (this.Obj.content.regionCode != 0) {
            delete obj.content.flag
          } else {
            obj.content.flag = obj.content.flag ? 'yes' : 'no'
          }
          obj.content.fileType = 'excel'
          obj.content.fileName = 'dfs'
          this.postJson('station', {apiCode: 300312, content: obj.content}).then(res => {
            var blob = new Blob([res], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'})
            FileSaver.saveAs(blob, '业务办理统计' + '.xlsx')
          })
        }
      })
    },
    showFileModal(item, bizDate) {
      let {flowId, number} = item
      if ((bizDate == '合计' || typeof (bizDate * 1) == 'number') && number > 0) {
        this.fileFlag = true
        setTimeout(() => {
          // console.log(flowId)
          // console.log(bizDate)
          // console.log(this.$refs.file)
          this.$refs.file.Obj.content.flowId = flowId
          this.fileFlag = true
          this.$refs.file.tableHeader.pop()
          let timeLevel = this.Obj.content.timeLevel
          let date = new Date().getDate() + ''
          let month = new Date().getMonth() + 1
          month = month < 10 ? '0' + month : month + ''
          if (timeLevel == 'YEAR') {
            if (bizDate != '合计') {
              this.$refs.file.Obj.content.finishDateStart = bizDate + '-01-01'
              if ((bizDate * 1) < (new Date().getFullYear())) {
                this.$refs.file.Obj.content.finishDateEnd = bizDate + '-12-31'
              } else {
                this.$refs.file.Obj.content.finishDateEnd = bizDate + '-' + month + '-' + (date < 10 ? '0' + date : date)
              }
            } else {
              this.$refs.file.Obj.content.finishDateStart = this.Obj.content.startStr + '-01-01'
              if ((this.Obj.content.startStr * 1) < (new Date().getFullYear())) {
                this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-12-31'
              } else {
                this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-' + month + '-' + (date < 10 ? '0' + date : date)
              }
            }
          } else if (timeLevel == 'HALF') {
            if (this.Obj.content.startHalf == 'firstHalf') {
              this.$refs.file.Obj.content.finishDateStart = this.Obj.content.startStr + '-01-01'
              this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-06-31'
            } else {
              this.$refs.file.Obj.content.finishDateStart = this.Obj.content.startStr + '-07-01'
              this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-12-31'
            }
          } else if (timeLevel == 'QUARTER') {
            if (this.Obj.content.startHalf == 'firstQuarter') {
              this.$refs.file.Obj.content.finishDateStart = this.Obj.content.startStr + '-01-01'
              this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-03-31'
            } else if (this.Obj.content.startHalf == 'secondQuarter') {
              this.$refs.file.Obj.content.finishDateStart = this.Obj.content.startStr + '-04-01'
              this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-06-30'
            } else if (this.Obj.content.startHalf == 'thirdQuarter') {
              this.$refs.file.Obj.content.finishDateStart = this.Obj.content.startStr + '-07-01'
              this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-09-30'
            } else {
              this.$refs.file.Obj.content.finishDateStart = this.Obj.content.startStr + '-10-01'
              this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-12-31'
            }
          } else if (timeLevel == 'MONTH') {
            this.$refs.file.Obj.content.finishDateStart = this.Obj.content.startStr + '-01'
            this.$refs.file.Obj.content.finishDateEnd = this.Obj.content.endStr + '-' + (date < 10 ? '0' + date : date)
          }
          this.$refs.file.Obj.content.sysModule = 'station'
          this.$refs.file.Obj.content.regionCode = this.Obj.content.regionCode
          this.$refs.file.data1 = []
          this.$refs.file.showBtn = false // 隐藏掉按钮
          setTimeout(() => {
            this.$refs.file.query()
          }, 400)
        }, 50)
      }
    },
    // 按日
    selDateEvent(date) {
      if (date) {
        this.Obj.content.startStr = date[0]
        this.Obj.content.endStr = date[1]
      } else {
        this.Obj.content.startStr = ''
        this.Obj.content.endStr = ''
      }
      console.log(this.Obj.content.startStr)
      console.log(this.Obj.content.endStr)
    },
    checkAllGroupChange(data) {
      this.Obj.content.processTypeIds = data
      if (data.length === this.flowList.length) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
      console.log(this.Obj.content.processTypeIds)
    },
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      if (this.checkAll) {
        this.Obj.content.processTypeIds = this.checkAllGroup = this.checkAllList
      } else {
        this.checkAllGroup = []
        this.Obj.content.processTypeIds = []
      }
      console.log(this.Obj.content.processTypeIds)
    },
    async validate() {
      var check = true
      if (this.Obj.content.processTypeIds && !this.Obj.content.processTypeIds.length) {
        this.showMsg('请选择业务类型', 'warning')
        check = false
      } else {
        this.Obj.content.processTypeNames = []
        const data = this.Obj.content.processTypeIds
        this.flowList.forEach(v => {
          if (data.includes('' + v.id)) {
            this.Obj.content.processTypeNames.push(v.flowName)
          }
        })
      }
      console.log(this.Obj.content.startStr)
      console.log(this.Obj.content.endStr)
      if (!this.Obj.content.startStr || !this.Obj.content.endStr) {
        this.showMsg('请选择时间范围', 'warning')
        check = false
      }
      if (!this.Obj.content.regionCode) {
        this.showMsg('请选择所属区域', 'warning')
        check = false
      }
      let newVal = this.Obj
      console.log(this.Obj.content)
      let val = newVal.content.timeLevel
      if (val != 'DAY' && val != 'MONTH') {
        if (this.Obj.content.startStr.length > 4) this.Obj.content.startStr = this.Obj.content.startStr.substr(0, 4)
        if (this.Obj.content.endStr.length > 4) this.Obj.content.endStr = this.Obj.content.endStr.substr(0, 4)
      }
      if (val == 'YEAR') { // 按年
        newVal.content.startHalf = newVal.content.endHalf = newVal.content.startQuarter = newVal.content.endQuarter = ''
      } else if (val == 'HALF') { // 按半年
        // newVal.content.startHalf = newVal.content.endHalf = 'firstHalf'
        newVal.content.startQuarter = newVal.content.endQuarter = ''
      } else if (val == 'QUARTER') { // 按季度
        // newVal.content.startQuarter = newVal.content.endQuarter = 'firstQuarter'
        newVal.content.startHalf = newVal.content.endHalf = ''
      } else if (val == 'MONTH') { // 按月
        newVal.content.startHalf = newVal.content.endHalf = newVal.content.startQuarter = newVal.content.endQuarter = ''
      } else if (val == 'DAY') { // 按日
        newVal.content.startHalf = newVal.content.endHalf = newVal.content.startQuarter = newVal.content.endQuarter = ''
      }
      console.log(this.Obj.content)
      return check
    },
    // 查询
    query() {
      this.validate().then(flag => {
        if (flag) {
          // this.spinShow = true
          let obj = JSON.parse(JSON.stringify(this.Obj))
          if (this.Obj.content.regionCode != 0) {
            delete obj.content.flag
          } else {
            obj.content.flag = obj.content.flag ? 'yes' : 'no'
          }
          this.postJson('station', obj).then(res => {
            // this.spinShow = false
            if (res.code == 0) {
              if (res.content.length > 1) {
                console.log(res)
                this.showTable = true
                this.data = res.content
              } else {
                this.showMsg('暂无数据')
                this.showTable = false
              }
            } else {
              this.showTable = false
            }
          })
        }
      })
    },
    areaSelectResult(val) {
      // console.log('areaSelectResult', result)
      // // 第一次加载会触发但是 result是空
      // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
      // console.log('this.regionCode', this.regionCode)
      // if (result.length > 0) {
      //   this.ruleForm.regionCode = result[result.length - 1].value
      //   this.ruleForm.regionName = result[result.length - 1].label
      // } else {
      //   this.ruleForm.regionCode = ''
      //   this.ruleForm.regionName = ''
      // }
      if (val[0]) {
        this.Obj.content.regionCode = val[0].value
      }
      if (val[1]) {
        this.Obj.content.regionCode = val[1].value
      }
      if (val[2]) {
        this.Obj.content.regionCode = val[2].value
      }
    }
  },
  mounted() {
    // 获取业务列表
    this.postJson(
      '',
      {
        apiCode: 200127,
        content: {
          sysModule: 'station'
        }
      }
    ).then(res => {
      this.checkboxList = []
      this.flowList = res.content.dataList
      res.content.dataList.forEach(v => {
        this.checkAllList.push('' + v.id)
        this.checkboxList.push({
          text: v.flowName,
          value: v.id
        })
      })
    })
  }
}
</script>

<style lang="scss">
  @import "../../../../../../assets/css/station/zoneAnalysis";
  @import "../../../../../../assets/css/station/listPage";
  .bussinessStats{
    .form-inline .el-form-item{
      display: flex;
      width: 100%;
      .el-form-item__label{

      }
      .el-form-item__content{
        flex: 1;
        .crBox{
          border: 1px solid #dfe0e3;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          padding-left: 10px;
          .el-checkbox{
            display: inline-block;
            margin-left: 0px;
            margin-right: 5px;
            .el-checkbox__label{
              padding-left: 3px;
              padding-right: 8px;
            }
          }
        }
        .el-radio-group{
          width: 100%;
          height: 100%;
          margin-right: 10px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          border: 1px solid #dfe0e3;
          -webkit-border-radius: 4px;
          -moz-border-radius: 4px;
          border-radius: 4px;
          padding-left: 10px;
          .el-radio{
            line-height: 28px;
          }
        }
      }
    }
    .table_box {
      width: 100%;
      overflow-x: scroll;
    }
    ._table {
      min-width: 690px;
      text-align: center;
      border: 1px solid #e9eaec;
      thead, tbody {
        tr {
          td {
            min-width: 50px;
            color: #495060;
            text-align: center !important;
            padding: 0 !important;
            border: 1px solid #e9eaec !important;
          }
        }
      }
      tbody {
        tr {
          td {
            &:nth-child(3n+2) {
              background: gold !important;
            }
            &:nth-child(3n) {
              background: #ff9900 !important;
            }
            &:nth-child(3n+1) {
              background: #18be6a !important;
            }
            &:nth-child(1) {
              background: white !important;
            }
            &:last-child {
              background: transparent !important;
            }
          }
        }
        tr:hover {
          td {
            &:nth-child(3n+2) {
              background: gold !important;
            }
            &:nth-child(3n) {
              background: #ff9900 !important;
            }
            &:nth-child(3n+1) {
              background: #18be6a !important;
            }
            &:nth-child(1) {
              background: white !important;
            }
            &:last-child {
              background: transparent !important;
            }
          }
        }
      }

    }
    .table_title {
      width: 80px;
    }
  }
</style>