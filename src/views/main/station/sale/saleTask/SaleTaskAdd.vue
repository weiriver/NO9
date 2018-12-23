<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="目标日期" prop="targettype">
        <Select v-model="ruleForm.targettype" clearable>
          <Option v-for="item in targetTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属区域" prop="regionName">
        <AreaCascader :ruturnAllLevelResultFlag="true" @areaSelectResult="areaSelectResult" ref="as" :stage="3" :res="ruleForm.regionCode" v-model="ruleForm.regionCode"></AreaCascader>
      </FormItem>
      <FormItem label="总销量目标" prop="totalTarget">
        <Input v-model="ruleForm.totalTarget"></Input>
      </FormItem>
      <FormItem label="电脑销量目标" prop="dnTarget">
        <Input v-model="ruleForm.dnTarget"></Input>
      </FormItem>
      <FormItem label="中福销量目标" prop="zfTarget">
        <Input v-model="ruleForm.zfTarget"></Input>
      </FormItem>
      <FormItem label="即开票销量目标" prop="jkTarget">
        <Input v-model="ruleForm.jkTarget"></Input>
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
        isAdd: true,// 上传者名称
        ObjInit: {// 编辑初始化数据
          apiCode: 300605,
          content: {
            id: ''
          }
        },
        ruleForm: {},
        sortList: [],
        rules: {
          targettype: [
            {required: true, message: '目标日期不能为空', trigger: 'blur'}
          ],
          regionName: [
            {required: true, message: '请选择区域'}
          ],
          totalTarget: [
            {required: true, message: '总销量目标不能为空'}
          ],
          dnTarget: [
            {required: true, message: '电脑销量目标不能为空'}
          ],
          zfTarget: [
            {required: true, message: '中福销量目标不能为空'}
          ],
          jkTarget: [
            {required: true, message: '即开票销量目标不能为空'}
          ]
        },
        targetTypeList: []
      }
    },
    methods: {
      // 所属区域结果
      areaSelectResult(val) {
        this.ruleForm.regionCode = val[val.length - 1].value
        this.ruleForm.regionName = val[val.length - 1].label
      },
      initStore (id) {
        this.ObjInit.content.id = id
        this.postJson('station', this.ObjInit).then(res => {
          this.ruleForm = res.content
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
          apiCode: 300604,
          content: this.ruleForm
        }).then(res => {
          if (res.code === '0') {
            this.showMsg('保存成功')
            this.goback()
          }
        })
      },
      // 获取下拉列表label值
      getValue(event, key, name) {
        if (name === 'eqpTypeList') {
          var objR = 'deviceTypeName'
        } else {
          var objR = 'deviceModelName'
        }
        let obj = {}
        obj = this[name].find((item)=>{
          // 筛选出匹配数据
          return item.id === event
        });
        this.ruleForm[key] = obj[objR]
      },
      async add() {
        this.postJson('station', {
          apiCode: 300602,
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
        this.isAdd = false
        this.initStore(id)
      } else {
        this.isAdd = true
        this.ruleForm = {}
      }
      let year = new Date().getFullYear()
      this.targetTypeList = [
        {
          label: year,
          value: year + ''
        },
        {
          label: year - 1,
          value: year - 1 + ''
        },
        {
          label: year - 2,
          value: year - 2 + ''
        }
      ]
    }
  }
</script>