<!--todolist-->
<!--仓库新增：-->

<!--所属区域：省中心-仓库类型（中心）-管理员（中心）-->

<!--所属区域：市中心-仓库类型（地市/片区）-管理员（如果仓库类型选择地市：管理员是系统用户。如果是片区：管理员是巡查员-->
<!--区域管理员仓库类型也是必选-->

<template>
  <div>
    <div class="content_title">
      基本信息
    </div>

    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">

      <FormItem label="仓库管理员" prop="adminName1">
        <AreauserSelect ref="userLists" :checkboxFlag="true"></AreauserSelect>
      </FormItem>
      <!--单选-->
      <FormItem label="仓库管理员" prop="adminName1">
        <AreauserSelect ref="user" :checkboxFlag="false"></AreauserSelect>
      </FormItem>
      <FormItem label="上传附件" prop="abd">
        <ConfirmUpload class="mb20" :api="uploadApi" @uploadResult="uploadResult">
          <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
        </ConfirmUpload>
      </FormItem>
      <FormItem label="上传附件" prop="abd">
        <ModalUpload class="mb20" :api="uploadConf" :isMultiple="true">
          <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
        </ModalUpload>
      </FormItem>
      <FormItem label="上传附件" prop="abd">
        <ImportFile :btnStyle="'border-radius: 0 4px 4px 0;'">
          <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
        </ImportFile>
      </FormItem>
      <FormItem label="仓库名称" prop="nameX">
        <Input v-model="ruleForm.nameX"></Input>
      </FormItem>
      <FormItem label="所属区域" prop="regionCode">
        <AreaCascader ref="as" :ruturnAllLevelResultFlag="true" v-model="ruleForm.regionCode"
                      @areaSelectResult="areaSelectResult" :stage="2" :res="regionCode"></AreaCascader>
      </FormItem>
      <FormItem label="仓库类型" prop="typeX">
        <Select clearable  v-model="ruleForm.typeX" placeholder="请选择仓库类型">
          <Option label="中心仓库" value="center"></Option>
          <Option label="地市仓库" value="city"></Option>
          <Option label="片区仓库" value="zone"></Option>
        </Select>
      </FormItem>
      <FormItem label="仓库管理员" prop="adminName">
        <Input v-model="ruleForm.adminName"></Input>
      </FormItem>
      <FormItem label="备注" prop="extInfo">
        <Input type="textarea"
               autosize
               v-model="ruleForm.extInfo"></Input>
      </FormItem>


      <FormItem>
        <Button type="primary" @click="submitForm('ruleForm')">保存</Button>
        <Button type="primary" @click="submitForm('ruleForm', 'true')">保存并启用</Button>
        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 测试使用
        uploadApi: {
          sysModule: 'station', hostBizObj: 'equ_device_model_master', hostBizId: ''
        },
        uploadConf: {
          sysModule: 'flow',
          hostBizObj: 'flow_files',
          hostBizId: ''
        },
        regionCode: '',
        ruleForm: {},
        rules: {
          nameX: [
            {required: true, message: '请输入仓库名称', trigger: 'blur'}
          ],
          typeX: [
            {required: true, message: '请选择仓库类型', trigger: 'change'}
          ],
          regionCode: [
            {required: true, message: '请输入区域', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getchiliren() {
        this.fenfaObj.content.acceptById = this.$refs.chuliren.userSelectCheckboxId
        this.fenfaObj.content.acceptByName = this.$refs.chuliren.userSelectCheckboxName
        console.log('选择分发人', this.fenfaObj)
      },
      uploadResult(res) {
        console.log('上传返回的结构', JSON.parse(res))
      },
      areaSelectResult(result) {
        console.log('areaSelectResult', result)
        // 第一次加载会触发但是 result是空
        // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
        // console.log('this.regionCode', this.regionCode)
        if (result.length > 0) {
          this.ruleForm.regionCode = result[result.length - 1].value
          this.ruleForm.regionName = result[result.length - 1].label
        } else {
          this.ruleForm.regionCode = ''
          this.ruleForm.regionName = ''
        }
      },
      async save(apiCode, msg) {
        let res = await this.postJson('ws', {
          apiCode,
          content: this.ruleForm
        })
        if (res.code == 0) {
          this.showMsg(msg, 'success')
          this.$router.push('/storeSet/storeList')
        } else {
          this.showMsg(res.msg, 'warning')
        }
      },
      submitForm(formName, status = 'false') {
        // 获取单选的用户 name /id
        console.log('this.$refs.user.userSelectName', this.$refs.user.userSelectName)
        console.log('this.$refs.user.userSelectId', this.$refs.user.userSelectId)
        // 获取多选的用户的 name/id
        console.log('this.$refs.userLists.userSelectCheckboxId', this.$refs.userLists.userSelectCheckboxId)
        console.log('this.$refs.userLists.userSelectCheckboxName', this.$refs.userLists.userSelectCheckboxName)
        // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
        // console.log('this.regionCode', this.regionCode)
        if (!this.ruleForm.regionCode && this.regionCode) {
          this.ruleForm.regionCode = this.regionCode
        }
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.ruleForm.status = status
            if (this.$route.params.id) {
              this.save(500002, '修改成功')
            } else {
              this.save(500001, '新增成功')
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        if (this.$route.params.id) {
          this.initStore()
        } else {
          this[formName] = {}
          this.$refs.as.clear()
          this.$refs.userLists.clear()
          this.$refs.user.clear()
        }
      },
      async initStore() {
        let id = this.$route.params.id
        var res = await this.postJson('ws', {
          apiCode: 500005,
          content: {
            id
          }
        })
        this.ruleForm = res.content
        this.ruleForm.typeX = res.content.typeX.value
        this.regionCode = res.content.regionCode
      },
      refresh() {
        this.$router.replace({
          path: '/refresh',
          query: {
            t: Date.now()
          }
        })
      },
      routerChange() {
        this.refresh()
        this.$refs.userLists.clear()
        this.$refs.user.clear()
      }
    },
    watch: {
      '$route': 'routerChange'
    },
    mounted: async function () {
      //初始化设置用户
      this.$refs.userLists.setDataCheckBox('48,40,43,44', 'zhang2,9999,123123,段超群')
      this.$refs.user.setDataRadio(44, '段超群')

      let id = this.$route.params.id
      console.log('id', id)
      if (id) {
        this.initStore()
      }
    }
  }
</script>


