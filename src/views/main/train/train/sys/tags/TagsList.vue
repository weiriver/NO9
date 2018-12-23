<!--分页设置-->
<template>
  <div>

    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-edit" @click="$router.push('/train/tagsAdd')" v-if="!activeCourseName">新增
        </Button>
        <!--</ButtonGroup>-->
      </div>


      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="课程标签名称" prop="courseTagName">
            <Input v-model="searchForm.courseTagName	"></Input>
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
          <TableColumn label="课程标签名称" prop="courseTagName">
            <template slot-scope="scope">
              <a :class="{highlight:activeCourseName,pointer:activeCourseName}" @click="emitCouse(scope.row)">
                {{ scope.row.courseTagName}}
              </a>
            </template>
          </TableColumn>
          <TableColumn label="说明" prop="description"></TableColumn>
          <TableColumn label="操作" width="120" v-if="!activeCourseName">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.id)" type="text" typeOptions>修改</Button>
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
    activeCourseName: false
  },
  data: function () {
    return {
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
    // 向父组件传递内容
    emitCouse(item) {
      this.$emit('chooseTag', item)
    },
    areaSelectResult(result) {
      console.log('areaSelectResult', result)
      // 第一次加载会触发但是 result是空
      this.searchForm.regionCode = result[result.length - 1].value
      this.searchForm.regionName = result[result.length - 1].label
      // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
      // console.log('this.regionCode', this.regionCode)
    },
    async statusChange(value, id) {
      console.log('新状态的值', value, id)
      var res = await this.postJson('train', {
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
    async deleteItem(id) {
      const isConfirm = await this.$confirm('确定删除吗')
      if (isConfirm == 'confirm') {
        const res = await this.postJson('train', {
          apiCode: 640004,
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
    editItem(id) {
      this.$router.push(`/train/tagsAdd/${id}`)
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
      var res = await this.postJson('train', {
        apiCode: 640002,
        content: this.confirmSearch
      })
      this.tableData = res.content.dataList
      this.totalCount = res.content.dataPage.totalCount
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
    if (this.activeCourseName) {
      this.tableHeight = this.tableHeightCal('el-main', 346)
    } else {
      this.tableHeight = this.tableHeightCal('el-main', 150)
    }
    this.init()
  }
}
</script>

<style></style>
