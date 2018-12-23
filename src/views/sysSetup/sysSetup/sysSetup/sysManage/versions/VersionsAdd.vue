<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="版本号" prop="appVersion">
        <Input v-model="ruleForm.appVersion"></Input>
      </FormItem>
      <FormItem label="设备型号" prop="modelType">
        <Select v-model="ruleForm.modelType" placeholder="请选择设备型号" >
          <Option v-for="item in modeTypeList" :key="item.value"
                  :label="item.text" :value="item.value"></Option>
        </Select>
      </FormItem>

      <FormItem label="版本说明" prop="illustrate">
        <Input type="textarea"
               autosize
               v-model="ruleForm.illustrate"></Input>
      </FormItem>
      <FormItem label="上传附件" prop="abd">
        <ConfirmUpload :limit="1" class="mb20" :api="uploadConf" :apiCode="apiCode" :type="['apk']" @uploadResult="uploadResult">
          <div slot="warnTxt">只能上传apk文件</div>
        </ConfirmUpload>
      </FormItem>
      <FormItem label="站点" >
       <station-select ref="stationSelect" :checkboxFlag="true"></station-select>
      </FormItem>
      <!--<FormItem label="上传附件" prop="abd">-->
      <!--<ModalUpload class="mb20" :api="uploadConf" :isMultiple="true">-->
      <!--<div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>-->
      <!--</ModalUpload>-->
      <!--</FormItem>-->
      <FormItem>
        <Button v-if="!$route.params.id"  type="primary" @click="submitForm('ruleForm', '0')">保存</Button>
        <Button v-if="!$route.params.id"  type="primary" @click="submitForm('ruleForm', '1')">保存并启用</Button>
        <Button v-if="$route.params.id"  type="primary" @click="editForm('ruleForm')">保存</Button>
        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import StationSelect from '@/components/stationSelect/StationSelect.vue'
  export default {
    data() {
      return {
        apiCode: 200007,
        uploadConf: {
          sysModule: 'ids',
          hostBizObj: 'app_version_info',
          hostBizId: ''
        },
        originName: '',
        ruleForm: {
        },
        rules: {
          appVersion: [
            { required: true, message: '版本号', trigger: 'blur' },
            { pattern: /^[0-9]\.[0-9]\.[0-9]$/, message: '版本号格式x.x.x;[x为数字]', trigger: 'blur' },
          ],
          modelType: [
            { required: true, message: '请选择设备型号', trigger: ' change' }
          ]
        }
      };
    },
    components: {
      StationSelect
    },
    computed: {
      modeTypeList() {
        return this.$store.state.station_enumDic.modeType
      }

    },
    methods: {
      uploadResult(result) {
        console.log('上传返回的结果', JSON.parse(result))
        var resultData = JSON.parse(result)[0]
        console.log('resultData', resultData)
        this.ruleForm.contentName =resultData.fileName
        this.ruleForm.fileSize =resultData.fileSize
        this.ruleForm.path =resultData.httpUrl

      },
      async save (apiCode, msg) {
        // 代码中的数据格式
        // stationArea: stationObj,
        // extInfo: JSON.stringify(this.tagList)
        // 测试提交的数据
        // appVersion: "1.1.1"
        // contentName: "test.apk"
        // extInfo: "["41000000"]"
        // fileSize: 10
        // illustrate: "说明"
        // modelType: "HX-TV"
        // path: "http://202.105.127.12:10001/fastdfs/download/9651?token=96559A21F57F83FE515328B6B3F297DC3416BCA292193ED7"
        // stationArea: {stations: ["41000000"]}
        // status: "0"
        let res = await this.postJson('account', {
          apiCode,
          content: this.ruleForm
        })
        if (res.code == 0) {
          this.showMsg(msg, 'success')
          this.$router.push('/sysSetup/systemManage/versions')
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
