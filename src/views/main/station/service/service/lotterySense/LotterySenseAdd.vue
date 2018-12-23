<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="标题" prop="commonSenseTitle">
        <Input v-model="ruleForm.commonSenseTitle"></Input>
      </FormItem>
      <FormItem label="类型" prop="commonSenseType">
        <Select clearable  v-model="ruleForm.commonSenseType">
          <Option v-for="item in commonSenseType" :value="item.value" :key="item.value" :label="item.label"></Option>
        </Select>
      </FormItem>
      <FormItem label="所属区域" prop="regionCode">
        <AreaCascader :ruturnAllLevelResultFlag="true" @areaSelectResult="areaSelectResult" ref="as" :stage="3"></AreaCascader>
      </FormItem>
      <FormItem label="是否广告" prop="isAdv">
        <Radio border v-model="ruleForm.isAdv" label="true">是</Radio>
        <Radio border v-model="ruleForm.isAdv" label="false">否</Radio>
      </FormItem>
      <FormItem label="状态" prop="commonSenseStatus">
        <Radio border v-model="ruleForm.commonSenseStatus" label="on">启用</Radio>
        <Radio border v-model="ruleForm.commonSenseStatus" label="off">停用</Radio>
      </FormItem>
      <FormItem label="排序" prop="sort">
        <Input v-model="ruleForm.sort"></Input>
      </FormItem>
      <FormItem label="图片" prop="imgUrl">
        <img style="width: 100%;height: 100%;" :src="ruleForm.imgUrl" v-if="imgFlag"/>
        <ModalUpload class="mb20" :isMultiple="true" :api="uploadConf" :type="['jpg', 'bmp', 'png']">
          <div slot="warnTxt">选择上传图片文件</div>
        </ModalUpload>
      </FormItem>
      <FormItem label="简介" prop="introduction">
        <Input type="textarea" autosize v-model="ruleForm.introduction"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        imgFlag: true,
        uploadConfFacilities: '',
        ObjInit: {// 编辑初始化数据
          apiCode: 300265,
          content: {
            id: ''
          }
        },
        ruleForm: {},
        sortList: [],
        uploadConf: [{}],
        rules: {
          commonSenseTitle: [
            {required: true, message: '标题不能为空', trigger: 'blur'}
          ],
          commonSenseType: [
            {required: true, message: '请选择类型', trigger: 'blur'}
          ],
          regionCode: [
            {required: true, message: '请选择区域', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '排序不能为空', trigger: 'blur'}
          ],
          introduction: [
            {required: true, message: '介绍不能为空', trigger: 'blur'}
          ]
        },
        eqpTypeList: [], // 设备类型
        commonSenseType: [
          {
            value: 'playIndroduction',
            label: '玩法介绍'
          },
          {
            value: 'gameIndroduction',
            label: '游戏介绍'
          },
          {
            value: 'cashGuide',
            label: '兑奖指南'
          },
          {
            value: 'manageRules',
            label: '管理条例'
          },
          {
            value: 'news',
            label: '新闻资讯'
          }
        ]
      }
    },
    methods: {
      // 选择区域
      areaSelectResult (result) {
        if (result.length > 0) {
          this.ruleForm.regionCode = result[result.length - 1].value
          this.ruleForm.regionName = result[result.length - 1].label
        } else {
          this.ruleForm.regionCode = ''
          this.ruleForm.regionName = ''
        }
      },
      initStore (id) {
        this.ObjInit.content.id = id
        this.postJson('station', this.ObjInit).then(res => {
          this.ruleForm = res.content
          this.ruleForm.isAdv = '' + this.ruleForm.isAdv
          this.ruleForm.commonSenseStatus = '' + this.ruleForm.commonSenseStatus.value
          this.ruleForm.commonSenseType = '' + this.ruleForm.commonSenseType.value
          this.ruleForm.sort = '' + this.ruleForm.sort
          console.log(this.ruleForm)
          this.imgFlag = false
          setTimeout(() => {
            this.imgFlag = true
          }, 50)
        })
      },
      submitForm() {
        this.$refs['ruleForm'].validate().then(res => {
          if (res) {
            if (this.$route.params.id) { // 修改
              this.modify()
            } else { // 新增
              this.add()
            }
          }
        })
      },
      async modify() {
        this.postJson('station', {
          apiCode: 300263,
          content: this.ruleForm
        }).then(res => {
          if (res.code === '0') {
            this.showMsg('保存成功')
            this.goback()
          }
        })
      },
      async add() {
        this.postJson('station', {
          apiCode: 300262,
          content: this.ruleForm
        }).then(res => {
          if (res.code === '0') {
            this.showMsg('新增成功')
            this.goback()
          }
        })
      },
      // 返回一步
      goback() {
        setTimeout(() => {
          this.$router.back(-1)
        }, 1000)
      }
    },
    watch: {},
    mounted: async function () {
      let id = this.$route.params.id
      if (id) {
        this.initStore(id)
      } else {
        this.ruleForm = {}
        this.$set(this.ruleForm,'isAdv','false')
        this.$set(this.ruleForm,'commonSenseStatus','off')
      }
    }
  }
</script>