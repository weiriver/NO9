<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="名称" prop="nameX">
        <Input v-model="ruleForm.nameX"></Input>
      </FormItem>
      <FormItem label="英文名称" prop="nameEn">
        <Input v-model="ruleForm.nameEn"></Input>
      </FormItem>
      <FormItem label="登录链接" prop="accessUrl">
        <Input v-model="ruleForm.accessUrl"></Input>
      </FormItem>

      <FormItem label="系统路由" prop="link">
        <Input v-model="ruleForm.link"></Input>
      </FormItem>


      <FormItem label="系统模块" prop="sysModule">
        <Select v-model="ruleForm.sysModule" placeholder="请选择系统模块" >
            <Option v-for="item in sysModuleSelects" :key="item.value"
                    :label="item.text" :value="item.value"></Option>
          </Select>
      </FormItem>

      <FormItem label="系统类型" prop="typeX">
        <Select v-model="ruleForm.typeX" placeholder="请选择系统类型" >
            <Option v-for="item in sysModuleTypexs" :key="item.value"
                    :label="item.text" :value="item.value"></Option>
          </Select>
      </FormItem>
      <FormItem label="详细描述" prop="remark">
        <Input type="textarea"
               autosize
               v-model="ruleForm.remark"></Input>
      </FormItem>
      <FormItem label="上传附件" prop="abd"  v-if="ruleForm.typeX !== 'service'">
        <ConfirmUpload :limit="1" class="mb20" :api="uploadConf" :apiCode="apiCode" >
          <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
        </ConfirmUpload>
      </FormItem>
      <!--<FormItem label="上传附件" prop="abd">-->
        <!--<ModalUpload class="mb20" :api="uploadConf" :isMultiple="true">-->
          <!--<div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>-->
        <!--</ModalUpload>-->
      <!--</FormItem>-->
      <FormItem>
        <Button v-if="!$route.params.id"  type="primary" @click="submitForm('ruleForm', 'off')">保存</Button>
        <Button v-if="!$route.params.id"  type="primary" @click="submitForm('ruleForm', 'on')">保存并启用</Button>
        <Button v-if="$route.params.id"  type="primary" @click="editForm('ruleForm')">保存</Button>
        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    data() {
      var validateName = async (rule, value, callback) => {
        console.log('value', value)
        if (!value) {
          callback(new Error('请输入名称'))
        } else if (value.length < 2) {
          callback(new Error('名称至少两个字'))
        } else {
          var res = await this.postJson('account', {
            apiCode: 100037,
            content: {
              nameX: value
            }
          })
          if (res.code === '0') {
            if (res.content.exist && value !== this.originName) {
              callback(new Error('系统名称已存在'))
            } else {
              callback()
            }
          }
          callback()
        }
      }
      return {
        apiCode: 200007,
        uploadConf: {
          sysModule: 'account',
          hostBizObj: 'sys_sub_system',
          hostBizId: ''
        },
        originName: '',
        ruleForm: {
        },
        rules: {
          nameX: [
            { required: true, validator: validateName, trigger: 'blur' }
          ],
          nameEn: [
            { required: true, message: '请输入英文名称', trigger: 'blur' },
            { min: 2, message: '名称最少两个字符', trigger: 'blur' }
          ],
          accessUrl: [
            { required: true, message: '请输入登录链接', trigger: 'blur' }
          ],
          link: [
            { required: true, message: '请输入系统路由', trigger: 'blur' }
          ],
          sysModule: [
            { required: true, message: '请选择系统模块', trigger: ' change' }
          ],
          typeX: [
            { required: true, message: '请选择系统类型', trigger: 'change' }
          ]
        }
      };
    },
    computed: {
      sysModuleSelects() {
        return this.$store.state.station_enumDic.SysModuleEnum
      },
      sysModuleTypexs() {
        return this.$store.state.station_enumDic.CommonEnum$subSystemTypeEnum
      }

    },
    methods: {
      async save (apiCode, msg) {
        let res = await this.postJson('account', {
          apiCode,
          content: this.ruleForm
        })
        if (res.code == 0) {
          this.showMsg(msg, 'success')
          this.$router.push('/sysSetup/systemManage/decksubsys')
        }
      },
      async init() {
        let id = this.$route.params.id
        var res = await this.postJson('account', {
          apiCode: 100032,
          content: {
            id
          }
        })
        this.ruleForm = res.content
        this.ruleForm.sysModule = res.content.sysModule.value
        this.ruleForm.typeX = res.content.typeX.value
        this.originName = this.ruleForm.nameX
        this.ruleForm.status = res.content.status.value
      },
      editForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.save(100034, '修改成功')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitForm(formName, status) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.ruleForm.status = status
            this.save(100033, '新增成功')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.refresh()
        // if (this.$route.params.id) {
        //   this.init()
        // } else {
        //   this.$refs[formName].resetFields()
        // }
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
      this.uploadConf.hostBizId = ''
      if (id) {
        this.init()
        this.uploadConf.hostBizId = id
        this.apiCode = 200009
        this.uploadConf.isModify = true
      }
    }
  }
</script>

<style></style>
