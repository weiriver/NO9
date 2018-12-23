<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="问卷标题" prop="surveyTitle">
        <Input v-model="ruleForm.surveyTitle"></Input>
      </FormItem>
      <FormItem label="发布方式" prop="publishType">
        <Select v-model="ruleForm.publishType" placeholder="请选择发布方式">
          <Option v-for="item in publishTypeList" :key="item.value" :value="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="选择站点" prop="stationCodes" v-show="ruleForm.publishType=='station'">
        <Input type="textarea" autosize v-model="ruleForm.stationCodes"
               @focus="stationListDialogVisible = true"></Input>
      </FormItem>
      <FormItem label="所属区域" prop="areaNames" v-show="ruleForm.publishType=='region'">
        <Input type="textarea" autosize v-model="ruleForm.areaNames" @focus="areaTreeDialogVisible = true"></Input>
      </FormItem>

      <FormItem label="希望完成时间" prop="exceptFinishedTime">
        <DatePicker v-model="ruleForm.exceptFinishedTime"
                    type="date" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
        </DatePicker>
      </FormItem>

      <FormItem label="题目列表" prop="questionsListStr">
        <Input type="textarea" autosize v-model="ruleForm.questionsListStr"
               @focus="questionsListDialogVisible = true"></Input>
      </FormItem>

      <FormItem label="问卷内容" prop="surveyContent">
        <Input type="textarea"
               autosize
               v-model="ruleForm.surveyContent"></Input>
      </FormItem>


      <FormItem>
        <Button type="primary" @click="submitForm('ruleForm')">保存</Button>
        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>

    <!--选择所属区域--弹窗-->
    <Dialog title="选择所属区域" :visible.sync="areaTreeDialogVisible" width="40%">
      <div style="height: 300px;overflow: auto">
        <AreaTree ref="areaTree"></AreaTree>
      </div>
      <div slot="footer" class="dialog-footer">
        <Button @click="areaTreeDialogVisible = false">取 消</Button>
        <Button type="primary" @click="chooseConfirm">确 定</Button>
      </div>
    </Dialog>
    <!--选择站点--弹窗-->
    <Dialog title="选择所属区域" :visible.sync="stationListDialogVisible" width="80%">
      <SitesChoose ref="sitesChoose" :resetTableHeight="330"></SitesChoose>
      <div slot="footer" class="dialog-footer">
        <Button @click="stationListDialogVisible = false">取 消</Button>
        <Button type="primary" @click="chooseItems">确 定</Button>
      </div>
    </Dialog>
    <!--选择题目列表点--弹窗-->
    <Dialog title="选择题目列表" :visible.sync="questionsListDialogVisible" width="80%">
      <ExamItemBankManage ref="questionsChoose" :hasCheckBox="true"></ExamItemBankManage>
      <div slot="footer" class="dialog-footer">
        <Button @click="stationListDialogVisible = false">取 消</Button>
        <Button type="primary" @click="chooseQuestions">确 定</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import AreaTree from '@/components/areaCascader/AreaTree'
import SitesChoose from '@/components/sitesChoose/SitesChoose'
import ExamItemBankManage from '../../../trainExam/exam/examItemBankManage/ExamItemBankManage'

