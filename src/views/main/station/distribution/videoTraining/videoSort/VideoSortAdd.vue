<template>
    <div>
        <div class="content_title">
            视频类别信息
        </div>
        <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
            <FormItem label="视频类别" prop="videoSortName">
                <Input v-model="ruleForm.videoSortName"></Input>
            </FormItem>
            <FormItem label="类别状态" prop="videoSortStatus">
                <Radio border v-model="ruleForm.videoSortStatus" label="start">启用</Radio>
                <Radio border v-model="ruleForm.videoSortStatus" label="stop">停用</Radio>
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
          apiCode: 300285,
          content: {
            id: ''
          }
        },
        ruleForm: {},
        rules: {
          videoSortName: [
            {required: true, message: '请输入类别名称', trigger: 'blur'}
          ],
          videoSortStatus: [
            {required: true, message: '请选择类别状态'}
          ]
        }
      }
    },
    methods: {
      initStore (id) {
        this.ObjInit.content.id = id
        this.postJson('station', this.ObjInit).then(res => {
          if (res.code === '0') {
            let {id, videoSortName, videoSortStatus} = res.content
            this.ruleForm = {id, videoSortName, videoSortStatus}
            console.log(this.ruleForm)
            this.ruleForm.videoSortStatus = videoSortStatus.value
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
          apiCode: 300283,
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
          apiCode: 300282,
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
      }
    }
  }
</script>