<template>
  <div class="SitesInfoModify">
    <h3 class="mb20">基本信息</h3>
    <Form class="form-inline" label-width="140px" :model="Obj" size="small" :rules="ruleInline" ref="formRef">
      <FormItem label="站点编号">
        <Input v-model="Obj.stationId" disabled/>
      </FormItem>
        <FormItem label="合同号">
        <Input v-model="Obj.contractSN" disabled/>
      </FormItem>
      <FormItem label="所属区域">
        <Input v-model="Obj.regionName" disabled/>
      </FormItem>
      <FormItem label="代销商">
        <Input v-model="Obj.agentName" disabled/>
      </FormItem>
        <FormItem label="站点类型">
        <Select v-model="Obj.stationType">
          <Option v-for="item in stationTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="账户控制类型">
        <Select v-model="Obj.accountType">
          <Option v-for="item in accountTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="可用余额下限">
        <Input v-model="Obj.accountLimit"/>
      </FormItem>
      <FormItem label="负责人">
        <Input v-model="Obj.responsor"/>
      </FormItem>
      <FormItem label="联系人" >
        <Input v-model="Obj.linkMan"/>
      </FormItem>
      <FormItem label="联系电话">
        <Input v-model="Obj.phone"/>
      </FormItem>
      <FormItem label="移动电话">
        <Input v-model="Obj.cellPhone"/>
      </FormItem>
      <FormItem label="票打印地址" prop="printAddr">
        <Input v-model="Obj.printAddr" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"/>
      </FormItem>
      <FormItem label="联系地址">
        <Input v-model="Obj.address" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('formRef')">保存</Button>
        <Button plain @click="resetForm">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'SitesInfoModify',
  data() {
    return {
      stationTypeList: [],
      Obj: {},
      accountTypeList: [],
      ruleInline: {
        printAddr: [
          {max: 50, message: '票打印地址字数限制50个字', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    // (保存)按钮--提交表单
    submitForm(formRef) {
      this.$refs[formRef].validate(async (valid) => {
        if (valid) {
          var res = await this.postJson('station', {
            apiCode: 300213,
            content: this.Obj
          })
          if (res.code === '0') {
            this.showMsg('修改成功')
            this.$router.back(-1)
          }
        } else {
           this.showMsg('请输入正确的必填信息', 'error')
        }
      })
    },
    // 重置表单
    resetForm() {
      this.getInfo(this.$route.params.id)
    },
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300212,
        content: {
          stationId: id
        }
      })
      if (res.code == 0) {
        this.Obj = res.content
      }
    },
    async getStationTypeList() {
      var res = await this.postJson('station', {
        apiCode: 300014,
        content: {}
      })
      if (res.code == 0) {
        this.stationTypeList = res.content
      }
    },
    getAccountTypeList() {
      this.accountTypeList = this.$store.state['station_enumDic'].MisEnum$accountTypeEnum
    }
  },
  mounted() {
    var {id} = this.$route.params
    this.getInfo(id)
    this.getStationTypeList()
    this.getAccountTypeList()
  }
}
</script>

<style scoped>

</style>