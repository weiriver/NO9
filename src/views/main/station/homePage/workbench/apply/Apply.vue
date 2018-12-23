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
                :printTitle="'我的申请列表'"
                :tableData="tableData"
        ></Print>
        <Export
                :btnStyle="'border-radius:0 4px 4px 0'"
                :queryObj="confirmSearch"
                :checkboxList="checkboxList"
                :exportObjOrigin="exportObj"
                :sysModule="'station'"
                :fileSaveName="'我的申请列表'"
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
          <TableColumn label="申请时间" prop="createDate"></TableColumn>
          <TableColumn label="当前步骤" prop="currentNodeName" width="100"></TableColumn>
          <TableColumn label="当前处理人" prop="currentByName"></TableColumn>
          <TableColumn label="操作" width="140">
            <template slot-scope="scope">
              <Button @click="detailItem(scope.row)" type="text" size="small">查看</Button>
              <Button v-if="scope.row.draft" @click="editItem(scope.row)" type="text" size="small">修改</Button>
              <Button v-if="scope.row.draft" @click="deleteItem(scope.row)" type="text" size="small">删除</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>

    <!--删除记录--弹窗-->
    <Dialog :title="transferTitle" :visible.sync="transferDialogVisible" width="50%">
      <div>确定删除该条记录？</div>
      <div slot="footer" class="dialog-footer">
        <Button @click="transferDialogVisible = false">取 消</Button>
        <Button type="primary" @click="deleteConfirm">确 定</Button>
      </div>
    </Dialog>

  </div>
</template>

<script>
  export default {
    name: 'Apply',
    data: function () {
      return {
        transferTitle: '删除确认',
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
            value: 'createDate'
          },
          {
            text: '当前步骤',
            value: 'currentNodeName'
          },
          {
            text: '当前处理人',
            value: 'currentByName'
          }
        ], // 表格头部信息
        checkboxList: [], // 导出弹框-展示出来的多选框
        exportObj: {
          apiCode: 200121,
          content: {
            colNames: [],
            colCNNames: [],
            fileType: 'excel',
            fileName: '我的申请列表'
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
        deleteObj: {
          apiCode: 200115,
          content: {}
        }
      }
    },
    methods: {
      // 删除
      deleteItem(item) {
        console.log(item)
        this.transferDialogVisible = true
        this.deleteObj.content.instanceId = item.id
        this.deleteObj.content.flowId = item.flowId
        this.deleteObj.content.bizId = item.bizId
      },
      // 确认删除
      deleteConfirm() {
        console.log(this.deleteObj)
        // 移交确认按钮
        this.transferDialogVisible = false
        this.postJson('common', this.deleteObj).then(res => {
          if (res.code == 0) {
            this.showMsg('删除成功')
            this.query()
          }
        })
      },
      // 查看
      detailItem(item) {
        sessionStorage.setItem('applyDetail', JSON.stringify(item))
        this.$router.push('/index/applyDetail?from=apply')
      },
      // 修改
      editItem(item) {
        sessionStorage.setItem('draftFromApply', JSON.stringify(item))
        const target = item.flowCode
        console.log(target)
        if (target == 'station_add') { // 建站申请
          this.$router.push('/businessHandle/sitesAdd?from=apply')
        } else if (target == 'station_openclose') { // 站点停开机申请
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/sitesStopBoot?from=apply')
        } else if (target == 'station_restore') { // 恢复撤站状态申请
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/resumeSiteStatus?from=apply')
        } else if (target == 'station_move') { // 迁址申请
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/sitesMove?from=apply')
        } else if (target == 'station_recovercert') { // 站点清标申请
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/clearProof?from=apply')
        } else if (target == 'station_saleright') { // 快三销售权限管理申请
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/K3sale?from=apply')
        } else if (target == 'station_relexsale') { // '固定销售限额申请'
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/stationRelexSaleApply?from=apply')
        } else if (target == 'station_templimit') { // 临时销售限额申请
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/tempRelexSaleApply?from=apply')
        } else if (target == 'station_basic_change') { // 基本资料变更申请
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/sitesInfoChange?from=apply')
        } else if (target == 'station_cancelticket') { // 站点注销票申请
          // sessionStorage.setItem('draftFromApply', JSON.stringify(item))
          this.$router.push('/businessHandle/stationCancelticket?from=apply')
        } else if (target == 'yucaitong_change') { // 豫彩通变更申请
          // sessionStorage.setItem('draftYCTChange', JSON.stringify(item))
          this.$router.push('/businessHandle/YCTChange?from=apply')
        } else if (target == 'station_repeal') { // 站点票注销
          // sessionStorage.setItem('draftStationCancel', JSON.stringify(item))
          this.$router.push('/businessHandle/stationCancel?from=apply')
        } else if (target == 'message_publish') { // 消息发布
          // sessionStorage.setItem('draftMessagePublish', JSON.stringify(item))
          this.$router.push('/businessHandle/messagePublish?from=apply')
        } else if (target == 'station_responsor_change') { // 责任人变更
          // sessionStorage.setItem('draftStationResponsorChange', JSON.stringify(item))
          this.$router.push('/businessHandle/stationResponsorChange?from=apply')
        } else if (target == 'station_change') { // 责任人变更
          // sessionStorage.setItem('draftStationChange', JSON.stringify(item))
          this.$router.push('/businessHandle/stationChange?from=apply')
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
          apiCode: 200055,
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
