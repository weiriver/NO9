<template>
  <div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="课程名称" prop="courseName">
        <Input v-model="ruleForm.courseName"></Input>
      </FormItem>
      <FormItem label="课程类型" prop="courseTypeId">
        <Select clearable v-model="ruleForm.courseTypeId" placeholder="请选择课程类型" @change="selectType">
          <Option v-for="item in courseTypeList" :value="item.id" :key="item.id" :label="item.courseTypeName"></Option>
        </Select>
      </FormItem>
      <FormItem label="培训课件" prop="courseTagName">
        <ModalUpload @uploadResult="uploadResult" class="" :api="uploadConf" :type="uploadType" :isMultiple="true">
          <div slot="warnTxt">支持上传：{{ uploadType.join(',') }}</div>
        </ModalUpload>
      </FormItem>

      <FormItem label="选择题目" prop="courseTagName">
        <Button @click="openDialog">选择</Button>
      </FormItem>
      <Table stripe :data="tableData" border style="width: 80%;margin: 0 0 18px 120px" v-if="tableData.length > 0" :height="300">
        <TableColumn label="序号" width="50" type="index">
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
            {{ scope.row.answers  }}
          </template>
        </TableColumn>
        <TableColumn label="正确答案" prop="rightAnswers"></TableColumn>
      </Table>
      <FormItem>
        <Button type="primary" @click="submitForm(true)">暂存</Button>
        <Button type="primary" @click="submitForm(false)">保存</Button>
        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>
    <!-- 删除对话框 -->
    <Dialog :before-close="handleClose" title="选择题目" :visible.sync="dialogVisible" width="80%">
      <exam-item-bank-manage ref="questions" :hasCheckBox="true" ></exam-item-bank-manage>
      <div slot="footer" class="dialog-footer">
        <Button @click="handleClose">取 消</Button>
        <Button type="primary" @click="chooseItems">确 定</Button>
      </div>
    </Dialog>
  </div>
</template>


