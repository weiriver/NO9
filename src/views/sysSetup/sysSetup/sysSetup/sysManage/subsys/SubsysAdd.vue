<template>
  <div>
    <div class="content_title">
      基本信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="名称" prop="nameX">
        <Input v-model="ruleForm.nameX"></Input>
      </FormItem>
      <FormItem label="缩写" prop="code">
        <Input v-model="ruleForm.code"></Input>
      </FormItem>
      <FormItem label="类型" prop="typeX">
        <Select v-model="ruleForm.typeX" placeholder="请选择系统类型" >
          <Option v-for="item in sysSystemTypes" :key="item.value"
                  :label="item.text" :value="item.value"></Option>
        </Select>
      </FormItem>
      <FormItem label="前端跳转路由" prop="link">
        <Input v-model="ruleForm.link"></Input>
      </FormItem>

      <FormItem label="排序" prop="seq">
        <Input v-model="ruleForm.seq"></Input>
      </FormItem>



      <FormItem label="描述" prop="remark">
        <Input type="textarea"
               autosize
               v-model="ruleForm.remark"></Input>
      </FormItem>
      <FormItem>
        <Button v-if="!$route.params.id" type="primary" @click="submitForm('ruleForm', false)">保存</Button>
        <Button v-if="!$route.params.id" type="primary" @click="submitForm('ruleForm', true)">保存并启用</Button>
        <Button v-if="$route.params.id" type="primary" @click="editForm('ruleForm')">保存</Button>

        <Button @click="resetForm('ruleForm')">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    data() {
      var validator = async (rule, value, callback, source) => {
        this.validateObj.content = Object.assign(this.validateObj.content, source)
        console.log('value', value)
        var res = await this.postJson('common', this.validateObj)
        if (res.code === '0') {
          callback()
        } else {
          for (var key in source) {
            if (key === 'nameX') {
              callback(new Error('名称已经存在'))
            } else if (key === 'code') {
              callback(new Error('缩写已经存在'))
            } else {
            }
          }
        }
      }
      return {
        validateObj: {
          apiCode: 200026,
          content: {
            sysModule: sessionStorage.getItem('sysName'),
            id: this.$route.params.id
          }
        },
        ruleForm: {
        },
        rules: {
          nameX: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
            {type: 'string', min: 2, message: '不能少于2个字', trigger: 'blur'},
            {validator: validator, required: true, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '缩写不能为空', trigger: 'blur'},
            {type: 'string', min: 3, message: '不能少于3个字', trigger: 'blur'},
            {validator: validator, required: true, trigger: 'blur'}
          ],
          typeX: [
            {required: true, message: '类型不能为空', trigger: 'change'}
          ]
        }
      };
    },
    computed: {
      sysSystemTypes() {
        return this.$store.state.station_enumDic.CommonEnum$sysSystemTypeEnum
      }

    },
    methods: {
      async save (apiCode, msg) {
        let res = await this.postJson('common', {
          apiCode,
          content: this.ruleForm
        })
        if (res.code == 0) {
          this.showMsg(msg, 'success')
          this.$router.push('/sysSetup/systemManage/subsys')
        }
      },
      async init() {
        let id = this.$route.params.id
        var res = await this.postJson('common', {
          apiCode: 200022,
          content: {
            id
          }
        })
        this.ruleForm = res.content
        this.ruleForm.sysModule = res.content.sysModule.value
        this.ruleForm.typeX = res.content.typeX.value
      },
      submitForm(formName, status) {
        this.ruleForm.sysModule = sessionStorage.getItem('sysName')
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.ruleForm.status = status
            this.save(200023, '新增成功')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.save(200024, '修改成功')
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.refresh()
        // 因为 会出现名称输入提示空或者数据没有全部清除或者清除之后无法选择类型的情况，好穿 refresh
        // if (this.$route.params.id) {
        //   this.init()
        // } else {
        //   this.$refs[formName].resetFields()
        //   console.log('this.ruleform', this.ruleForm, this.$refs[formName])
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
      if (id) {
        this.init()
      }
    }
  }
</script>

<style></style>
