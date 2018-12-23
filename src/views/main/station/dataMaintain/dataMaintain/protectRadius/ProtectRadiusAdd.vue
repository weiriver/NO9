<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="区域等级名称" prop="stationAreaLevelCode">
        <Select clearable  v-model="ruleForm.stationAreaLevelCode" placeholder="请选择">
          <Option v-for="item in operateModeList" :key = "item.value" :value = "item.value"  :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="保护半径值" prop="limitRadius">
        <Input v-model="ruleForm.limitRadius"></Input>
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
  name: 'protectRadiusAdd',
  data() {
    var obj = { // 后台校验属性可使用性
      apiCode: 300122,
      content: {}
    }
    const validator = (rule, value, callback, source, options) => {
      obj.content.modelId = value
      this.postJson('station', obj).then(res => {
        if (res.code === '0') {
          if (res.content === true) { // 表示已经存在
            callback(new Error('区域等级名称已经存在'))
          } else {
            this.ruleForm.stationAreaLevelName = this.operateModeList.filter(ele => ele.value === this.ruleForm.stationAreaLevelCode)[0].text
            callback()
          }
        } else {
          callback(new Error('请先选择“区域等级名称”'))
        }
      })
    }
    const validator1 = (rule, value, callback, source, options) => {
      if (typeof value !== 'number' && typeof value * 1 !== 'number') {
        callback(new Error('请输入数字,取值范围1-500米'))
      }
      if (value <= 0 || value > 500) {
        callback(new Error('保护半径数值取值范围1-500米'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        stationAreaLevelCode: '',
        limitRadius: ''
      },
      rules: {
        stationAreaLevelCode: [
          {required: true, message: '区域等级名称不能为空', trigger: 'change'},
          {validator: validator, required: true, trigger: 'change'}
        ],
        limitRadius: [
          {required: true, message: '保护半径值不能为空', trigger: 'blur'},
          {validator: validator1, required: true, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    resetForm(formName) {
      this[formName] = {}
    },
    submitForm(formName, status = 'false') {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.save(300123, '新增成功')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    async save(apiCode, msg) {
      let res = await this.postJson('station', {
        apiCode,
        content: this.ruleForm
      })
      if (res.code == 0) {
        this.showMsg(msg, 'success')
        this.$router.back(-1)
      } else {
        this.showMsg(res.msg, 'warning')
      }
    }
  },
  computed: {
    ...mapState({
      operateModeList: state => state['all_enumDic']['operateMode']
    })
  },
  watch: {
    ruleForm(val) {
      console.log(val)
    }
  },
  mounted: async function () {

  }
}
</script>

<style scoped>

</style>