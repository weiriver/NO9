<template>
  <div>
    <div class="content_title">
      新增/修改即开票站点
    </div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="110px">
      <FormItem label="站点编号" prop="stationCode">
        <Input v-model="ruleForm.stationCode" :maxlength="8" placeholder="最少8个字"/>
      </FormItem>
      <FormItem label="身份证号码" prop="idcard">
        <Input v-model="ruleForm.idcard" :maxlength="18" placeholder="最少15个字"/>
      </FormItem>
      <FormItem label="联系人" prop="contactUser">
        <Input v-model="ruleForm.contactUser" :maxlength="10" placeholder="最少2个字"/>
      </FormItem>
      <FormItem label="联系人电话" prop="contactMobile">
        <Input v-model="ruleForm.contactMobile" :maxlength="11" placeholder="请输入11位手机号码"/>
      </FormItem>
      <FormItem label="性别" prop="sex">
        <RadioGroup v-model="ruleForm.sex">
          <Radio :label="'male'">男</Radio>
          <Radio :label="'female'">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="站点地址" prop="address">
        <Input v-model="ruleForm.address" :maxlength="50"/>
      </FormItem>
      <FormItem label="建站时间" prop="setupTime">
        <DatePicker v-model="ruleForm.setupTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                    placeholder="请选择日期"
        ></DatePicker>
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
  name: 'jkpSiteAdd',
  data() {
    const isMobile = (rule, value, callback) => {
      if (this.Regexp.isMobile(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    const isIDCard = (rule, value, callback) => {
      if (!this.Regexp.isIDCard(value)) {
        callback(new Error('请输入正确身份证号码'))
      } else {
        callback()
      }
    }
    return {
      // 表单内容
      ruleForm: {},
      // 表单校验
      rules: {
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: ['change', 'blur']},
          {type: 'string', min: 8, message: '不能少于8个字', trigger: 'blur'},
        ],
        idcard: [
          {required: true, message: '身份证号码不能为空', trigger: 'blur'},
          {type: 'string', min: 15, message: '不能少于15个字', trigger: 'blur'},
          {validator: isIDCard, required: true, trigger: 'blur'}
        ],
        contactUser: [
          {required: true, message: '联系人不能为空', trigger: 'blur'},
          {type: 'string', min: 2, message: '不能少于2个字', trigger: 'blur'}
        ],
        contactMobile: [
          {required: true, message: '联系人电话不能为空', trigger: 'blur'},
          {type: 'string', min: 11, message: '长度不能少于11', trigger: 'blur'},
          {validator: isMobile, required: true, trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '性别不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 修改时加载详情
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300245,
        content: { id }
      })
      if (res.code == 0) {
        console.log('getInfo', res.content)
        this.ruleForm = res.content
        const {sex} = res.content
        this.$set(this.ruleForm, 'sex', sex === null ? '' : (sex === 'male' ? 'male' : 'female'))
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    // 提交表单
    submitForm(formRef) {
      this.$refs[formRef].validate(async (valid) => {
        if (valid) { // 验证通过
          if (this.$route.params.id) { // 修改
            console.log('ruleForm', this.ruleForm)
            var res = await this.postJson('station', {
              apiCode: 300243,
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
              apiCode: 300242,
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