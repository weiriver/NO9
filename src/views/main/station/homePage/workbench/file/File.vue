<template>
  <div class="File">
    <TablePage :totalCount="totalCount" ref="tabelPage">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <Print
          :btnStyle="'border-radius: 0'"
          :printTitle="'档案列表'"
          :tableHeader="checkboxList"
          :tableData="data1"
        ></Print>
        <Export
          :btnStyle="'border-radius:0 4px 4px 0'"
          :queryObj="confirmSearch"
          :checkboxList="checkboxList"
          :exportObjOrigin="exportObj"
          :sysModule="'public'"
          :fileSaveName="'档案信息'"
        ></Export>
      </div>
      <!-- 查询部分 -->
      <div class="searchBox" slot="query">
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="业务标题">
            <Input v-model="searchForm.bizTitle"/>
          </FormItem>
          <FormItem label="业务类型">
            <Select v-model="searchForm.flowId">
              <Option v-for="item in flowList" :value="item.id" :key="item.value" :label="item.flowName"></Option>
            </Select>
          </FormItem>
          <FormItem label="申请日期">
            <DatePicker type="daterange" v-model="applyDate" placement="bottom-end" value-format="yyyy-MM-dd"
                              @change="selDateEvent"></DatePicker>
          </FormItem>
          <FormItem label="归档日期">
            <DatePicker type="daterange" v-model="archiveDate" placement="bottom-end" value-format="yyyy-MM-dd"
                              @change="archiveDateEvent"></DatePicker>
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
          <TableColumn label="发起人" prop="createByName" minWidth="170"></TableColumn>
          <TableColumn label="创建时间" prop="createDate" minWidth="110">
            <template slot-scope="scope">
              <span>{{scope.row.createDate ? scope.row.createDate.substr(0, 10) : ''}}</span>
            </template>
          </TableColumn>
          <TableColumn label="完成时间" prop="lastUpdate" minWidth="110">
            <template slot-scope="scope">
              <span>{{scope.row.createDate ? scope.row.createDate.substr(0, 10) : ''}}</span>
            </template>
          </TableColumn>
          <TableColumn label="归档状态" prop="status" minWidth="100"></TableColumn>
          <TableColumn label="是否查看" prop="readStatus" minWidth="90">
            <template slot-scope="scope">
              <span>{{scope.row.readStatus ? '已查看' : '未查看'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="操作" minWidth="110">
            <template slot-scope="scope">
              <Button @click="distributeClick(scope.row)" type="text" v-if="Auth(200068)">分发</Button>
              <Button @click="detail(scope.row)" type="text">查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>

    <!--“分发”弹窗-->
    <Dialog :visible.sync="distributeModalFlag"
           title="分发档案"
           width="568"
           @on-ok="distributeConfirm"
           @on-cancel="distributeCancel"
           >
      <div class="distributeContent">
        <Row class="row">
          <Col :span="8" class="leftBar"><span>档案接收人</span></Col>
          <Col :span="16">
            <Input v-model="fenfaObj.content.acceptByName" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                    @focus="showTreeModal"
                    placeholder=""/>
          </Col>
        </Row>
        <Row class="row">
          <Col :span="8" class="leftBar"><span>查看处理情况</span></Col>
          <Col :span="16">
            <Select v-model="fenfaObj.content.showDetailFlag" style="width:200px">
              <Option value="1" label="允许">允许</Option>
              <Option value="0" label="禁止">禁止</Option>
            </Select>
          </Col>
        </Row>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button type="text" @click="distributeCancel">取 消</Button>
        <Button type="primary" @click="distributeConfirm">确 定</Button>
      </div>
    </Dialog>

    <!--“档案分发人” tree弹窗-->
    <Dialog
      :visible.sync="treeFlag"
      :append-to-body="true"
      title="选择用户"
      width="568">
      <AreauserSelect ref="chuliren" :checkboxFlag="true"></AreauserSelect>
      <div slot="footer" class="dialog-footer">
        <Button type="text" @click="treeCancel">取 消</Button>
        <Button type="primary" @click="treeConfirm">确 定</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'File',
  data() {
    return {
      showBtn: true, // 业务办理统计业务需要，动态控制按钮显示/隐藏
      exportObj: {
        apiCode: 200125,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '我的档案'
        }
      },
      checkboxList: [],
      delFlag: false, // “删除按钮”弹窗
      data1: [], // 表格内容信息
      dataCache: [], // 存放请求到的原始数据
      tableHeight: 0, // 默认是300
      totalCount: 0,
      fenfaObj: {
        apiCode: 200068,
        content: {
          sysModule: 'station',
          page: 1
        }
      },
      flowList: [],
      applyDate: [], // 申请日期
      archiveDate: [], // 归档日期
      businessTitle: '', // 业务标题
      businessType: '', // 业务名称
      distributeModalFlag: false, // “强制跳转” 弹窗
      printAndExportModalFlag: false, // （打印/导出）的弹窗的开关
      printOrExportClicked: '', // （打印或导出）按钮哪个被点击了, 0：打印 1：导出
      treeFlag: false,// “树结构” 弹窗
      confirmSearch: {
        sysModule: 'station',
        page: 1,
        limit: 20
      },
      searchForm: {
        sysModule: 'station',
        page: 1,
        limit: 20
      }
    }
  },
  methods: {
    indexMethod(index) {
      return index + 1 + (this.confirmSearch.page - 1) * 20
    },
    // 打开树状弹窗
    showTreeModal() {
      this.treeFlag = true
    },
    // 清空
    resetForm(formName, comfirmName) {
      this[formName] = this[comfirmName] = {
        page: 1,
        limit: 20,
        sysModule: 'station'
      }
      this.archiveDate = []
      this.applyDate = []
    },
    // 申请日期
    selDateEvent(date) {
      console.log('this.archiveDate', this.archiveDate)
      this.searchForm.createDateStart = date[0]
      this.searchForm.createDateEnd = date[1]
    },
    //  归档时间
    archiveDateEvent(date) {
      console.log('this.archiveDate', this.archiveDate)
      this.searchForm.finishDateStart = date[0]
      this.searchForm.finishDateEnd = date[1]
    },
    tableEditButtonFlag(val) {
      if (this.auth(val)) {
        return 'inline'
      } else {
        return 'none'
      }
    },
    // 分发
    distributeClick(item) {
      this.fenfaObj.content.instanceId = item.id
      this.distributeModalFlag = true // 显示跳转弹窗
    },
    // 分发 确认按钮
    async distributeConfirm() {
      console.log('分发确认')
      console.log('this.fenfaObj', this.fenfaObj)
      if (this.fenfaObj.content.showDetailFlag === '1') {
        this.fenfaObj.content.showDetail = true
      } else {
        this.fenfaObj.content.showDetail = false
      }
      var res = await this.postJsonWithMask('common', {
        apiCode: 200068,
        content: this.fenfaObj.content
      })
      console.log('res', res.content)
      if (res.code === '0') {
        this.showMsg('分发成功')
        this.fenfaObj.content = {}
      }
      this.distributeModalFlag = false
    },
    // 分发 取消按钮
    distributeCancel() {
      this.distributeModalFlag = false
      this.fenfaObj.content = {}
    },
    // tree确认按钮
    treeConfirm() {
      this.fenfaObj.content.acceptById = this.$refs.chuliren.userSelectCheckboxId
      this.fenfaObj.content.acceptByName = this.$refs.chuliren.userSelectCheckboxName
      console.log('选择分发人', this.fenfaObj)
      this.treeFlag = false
    },
    // tree取消按钮
    treeCancel() {
      this.treeFlag = false
      console.log('tree取消按钮')
    },
    // 查看
    detail(item) {
      sessionStorage.setItem('applyDetail', JSON.stringify(item))
      this.$router.push('/index/applyDetail?from=file')
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
        fileName: '我的档案'
      }
      var res = await this.postJson('common', {
        apiCode: 200058,
        content: this.confirmSearch
      })
      if (res.code == '0') {
        var dataList = res.content.dataList
        console.log(dataList)
        // this.createDate = dataList.createDate.getDate()
        this.data1 = this.dataCache = dataList
        this.totalCount = res.content.dataPage.totalCount
        this.checkboxList = []
        res.content.dataQry.colCNNames.forEach((v, i) => {
          this.checkboxList.push({
            text: v,
            value: res.content.dataQry.colNames[i]
          })
        })
        console.log('query 里面的this.checkboxList', this.checkboxList)
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
.leftBar {
  text-align: right;
  padding-right: 20px;
  font-size: 14px;
  line-height: 30px;
}

.row {
  margin: 10px 0;
}
</style>