<template>
    <div>
        <div class="content_title">
            视频信息
        </div>
        <Form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="ruleForm">
            <FormItem label="视频标题" prop="videoTitle">
                <Input v-model="ruleForm.videoTitle"></Input>
            </FormItem>
            <FormItem label="视频类别" prop="videoInSortId">
                <Select clearable  v-model="ruleForm.videoInSortId">
                    <Option v-for="item in sortList" :key="item.id" :value="item.id" :label="item.videoSortName"></Option>
                </Select>
            </FormItem>
            <FormItem label="视频状态" prop="videoStatus">
                <Select clearable  v-model="ruleForm.videoStatus">
                    <Option label="上线" value="online"></Option>
                    <Option label="下线" value="false"></Option>
                </Select>
            </FormItem>
            <FormItem label="视频介绍" prop="videoSortName">
                <Input v-model="ruleForm.videoIntro"></Input>
            </FormItem>
            <FormItem label="备注" prop="videoSortName">
                <Input v-model="ruleForm.videoRemark"></Input>
            </FormItem>
            <FormItem label="上传视频" prop="abd">
                <ModalUpload class="mb20" :isMultiple="true">
                    <div slot="warnTxt">选择上传视频文件</div>
                </ModalUpload>
            </FormItem>
            <FormItem label="上传人" v-show="!isAdd">
                <Input disabled v-model="ruleForm.videoUpPerson"></Input>
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
          apiCode: 300290,
          content: {
            id: ''
          }
        },
        sortObj: {// 获取类型类别
          apiCode: 300281,
          content: {}
        },
        ruleForm: {},
        sortList: [],
        rules: {
          videoTitle: [
            {required: true, message: '视频标题不能为空', trigger: 'blur'}
          ],
          videoInSortId: [
            {required: true, message: '请选择视频类别'}
          ],
          videoStatus: [
            {required: true, message: '请选择视频状态'}
          ]
        }
      }
    },
    methods: {
      // 获得所有视频类别
      async getSort() {
        this.postJson('station', this.sortObj).then(res => {
          this.sortList = res.content.dataList
        })
      },
      initStore (id) {
        this.ObjInit.content.id = id
        this.postJson('station', this.ObjInit).then(res => {
          if (res.code === '0') {
            let {id, videoTitle, videoInSortId, videoIntro, videoRemark, videoUpPerson} = res.content.videoDetailInfo
            let videoStatus = res.content.videoDetailInfo.videoStatus.text
            this.ruleForm = {id, videoTitle, videoInSortId, videoStatus, videoIntro, videoRemark, videoUpPerson}
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
          apiCode: 300288,
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
          apiCode: 300287,
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
      this.getSort()
      if (id) {
        this.isAdd = false
        this.initStore(id)
      } else {
        this.isAdd = true
        this.ruleForm = {}
      }
    }
  }
</script>