<template>
  <div>
    <TablePage :totalCount="totalCount">
      <!--顶部按钮组-->
      <div slot="btn_groups">
        <!--<ButtonGroup>-->
        <Print
           :btnStyle="'border-radius: 4px 0 0 4px '"
           :tableHeader="tableHeader"
           :printTitle="'问卷题库'"
           :tableData="tableData"
        ></Print>
        <Button type="primary" icon="el-icon-plus" @click="addItem" v-if="true">新增</Button>
        <Export
           :btnStyle="'border-radius:0 4px 4px 0'"
           :queryObj="confirmSearch"
           :checkboxList="checkboxList"
           :exportObjOrigin="exportObj"
           :sysModule="'train'"
           :fileSaveName="'问卷题库'"
        ></Export>
        <!--</ButtonGroup>-->
      </div>
      <!--查询条件-->
      <div slot="query">
        <!--默认一行两个选择，如果一行一个加入class="full-line" label-width最高140px,超过140px不要选择一行两个模式-->
        <Form :inline="true" class="form-inline" label-width="140px" :model="searchForm" size="mini"
              ref="searchForm">
          <FormItem label="问卷题目" prop="questionContent">
            <Input v-model="searchForm.questionContent" placeholder="请输入问卷题目"/>
          </FormItem>
          <FormItem label="问卷类型" prop="questionType">
            <Select v-model="searchForm.questionType" placeholder="请选择问卷类型">
              <Option v-for="item in questionTypeEnum" :key="item.value"
                      :label="item.text" :value="item.value"></Option>
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
          <TableColumn fixed label="序号" width="50" align="center">
            <template slot-scope="scope">
              <span>{{scope.$index+1+(confirmSearch.page-1)*20}} </span>
            </template>
          </TableColumn>
          <TableColumn label="题目编号" prop="id"></TableColumn>
          <TableColumn label="题目类型" prop="questionType">
            <template slot-scope="scope">
              {{scope.row.questionType | getTxt}}
            </template>
          </TableColumn>
          <TableColumn label="题目" prop="questionContent"></TableColumn>
          <TableColumn label="选项" prop="answers"></TableColumn>
          <TableColumn
             label="操作"
             width="140">
            <template slot-scope="scope">
              <Button @click="viewDetail(scope.row.id)" type="text" size="small">详情</Button>
              <Button @click="editItem(scope.row.id)" v-if="true" type="text" size="small">修改</Button>
              <Button @click="deleteItem(scope.row.id)" v-if="true" type="text" size="small">删除</Button>
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
  name: 'ItemBank',
  data() {
    return {
      confirmSearch: {
        page: 1
      },
      searchForm: {
        page: 1
      },
      totalCount: 20,
      tableHeight: 0,
      tableData: [],
      tableHeader: [
        {text: '题目编号', value: 'id'},
        {text: '题目类型', value: 'questionType'},
        {text: '题目', value: 'questionContent'},
        {text: '选项', value: 'answers'}
      ],
      checkboxList: [],
      exportObj: {
        apiCode: 620006, // 接口地址
        content: {
          colNames: [], // checkbox的value
          colCNNames: [], // checkbox的显示中文名字
          fileType: 'excel', // 导出的文件格式，此处为excel文件
          fileName: '问卷题库' // 导出的excel内容的表头
        }
      },
      dialogVisible: false,
      deleteId: ''
    }
  },
  computed: {
    questionTypeEnum() {
      return this.$store.state.all_enumDic.TrainEnum$QuestionTypeEnum
    }
  },
  methods: {
    // 详情
    viewDetail(id) {
      this.$router.push(`/trainSurvey/ItemBankDetail/${id}`)
    },
    // 新增
    addItem() {
      this.$router.push('/trainSurvey/ItemBankAdd/')
    },
    // 修改
    editItem(id) {
      this.$router.push(`/trainSurvey/ItemBankAdd/${id}`)
    },
    // 弹出删除对话框
    deleteItem(id) {
      this.dialogVisible = true
      this.deleteId = id
    },
    // 确认删除
    async confirmDelete() {
      var res = await this.postJson('train', {
        apiCode: 620004,
        content: {
          id: this.deleteId
        }
      })
      if (res.code == 0) {
        this.showMsg('删除成功', 'success')
        this.dialogVisible = false
        this.init()
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
    // 请求列表数据
    async query() {
      var res = await this.postJson('train', {
        apiCode: 620005,
        content: this.confirmSearch
      })
      if (res.code == 0) {
        console.log('dataList', res.content.dataList)
        this.tableData = res.content.dataList
        // this.$set(this.tableData,[],res.content.dataList)
        this.totalCount = res.content.dataPage.totalCount
        console.log('dataQry', res.content.dataQry)
        this.checkboxList = []
        res.content.dataQry.colCNNames.forEach((item, index) => {
          this.checkboxList.push({
            text: item,
            value: res.content.dataQry.colNames[index]
          })
        })
        console.log('checkboxList', this.checkboxList)
      }
    },
    resetForm(formRef) {
      this.$refs[formRef].resetFields()
      this.searchForm = {
        page: 1
      }
    }
  },
  mounted() {
    this.tableHeight = this.tableHeightCal('el-main', 150)
    this.init()
  }
}
</script>

<style scoped>

</style>