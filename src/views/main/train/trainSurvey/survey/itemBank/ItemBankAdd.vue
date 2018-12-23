<template>
  <div>
    <div class="content_title">
      新增/修改问卷题
    </div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px">
      <FormItem label="问卷题目" prop="questionContent">
        <Input v-model="ruleForm.questionContent" placeholder="请输入问卷题目"/>
      </FormItem>
      <FormItem label="问卷类型" prop="questionType">
        <Select v-model="ruleForm.questionType" placeholder="请选择问卷类型">
          <Option v-for="item in questionTypeEnum" :key="item.value"
                  :label="item.text" :value="item.value"></Option>
        </Select>
      </FormItem>
      <FormItem label="选项答案A" prop="answerA">
        <Input v-model="ruleForm.answerA" placeholder="请输入选项答案A"/>
      </FormItem>
      <FormItem label="选项答案B" prop="answerB">
        <Input v-model="ruleForm.answerB" placeholder="请输入选项答案B"/>
      </FormItem>
      <FormItem label="选项答案C" prop="answerC">
        <Input v-model="ruleForm.answerC" placeholder="请输入选项答案C"/>
      </FormItem>
      <FormItem label="选项答案D" prop="answerD">
        <Input v-model="ruleForm.answerD" placeholder="请输入选项答案D"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('formRef')">提交</Button>
        <Button @click="resetForm('formRef')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'ItemBankAdd',
  data() {
    return {
      ruleForm: {
        questionContent: '',
        questionType: '',
        answersList: [],
        answerA: '',
        answerB: '',
        answerC: '',
        answerD: ''
      },
      rules: {
        questionContent: [
          {required: true, message: '问卷题目不能为空', trigger: ['change', 'blur']}
        ],
        questionType: [
          {required: true, message: '问卷类型不能为空', trigger: ['change', 'blur']}
        ],
        answerA: [
          {required: true, message: '选项答案A不能为空', trigger: ['change', 'blur']}
        ],
        answerB: [
          {required: true, message: '选项答案B不能为空', trigger: ['change', 'blur']}
        ],
        answerC: [
          {required: true, message: '选项答案C不能为空', trigger: ['change', 'blur']}
        ],
        answerD: [
          {required: true, message: '选项答案D不能为空', trigger: ['change', 'blur']}
        ]
      }
    }
  },
  computed: {
    questionTypeEnum() {
      return this.$store.state.all_enumDic.TrainEnum$QuestionTypeEnum
    }
  },
  methods: {
    // 修改时加载详情
    async getInfo() {
      var res = await this.postJson('train', {
        apiCode: 620003,
        content: {
          id: this.$route.params.id
        }
      })
      console.log('详情', res.content)
      if (res.code == 0) {
        this.ruleForm.questionContent = res.content.questionContent
        this.ruleForm.questionType = this.GetTxt(res.content.questionType)
        this.ruleForm.answerA = res.content.answersList[0]
        this.ruleForm.answerB = res.content.answersList[1]
        this.ruleForm.answerC = res.content.answersList[2]
        this.ruleForm.answerD = res.content.answersList[3]
      }
    },
    submitForm(formRef) {
      this.$refs[formRef].validate(async (valid) => {
        if (valid) { // 验证通过
          this.ruleForm.answersList.push(this.ruleForm.answerA, this.ruleForm.answerB, this.ruleForm.answerC, this.ruleForm.answerD)
          if (this.$route.params.id) { // 修改
            console.log('answersList修改', this.ruleForm.answersList)
            var res = await this.postJson('train', {
              apiCode: 620002,
              content: {
                id: this.$route.params.id,
                questionType: this.ruleForm.questionType,
                questionContent: this.ruleForm.questionContent,
                answersList: this.ruleForm.answersList
              }
            })
            console.log('修改', res.content)
            if (res.code == 0) {
              this.showMsg('修改成功', 'success')
              this.$router.go(-1)
            }
          } else { // 新增
            console.log('answersList新增', this.ruleForm.answersList)
            var res = await this.postJson('train', {
              apiCode: 620001,
              content: {
                questionType: this.ruleForm.questionType,
                questionContent: this.ruleForm.questionContent,
                answersList: this.ruleForm.answersList
              }
            })
            console.log('新增', res.content)
            if (res.code == 0) {
              this.showMsg('新增成功', 'success')
              this.$router.go(-1)
            }
          }
        } else { // 验证失败
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formRef) {
      if (this.$route.params.id) {
        this.getInfo() // 修改时加载详情
      } else {
        this.$refs[formRef].resetFields()
        this.ruleForm = {}
      }
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getInfo()
    }
  }
}
</script>

<style>

</style>
