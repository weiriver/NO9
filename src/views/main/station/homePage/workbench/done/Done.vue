<template>
  <div class="done">
    <TablePage :totalCount="totalCount" ref="tabelPage">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Print
          :btnStyle="'border-radius: 0'"
          :printTitle="'我的已办列表'"
          :tableHeader="checkboxList"
          :tableData="data1"
        ></Print>
        <Export
          :btnStyle="'border-radius:0 4px 4px 0'"
          :queryObj="confirmSearch"
          :checkboxList="checkboxList"
          :exportObjOrigin="exportObj"
          :sysModule="'public'"
          :fileSaveName="'我的已办列表'"
        ></Export>
      </div>
      <!-- 查询部分 -->
      <div class="searchBox" slot="query">
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini" ref="searchForm">
          <FormItem label="业务标题">
            <Input v-model="searchForm.bizTitle"/>
          </FormItem>
          <FormItem label="业务类型">
            <Select v-model="searchForm.flowId">
              <Option v-for="item in flowList" :value="item.id" :key="item.value" :label="item.flowName"></Option>
            </Select>
          </FormItem>
          <FormItem label="申请日期">
            <DatePicker type="daterange" v-model="selectDateValue" placement="bottom-end" value-format="yyyy-MM-dd" @change="selDateEvent"></DatePicker>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm', 'confirmSearch')">清空</Button>
          </FormItem>
        </Form>
      </div>
      <!--表格-->
      <div slot="TableSlot">
        <Table ref="multipleTable" stripe :data="data1" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn label="序号" width="50" type="index" align="center" :index="indexMethod"></TableColumn>
          <TableColumn label="业务标题" minWidth="240" prop="bizTitle"></TableColumn>
          <TableColumn label="业务类型" prop="flowName" minWidth="170"></TableColumn>
          <TableColumn label="处理时间" prop="finishDate" minWidth="110">
            <template slot-scope="scope">
              <span>{{scope.row.createDate ? scope.row.createDate.substr(0, 10) : ''}}</span>
            </template>
          </TableColumn>
          <TableColumn label="受理步骤" prop="nodeName" minWidth="170"></TableColumn>
          <TableColumn label="当前处理人" prop="currentByName" minWidth="170"></TableColumn>
          <TableColumn label="操作" minWidth="170">
            <template slot-scope="scope">
              <Button @click="cuibanClick(scope.row.instanceId)" type="text" v-if="Auth(200066)">催办</Button>
              <Button @click="forceCloseClick(scope.row.instanceId)" type="text" v-if="Auth(200067)">强制结束</Button>
              <Button @click="detail(scope.row)" type="text">查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
      <!--点击“强制结束”弹窗-->
    <Dialog :visible.sync="forceCloseFlag" width="30%" title="强制结束" :center="true">
      <div class="forceCloseReason">
        <p style="margin-bottom: 10px;">请输入结束原因:</p>
        <Input class="closeReasonTextarea" v-model="closeReason" :rows="6" type="textarea" placeholder=""/>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" @click="forceCloseConfirm" class="forceClose-btn">提交</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Done',
  data() {
    return {
      forceCloseId: '',
      closeReason: '',// 强制结束的理由
      exportObj: {
        apiCode: 200123,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '我的已办'
        }
      },
      checkboxList: [],
      data1: [], // 表格内容信息
      dataCache: [], // 存放请求到的原始数据
      tableHeight: 0, // 默认是0
      filterStr: '', // 过滤的输入字符
      totalCount: 0,
      confirmSearch: {
        sysModule: 'station',
        page: 1,
        limit: 20
      },
      searchForm: {
        sysModule: 'station',
        page: 1,
        limit: 20
      },
      flowList: [], // 业务类型
      forceCloseFlag: false, // “强制结束” 弹窗
      selectDateValue: []
    }
  },
  methods: {
    // 表格序号
    indexMethod(index) {
      return index + 1 + (this.confirmSearch.page - 1) * 20
    },
    // 申请日期
    selDateEvent(date) {
      this.searchForm.createDateStart = date[0]
      this.searchForm.createDateEnd = date[1]
    },
    // 催办
    async cuibanClick(instanceId) {
      var res = await this.postJsonWithMask('common', {
        apiCode: 200066,
        content: {
          instanceId: instanceId
        }
      })
      if (res.code === '0') {
        this.showMsg('催办成功')
      }
    },
    // 强制结束点击
    forceCloseClick(instanceId) {
      this.forceCloseId = instanceId
      this.forceCloseFlag = true
    },
    // 强制结束确认
    async forceCloseConfirm() {
      var res = await this.postJsonWithMask('common', {
        apiCode: 200067,
        content: {
          instanceId: this.forceCloseId,
          content: this.closeReason
        }
      })
      if (res.code === '0') {
        this.showMsg('操作成功')
        this.forceCloseFlag = false
        this.closeReason = ''
        this.query()
      }
    },
    // 查看
    detail(item) {
      sessionStorage.setItem('applyDetail', JSON.stringify(item))
      this.$router.push('/index/applyDetail?from=done')
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      this.exportObj.content = {
        colNames: [],
        colCNNames: [],
        fileType: 'excel',
        fileName: '我的已办'
      }
      var res = await this.postJson('common', {
        apiCode: 200057,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        var dataList = res.content.dataList
        this.data1 = this.dataCache = dataList
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
    // 清空
    resetForm(formName, comfirmName) {
      this[formName] = this[comfirmName] = {
        page: 1,
        limit: 20,
        sysModule: 'station'
      }
      this.selectDateValue = []
    },
    async getFlowList() {
      var res = await this.postJson('common', {
        apiCode: 200127,
        content: {
          sysModule: 'station',
          paginated: false
        }
      })
      if (res.code == 0) {
        this.flowList = res.content.dataList
      }
    },
    arrFilter() {
      if (this.filterStr) {
        this.data1 = this.ArrFilter(this.filterStr, this.dataCache)
      } else {
        this.query()
      }
    }
  },
  mounted: function () {
    this.getFlowList()
    this.init()
    this.tableHeight = this.tableHeightCal('el-main', 150)
  }
}
</script>

<style scoped lang="scss">
.forceClose-btn{
  width: 100%;
}
</style>