<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="是否在APP显示" prop="showApp">
        <RadioGroup v-model="ruleForm.showApp">
          <Radio label="true">是</Radio>
          <Radio label="false">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="物品类别" prop="goodsType">
        <!--<Select placeholder="请选择活动区域">-->
        <Select v-model="ruleForm.goodsType" placeholder="请选择活动区域">
        <Option v-for="item in goodsTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
      </Select>

      </FormItem>
      <FormItem label="物品类别ID" prop="goodsTypeId">
        <Input v-model="ruleForm.goodsTypeId"></Input>
      </FormItem>
      <FormItem label="物品类别名称" prop="goodsTypeName">
        <Input v-model="ruleForm.goodsTypeName"></Input>
      </FormItem>

      <FormItem label="故障描述" prop="faultProblem">
        <Input type="textarea" autosize v-model="ruleForm.faultProblem"></Input>
      </FormItem>

      <FormItem>
        <Button type="primary" @click="submitForm('ruleForm')">保存</Button>
        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data() {
    return {
      ruleForm: {},
      rules: {
        showApp: [
          {required: true, message: '请选择是否在APP显示', trigger: 'change'}
        ],
        goodsType: [
          {required: true, message: '请输入物品类别', trigger: 'change'}
        ],
        goodsTypeId: [
          {required: true, message: '请输入物品类别ID', trigger: 'blur'}
        ],
        goodsTypeName: [
          {required: true, message: '请输入物品类别名称'}
        ],
        faultProblem: [
          {required: true, message: '请输入故障描述', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapState({
      goodsTypeList: state => state['all_enumDic']['StorageEnum$goodsTypeEnum']
    })
  },
  methods: {
    async save(apiCode, msg) {
      let res = await this.postJson('eqp', {
        apiCode,
        content: this.ruleForm
      })
      if (res.code == 0) {
        this.showMsg(msg, 'success')
        this.$router.push('/repairKnowledge/todoRepository')
      }
    },
    async initInfo() {
      let id = this.$route.params.id
      var res = await this.postJson('eqp', {
        apiCode: 800021,
        content: {id}
      })
      console.log(res)
      if (res.code == 0) {
        this.ruleForm = this.BooleanToString(res.content)
        this.ruleForm.goodsType = this.ruleForm.goodsType.value
      }
    },
    submitForm(formName, status = 'false') {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.ruleForm.status = status
          if (this.$route.params.id) {
            this.save(800022, '修改成功')
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
  watch: {
  },
  mounted: async function () {
    let id = this.$route.params.id
    if (id) {
      this.initInfo()
    }
  }
}
</script>

<style></style>
