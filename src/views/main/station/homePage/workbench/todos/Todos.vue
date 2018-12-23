<!--库存查询-->
<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Print
           :btnStyle="'border-radius: 0px '"
           :tableHeader="tableHeader"
           :printTitle="'我的待办列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'station'"
           :fileSaveName="'我的待办列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="业务标题" prop="bizTitle">
            <Input v-model="searchForm.bizTitle"></Input>
          </FormItem>
          <FormItem label="业务类型" prop="flowId">
            <Select clearable v-model="searchForm.flowId" placeholder=''>
              <Option v-for="item in flowList" :key="item.id" :value="item.id" :label="item.flowName"></Option>
            </Select>
          </FormItem>

          <FormItem label="申请开始日期" prop="createDateStart">
            <DatePicker
               v-model="searchForm.createDateStart"
               type="date"
               placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </DatePicker>
          </FormItem>
          <FormItem label="申请结束日期" prop="createDateEnd">
            <DatePicker
               v-model="searchForm.createDateEnd"
               type="date"
               placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </DatePicker>
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
          <TableColumn label="序号" width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="业务标题" prop="bizTitle"></TableColumn>
          <TableColumn label="业务类型" prop="flowName"></TableColumn>
          <TableColumn label="申请时间" prop="applyDate"></TableColumn>
          <TableColumn label="截止时间" prop="timeLimit"></TableColumn>
          <TableColumn label="状态" prop="status">
            <template slot-scope="scope">
              {{ scope.row.status | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="当前步骤" prop="nodeName" width="100"></TableColumn>

          <TableColumn label="操作" width="140">
            <template slot-scope="scope">
              <Button @click="transfer(scope.row)" type="text" size="small" v-if="Auth(200065)">移交</Button>
              <Button @click="editItem(scope.row)" type="text" size="small">处理</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>

    <!--选择物品名称--弹窗-->
    <Dialog :title="transferTitle" :visible.sync="transferDialogVisible" width="50%">

      <Form label-width="140px" :model="yijiaoObj" size="mini" ref="yijiaoObj">
        <FormItem label="步骤移交人" prop="goodsId">
          <AreauserSelect ref="chuliren" :checkboxFlag="false"></AreauserSelect>
        </FormItem>

        <FormItem label="备注" prop="content">
          <Input type="textarea" autosize v-model="yijiaoObj.content.content"></Input>
        </FormItem>

      </Form>

      <div slot="footer" class="dialog-footer">
        <Button @click="transferDialogVisible = false">取 消</Button>
        <Button type="primary" @click="transferConfirm">确 定</Button>
      </div>
    </Dialog>

  </div>
</template>

<script>
export default {
  name: 'Todos',
  data: function () {
    return {
      transferTitle: '移交步骤',
      transferDialogVisible: false,
      deviceTypeSelected: true,
      tableHeader: [
        {
          text: '业务标题',
          value: 'bizTitle'
        },
        {
          text: '业务类型',
          value: 'flowName'
        },
        {
          text: '申请时间',
          value: 'applyDate'
        },
        {
          text: '截止时间',
          value: 'timeLimit'
        },
        {
          text: '状态',
          value: 'status'
        },
        {
          text: '当前步骤',
          value: 'nodeName'
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
        sysModule: 'station',
        page: 1,
        limit: 20
      },
      searchForm: {
        sysModule: 'station',
        page: 1,
        limit: 20
      },
      flowList: [],
      regionCode: '',
      yijiaoObj: {
        apiCode: 200065,
        content: {}
      }
    }
  },
  methods: {
    // 移交
    transfer(item) {
      this.transferDialogVisible = true
      this.yijiaoObj.content.instanceId = item.instanceId
      this.yijiaoObj.content.waitTaskId = item.id
    },
    // 确认移交
    transferConfirm() {
      this.yijiaoObj.content.acceptById = this.$refs.chuliren.userSelectId
      this.yijiaoObj.content.acceptByName = this.$refs.chuliren.userSelectName
      console.log(this.yijiaoObj)
      // 移交确认按钮
      if (!this.yijiaoObj.content.acceptById) {
        this.showMsg('请选择移交人', 'warning')
        return
      }
      this.transferDialogVisible = false
      this.postJson('common', this.yijiaoObj).then(res => {
        if (res.code == 0) {
          this.showMsg('移交成功')
          this.query()
        }
      })
    },
    // 处理
    editItem(item) {
      sessionStorage.setItem('todosDetail', JSON.stringify(item))
      const target = item.flowCode
      console.log(target)
      // this.$router.push('/index/todosEdit')
      if (target == 'station_add') { // 建站申请
        sessionStorage.setItem('todosSitesAdd', JSON.stringify(item))
        this.$router.push('/index/todosSitesAdd')
      } else if (target == 'station_openclose') { // 站点停开机申请
        sessionStorage.setItem('todosSitesStopBoot', JSON.stringify(item))
        this.$router.push('/index/todosSitesStopBoot')
      } else if (target == 'station_restore') { // 恢复撤站状态申请
        sessionStorage.setItem('todosResumeSiteStatus', JSON.stringify(item))
        this.$router.push('/index/todosResumeSiteStatus')
      } else if (target == 'station_move') { // 迁址申请
        sessionStorage.setItem('todosSitesMove', JSON.stringify(item))
        this.$router.push('/index/todosSitesMove')
      } else if (target == 'station_recovercert') { // 站点清标申请
        sessionStorage.setItem('todosClearProof', JSON.stringify(item))
        this.$router.push('/index/todosClearProof')
      } else if (target == 'station_saleright') { // 快三销售权限管理申请
        sessionStorage.setItem('todosK3sale', JSON.stringify(item))
        this.$router.push('/index/todosK3sale')
      } else if (target == 'station_relexsale') { // '固定销售限额申请'
        sessionStorage.setItem('todosStationRelexSaleApply', JSON.stringify(item))
        this.$router.push('/index/todosStationRelexSaleApply')
      } else if (target == 'station_templimit') { // 临时销售限额申请
        sessionStorage.setItem('todosTempRelexSaleApply', JSON.stringify(item))
        this.$router.push('/index/todosTempRelexSaleApply')
      } else if (target == 'station_basic_change') { // 基本资料变更申请
        sessionStorage.setItem('todosSitesInfoChange', JSON.stringify(item))
        this.$router.push('/index/todosSitesInfoChange')
      } else if (target == 'station_cancelticket') { // 站点注销票申请
        sessionStorage.setItem('todoSstationCancelticket', JSON.stringify(item))
        this.$router.push('/index/todoStationCancelticket')
      } else if (target == 'station_yucaitong_change') { // 豫彩通变更申请
        sessionStorage.setItem('todosYCTChange', JSON.stringify(item))
        this.$router.push('/index/todosYCTChange')
      } else if (target == 'station_repeal') { // 站点票注销
        sessionStorage.setItem('todosStationCancel', JSON.stringify(item))
        this.$router.push('/index/todosStationCancel')
      } else if (target == 'message_publish') { // 消息发布
        sessionStorage.setItem('todosMessagePublish', JSON.stringify(item))
        this.$router.push('/index/todosMessagePublish')
      } else if (target == 'station_responsor_change') { // 责任人变更
        sessionStorage.setItem('todosStationResponsorChange', JSON.stringify(item))
        this.$router.push('/index/todosStationResponsorChange')
      } else if (target == 'station_change') { // 责任人变更
        sessionStorage.setItem('todosStationChange', JSON.stringify(item))
        this.$router.push('/index/todosStationChange')
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
      var res = await this.postJson('common', {
        apiCode: 200056,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        this.tableData = res.content.dataList
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
      this[formName] = {
        page: 1,
        limit: 20
      }
      this.$refs.as.clear()
    },
    // 获取业务列表
    getFlowList() {
      this.postJson('common', {
        apiCode: 200127,
        content: {
          sysModule: 'station'
        }
      }).then(res => {
        this.flowList = res.content.dataList
      })
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
    // 获取业务列表
    this.getFlowList()
  }
}
</script>

<style></style>
