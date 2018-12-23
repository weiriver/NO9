<template>
  <div>
    <div class="content_title">
      创建/修改课程类型
    </div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px">
      <FormItem label="课程类型" prop="courseTypeName">
         <Input v-model="ruleForm.courseTypeName" placeholder="请输入课程类型，不超过20字"/>
      </FormItem>
      <FormItem label="说明" prop="description">
         <Input type="textarea" :autosize="{ minRows:3, maxRows: 10 }"
                v-model="ruleForm.description" placeholder="请输入课程类型说明"/>
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
  name: 'CourseTypeAdd',
  data() {
    return {
      ruleForm: {
        courseTypeName: '',
        description: ''
      },
      rules: {
        courseTypeName: [
          { required: true, message: "课程类型不能为空", trigger: ['change','blur'] },
          { min:1, max: 20, message: "不超过20个字符", trigger: ['change','blur'] }
        ]
      }
    }
  },
  methods: {
    // 修改时加载详情
    async getInfo() {
      var res = await this.postJson('train', {
        apiCode: 630008,
        content: {
          id: this.$route.params.id
        }
      })
      console.log('详情', res.content)
      if (res.code == 0) {
        this.ruleForm.courseTypeName = res.content.courseTypeName
        this.ruleForm.description = res.content.description
      }
    },
    // 提交表单
    submitForm(formRef) {
      this.$refs[formRef].validate(async (valid) => {
        if (valid) { // 验证通过
          if (this.$route.params.id) { // 修改
            var res = await this.postJson('train', {
              apiCode: 630010,
              content: {
                id: this.$route.params.id,
                courseTypeName: this.ruleForm.courseTypeName,
                description: this.ruleForm.description
              }
            })
            console.log('修改', res.content)
            if (res.code == 0) {
              this.showMsg('修改成功', 'success')
              this.$router.go(-1)
            }
          } else { // 新增
            var res = await this.postJson('train', {
              apiCode: 630007,
              content: this.ruleForm
            })
            console.log('新增', res.content)
            if (res.code == 0) {
              this.showMsg('新增成功', 'success')
              this.$router.go(-1)
            }
          }
        } else { // 验证失败
          console.log('error submit!!')
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formRef) {
      if(this.$route.params.id) { // 修改时重置为详情
        this.getInfo()
      } else { // 新增时重置为清空
        this.$refs[formRef].resetFields()
        this.ruleForm = {}
      }
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getInfo() // 修改时加载详情
    }
  }
}
</script>
