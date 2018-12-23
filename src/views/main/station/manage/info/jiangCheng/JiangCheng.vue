<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-plus" @click="$router.push('/manage/jiangChengAdd')" v-show="Auth(300052)">
          新增
        </Button>
        <Print
           :btnStyle="'border-radius: 0'"
           :tableHeader="tableHeader"
           :printTitle="'奖惩信息列表'"
           :tableData="tableData"
        ></Print>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'station'"
           :fileSaveName="'奖惩信息列表'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="奖惩对象编号">
            <Input v-model="searchForm.rewardPunishCode"/>
          </FormItem>
          <FormItem label="奖惩类型">
            <Select v-model="searchForm.rewardPunishTypeId">
              <Option v-for="item in rewardPunishTypeEnum"
                      :value="item.value"
                      :key="item.value"
                      :label="item.text">
              </Option>
            </Select>
          </FormItem>
          <FormItem label="奖惩日期">
            <DatePicker v-model="searchForm.rewardPunishDate" @change="dateEvent"
                        type="daterange" value-format="yyyy-MM-dd" style="width: 100%"
            ></DatePicker>
          </FormItem>
          <FormItem label="奖惩原因">
            <Input v-model="searchForm.rewardPunishReason"/>
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
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="奖惩对象">
            <template slot-scope="scope">
              {{ scope.row.rewardPunishObject ? scope.row.rewardPunishObject.text : '' }}
            </template>
          </TableColumn>
          <TableColumn label="奖惩对象编号" prop="rewardPunishCode"></TableColumn>
          <TableColumn label="奖惩类型" prop="rewardPunishType"></TableColumn>
          <TableColumn label="奖惩原因" prop="rewardPunishReason"></TableColumn>
          <TableColumn label="奖惩日期">
            <template slot-scope="scope">
              {{ scope.row.rewardPunishDate | ToDate }}
            </template>
          </TableColumn>
          <TableColumn label="操作" width="120">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.id)" type="text" typeOptions v-if="Auth(300053)">修改</Button>
              <Button @click="deleteItem(scope.row.id)" type="text" typeOptions v-if="Auth(300054)">删除</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>

    <!-- 删除对话框 -->
    <Dialog title="确认删除？" :visible.sync="dialogVisible" width="50%">
      <span>删除后无法恢复，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <Button @click="dialogVisible = false">取消</Button>
        <Button type="danger" @click="confirmDelete">确认删除</Button>
      </span>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'jiangCheng',
  data() {
    return {
      dialogVisible: false,
      deleteId: '',
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      searchForm: {
        page: 1
      },
      confirmSearch: {
        page: 1
      },
      // 打印表头
      tableHeader: [
        {
          text: '奖惩对象',
          value: 'rewardPunishObject'
        },
        {
          text: '奖惩对象编号',
          value: 'rewardPunishCode'
        },
        {
          text: '奖惩类型',
          value: 'rewardPunishType'
        },
        {
          text: '奖惩原因',
          value: 'rewardPunishReason'
        },
        {
          text: '奖惩日期',
          value: 'rewardPunishDate'
        }
      ],
      // 导出弹窗
      checkboxList: [],
      // 导出对象
      exportObj: {
        apiCode: 300056,
        content: {
          colNames: [],
          colCNNames: [],
          fileType: 'excel',
          fileName: '奖惩信息列表'
        }
      }
    }
  },
  computed: {
    rewardPunishTypeEnum() {
      return this.$store.state.station_enumDic.rewardPunishType
    }
  },
  methods: {
    // 日期转换
    dateEvent(date) {
      this.searchForm.rewardPunishBeginTime = date[0]
      this.searchForm.rewardPunishEndTime = date[1]
    },
    // 修改
    editItem(id) {
      this.$router.push(`/manage/jiangChengAdd/${id}`)
    },
    // 删除按钮
    deleteItem(id) {
      this.dialogVisible = true
      this.deleteId = id
    },
    // 确认删除
    async confirmDelete() {
      var res = await this.postJson('station', {
        apiCode: 300054,
        content: {
          id: this.deleteId
        }
      })
      if (res.code == 0) {
        this.showMsg('删除成功', 'success')
        this.dialogVisible = false
        this.init()
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    // 初始加载
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
      var res = await this.postJson('station', {
        apiCode: 300051,
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
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
    }
  },
  mounted() {
    this.init()
    this.tableHeight = this.tableHeightCal('el-main', 190)
  }
}
</script>

<style scoped>

</style>