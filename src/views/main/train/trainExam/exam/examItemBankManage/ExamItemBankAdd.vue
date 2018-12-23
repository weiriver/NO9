<template>
  <div>
    <Form :model="Obj" :rules="rules" ref="Obj" label-width="120px" class="ruleForm">

      <FormItem label="题目类型" prop="questionType">
        <Select clearable v-model="Obj.questionType" placeholder="请选择题目类型">
          <Option label="单选" value="single"></Option>
          <Option label="多选" value="multi"></Option>
        </Select>
      </FormItem>
      <FormItem label="题目名称" prop="testQuestionName">
        <Input v-model="Obj.testQuestionName"></Input>
      </FormItem>
      <!--:label="'选项' + (index + 1)"-->
      <FormItem class="two-item-line"
                v-for="(option, index) in Obj.answerOpions"
                :label="index==0?'A':index==1?'B':index==2?'C':'D'"
                :key="index"
                :prop="'answerOpions.' + index + '.value'"
                :rules="answerRules">
        <Input v-model="option.value" @focus="remarkIndex(index)" @blur="checkOptions('Obj')"></Input>
        <!--<Input v-model="option.value" @focus="remarkIndex(index)" :disabled="option.disabled"></Input>-->
        <Button @click.prevent="removeOption(option)" v-show="index!=0 && index!=1">删除</Button>
      </FormItem>
      <FormItem label="多选正确答案" prop="multiRightAnswers"
                v-show="Obj.questionType == 'multi' ">
        <Select v-model="Obj.multiRightAnswers" placeholder="请选择" multiple :disabled="rightAnwserDisabled">
          <Option v-for="(item, index) in Obj.answerOpions"
                  :key="item.value"
                  :label="index==0?'A':index==1?'B':index==2?'C':'D'"
                  :value="item.value">
          </Option>
        </Select>
      </FormItem>
      <FormItem label="单选正确答案" prop="rightAnswers" v-show="Obj.questionType === 'single'">
        <Select v-model="Obj.rightAnswers" placeholder="请选择"
                :disabled="rightAnwserDisabled">
          <Option v-for="(item, index) in Obj.answerOpions"
                  :key="item.value"
                  :label="index==0?'A':index==1?'B':index==2?'C':'D'"
                  :value="item.value">
          </Option>
        </Select>
      </FormItem>

      <FormItem label="所属课程" prop="courseId">
        <div @click="showDialog">
          <Input v-model="Obj.courseName" readonly></Input>
          <span v-model="Obj.courseId"></span>
        </div>
      </FormItem>

      <FormItem label="题目标签" prop="tags">
        <Button class="mr10" type="primary" icon="el-icon-plus" circle @click="showTags"></Button>
        <Tag :key="tag.id"
             v-for="tag in dynamicTags"
             closable
             :disable-transitions="false"
             @close="handleClose(tag)">
          {{tag.name}}
        </Tag>
      </FormItem>

      <FormItem>
        <Button @click="addOption" :disabled="Obj.answerOpions.length==4">新增选项</Button>
        <Button type="primary" @click="submitForm('Obj')">提交</Button>
        <Chuli :node-list="nodeList" :flowId="flowObj.flowId" :nodeCode="beginNode.code"
               @chuliConfirm="chuliConfirm" :instanceId="instanceId"
               @vertify="checkForm" ref="chuliBtn"></Chuli>
        <Button @click="resetForm('Obj')">重置</Button>
      </FormItem>
    </Form>

    <!--选择所属课程--弹窗-->
    <Dialog title="选择所属课程" :visible.sync="dialogVisible" width="80%">
      <CourseList @chooseCourse="chooseCourseId" ref="courseList" :activeCourseName="true"></CourseList>
    </Dialog>

    <!--选择标签--弹窗-->
    <Dialog title="选择标签" :visible.sync="tagsDialogVisible" width="80%">
      <TagsList @chooseTag="chooseTag" ref="tagsList" :activeCourseName="true"></TagsList>
    </Dialog>
  </div>
</template>

<script>
import CourseList from '@/views/main/train/train/sys/course/CourseList'
import TagsList from '@/views/main/train/train/sys/tags/TagsList'
import Chuli from '@/components/chuli/Chuli'

var optionIndex = 0

