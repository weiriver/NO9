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
      <FormItem label="仓库名称" prop="nameX">
        <Input v-model="ruleForm.nameX"></Input>
      </FormItem>
      <FormItem label="所属区域" prop="regionCode">
        <AreaCascader ref="as" :ruturnAllLevelResultFlag="true" v-model="ruleForm.regionCode"
                      @areaSelectResult="areaSelectResult" :stage="1" :res="regionCode"></AreaCascader>
      </FormItem>

      <!--首次进来固定写死-->

      <FormItem label="仓库类型" prop="typeXValue" v-if="initFlag">
        <Input v-model="ruleForm.typeXValue" disabled></Input>
      </FormItem>
      <FormItem label="仓库管理员" prop="showAdmin" v-if="initFlag">
        <Input v-model="ruleForm.showAdmin" disabled></Input>
      </FormItem>

      <!--其他情况-->
      <FormItem label="仓库类型" prop="typeX" v-if="!initFlag">
        <Select clearable  v-model="ruleForm.typeX" placeholder="请选择仓库类型" @change="storeTypeChange" :disabled="!typeChangeFlag">
          <Option v-for="item in storeTypeList" :key = "item.value" :value = "item.value"  :label="item.label" :disabled="item.flag"></Option>
        </Select>
      </FormItem>
      <FormItem label="仓库管理员" prop="admin" v-if="!initFlag">
        <Input v-model="ruleForm.showAdmin" v-if="!userFlag" :disabled="!userFlag"></Input>
        <AreauserSelect :regionCode="ruleForm.regionCode" ref="user" :checkboxFlag="false" v-if="!isZone && userFlag"></AreauserSelect>
        <Select clearable  v-model="ruleForm.admin" placeholder="请选择仓库巡查员" v-if="isZone && userFlag" @change="inspectorChange">
          <Option v-for="item in inspectorList" :key = "item.id" :value = "item.id"  :label="item.name"></Option>
        </Select>
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
      initFlag: false, // 是否是修改首次进来 true 是
      inspectorList: [], // 巡查员列表
      userFlag: false, // 片区是否已经选择
      isZone: false, // 是否是片区仓库 true为片区仓库
      typeChangeFlag: false, // 是否已选择区域 true 为已选择
      regionCode: '',
      ruleForm: {},
      rules: {
        nameX: [
          {required: true, message: '请输入仓库名称', trigger: 'blur'}
        ],
        typeX: [
          {required: true, message: '请选择仓库类型'}
        ],
        regionCode: [
          {required: true, message: '请输入区域', trigger: 'blur'}
        ]
      },
      storeTypeList: [
        {
          label: '中心仓库',
          value: 'center',
          flag: true
        },
        {
          label: '地市仓库',
          value: 'city',
          flag: true
        },
        {
          label: '片区仓库',
          value: 'zone',
          flag: true
        }
      ]
    }
  },
  methods: {
    inspectorChange(val) {
      let obj = {}
      obj = this.inspectorList.find((item)=>{
        return item.id === val;
      })
      console.log('obj', obj)
      this.ruleForm.admin = obj.id
      this.ruleForm.adminName = obj.name
      this.$forceUpdate()
    },
    async getInspectorList() {
      let res = await this.postJson('ws', {
        apiCode: 500007,
        content: {
          regionCode: this.ruleForm.regionCode
        }
      })
      if (res.code == 0) {
        this.inspectorList = res.content
      } else {
      }
    },
    async storeTypeChange (val) {
      this.ruleForm.showAdmin = ''
      this.userFlag = false
      if (val === 'zone') {
        this.isZone = true
        this.ruleForm.admin = ''
        this.ruleForm.adminName = ''
        await this.getInspectorList()
      } else {
        this.isZone = false
      }
      this.userFlag = true
    },
    areaSelectResult(result) {
      console.log('区域变化')
      if (!this.initFlag) {
        this.ruleForm.showAdmin = ''
        this.typeChangeFlag = false
        this.userFlag = false
        this.$set(this.ruleForm, 'typeX', '')
        // 第一次加载会触发但是 result是空
        if (result.length > 0) {
          this.ruleForm.regionCode = result[result.length - 1].value
          this.ruleForm.regionName = result[result.length - 1].label
          if (this.ruleForm.regionCode === '640000000000') {
            this.storeTypeList[0].flag = false
            this.storeTypeList[1].flag = true
            this.storeTypeList[2].flag = true
          } else {
            this.storeTypeList[0].flag = true
            this.storeTypeList[1].flag = false
            this.storeTypeList[2].flag = false
          }
          this.typeChangeFlag = true
        }
      } else {
        this.initFlag = false
      }
      // console.log('this.ruleForm.regionCode', this.ruleForm.regionCode)
      // console.log('this.regionCode', this.regionCode)
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
      if (!this.isZone && this.$refs.user) {
        this.ruleForm.admin = this.$refs.user.userSelectId
        this.ruleForm.adminName = this.$refs.user.userSelectName
      }
      // 修改的时候设置 regionCode
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
      }
    },
    async initStore() {
      this.initFlag =true
      this.userFlag = false // 片区是否已经选择
      this.isZone = false // 是否是片区仓库 true为片区仓库
      this.typeChangeFlag = false // 是否已选择区域 true 为已选择
      let id = this.$route.params.id
      this.regionCode = ''
      var res = await this.postJson('ws', {
        apiCode: 500005,
        content: {
          id
        }
      })
      this.ruleForm = res.content
      this.ruleForm.typeObj = JSON.parse(JSON.stringify(res.content.typeX))
      this.ruleForm.typeX = this.ruleForm.typeObj.value
      this.ruleForm.typeXValue = this.ruleForm.typeObj.text
      this.regionCode = res.content.regionCode
      console.log('initStore this.regionCode', this.regionCode)
      this.ruleForm.showAdmin = res.content.adminName
      this.ruleForm.admin = res.content.admin + ''
      // if (this.ruleForm.typeX !== 'zone') {
      //   this.$nextTick(() => {
      //     console.log('this.$refs', this.$refs)
      //     this.$refs.user.setDataRadio(res.content.admin, res.content.adminName)
      //   })
      // }
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
    }
  },
  watch: {
    '$route': 'routerChange',
    regionCode: function (val) {
      console.log('res 更改', val)
    }
  },
  mounted: async function () {
    let id = this.$route.params.id
    console.log('id', id)
    if (id) {
      this.initStore()
    }
  }
}
</script>

<style></style>
