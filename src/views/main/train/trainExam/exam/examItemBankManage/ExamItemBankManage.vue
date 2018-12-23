<!--分页设置-->
<template>
  <div>

    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <ButtonGroup v-if="!hasCheckBox">
          <Button type="primary" icon="el-icon-edit" @click="$router.push('/trainExam/examItemBankAdd')">新增</Button>
        </ButtonGroup>
      </div>


      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="题号" prop="id">
            <Input v-model="searchForm.id"></Input>
          </FormItem>
          <FormItem label="题目" prop="testQuestionName">
            <Input v-model="searchForm.testQuestionName"></Input>
          </FormItem>
          <FormItem label="课程名称" prop="courseName">
            <Input v-model="searchForm.courseName"></Input>
          </FormItem>
          <FormItem label="问题类型" prop="questionType">
            <Select clearable v-model="searchForm.questionType" placeholder="请选择问题类型">
              <Option label="单选" value="single"></Option>
              <Option label="多选" value="multi"></Option>
            </Select>
          </FormItem>
          <FormItem class="full-line">
            <Button type="primary" @click="search()">查询</Button>
            <Button @click="resetForm('searchForm')">重置</Button>
          </FormItem>
        </Form>
      </div>

      <!--表格-->
      <div slot="TableSlot">
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight"
               ref="tableSelection" @select="handleSelect" @select-all="handleSelectAll">
          <TableColumn v-if="hasCheckBox" type="selection" width="55"></TableColumn>
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="题目类型" prop="questionType">
            <template slot-scope="scope">
              {{ scope.row.questionType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="题号" prop="id"></TableColumn>
          <TableColumn label="题目" prop="testQuestionName"></TableColumn>
          <TableColumn label="选项">
            <template slot-scope="scope">
              {{ scope.row.answers }}
            </template>
          </TableColumn>
          <TableColumn label="正确答案" prop="rightAnswers"></TableColumn>
          <TableColumn label="所属课程" prop="courseName"></TableColumn>
          <TableColumn label="状态" prop="status" with="100"></TableColumn>
          <TableColumn v-if="!hasCheckBox" label="操作" width="120">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row)" type="text" typeOptions>修改</Button>
              <Button @click="deleteItem(scope.row.id)" type="text" typeOptions>删除</Button>
            </template>
          </TableColumn>
        </Table>
      </div>
    </TablePage>
  </div>
</template>

<script>
export default {
  name: 'StoreList',
  props: {
    hasCheckBox: {
      type: Boolean,
      default: false // 是否有选择框
    }
  },
  data: function () {
    return {
      checkedItems: [],
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      }
    }
  },
  methods: {
    handleSelectAll(selection) {
      console.log('点击全选的情况', selection)
      this.tableData.forEach((row) => {
        this.handleSelect(selection, row)
      })
    },
    handleSelect(selection, row) {
      console.log('selection, row', selection.includes(row))
      var rowIndex = -1
      this.checkedItems.forEach((item, index) => {
        if (item.id === row.id) {
          rowIndex = index
        }
      })
      if (selection.indexOf(row) > -1 && rowIndex == -1) {
        this.checkedItems.push(row)
      } else if (selection.indexOf(row) == -1 && rowIndex > -1) {
        this.checkedItems.splice(rowIndex, 1)
      }
    },
    async deleteItem(id) {
      const isConfirm = await this.$confirm('确定删除吗')
      if (isConfirm == 'confirm') {
        const res = await this.postJson('train', {
          apiCode: 630004,
          content: {id}
        })
        if (res.code == 0) {
          this.showMsg('删除成功')
          this.init()
        } else {
          this.showMsg('删除失败', 'warning')
        }
      }
    },
    editItem(item) {
      console.log(item)
      // this.$router.push({path: `/trainExam/examItemBankAdd/${item.id}`, query: {type: item.status.value}})
    },
    initCheckedItems() {
      // 获取到数据时候判定是否是之前 已经勾选的项
      if (this.$refs.tableSelection) {
        this.$refs.tableSelection.clearSelection()
        var rows = this.checkedItems
        if (rows && rows.length > 0) {
          rows.forEach((row) => {
            this.tableData.forEach((nowRow) => {
              if (nowRow.id == row.id) {
                this.$refs.tableSelection.toggleRowSelection(nowRow, true)
              }
            })
          })
        }
      }
    },
    async init() {
      this.Event.$on('pagechange', async (val) => {
        // 每次点分页的时候存一下之前的项
        this.confirmSearch.page = val
        await this.query()
        this.initCheckedItems()
      })
      this.search()
    },
    async search() {
      this.confirmSearch = JSON.parse(JSON.stringify(this.searchForm))
      this.Event.$emit('pageInit', 1)
      await this.query()
      this.initCheckedItems()
    },
    async query() {
      var res = await this.postJson('train', {
        apiCode: 630002,
        content: this.confirmSearch
      })
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
    },
    resetForm(formName) {
      this[formName] = {
        page: 1
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
    if (this.hasCheckBox) {
      this.tableHeight = this.tableHeightCal('el-main', 346)
    }
  }
}
</script>

<style></style>
