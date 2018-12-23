<!--分页设置-->
<template>
  <div>

    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Button type="primary" icon="el-icon-edit" @click="$router.push('/train/courseAdd')" v-if="!activeCourseName">
          新增
        </Button>
        <!--</ButtonGroup>-->
      </div>


      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="课程名称" prop="courseName">
            <Input v-model="searchForm.courseName"></Input>
          </FormItem>
          <FormItem label="状态" prop="status">
            <Select v-model="searchForm.status" placeholder="请选择状态">
              <Option v-for="item in statusList" :value="item.value" :key="item.value" :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="课件类别" prop="coursewareType">
            <Select clearable v-model="searchForm.coursewareType" placeholder="请选择问题类型">
              <Option v-for="item in CoursewareTypeList" :value="item.value" :key="item.value"
                      :label="item.text"></Option>
            </Select>
          </FormItem>
          <FormItem label="课程类别" prop="courseTypeId">
            <Select clearable v-model="searchForm.courseTypeId" placeholder="请选择课程类型">
              <Option v-for="item in courseTypeList" :value="item.id" :key="item.id"
                      :label="item.courseTypeName"></Option>
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
        <Table stripe :data="tableData" :height="tableHeight" border style="width: 100%" v-if="tableHeight">
          <TableColumn
             label="序号"
             width="50">
            <template slot-scope="scope">
              {{ scope.$index + 1 + (confirmSearch.page - 1) * 20 }}
            </template>
          </TableColumn>
          <TableColumn label="课程名称" prop="courseName">
            <template slot-scope="scope">
              <a :class="{highlight:activeCourseName,pointer:activeCourseName}" @click="emitCouse(scope.row)">
                {{ scope.row.courseName}}
              </a>
            </template>
          </TableColumn>
          <TableColumn label="课程类型" prop="questionType">
            <template slot-scope="scope">
              {{ scope.row.questionType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="课件类型" prop="id"></TableColumn>
          <TableColumn label="课件名称" prop="testQuestionName"></TableColumn>
          <TableColumn label="上传时间" prop="rightAnswers"></TableColumn>
          <TableColumn label="单选题（题）" prop="courseName"></TableColumn>
          <TableColumn label="多选题（题）" prop="testQuestionName"></TableColumn>
          <TableColumn label="上传人员" prop="rightAnswers"></TableColumn>
          <TableColumn label="状态" prop="questionType">
            <template slot-scope="scope">
              {{ scope.row.questionType | getTxt }}
            </template>
          </TableColumn>
          <TableColumn label="操作" width="120" v-if="!activeCourseName">
            <template slot-scope="scope">
              <Button @click="editItem(scope.row.id)" type="text" typeOptions>查看</Button>
              <!--<Button @click="deleteItem(scope.row.id)" type="text" typeOptions>删除</Button>-->
            </template>
          </TableColumn>
        </Table>
      </div>

    </TablePage>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'StoreList',
  props: {
    activeCourseName: false
  },
  data: function () {
    return {
      courseTypeList: [],
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
  computed: {
    ...mapState({
      statusList: state => state['all_enumDic']['TrainEnum$StatusEnum'],
      CoursewareTypeList: state => state['all_enumDic']['TrainEnum$CoursewareTypeEnum']
    })
  },
  methods: {
    // 向父组件传递内容
    emitCouse(item) {
      this.$emit('chooseCourse', item)
    },
    async getCourseTypeList() {
      var res = await this.postJson('train', {
        apiCode: 630009,
        content: {
          paginated: false
        }
      })
      if (res.code == 0) {
        console.log('课程类型', res.content.dataList)
        this.courseTypeList = res.content.dataList
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
    editItem(id) {
      this.$router.push(`/train/courseDetail/${id}`)
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
        apiCode: 650002,
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
    this.init()
    this.getCourseTypeList()
    if (this.activeCourseName) {
      this.tableHeight = this.tableHeightCal('el-main', 346)
    } else {
      this.tableHeight = this.tableHeightCal('el-main', 150)
    }
  }
}
</script>

<style></style>
