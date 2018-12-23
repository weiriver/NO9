<!--分页设置-->
<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-edit">打印</Button>
        <Button type="primary" icon="el-icon-edit">导出</Button>

        <!--</ButtonGroup>-->
      </div>

      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">

          <FormItem label="业务标题" prop="name">
            <Input v-model="searchForm.bizTitle"></Input>
          </FormItem>

          <FormItem label="业务类型" prop="region">
            <Select clearable v-model="searchForm.flowId">
              <Option v-for="item in flowList" :value="item.id" :key="item.value" :label="item.flowName"></Option>
            </Select>
          </FormItem>
          <FormItem label="申请日期" prop="createDate">
            <DatePicker
               v-model="searchForm.createDate"
               type="daterange"
               placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
            </DatePicker>
          </FormItem>
          <FormItem label="归档日期" prop="finishDate">
            <DatePicker
               v-model="searchForm.finishDate"
               type="daterange"
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
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="业务标题" prop="bizTitle"></TableColumn>
          <TableColumn label="业务类型" prop="flowName"></TableColumn>
          <TableColumn label="发起人 " prop="createByName"></TableColumn>
          <TableColumn label="创建时间 " prop="createDate"></TableColumn>
          <TableColumn label="完成时间 " prop="lastUpdate"></TableColumn>
          <TableColumn label="归档状态">
            <template slot-scope="scope">
              {{ scope.row.status | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="是否查看">
            <template slot-scope="scope">
              {{ scope.row.readStatus | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="distribute(scope.row)" type="text" typeOptions>分发</Button>
              <Button @click="detail(scope.row)" type="text" typeOptions>查看</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
    <!--选择物品名称--弹窗-->
    <Dialog :title="distributeTitle" :visible.sync="distributeDialogVisible" width="50%">

      <Form label-width="140px" :model="fenfaObj" size="mini" ref="fenfaObj">
        <FormItem label="档案接收人" prop="goodsId">
          <AreauserSelect ref="chuliren" :checkboxFlag="true"></AreauserSelect>
        </FormItem>

        <FormItem label="查看处理情况" prop="content">
          <Select clearable v-model="fenfaObj.content.showDetail" placeholder="请选择">
            <Option value="true" label="允许"></Option>
            <Option value="false" label="禁止"></Option>
          </Select>
        </FormItem>

      </Form>

      <div slot="footer" class="dialog-footer">
        <Button @click="distributeDialogVisible = false">取 消</Button>
        <Button type="primary" @click="distributeConfirm">确 定</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'Subindex',
  data: function () {
    return {
      flowList: [],
      fenfaObj: {
        apiCode: 200068,
        content: {
          sysModule: 'storage',
          showDetail: 'true'
        }
      },
      distributeTitle: '分发档案',
      distributeDialogVisible: false,
      dialogVisible: false,
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        sysModule: 'storage',
        page: 1
      },
      searchForm: {
        sysModule: 'storage',
        page: 1
      }
    }
  },
  methods: {
    detail(item) {
      console.log('查看详情', item)
      sessionStorage.setItem('applyDetail', JSON.stringify(item))
      // this.$router.push('/store/applyDetail?from=file')
    },
    distribute(item) {
      this.distributeDialogVisible = true
      this.fenfaObj.content.instanceId = item.id
    },
    async distributeConfirm() {
      this.fenfaObj.content.acceptById = this.$refs.chuliren.userSelectCheckboxId
      this.fenfaObj.content.acceptByName = this.$refs.chuliren.userSelectCheckboxName
      console.log(this.fenfaObj)
      // 分发确认按钮
      if (!this.fenfaObj.content.acceptById) {
        this.showMsg('请选择分发人', 'warning')
        return
      }
      this.distributeDialogVisible = false
      var res = await this.postJson('common', this.fenfaObj)
      if (res.code == 0) {
        this.showMsg('分发成功')
        this.query()
      }
    },
    async getFlowList() {
      var res = await this.postJson('common', {
        apiCode: 200127,
        content: {
          paginated: false
        }
      })
      this.flowList = res.content.dataList
      console.log('flowList', res.content)
    },
    areaSelectResult(result) {
      console.log('areaSelectResult', result)
      if (result.length > 0) {
        // 第一次加载会触发但是 result是空
        this.searchForm.regionCode = result[result.length - 1].value
        this.searchForm.regionName = result[result.length - 1].label
        // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
        // console.log('this.regionCode', this.regionCode)
      } else {
        // 第一次加载会触发但是 result是空
        this.searchForm.regionCode = ''
        this.searchForm.regionName = ''
        // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
        // console.log('this.regionCode', this.regionCode)
      }
    },
    editItem(id) {
      this.$router.push(`/storeSet/storeAdd/${id}`)
    },
    async init() {
      this.Event.$on('pagechange', (val) => {
        this.confirmSearch.page = val
        this.query()
      })
      this.search()
    },
    search() {
      if (this.searchForm.finishDate) {
        this.searchForm.finishDateStart = this.searchForm.finishDate[0]
        this.searchForm.finishDateEnd = this.searchForm.finishDate[1]
      }
      if (this.searchForm.createDate) {
        this.searchForm.createDateStart = this.searchForm.createDate[0]
        this.searchForm.createDateEnd = this.searchForm.createDate[1]
      }
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      var res = await this.postJson('common', {
        apiCode: 200058,
        content: this.confirmSearch
      })
      this.tableData = res.content.dataList
      console.log('this.tableData', this.tableData)
      this.totalCount = res.content.dataPage.totalCount
    },
    resetForm(formName) {
      this[formName] = {
        sysModule: 'storage',
        page: 1
      }
    }
  },
  mounted() {
    this.getFlowList()
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style></style>
