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
            <Input v-model="searchForm.nameX	"></Input>
          </FormItem>

          <FormItem label="业务类型" prop="region">
            <Select clearable v-model="searchForm.status">
              <Option label="全部" value=""></Option>
              <Option label="领用" value="1"></Option>
              <Option label="调拨" value="2"></Option>
              <Option label="损耗" value="3"></Option>
            </Select>
          </FormItem>
          <FormItem label="申请日期" prop="expireDate">
            <DatePicker
               v-model="searchForm.expireDate"
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
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="业务标题" prop="nameX"></TableColumn>
          <TableColumn label="业务类型" prop="nameX"></TableColumn>
          <TableColumn
             label="申请时间"
          >
            <template slot-scope="scope">
              {{ scope.row.typeX | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
             label="当前步骤"
          >
            <template slot-scope="scope">
              {{ scope.row.typeX | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
             label="当前处理人"
          >
            <template slot-scope="scope">
              {{ scope.row.typeX | getTxt }}
            </template>
          </TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="dialogVisible = true" type="text" typeOptions>处理</Button>
              <Button @click="dialogVisible = true" type="text" typeOptions>移交</Button>
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
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
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1
      },
      searchForm: {
        status: '',
        page: 1
      }
    }
  },
  methods: {
    areaSelectResult(result) {
      console.log('areaSelectResult', result)
      if (result.length > 0) {
        // 第一次加载会触发但是 result是空
        this.searchForm.regionCode = result[result.length - 1].value
        this.searchForm.regionName = result[result.length - 1].label
        // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
        // console.log('this.regionCode', this.regionCode)
      } else {
        this.searchForm.regionCode = ''
        this.searchForm.regionName = ''
      }
    },
    async statusChange(value, id) {
      console.log('新状态的值', value, id)
      var res = await this.postJson('ws', {
        apiCode: 500006,
        content: {
          id: id,
          status: value
        }
      })
      console.log('数据返回', res.content)
      if (res.content.updated == 1) {
        this.showMsg('状态修改成功', 'success')
        this.init()
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
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      this.query()
    },
    async query() {
      // var res = await this.postJson('ws', {
      //   apiCode: 500004,
      //   content: this.confirmSearch
      // })
      // this.tableData = res.content.dataList
      // this.totalCount = res.content.dataPage.totalCount
    },
    resetForm(formName) {
      this[formName] = {
        status: '',
        page: 1
      }
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
