<template>
  <div>
    <div class="content_title">
      新增/修改即开票站点
    </div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="110px">
      <FormItem label="故障级别名称" prop="nameX">
        <Input v-model="ruleForm.nameX" :maxlength="50" placeholder="请输入名称"/>
      </FormItem>
      <FormItem label="中心处理时限" prop="centerDealDatetime">
        <Input v-model="ruleForm.centerDealDatetime" :maxlength="5" placeholder="请输入正整数"/>
      </FormItem>
      <FormItem label="地市处理时限" prop="cityDealDatetime">
        <Input v-model="ruleForm.cityDealDatetime" :maxlength="5" placeholder="请输入正整数"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('formRef')">保存</Button>
        <Button @click="resetForm('formRef')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'hurdlesLevelAdd',
  data() {
    const checkName = async (rule, value, callback) => {
      var res = await this.postJson('station', {
        apiCode: 300236,
        content: {
          nameX: value
        }
      })
      if (res.code == 0) {
        callback()
      } else if (res.code == 10021) {
        callback(new Error('级别名称已经存在'))
      }
    }
    const isInt = (rule, value, callback) => {
      if (this.Regexp.isInt(value)) {
        callback()
      } else {
        callback(new Error('请输入正整数'))
      }
    }
    return {
      // 表单内容
      ruleForm: {},
      // 表单校验
      rules: {
        nameX: [
          {required: true, message: '故障级别名称不能为空', trigger: 'blur'},
          {max: 50, message: '级别名称长度不能超过50个字！', trigger: 'blur'},
          {validator: checkName, trigger: 'blur'}
        ],
        centerDealDatetime: [
          {required: true, message: '中心处理时限不能为空', trigger: 'blur'},
          {validator: isInt, trigger: 'blur'}
        ],
        cityDealDatetime: [
          {required: true, message: '地市处理时限不能为空', trigger: 'blur'},
          {validator: isInt, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 修改时加载详情
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300232,
        content: { id }
      })
      if (res.code == 0) {
        console.log('getInfo', res.content)
        this.ruleForm = res.content
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    // 提交表单
    submitForm(formRef) {
      this.$refs[formRef].validate(async (valid) => {
        if (valid) { // 验证通过
          const {centerDealDatetime, cityDealDatetime} = this.ruleForm
          if (this.$route.params.id) { // 修改
            console.log('ruleForm', this.ruleForm)
            var res = await this.postJson('station', {
              apiCode: 300234,
              content: this.ruleForm
            })
            console.log('修改', res.content)
            if (res.code == 0) {
              this.showMsg('修改成功', 'success')
              this.$router.go(-1)
            } else {
              this.showMsg(res.msg, 'warning')
            }
          } else { // 新增
            var res = await this.postJson('station', {
              apiCode: 300233,
              content: this.ruleForm
            })
            console.log('新增', res.content)
            if (res.code == 0) {
              this.showMsg('新增成功', 'success')
              this.$router.go(-1)
            } else {
              this.showMsg(res.msg, 'warning')
            }
          }
        } else { // 验证失败
          this.showMsg('请输入必要信息', 'error')
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formRef) {
      if(this.$route.params.id) { // 修改时重置为详情
        this.getInfo(this.$route.params.id)
      } else { // 新增时重置为清空
        this.$refs[formRef].resetFields()
        this.ruleForm = {}
      }
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.getInfo(this.$route.params.id) // 修改时加载详情
    }
  }
}
</script>

<style scoped>

</style>