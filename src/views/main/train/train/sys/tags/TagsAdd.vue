<template>
  <div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="课程标签名称" prop="courseTagName">
        <Input v-model="ruleForm.courseTagName"></Input>
      </FormItem>

      <FormItem label="说明" prop="description">
        <Input type="textarea" maxlength="20"
               autosize
               v-model="ruleForm.description"></Input>
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
        courseTagName: [
          {required: true, message: '请输入课程标签名称', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async save(apiCode, msg) {
      console.log(this.ruleForm)
      let res = await this.postJson('train', {
        apiCode,
        content: this.ruleForm
      })
      if (res.code == 0) {
        this.showMsg(msg, 'success')
        this.$router.push('/train/tagsList')
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.$route.params.id) {
            this.save(640003, '修改成功')
          } else {
            this.save(640001, '新增成功')
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      if (this.$route.params.id) {
        this.initStore()
      } else {
        this[formName] = {}
        this.$refs.as.clear()
      }
    },
    async initStore(id) {
      const res = await this.postJson('train', {apiCode: 640005, content: {id}})
      console.log(res)
      if (res.code == 0) {
        this.ruleForm.courseTagName = res.content.courseTagName
        this.ruleForm.description = res.content.description
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
  watch: {
    '$route': 'routerChange'
  },
  mounted: async function () {
    let id = this.$route.params.id
    console.log('id', id)
    if (id) {
      this.initStore(id)
    }
  }
}
</script>

<style></style>
