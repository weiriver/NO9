<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="销售厅编号" prop="hallCode">
        <Input v-model="ruleForm.hallCode"></Input>
      </FormItem>
      <FormItem label="销售厅名称" prop="hallName">
        <Input v-model="ruleForm.hallName"></Input>
      </FormItem>
      <FormItem label="销售厅所属区域" prop="hallCityCode">
        <div v-model="ruleForm.hallCityCode">
          <AreaCascader ref="as" @areaSelectResult="areaSelectResult" :stage="2" :res="ruleForm.hallCityCode"></AreaCascader>
        </div>
      </FormItem>
      <FormItem label="销售厅电话(座机)" prop="hallPhone">
        <Input v-model="ruleForm.hallPhone"></Input>
      </FormItem>
      <FormItem label="销售厅值班经理" prop="managerName">
        <Input v-model="ruleForm.managerName"></Input>
      </FormItem>
      <FormItem label="值班经理电话" prop="managerMobile">
        <Input v-model="ruleForm.managerMobile"></Input>
      </FormItem>
      <FormItem label="销售厅人员数量" prop="peopleNum">
        <Input v-model="ruleForm.peopleNum"></Input>
      </FormItem>
      <FormItem label="技术人员" prop="technicalName">
        <Input v-model="ruleForm.technicalName"></Input>
      </FormItem>
      <FormItem label="技术人员手机" prop="technicalMobile">
        <Input v-model="ruleForm.technicalMobile"></Input>
      </FormItem>
      <FormItem label="销售厅地址" prop="hallAddress">
        <Input v-model="ruleForm.hallAddress"></Input>
      </FormItem>
      <FormItem label="销售厅开建时间" prop="hallOpentime">
        <DatePicker type="date" placeholder="选择日期" v-model="ruleForm.hallOpentime"
                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"
        ></DatePicker>
      </FormItem>
      <FormItem label="销售厅面积(㎡)" prop="hallArea">
        <Input v-model="ruleForm.hallArea"></Input>
      </FormItem>
      <FormItem label="管理机设备类型" prop="deviceTypeName">
        <Input v-model="ruleForm.deviceTypeName"></Input>
      </FormItem>
      <FormItem label="销售厅机器台数" prop="deviceNum">
        <Input v-model="ruleForm.deviceNum"></Input>
      </FormItem>
      <FormItem label="销售厅域名账号" prop="domainAccount">
        <Input v-model="ruleForm.domainAccount"></Input>
      </FormItem>
      <FormItem label="幸运彩投注机编号列表" prop="xycDeviceCodes">
        <Input v-model="ruleForm.xycDeviceCodes" placeholder="编号间用英文逗号分隔" ></Input>
      </FormItem>
      <FormItem label="电脑票投注机编号列表" prop="dnpDeviceCodes">
        <Input v-model="ruleForm.dnpDeviceCodes" placeholder="编号间用英文逗号分隔" ></Input>
      </FormItem>
      <FormItem label="即开票投注机编号列表" prop="jkpDeviceCodes">
        <Input v-model="ruleForm.jkpDeviceCodes" placeholder="编号间用英文逗号分隔" ></Input>
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
  name: 'zfOnlineAdd',
  data() {
    return {
      regionCode: '',
      ruleForm: {
        hallCityCode: ''
      },
      rules: {
        hallCode: [
          {required: true, message: '站点编号不能为空', trigger: 'blur'},
          {min: 8, message: '编号长度为8位', trigger: 'blur'}
        ],
        hallName: [
          {required: true, message: '销售厅名称不能为空', trigger: 'blur'}
        ],
        hallCityCode: [
          {required: true, message: '销售厅所属区域不能为空', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    // 所属区域结果
    areaSelectResult(val) {
      console.log(val)
      this.ruleForm.hallCityCode = val.value
    },
    async save (apiCode, msg) {
      let res = await this.postJson('station', {
        apiCode,
        content: this.ruleForm
      })
      if (res.code == 0) {
        this.showMsg(msg, 'success')
        this.$router.go(-1)
      }
    },
    async initSupplier() {
      let id = this.$route.params.id
      var res = await this.postJson('station', {
        apiCode: 300100,
        content: {
          id
        }
      })
      this.ruleForm = res.content
      this.regionCode = res.content.regionCode
    },
    submitForm(formName, status='false') {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.$route.params.id) {
            this.save(300098, '修改成功')
          } else {
            this.save(300097, '新增成功')
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      if (this.$route.params.id) {
        this.initSupplier()
      } else {
        this[formName] = {}
        this.$refs.as.clear()
      }
    }
  },
  watch: {
    '$route': 'routerChange'
  },
  mounted: async function () {
    let id = this.$route.params.id
    if (id) {
      this.initSupplier()
    }
  }
}
</script>

<style scoped>

</style>