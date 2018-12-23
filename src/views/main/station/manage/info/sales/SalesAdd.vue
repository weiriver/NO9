<template>
  <div>
    <div class="content_title">
      新增/修改销售员
    </div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="110px">
      <FormItem label="姓名" prop="nameX">
        <Input v-model="ruleForm.nameX" :maxlength="10" placeholder="最少2个字"/>
      </FormItem>
      <FormItem label="工号" prop="empNo" v-if="!isAdd">
        <Input v-model="ruleForm.empNo" disabled/>
      </FormItem>
      <FormItem label="身份证号码" prop="idCard">
        <Input v-model="ruleForm.idCard" :maxlength="18" placeholder="最少15个字"/>
      </FormItem>
      <FormItem label="手机号码" prop="mobile">
        <Input v-model="ruleForm.mobile" :maxlength="11"/>
      </FormItem>
      <FormItem label="所属站点" prop="stationCode">
        <Select v-model="ruleForm.stationCode" filterable remote :remote-method="getStationList"
                :loading="loadingStation" placeholder="请选择所属站点">
          <Option v-for="item in stationList" :value="item.station_code" :key="item.station_code" :label="item.station_code"></Option>
        </Select>
      </FormItem>
      <FormItem label="学历" prop="cultureDegree">
        <Select v-model="ruleForm.cultureDegree" placeholder="请选择学历">
          <Option v-for="item in eduEnum" :value="item.value" :key="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="性别" prop="sex">
        <RadioGroup v-model="ruleForm.sex">
          <Radio :label="'male'">男</Radio>
          <Radio :label="'female'">女</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="联系人" prop="linkMan">
        <Input v-model="ruleForm.linkMan" :maxlength="10"/>
      </FormItem>
      <FormItem label="考试成绩" prop="examResult">
        <Input v-model="ruleForm.examResult" :maxlength="5"/>
      </FormItem>
      <FormItem label="户籍地址" prop="hkAddress">
        <Input v-model="ruleForm.hkAddress" :maxlength="50"/>
      </FormItem>
      <FormItem label="年龄" prop="age">
        <Input v-model="ruleForm.age" :maxlength="3"/>
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
  name: 'salesAdd',
  data() {
    const isNumber = (rule, value, callback) => {
      if (this.Regexp.isNumber(value)) {
        callback()
      } else {
        callback(new Error('只支持数字'))
      }
    }
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
      isAdd: true,
      loadingStation: false,
      stationList: [],
      // 表单内容
      ruleForm: {},
      // 表单校验
      rules: {
        nameX: [
          {required: true, message: '姓名不能为空', trigger: 'blur'},
          {type: 'string', min: 2, message: '不能少于2个字', trigger: 'blur'}
        ],
        idCard: [
          {required: true, message: '身份证号码不能为空', trigger: 'blur'},
          {type: 'string', min: 15, message: '不能少于15个字', trigger: 'blur'},
          {validator: isIDCard, required: true, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '手机号码不能为空', trigger: 'blur'},
          {type: 'string', min: 11, message: '长度不能少于11', trigger: 'blur'},
          {validator: isMobile, required: true, trigger: 'blur'}
        ],
        stationCode: [
          {required: true, message: '所属站点不能为空', trigger: 'blur'}
        ],
        examResult: [
          {required: true, message: '考试成绩不能为空', trigger: 'blur'},
          {validator: isNumber, trigger: 'blur'}
        ],
        age: [
          {required: true, message: '年龄不能为空', trigger: 'blur'},
          {validator: isNumber, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    // List-文化程度、学历
    eduEnum() {
      return this.$store.state['station_enumDic'].CommonEnum$eduEnum
    }
  },
  methods: {
    // 获取站点类型列表
    async getStationList(sCode) {
      var res = await this.postJson('station', {
        apiCode: 300019,
        content: {
          searchKey: sCode
        }
      })
      if (res.code == 0) {
        this.stationList = res.content
      }
    },
    // 修改时加载详情
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300035,
        content: { id }
      })
      if (res.code == 0) {
        console.log('getInfo', res.content)
        this.ruleForm = res.content
        const {cultureDegree, sex} = res.content
        this.$set(this.ruleForm, 'cultureDegree', cultureDegree ? cultureDegree.value : '')
        this.$set(this.ruleForm, 'sex', sex ? sex.value : '')
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
              apiCode: 300033,
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
              apiCode: 300032,
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
      this.isAdd = false
    } else {
      this.isAdd = true
    }
  }
}
</script>

<style scoped>

</style>