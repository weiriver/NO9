<template>
  <div>
    <TablePage :totalCount="totalCount">

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="调整月份">
            <DatePicker v-model="applyDate" @change="dateEvent"
                        type="month" value-format="yyyy-MM" style="width: 100%"
            ></DatePicker>
          </FormItem>
          <FormItem label="站点编号" >
            <Input v-model="searchForm.stationCode" />
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
          <TableColumn min-width="100" label="站点编号" prop="stationId"></TableColumn>
          <TableColumn min-width="100" label="调整日期">
            <template slot-scope="scope">
              {{ scope.row.beginDate | ToDate }}
            </template>
          </TableColumn>
          <TableColumn min-width="80" label="调整结果" prop="result">
            <template slot-scope="scope">
              {{ transferResult(scope.row.result)}}
            </template>
          </TableColumn>
          <TableColumn min-width="220" label="代消费类型" prop="commissionName"></TableColumn>
          <TableColumn min-width="220" label="原代销费类型" prop="commissionNameOld"></TableColumn>
          <TableColumn min-width="80" label="创建人" prop="createByName"></TableColumn>
          <TableColumn min-width="100" label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.createDate | ToDate }}
            </template>
          </TableColumn>

          <TableColumn label="操作" width="120">
            <template slot-scope="scope">
              <Button @click="deleteItem(scope.row.id)" type="text" typeOptions v-if="Auth(200014)">删除</Button>
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
        applyDate: '', // 日期选择
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
        }
      }
    },
    methods: {
      // 结果转换
      transferResult(text) {
        if (text === null) {
          return '未调整'
        } else if (text === false) {
          return '失败'
        } else if (text === true) {
          return '成功'
        }
      },
      // 日期转换
      dateEvent(date) {
        console.log('date', date)
        this.searchForm.beginDate = date + '-01'
      },
      // 删除按钮
      deleteItem(id) {
        this.dialogVisible = true
        this.deleteId = id
      },
      // 确认删除
      async confirmDelete() {
        var res = await this.postJsonWithMask('buz', {
          apiCode: 200014,
          content: {
            queueId: this.deleteId
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
        var res = await this.postJson('buz', {
          apiCode: 200013,
          content: this.confirmSearch
        })
        if (res.code == 0) {
          this.tableData = res.content.dataList
          this.totalCount = res.content.dataPage.totalCount
        } else {
          this.showMsg(res.msg, 'warning')
        }
      },
      resetForm(formName) {
        this[formName] = {
          page: 1
        }
        this.applyDate = ''
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