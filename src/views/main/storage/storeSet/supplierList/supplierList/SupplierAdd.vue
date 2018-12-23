<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="供应商名称" prop="supplierName">
        <Input v-model="ruleForm.supplierName"></Input>
      </FormItem>
      <FormItem label="负责人" prop="contactUser">
        <Input v-model="ruleForm.contactUser"></Input>
      </FormItem>
      <FormItem label="手机号码" prop="mobile">
        <Input v-model="ruleForm.mobile"></Input>
      </FormItem>
      <FormItem label="电话号码" prop="phone">
        <Input v-model="ruleForm.phone"></Input>
      </FormItem>
      <FormItem label="邮箱" prop="email" type="email">
        <Input v-model="ruleForm.email"></Input>
      </FormItem>
      <FormItem label="区域" prop="regionCode">
        <div v-model="ruleForm.regionCode">
          <AreaCascader ref="as" :ruturnAllLevelResultFlag="true"  @areaSelectResult="areaSelectResult" :stage="1" :res="regionCode"></AreaCascader>
        </div>
      </FormItem>
      <FormItem label="详细地址" prop="address">
        <Input v-model="ruleForm.address"></Input>
      </FormItem>
      <FormItem label="开户银行" prop="bank">
        <Input v-model="ruleForm.bank"></Input>
      </FormItem>
      <FormItem label="银行账户" prop="bankNum">
        <Input v-model="ruleForm.bankNum"></Input>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input type="textarea"
               autosize
               v-model="ruleForm.remark"></Input>
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
    data() {
      return {
        regionCode: '',
        ruleForm: {
        },
        rules: {
          supplierName: [
            { required: true, message: '请输入供应商名称', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }
          ],
          contactUser: [
            { required: true, message: '请输入负责人', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入电话号码'},
            { pattern: /^(?:0[1-9][0-9]{1,2}-)?[2-8][0-9]{6,7}$/, message: '请输入正确的电话号码' }
          ],
          email: [
            { required: true, message: '请输入邮箱',trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱' }
          ],
          regionCode: [
            { required: true, message: '请输入区域', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          bank: [
          ],
          bankNum: [
            { pattern: /^([1-9]{1})(\d{15}|\d{18})$/, message: '请输入正确的银行账户' }
          ]
        }
      };
    },
    methods: {
      areaSelectResult (result) {
        console.log('areaSelectResult', result)
        // 第一次加载会触发但是 result是空
        if (result.length > 0) {
          this.ruleForm.regionName = result[result.length - 1].label
          this.$set(this.ruleForm, 'regionCode', result[result.length - 1].value)
        } else {
          this.ruleForm.regionName = ''
          this.$set(this.ruleForm, 'regionCode', '')
        }
        this.regionCode = this.ruleForm.regionCode
        // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
        // console.log('this.regionCode', this.regionCode)
      },
      async save (apiCode, msg) {
        let res = await this.postJson('ws', {
          apiCode,
          content: this.ruleForm
        })
        if (res.code == 0) {
          this.showMsg(msg, 'success')
          this.$router.push('/storeSet/SupplierList')
        }
      },
      async initSupplier() {
        let id = this.$route.params.id
        var res = await this.postJson('ws', {
          apiCode: 500014,
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
            this.ruleForm.status = status
            if (this.$route.params.id) {
              this.save(500011, '修改成功')
            } else {
              this.save(500010, '新增成功')
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
      refresh () {
        this.$router.replace({
          path: '/refresh',
          query: {
            t: Date.now()
          }
        })
      },
      routerChange () {
        this.refresh()
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

<style></style>