<script>
  import ExamItemBankManage from '../../../trainExam/exam/examItemBankManage/ExamItemBankManage'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        coursewareTypeArr: [],
        uploadType: [],
        Obj: {},
        uploadConf: {
          sysModule: 'flow',
          hostBizObj: 'flow_files',
          hostBizId: ''
        },
        tableData: [],
        dialogVisible: false,
        courseTypeList: [],
        ruleForm: {},
        rules: {
          courseName: [
            {required: true, message: '请输入课程名称', trigger: 'blur'}
          ],
          courseTypeId: [
            {required: true, message: '请选择课程类型名称', trigger: 'change'}
          ]
        }
      }
    },
    components: {ExamItemBankManage},
    computed: {
      ...mapState({
        CoursewareTypeList: state => state['all_enumDic']['TrainEnum$CoursewareTypeEnum']
      })
    },
    methods: {
      uploadResult(results) {
        this.coursewareTypeArr = []
        results = JSON.parse(results)
        if (results.length > 0) {
          results.forEach((result) => {
            console.log('result', result)
            var type = result[0].fileType
            var nowItem = this.CoursewareTypeList.find((item) => {
              return item.value.toLocaleLowerCase() == type.toLocaleLowerCase()
            })
            console.log('nowItem', nowItem)
            this.coursewareTypeArr.push(nowItem.text)
          })
        }
      },
      selectType(val) {
        var nowType = this.courseTypeList.find((item) => {
          return item.id == val
        })
        this.ruleForm.courseTypeName = nowType.courseTypeName
      },
      handleClose() {
        console.log('没有点击确定')
        this.dialogVisible = false
      },
      chooseItems() {
        this.tableData = this.$refs.questions.checkedItems
        this.dialogVisible = false
      },
      openDialog() {
        this.dialogVisible = true
        console.log('考试题目的 ref', this.$refs.questions)
        if (this.$refs.questions) {
          this.$refs.questions.checkedItems = JSON.parse(JSON.stringify(this.tableData))
          this.$refs.questions.initCheckedItems()
        }
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
      // 提交
      async submit() {
        const res = await this.postJson('biz', {apiCode: 200079, content: this.Obj})
        if (res.code == 0) {
          this.showMsg('操作成功', 'success')
          this.$router.push('/train/CourseList')
        } else {
          this.showMsg(res.msg, 'warning')
        }
      },
      submitForm(draft) {
        console.log('this.ruleForm', this.ruleForm)
        console.log('this.tableData', this.tableData)
        this.ruleForm.coursewareType = this.coursewareTypeArr.join(',')
        var testQuestionList = this.tableData.map((item) => {
          return {
            id: item.id,
            questionType: item.questionType.value,
            testQuestionName: item.testQuestionName,
            answers: item.answers,
            rightAnswers: item.rightAnswers
          }
        })
        this.ruleForm.testQuestionList = [...this.tableData]
        this.Obj.BizCourse = {}
        this.Obj.BizCourse.courseList = [this.ruleForm]
        if (draft) {
          console.log('点击暂存')
          this.Obj.flow.draft = true
          this.submit(true)
        } else {
          console.log('点击保存')
          this.$refs.ruleForm.validate(async (valid) => {
            if (valid) {
              this.Obj.flow.draft = false
              this.submit(false)
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }

      },
      resetForm(formName) {
        if (this.$route.params.id) {
          this.initStore()
        } else {
          this[formName] = {}
          this.tableData = []
        }
      },
      async initStore() {
      },
      refresh() {
        this.$router.replace({
          path: '/refresh',
          query: {
            t: Date.now()
          }
        })
      },
      routerChange() {
        this.refresh()
      },
      // 获取流程图
      getFlowInfo(flowId) {
        this.postJsonWithMask('common', {
          apiCode: 200053,
          content: {
            flowId,
            sysModule: 'train'
          }
        }).then(res => {
          console.log('nodeList', res.content.nodeList)
          const nodelist = res.content.nodeList
          this.beginNode = nodelist.filter(v => {
            return v.code.includes('begin')
          })[0]
          this.nodeList = nodelist
          this.fromNodeCode = nodelist[1].code
          let userId = sessionStorage.getItem('login') ? JSON.parse(sessionStorage.getItem('login')).uid : JSON.parse(sessionStorage.getItem('loginInfo')).uid
          this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
          this.Obj.flow.fromNodeCode = nodelist[1].code
          this.Obj.flow.fromNodeName = nodelist[1].nameX
          this.Obj.flow.toNodeCode = nodelist[2].code
          this.Obj.flow.toNodeName = nodelist[2].nameX
          this.Obj.flow.warehousingBilling = nodelist[2].acceptByName
          this.Obj.flow.acceptById = nodelist[2].acceptById
          this.Obj.flow.acceptByName = nodelist[2].acceptByName
          this.Obj.flow.acceptByType = nodelist[2].acceptByType.value
        })
      }
    },
    watch: {
      '$route': 'routerChange'
    },
    beforeMount() {
      const flowTypelist = this.$store.state['all_enumDic']['FlowEnum$flowTypeEnum']
      console.log('flowTypelist', flowTypelist)
      let flowTarget = flowTypelist.filter(v => {
        return v.text == 'biz_course'
      }).map(v => {
        return {flowId: v.value, flowCode: v.text}
      })[0]
      if (flowTarget) {
        let flowName = '课程新增'
        let {flowId, flowCode} = flowTarget
        this.flowCode = flowCode
        this.Obj.flowId = flowId
        this.Obj.title = flowName
        this.Obj.nameX = flowName
        this.Obj.sysModuleEnum = 'train'
        this.Obj.flow = {}
        this.Obj.flow.bizTitle = flowName
        this.Obj.flow.flowId = flowId
        this.Obj.flow.agreed = true + '' // 是否同意，默认同意
        this.Obj.flow.flowName = flowName
        // 获取流程图
        this.getFlowInfo(flowId)
      }
    },
    mounted: async function () {
      let id = this.$route.params.id
      console.log('id', id)
      if (id) {
        this.initStore()
      }
      this.getCourseTypeList()
      if (this.CoursewareTypeList) {
        console.log('拿到上传类型数据')
        this.CoursewareTypeList.forEach((item) => {
          this.uploadType.push(item.value.toLowerCase())
        })
      }
    }
  }
</script>



<style></style>
