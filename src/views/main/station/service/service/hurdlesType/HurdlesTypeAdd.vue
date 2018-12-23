<template>
  <div>
    <div class="content_title">
      故障类型信息
    </div>
    <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
      <FormItem label="故障类型" prop="nameX">
        <Input v-model="ruleForm.nameX"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="submitForm('ruleForm')">保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        ObjInit: {// 编辑初始化数据
          apiCode: 300222,
          content: {
            id: ''
          }
        },
        ruleForm: {},
        rules: {
          nameX: [
            {required: true, message: '请输入故障类型名称', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      initStore (id) {
        this.ObjInit.content.id = id
        this.postJson('station', this.ObjInit).then(res => {
          if (res.code === '0') {
            let {id, nameX} = res.content
            this.ruleForm = {id, nameX}
          }
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
          apiCode: 300224,
          content: this.ruleForm
        }).then(res => {
          if (res.code === '0') {
            this.showMsg('保存成功')
            this.goback()
          } else if (res.code === '10021') {
            this.showMsg(res.msg, 'error')
          }
        })
      },
      async add() {
        this.postJson('station', {
          apiCode: 300223,
          content: this.ruleForm
        }).then(res => {
          if (res.code === '0') {
            this.showMsg('新增成功')
            this.goback()
          } else if (res.code === '10021') {
            this.showMsg(res.msg, 'error')
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
      }
    }
  }
</script>