export default {
  data() {
    return {
      questionsListDialogVisible: false, // 题目列表显示
      stationListDialogVisible: false, // 站点列表显示
      areaTreeDialogVisible: false, // 所属区域checkbox显示
      initFlag: false, // 是否是修改首次进来 true 是
      inspectorList: [], // 巡查员列表
      userFlag: false, // 片区是否已经选择
      isZone: false, // 是否是片区仓库 true为片区仓库
      typeChangeFlag: false, // 是否已选择区域 true 为已选择
      regionCode: '',
      ruleForm: {
        publishType: 'station'
      },
      rules: {
        surveyTitle: [
          {required: true, message: '请输入问卷标题', trigger: 'blur'}
        ],
        publishType: [
          {required: true, message: '请选择发布方式', trigger: 'change'}
        ],
        exceptFinishedTime: [
          {required: true, message: '请选择希望完成时间', trigger: 'change'}
        ],
        surveyContent: [
          {required: true, message: '请输入问卷调查内容', trigger: 'blur'}
        ],
        questionsListStr: [
          {required: true, message: '请输入题目列表', trigger: 'blur'},
          {required: true, message: '请输入题目列表', trigger: 'change'}
        ],
        stationCodes: [
          {required: false, message: '请选择站点', trigger: 'blur'},
          {required: false, message: '请选择站点', trigger: 'change'}
        ],
        areaNames: [
          {required: true, message: '请输入区域', trigger: 'blur'},
          {required: true, message: '请输入区域', trigger: 'change'}
        ]
      },
      storeTypeList: [
        {
          label: '中心仓库',
          value: 'center',
          flag: true
        },
        {
          label: '地市仓库',
          value: 'city',
          flag: true
        },
        {
          label: '片区仓库',
          value: 'zone',
          flag: true
        }
      ]
    }
  },
  methods: {
    // 确认
    chooseConfirm() {
      console.log(this.$refs.areaTree.names)
      this.$set(this.ruleForm, 'areaNames', this.$refs.areaTree.names.join(','))
      this.$set(this.ruleForm, 'regionCode', this.$refs.areaTree.ids)
      console.log(this.ruleForm)
      this.areaTreeDialogVisible = false
    },
    // 选择站点，确认结果
    chooseItems() {
      console.log('选择的站点数组为')
      this.$set(this.ruleForm, 'sitesList', this.$refs.sitesChoose.checkedItems.map(v => v.stationCode))
      this.$set(this.ruleForm, 'stationCodes', this.ruleForm.sitesList.join(','))
      this.stationListDialogVisible = false
    },
    // 选择题目，确认结果
    chooseQuestions() {
      this.$set(this.ruleForm, 'questionsList', this.$refs.questionsChoose.checkedItems.map(v => v.id))
      this.$set(this.ruleForm, 'questionsListStr', this.ruleForm.questionsList.join(','))
      this.questionsListDialogVisible = false
    },
    async save(apiCode, msg) {
      let res = await this.postJson('train', {
        apiCode,
        content: this.ruleForm
      })
      if (res.code == 0) {
        this.showMsg(msg, 'success')
        this.refresh()
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    submitForm(formName, status = 'false') {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.status = status
          if (this.$route.params.id) {
            // this.save(500002, '修改成功')
          } else {
            this.save(610003, '问卷发布成功')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.$route.params.id) {
      } else {
        this[formName] = {publishType: 'station'}
        this.refresh()
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
    }
  },
  computed: {
    publishTypeList() {
      return this.$store.state.all_enumDic.TrainEnum$PublishTypeEnum.filter(v => v.value == 'station' || v.value == 'region')
    }
  },
  watch: {
    '$route': 'routerChange',
    regionCode: function (val) {
      console.log('res 更改', val)
    },
    'ruleForm.publishType': {
      handler(val, oldName) {
        if (val != oldName) {
          if (val == 'station') {
            this.ruleForm.sitesList = []
            this.$set(this.rules.stationCodes[0], 'required', true)
            this.$set(this.rules.stationCodes[1], 'required', true)
            this.$set(this.rules.areaNames[1], 'required', false)
            this.$set(this.rules.areaNames[0], 'required', false)
          } else if (val == 'region') {
            this.ruleForm.areaNames = ''
            this.$set(this.rules.stationCodes[0], 'required', false)
            this.$set(this.rules.stationCodes[1], 'required', false)
            this.$set(this.rules.areaNames[0], 'required', true)
            this.$set(this.rules.areaNames[1], 'required', true)
          }
        }
      },
      immediate: true
    }
  },
  mounted: async function () {
    let id = this.$route.params.id
    console.log('id', id)
    if (id) {
    }
  },
  components: {
    AreaTree, SitesChoose, ExamItemBankManage
  }
}
</script>

<style lang="scss">
  .el-date-editor {
    width: 100% !important;
  }
</style>
