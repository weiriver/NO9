<template>
  <div class="ZfSaleAdd">
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="销售厅编号" prop="hallCode">
        <Input v-model="ruleForm.hallCode"></Input>
      </FormItem>
      <FormItem label="销售时间" prop="saleDate">
        <DatePicker type="datetime" placeholder="选择日期" v-model="ruleForm.saleDate"
                    value-format="yyyy-MM-dd HH:mm:ss"
        ></DatePicker>
      </FormItem>
      <FormItem label="游戏类别" prop="gameType">
        <Select v-model="ruleForm.gameType" placeholder="请选择">
          <Option v-for="item in gameTypeList" :value="item.value" :key="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="销量" prop="sales">
        <Input v-model="ruleForm.sales"></Input>
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
    name: 'ZfSaleAdd',
    data() {
      return {
        regionCode: '',
        ruleForm: {
          hallCode: ''
        },
        rules: {
          hallCode: [
            {required: true, message: '大厅编号不能为空', trigger: 'blur'},
            {min: 8, message: '编号为8位数字', trigger: 'blur'}
          ],
          gameType: [
            {required: true, message: '游戏类型不能为空', trigger: 'change'}
          ],
          saleDate: [
            {required: true, message: '销售厅时间不能为空', trigger: 'change'}
          ],
          sales: [
            {required: true, message: '销量不能为空', trigger: 'blur'}
          ]
        },
        gameTypeList: []
      }
    },
    methods: {
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
          apiCode: 300111,
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
              this.save(300109, '修改成功')
            } else {
              this.save(300108, '新增成功')
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
      },
      getGameTypeList() {
        this.gameTypeList = this.$store.state.station_enumDic.zfGameType
      }
    },
    watch: {
      '$route': 'routerChange'
    },
    computed: {
    },
    mounted: async function () {
      this.getGameTypeList()
      let id = this.$route.params.id
      if (id) {
        this.initSupplier()
      }
    }
  }
</script>

<style lang="scss">
  .ZfSaleAdd{
    .el-date-editor{
      width: 100%!important;
    }
  }
</style>