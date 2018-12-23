<template>
  <div>
    <div class="content_title">
      视频信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="设备类型名称" prop="deviceTypeName">
        <Input v-model="ruleForm.deviceTypeName"></Input>
      </FormItem>
      <FormItem label="是否内置" prop="isEmbeded">
        <Radio border v-model="ruleForm.isEmbeded" label="true">是</Radio>
        <Radio border v-model="ruleForm.isEmbeded" label="false">否</Radio>
      </FormItem>
      <FormItem label="是否标配" prop="isStandard">
        <Radio border v-model="ruleForm.isStandard" label="true">是</Radio>
        <Radio border v-model="ruleForm.isStandard" label="false">否</Radio>
      </FormItem>
      <FormItem label="是否回收" prop="isRecover">
        <Radio border v-model="ruleForm.isRecover" label="true">是</Radio>
        <Radio border v-model="ruleForm.isRecover" label="false">否</Radio>
      </FormItem>
      <FormItem label="启停状态" prop="status">
        <Radio border v-model="ruleForm.status" label="on">启用</Radio>
        <Radio border v-model="ruleForm.status" label="off">停用</Radio>
      </FormItem>
      <FormItem label="备注" prop="remark">
        <Input v-model="ruleForm.remark"></Input>
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
      uploadConfFacilities: '',
      ObjInit: {// 编辑初始化数据
        apiCode: 300085,
        content: {
          id: ''
        }
      },
      ruleForm: {},
      sortList: [],
      rules: {
        deviceTypeName: [
          {required: true, message: '设备类型名称不能为空', trigger: 'blur'}
        ]
      },
      eqpTypeList: [] // 设备类型
    }
  },
  methods: {
    initStore(id) {
      this.ObjInit.content.id = id
      this.postJson('station', this.ObjInit).then(res => {
        this.ruleForm = res.content
        if (res.content.isEmbeded) {
          this.ruleForm.isEmbeded = 'true'
        } else {
          this.ruleForm.isEmbeded = 'false'
        }
        if (res.content.isStandard) {
          this.ruleForm.isStandard = 'true'
        } else {
          this.ruleForm.isStandard = 'false'
        }
        if (res.content.isRecover) {
          this.ruleForm.isRecover = 'true'
        } else {
          this.ruleForm.isRecover = 'false'
        }
        this.ruleForm.status = res.content.status.value
        this.ruleForm.typeName = res.content.typeName
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
        apiCode: 300134,
        content: this.ruleForm
      }).then(res => {
        if (res.code === '0') {
          this.showMsg('保存成功')
          this.goback()
        }
      })
    },
    // 获取下拉列表label值
    getValue(event, key) {
      let obj = {}
      obj = this.eqpTypeList.find((item) => {
        // 筛选出匹配数据
        return item.id === event
      })
      this.ruleForm[key] = obj.deviceTypeName
    },
    async add() {
      this.postJson('station', {
        apiCode: 300082,
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
      this.$set(this.ruleForm,'isEmbeded','true')
      this.$set(this.ruleForm,'isStandard','false')
      this.$set(this.ruleForm,'isRecover','false')
      this.$set(this.ruleForm,'status','on')
    }
    // 获取设备类型列表
    this.postJson('station', {
      apiCode: 300081,
      content: {
        paginated: false
      }
    }).then(res => {
      this.eqpTypeList = res.content.dataList
    })
  }
}
</script>