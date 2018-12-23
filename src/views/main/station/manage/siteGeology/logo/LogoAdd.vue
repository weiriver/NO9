<template>
  <div>
    <div class="content_title">
      新增/修改标识
    </div>
    <Form :model="ruleForm" :rules="rules" ref="formRef" label-width="110px">
      <FormItem label="标识类型" prop="typeId">
        <Select v-model="ruleForm.typeId" placeholder="请选择标识类型" :disabled="!!$route.params.id">
          <Option v-for="item in operateModeEnum" :value="item.value" :key="item.value" :label="item.text"></Option>
        </Select>
      </FormItem>
      <FormItem label="标识图片">
        <img :src="ruleForm.flagPicture" alt=""
             style="vertical-align: middle; display: inline-block; height: 30px;">
        <Button type="text" @click="showLogoDialog">选择图片</Button>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input style="height: auto" type="textarea" :autosize="true" v-model="ruleForm.remark"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('formRef')">保存</Button>
        <Button @click="resetForm('formRef')">重置</Button>
      </FormItem>
    </Form>

    <!-- 上传附件对话框 -->
    <Dialog title="选择图片" :visible.sync="logoDialogVisible" width="50%" center>
      <RadioGroup v-model="logoId">
        <Radio v-for="item in logoList" :key="item.id" :label="item.id">
          <img :src="item.showUrl" alt="">
        </Radio>
      </RadioGroup>
      <LogoUpload ref="logoUpload" @uploadResult="uploadResult"></LogoUpload>
      <span slot="footer" class="dialog-footer">
        <Button type="primary" @click="confirm">确定</Button>
        <Button @click="cancel">取消</Button>
        <Button type="danger" @click="del">删除</Button>
      </span>
    </Dialog>

    <!-- 删除对话框 -->
    <Dialog title="确认删除？" :visible.sync="delDialogVisible" width="30%">
      <span>删除后无法恢复，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <Button @click="delDialogVisible = false">取消</Button>
        <Button type="danger" @click="confirmDelete">确认删除</Button>
      </span>
    </Dialog>
  </div>
</template>

<script>
import LogoUpload from './LogoUpload'

export default {
  name: 'LogoAdd',
  components: {LogoUpload},
  data() {
    const checkLogoExist = async (rule, value, callback) => {
      if (this.$route.params.id) { // 修改时标识类型不改变，不校验
        callback()
      } else { // 新增时校验标识类型
        var res = await this.postJson('station', {
          apiCode: 300132,
          content: {
            typeId: value
          }
        })
        if (res.code == 0) {
          if (res.content === true) {
            callback(new Error('该站点标识已经存在'))
          } else {
            callback()
          }
        } else {
          callback(new Error('请先选择“站点标识”'))
        }
      }
    }
    const checkSelectLogo = (rule, value, callback) => {
      console.log(value)
      if (value) {
        callback()
      } else {
        callback(new Error('请选择标识图片'))
      }
    }
    return {
      logoDialogVisible: false,
      delDialogVisible: false,
      deleteId: '',
      logoId: '',
      logoList: [],
      // 表单内容
      ruleForm: {},
      // 表单校验
      rules: {
        typeId: [
          {required: true, message: '标识类型不能为空', trigger: 'change'},
          {validator: checkLogoExist, required: true, trigger: 'change'}
        ],
        flagPicture: [
          {required: true, message: '请选择标识图片', trigger: 'blur'},
          {validator: checkSelectLogo, required: true, trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    operateModeEnum() {
      return this.$store.state.station_enumDic.operateMode
    }
  },
  methods: {
    // 选择图片按钮
    showLogoDialog() {
      this.logoDialogVisible = true
      this.getLogoList()
    },
    // 获取logo图片的列表
    async getLogoList() {
      var res = await this.postJson('common', {
        apiCode: 200005,
        content: {
          sysModule: 'station',
          hostBizObj: 'station_flag',
          hostBizId: '1'
        }
      })
      if (res.code == 0) {
        this.logoList = res.content.dataList
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    uploadResult() {
      this.getLogoList()
    },
    // 取消按钮
    cancel() {

    },
    // 确认按钮
    confirm() {
      this.logoDialogVisible = false
      console.log(this.logoId)
      console.log(this.logoList)
      this.ruleForm.flagPicture = this.logoList.filter(v => v.id === this.logoId)[0].showUrl
    },
    // 取消按钮
    cancel() {
      this.logoDialogVisible = false
      this.logoId = ''
      this.ruleForm.flagPicture = ''
    },
    // 删除按钮
    del() {
      if (!this.logoId) {
        this.showMsg('未选择标识图片！', 'error')
      } else {
        this.delDialogVisible = true
      }
    },
    // 确认删除
    async confirmDelete() {
      var res = await this.postJson('common', {
        apiCode: 200006,
        content: {
          id: this.logoId
        }
      })
      if (res.code == 0) {
        this.showMsg('删除成功', 'success')
        this.delDialogVisible = false
        this.getLogoList()
      } else {
        this.showMsg(res.msg, 'warning')
      }
    },
    // 修改时加载详情
    async getInfo(id) {
      var res = await this.postJson('station', {
        apiCode: 300136,
        content: {id}
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
          this.ruleForm.flagPicture = this.logoId
          if (this.$route.params.id) { // 修改
            console.log('ruleForm', this.ruleForm)
            var res = await this.postJson('station', {
              apiCode: 300134,
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
            this.ruleForm.typeX = this.operateModeEnum.filter(v => v.value === this.ruleForm.typeId)[0].text
            var res = await this.postJson('station', {
              apiCode: 300133,
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
          return false
        }
      })
    },
    // 重置表单
    resetForm(formRef) {
      if (this.$route.params.id) { // 修改时重置为详情
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