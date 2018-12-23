<!--分页设置-->
<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Print
           :btnStyle="'border-radius: 4px 0 0 4px '"
           :tableHeader="tableHeader"
           :printTitle="'我的已办列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'common'"
           :fileSaveName="'我的已办列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="业务标题" prop="bizTitle">
            <Input v-model="searchForm.bizTitle"/>
          </FormItem>
          <FormItem label="业务类型" prop="flowName">
            <Select clearable v-model="searchForm.flowId">
              <Option v-for="item in flowList" :value="item.id"
                      :key="item.value" :label="item.flowName"
              ></Option>
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
          <TableColumn label="处理时间" prop="createDate"></TableColumn>
          <TableColumn label="受理步骤" prop="nodeName"></TableColumn>
          <TableColumn label="当前处理人" prop="currentByName"></TableColumn>
          <TableColumn
             label="操作"
             width="210">
            <template slot-scope="scope">
              <Button @click="urgeClick(scope.row.instanceId)" type="text" typeOptions v-if="Auth(200066)">催办</Button>
              <Button @click="forceCloseClick(scope.row.instanceId)" type="text" typeOptions v-if="Auth(200067)">强制结束
              </Button>
              <Button @click="detailItem(scope.row)" type="text" typeOptions>查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
    <!-- 强制结束确认弹窗 -->
    <Dialog title="强制结束确认" :visible.sync="forceCloseDialogVisible" width="50%">
      <Form label-width="140px">
        <FormItem label="请输入结束原因">
          <Input type="textarea" autosize v-model="closeReason"/>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="forceCloseDialogVisible = false">取 消</Button>
        <Button type="primary" @click="forceCloseConfirm">确 定</Button>
      </div>
    </Dialog>
    <!-- 临时弹窗 -->
    <Dialog
       title="提示"
       :visible.sync="dialogVisible"
       width="30%">
      <span>该功能暂未实现</span>
      <span slot="footer" class="dialog-footer">
          <Button @click="dialogVisible = false">取 消</Button>
          <Button type="primary" @click="dialogVisible = false">确 定</Button>
        </span>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      dialogVisible: false,
      forceCloseDialogVisible: false,
      forceCloseId: '',
      closeReason: '',
      totalCount: 20,
      tableHeight: 0,
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
          text: '处理时间',
          value: 'createDate'
        },
        {
          text: '受理步骤',
          value: 'nodeName'
        },
        {
          text: '当前处理人',
          value: 'currentByName'
        }
      ],
      tableData: [],
      checkboxList: [], // 导出弹框-展示出来的多选框
      exportObj: {
        apiCode: 200123,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '我的已办列表'
        }
      },
      confirmSearch: {
        sysModule: 'storage',
        page: 1,
        limit: 20
      },
      searchForm: {
        sysModule: 'storage',
        page: 1,
        limit: 20
      },
      flowList: []
    }
  },
  methods: {
    // areaSelectResult (result) {
    //   console.log('areaSelectResult', result)
    //   // 第一次加载会触发但是 result是空
    //   this.searchForm.regionCode = result[result.length - 1].value
    //   this.searchForm.regionName = result[result.length - 1].label
    //   // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
    //   // console.log('this.regionCode', this.regionCode)
    // },
    // async statusChange (value, id) {
    //   console.log('新状态的值', value, id)
    //   var res = await this.postJson('ws', {
    //     apiCode: 500006,
    //     content: {
    //       id: id,
    //       status: value
    //     }
    //   })
    //   console.log('数据返回', res.content)
    //   if (res.content.updated == 1) {
    //     this.showMsg('状态修改成功', 'success')
    //     this.init()
    //   }
    // },
    detailItem(item) {
      console.log(item)
      sessionStorage.setItem('todosDetail', JSON.stringify(item))
      this.$router.push(`/storeIndex/doneDetail`)
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
        apiCode: 200057,
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
        status: '',
        page: 1
      }
      this.$refs.as.clear()
    },
    async getFlowList() {
      var res = await this.postJson('common', {
        apiCode: 200127,
        content: this.confirmSearch
      })
      this.flowList = res.content.dataList
    },
    async urgeClick(instanceId) {
      this.loading = true
      var res = await this.postJson('common', {
        apiCode: 200066,
        content: {
          instanceId: instanceId
        }
      })
      if (res.code == 0) {
        this.loading = false
        this.showMsg('催办成功')
      }
    },
    forceCloseClick(instanceId) {
      this.forceCloseDialogVisible = true
      this.forceCloseId = instanceId
    },
    async forceCloseConfirm() {
      this.loading = true
      var res = await this.postJson('common', {
        apiCode: 200067,
        content: {
          instanceId: this.forceCloseId,
          content: this.closeReason
        }
      })
      if (res.code == 0) {
        this.loading = false
        this.showMsg('强制结束成功')
        this.forceCloseDialogVisible = false
        this.closeReason = ''
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
    this.getFlowList()
  }
}
</script>

<style></style>
