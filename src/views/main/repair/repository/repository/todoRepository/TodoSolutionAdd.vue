<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">

      <FormItem label="解决方法描述" prop="answer">
        <Input type="textarea" v-model="ruleForm.answer" :rows="7" maxlength="200"></Input>
      </FormItem>


      <FormItem>
        <Button type="primary" @click="submitForm('ruleForm')">保存</Button>
        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>

  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {},
      rules: {
        answer: [
          {required: true, message: '请输入解决方法描述', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {},
  methods: {
    async save(apiCode, msg) {
      let res = await this.postJson('eqp', {
        apiCode,
        content: this.ruleForm
      })
      if (res.code == 0) {
        this.showMsg(msg, 'success')
        this.$router.go(-1)
      }
    },
    async initInfo() {
      let id = this.$route.params.id
      var res = await this.postJson('eqp', {apiCode: 800031, content: {id}})
      if (res.code == 0) {
        console.log(res)
        this.ruleForm = this.BooleanToString(res.content)
      }
    },
    submitForm(formName, status = 'false') {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.status = status
          this.ruleForm.showApp = false
          if (this.$route.params.id) {
            this.save(800033, '修改成功')
          } else {
            // this.save(500010, '新增成功')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.$route.params.id) {
        this.initInfo()
      } else {
        this[formName] = {}
      }
    }
  },
  watch: {},
  mounted: async function () {
    let id = this.$route.params.id
    if (id) {
      this.initInfo()
    }
  }
}
</script>

<style></style>