export default {
  data() {
    var checkDuplication = (rule, value, callback) => {
      let valueArr = this.Obj.answerOpions.map(v => v.value)
      this.Obj.answerOpions.forEach((v, i) => {
        v.disabled = false
        this.rightAnwserDisabled = false
      })
      valueArr.filter((v, index, self) => {
        if (self.indexOf(value) === index) {
          optionIndex = index
          if (this.Obj.answerOpions.length > 1) {
            var index = 0
            let isDuplication = this.Obj.answerOpions.find((v, i) => {
              if (v.value === value && i != optionIndex) {
                index = i
                console.log(i)
                return v
              }
            })
            if (isDuplication) {
              this.Obj.answerOpions.forEach((v, i) => {
                if (i != optionIndex) {
                  v.disabled = true
                  this.rightAnwserDisabled = true
                }
              })
              callback(new Error(`选项内容重复了,请重新输入!`))
            }
          } else {
            callback()
          }
        }
      })
      callback()

    }
    var rightAnswersCheckRequired = (rule, value, callback) => {
      if (this.Obj.questionType == 'single') {
        if (!this.Obj.rightAnswers) {
          callback(new Error(`请输入正确答案`))
        }
        callback()
      } else {
        if (!this.Obj.multiRightAnswers.length) {
          callback(new Error(`请输入正确答案`))
        }
        callback()
      }
    }
    return {
      optionIndex: 0,
      dialogVisible: false,
      tagsDialogVisible: false,
      rightAnwserDisabled: false,
      Obj: {
        questionType: 'single',
        testQuestionName: 'single',
        answerOpions: [
          {
            value: '1',
            disabled: false
          },
          {
            value: '2',
            disabled: false
          },
          {
            value: '3',
            disabled: false
          },
          {
            value: '4',
            disabled: false
          }
        ],
        testQuestionList: {}
      },
      tmpObj: {},
      rules: {
        questionType: [
          {required: true, message: '请输入题目类型', trigger: 'blur'}
        ],
        testQuestionName: [
          {required: true, message: '请输入题目名称', trigger: 'blur'}
        ],
        courseTagName: [
          {required: true, message: '请输入课程标签名称', trigger: 'blur'}
        ],
        rightAnswers: [
          // {required: true, message: '请输入单选题正确答案', trigger: 'blur'}
          {required: true, validator: rightAnswersCheckRequired, trigger: 'change'}
        ],
        multiRightAnswers: [
          // {required: true, message: '请输入多选题正确答案', trigger: 'blur'}
          {validator: rightAnswersCheckRequired, trigger: 'change'},
          {validator: rightAnswersCheckRequired, trigger: 'blur'}
        ]
      },
      answerRules: [
        {required: true, message: '选项不能为空', trigger: 'blur'},
        {validator: checkDuplication, trigger: 'blur'}
      ],
      courseList: [], // 课程列表
      dynamicTags: [{name: '新员工', id: 6}]
    }
  },
  computed: {},
  methods: {
    checkOptions(formName) {
      this.$refs[formName].validate(async (valid) => {
      })
    },
    // 删除标签
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    initFlowInfo() {
      const flowTypelist = this.$store.state['all_enumDic']['FlowEnum$flowTypeEnum']
      let flowTarget = flowTypelist.filter(v => {
        return v.text == 'biz_test_question'
      }).map(v => {
        return {flowId: v.value, flowCode: v.text}
      })[0]
      console.log(flowTarget)
      if (flowTarget) {
        let flowName = '题库新增'
        let {flowId, flowCode} = flowTarget
        this.flowCode = flowCode
        this.Obj.flowId = flowId
        this.Obj.title = flowName
        this.Obj.sysModuleEnum = 'flow'
        this.Obj.flow = {}
        this.Obj.flow.bizTitle = flowName
        this.Obj.flow.flowId = flowId
        this.Obj.flow.agreed = true + '' // 是否同意，默认同意
        this.Obj.flow.flowName = flowName
        console.log(this.Obj)
        // 获取流程图
        this.getFlowInfo(flowId)
      }
    },
    showDialog() {
      this.dialogVisible = true
    },
    showTags() {
      this.tagsDialogVisible = true
    },
    // 标记当前检验的是第几个
    remarkIndex(val) {
      optionIndex = val
    },
    // 所选标签
    chooseTag(val) {
      let isExit = this.dynamicTags.find(v => {
        return v.name == val.courseTagName && v.id == val.id
      })
      if (!isExit) {
        console.log({name: val.courseTagName, id: val.id})
        this.dynamicTags.push({name: val.courseTagName, id: val.id})
      } else {
        this.showMsg('该标签已经存在,请重新选择', 'warning')
      }
      this.tagsDialogVisible = false
    },
    // 所选课程id和name
    chooseCourseId(val) {
      this.Obj.testQuestionList.courseName = this.Obj.courseName = val.courseName
      this.Obj.testQuestionList.courseId = this.Obj.courseId = val.id
      this.dialogVisible = false
    },
    // 减少选项
    removeOption(item) {
      // 删除的时候，判断单选正确答案是不是已经选了该选项，如果是则置空正确答案
      if (this.Obj.rightAnswers === item.value) {
        this.Obj.rightAnswers = ''
      }
      // 删除的时候，判断多选正确答案是不是已经选了该选项，如果有则去除该选项
      if (this.Obj.multiRightAnswers && this.Obj.multiRightAnswers.includes(item.value)) {
        let oldIndex = this.Obj.multiRightAnswers.indexOf(item.value)
        this.Obj.multiRightAnswers.splice(oldIndex, 1)
      }
      if (this.Obj.answerOpions.length > 2) { // 至少保留2个选项
        var index = this.Obj.answerOpions.indexOf(item)
        if (index !== -1) {
          this.Obj.answerOpions.splice(index, 1)
        }
      }
    },
    // 添加选项
    addOption() {
      if (this.Obj.answerOpions.length < 4) {
        optionIndex = this.Obj.answerOpions.length
        this.Obj.answerOpions.push({
          value: '',
          disabled: false
        })
      }
    },
    async save(apiCode, msg) {
      this.tmpObj.testQuestionList = [this.tmpObj.testQuestionList]
      console.log(this.tmpObj)
      let res = await this.postJson('common', {
        apiCode,
        content: this.tmpObj
      })
      if (res.code == 0) {
        this.showMsg(msg, 'success')
        // this.$router.push('/trainExam/examItemBankManage')
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    updateTmpObj() {
      let tmpObj = JSON.parse(JSON.stringify(this.Obj))
      var arr = ['questionType', 'testQuestionName']
      arr.forEach(key => {
        tmpObj.testQuestionList[key] = this.Obj[key]
      })
      let answers = this.Obj.answerOpions.map(v => v.value).join('____')
      tmpObj.testQuestionList.answers = answers
      if (this.Obj.questionType == 'single') {
        tmpObj.testQuestionList.rightAnswers = tmpObj.rightAnswers
      } else {
        tmpObj.testQuestionList.rightAnswers = tmpObj.multiRightAnswers.join(',')
      }
      console.log(this.dynamicTags)
      tmpObj.testQuestionList.tagIds = this.dynamicTags.map(v => v.id).join(',')
      if (!this.Obj.courseId && !this.Obj.courseName) {
        tmpObj.testQuestionList.courseId = 0
        tmpObj.testQuestionList.courseName = '没有关联课程'
      }
      tmpObj.title = tmpObj.flow.bizTitle = this.Obj.testQuestionName
      this.tmpObj = tmpObj
      delete tmpObj.questionType
      delete tmpObj.testQuestionName
      delete tmpObj.rightAnswers
      delete tmpObj.multiRightAnswers
      delete tmpObj.courseId
      delete tmpObj.courseName
      delete tmpObj.answerOpions
      console.log(tmpObj)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 提交前，字段处理，把Obj对象的数据赋值给tmpObj,提交的时候，是以tmpObj提交
          this.updateTmpObj()


          if (!this.Obj.courseId) { // 如果没有选择课程，则不走流程的保存
            if (this.$route.params.id) {
              this.saveAsNotAFlow(630006, '题库修改成功')
            } else {
              this.saveAsNotAFlow(630005, '题库保存成功')
            }
          } else { // 选择了课程就必须走流程
            if (this.$route.query.type == 'AUDITING') { // 流程中的修改
              this.save(200111, '修改成功')
            } else {
              this.save(200079, '新增成功')
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async saveAsNotAFlow(apiCode, msg) {
      let arr = ['id', 'courseId', 'courseName', 'questionType', 'QuestionTypeEnum', 'testQuestionName', 'answers', 'rightAnswers', 'tagIds']
      const res = await this.postJson('train', {
        apiCode: apiCode,
        content: this.tmpObj.testQuestionList
      })
      if (res.code == 0) {
        this.showMsg(msg)
        this.$router.push('/trainExam/examItemBankManage')
      }
    },
    resetForm(formName) {
      if (this.$route.params.id) {
        this.init()
      } else {
        this[formName] = {
          answerOpions: [
            {
              value: ''
            },
            {
              value: ''
            }
          ]
        }
      }
    },
    async init(id) {
      let res = await this.postJson('train', {
        apiCode: 630001,
        content: {
          id
        }
      })
      if (res.code == 0) {
        let ress = res.content
        console.log(ress)
        this.Obj.flow.instanceId = this.Obj.id = this.Obj.testQuestionList.id = ress.id
        // 课程名称
        this.Obj.courseId = ress.courseId
        this.Obj.courseName = ress.courseName
        this.Obj.testQuestionName = ress.testQuestionName
        this.Obj.dynamicTags = [{name: ress.tagNames, id: ress.tagIds}]
        // 恢复符合页面展示规则的选项
        this.Obj.answerOpions = ress.answers.trim().split('      ').map(v => {
          return {
            value: v.split('、')[1]
          }
        })
        // 判断是多选题还是单选题
        this.$set(this.Obj, 'questionType', ress.questionType.value)
        if (this.Obj.questionType == 'single') {
          this.$set(this.Obj, 'rightAnswers', ress.rightAnswers)
        } else {
          this.$set(this.Obj, 'multiRightAnswers', ress.rightAnswers.split(','))
        }
        // 处理标签
        let tagNames = ress.tagNames.split(',')
        let tagIds = ress.tagIds.split(',')
        this.dynamicTags = []
        tagNames.forEach((v, index) => {
          this.dynamicTags.push({name: v, id: tagIds[index]})
        })
        console.log(this.Obj)
      } else {
      }
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
    async getCourseList() {
      var res = await this.postJson('train', {
        apiCode: 650002,
        content: this.confirmSearch
      })
      this.courseList = res.content.dataList
    },
    // 获取流程图
    getFlowInfo(flowId) {
      this.postJsonWithMask('common', {
        apiCode: 200053,
        content: {
          flowId,
          sysModule: 'station'
        }
      }).then(res => {
        const nodelist = res.content.nodeList
        console.log(nodelist)
        this.beginNode = nodelist.filter(v => {
          return v.code.includes('begin')
        })[0]
        this.nodeList = nodelist
        this.fromNodeCode = nodelist[1].code
        let userId = sessionStorage.getItem('login') ? JSON.parse(sessionStorage.getItem('login')).uid : JSON.parse(sessionStorage.getItem('loginInfo')).uid
        // this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
        this.Obj.flow.fromNodeCode = nodelist[1].code
        this.Obj.flow.fromNodeName = nodelist[1].nameX
        this.Obj.flow.toNodeCode = nodelist[2].code
        this.Obj.flow.toNodeName = nodelist[2].nameX
        this.Obj.flow.acceptByName = nodelist[2].acceptByName
        this.Obj.flow.acceptById = nodelist[2].acceptById
        this.Obj.flow.acceptByType = nodelist[2].acceptByType.value
      })
    }
  },
  watch: {
    '$route': 'routerChange',
    Obj: {
      handler(val, oldName) {
        if (val.questionType == 'single') {
          this.$set(this.rules.rightAnswers[0], 'required', true)
          this.$set(this.rules.multiRightAnswers[0], 'required', false)
        } else {
          this.$set(this.rules.rightAnswers[0], 'required', false)
          this.$set(this.rules.multiRightAnswers[0], 'required', true)
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted: async function () {
    let id = this.$route.params.id
    console.log('id', id)
    if (id) {
      this.init(id)
    }
    // 获取课程列表
    this.getCourseList()
    // 初始化流程数据
    this.initFlowInfo()
  },
  components: {CourseList, TagsList, Chuli}
}
</script>

<style lang="scss" scoped>
  .answer-option-btn {
    margin-left: 120px;
    margin-bottom: 18px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }
</style>
