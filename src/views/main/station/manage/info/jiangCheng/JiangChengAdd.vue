<template>
  <div>
    <div class="content_title">
      新增/修改奖惩
    </div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="110px">
      <FormItem label="奖惩类型" prop="rewardPunishTypeId">
        <Select v-model="ruleForm.rewardPunishTypeId"
                placeholder="请选择奖惩类型"
                @change='selectChange'>
          <Option v-for="item in rewardPunishTypeEnum" :value="item.value" :key="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="奖惩日期" prop="rewardPunishDate">
        <DatePicker v-model="ruleForm.rewardPunishDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                    placeholder="请选择日期"
        ></DatePicker>
      </FormItem>
      <FormItem label="奖惩对象" prop="rewardPunishObject">
        <Select v-model="ruleForm.rewardPunishObject" placeholder="请选择奖惩对象">
          <Option v-for="item in rewardPunishObjectEnum" :value="item.value" :key="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="奖惩对象编号" prop="rewardPunishCode">
        <Input style="height: auto" type="textarea" :autosize="true" v-model="ruleForm.rewardPunishCode"
               placeholder="以英文“;”隔开,如：41000011;41000012"/>
      </FormItem>
      <FormItem label="奖惩原因" prop="rewardPunishReason">
        <Input style="height: auto" type="textarea" :autosize="true" v-model="ruleForm.rewardPunishReason"
               placeholder="请输入奖惩原因"/>
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
  name: 'jiangChengAdd',
  data() {
    return {
      // 表单内容
      ruleForm: {},
      // 表单校验
      rules: {
        rewardPunishDate: [
          {required: true, type: 'string', message: '日期不能为空', trigger: 'blur'}
        ],
        rewardPunishCode: [
          {required: true, message: '奖惩对象编号不能为空', trigger: 'blur'},
          {
            validator(rule, value, callback, source, options) {
              if (value.indexOf('；') >= 0) {
                callback(new Error('请使用英文的分号'))
              } else {
                callback()
              }
            }
          }
        ],
        rewardPunishReason: [
          {required: true, message: '奖惩原因不能为空', trigger: 'blur'},
          {type: 'string', min: 6, message: '不能少于6个字', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    rewardPunishObjectEnum() {
      return this.$store.state.station_enumDic.StationEnum$rewardPunishObjectEnum
    },
    rewardPunishTypeEnum() {
      return this.$store.state.station_enumDic.rewardPunishType
    }
  },
  methods: {
    // 奖惩类型id转为text
    selectChange(tar) {
      this.rewardPunishTypeEnum.forEach(item => {
        if (item.value === tar) {
          this.ruleForm.rewardPunishType = item.text
        }
      })
    },
    // 修改时加载详情
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300055,
        content: { id }
      })
      if (res.code == 0) {
        console.log('getInfo', res.content)
        this.ruleForm = res.content
        this.$set(this.ruleForm, 'rewardPunishObject', res.content.rewardPunishObject.value)
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
              apiCode: 300053,
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
              apiCode: 300052,
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