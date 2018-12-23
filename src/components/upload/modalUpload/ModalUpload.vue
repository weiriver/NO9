<!--
上传组件（点击后为模态对话框，可查上传记录）
-->

<template>
  <div>
    <Button type="primary" @click="dialogModal = true">打开上传</Button>

    <Dialog class="upload-modal" title="上传附件" :visible.sync="dialogModal" width="800px">
      <Tabs v-model="activeName" @tab-click="handleTabsClick">

        <TabPane label="选择附件" name="first">
          <!--:before-remove="beforeRemove"-->
          <!--:on-remove="handleRemove"-->
          <Upload
             class="confirm-upload"
             action=""
             ref="upload"
             :on-preview="handlePreview"
             :on-exceed="handleExceed"
             :file-list="fileList"
             :multiple="isMultiple"
             :limit="!isMultiple?1:limit"
             :auto-upload="false">
            <Button slot="trigger" type="primary">选取文件</Button>

            <div slot="tip" class="el-upload__tip">
              <slot name="warnTxt">
                <div v-if="type" style="text-indent: 22px;">
                  只限制 {{type.join('、')}} 其中一种格式
                </div>
              </slot>
            </div>
          </Upload>

          <Form :model="form" class="mt12">
            <FormItem label="附件描述" :label-width="'90px'">
              <Input v-model="form.remark"></Input>
            </FormItem>
          </Form>

        </TabPane>

        <TabPane label="查看记录" name="second">
          <Table stripe
                 :data="hisList"
                 height="250"
                 border
                 style="width: 100%">
            <TableColumn prop="fileName" label="附件名称" width="180"></TableColumn>
            <TableColumn prop="fileType" label="文件格式"></TableColumn>
            <TableColumn prop="remark" label="描述"></TableColumn>
            <TableColumn prop="fileSize" label="文件大小"></TableColumn>
            <TableColumn prop="downloadCount" label="下载次数"></TableColumn>
            <TableColumn prop="createByName" label="上传人" width="120"></TableColumn>
            <TableColumn prop="address" label="操作">
              <template slot-scope="scope">
                <Button @click="downFile(scope)" type="text" typeOptions>下载</Button>
                <Button @click="deleteFile(scope.row.id)" type="text" typeOptions>删除</Button>
              </template>
            </TableColumn>
          </Table>
        </TabPane>

      </Tabs>
      <!--底部按钮-->
      <div slot="footer" class="dialog-footer">
        <Button @click="dialogModal = false">关 闭</Button>
        <Button style="margin-left: 10px;"
                type="success"
                :loading="loading"
                @click="submitUpload" v-if="activeName=='first'">上传到服务器
        </Button>
      </div>
    </Dialog>

    <Dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'ModalUpload',
  props: {
    maxSize: {
      type: [Number, String],
      default: 500 // 文件大小，默认500kb 单位:kb
    },
    api: {
      type: [Object],
      default: function () {
        return {}
      } // 上传的接口
    },
    type: {
      type: Array,
      default: () => {
        return ['jpg', 'bmp', 'png'] // 文件支持类型,默认支持图片
      }
    },
    limit: {
      type: [Number, String],
      default: 4 // 文件限制数量，默认最大只能传4个
    },
    isMultiple: {
      type: Boolean,
      default: false // 是否能多附件上传，默认单文件上传
    }
  },
  data() {
    return {
      form: {},
      activeName: 'first',
      loading: false,
      dialogImageUrl: '',
      dialogImgVisible: false,
      dialogModal: false,
      filesArr: [],
      fileList: [],
      hisList: []
    }
  },
  methods: {
    // 检查文件格式是否符合要求
    checkFile() {
      return new Promise(((resolve, reject) => {
        let arr = this.filesArr = this.$refs.upload.uploadFiles
        console.log(arr)
        if (!this.$refs.upload.uploadFiles.length) {
          this.showMsg('请先选择文件', 'warning')
          resolve(false)
        }
        arr.forEach(file => {
          if (file.size && file.size / 1000 > this.maxSize) {
            this.showMsg('文件容积太大', 'warning')
            resolve(false)
          } else {
            let checkFileName = this.type
            let name = file.name
            let index = name.lastIndexOf('.') + 1
            let fileName = name.substr(index)
            if (checkFileName.includes(fileName)) {
              return checkFileName.includes(fileName)
            } else {
              var str = this.type.join(',')
              this.showMsg(`文件类型只支持: ${str}`, 'warning')
              resolve(false)
            }
          }
        })
        resolve(true)
      }))
    },
    // 上传附件
    async submitUpload() {
      // this.$refs.upload
      const isPass = await this.checkFile()
      if (isPass) {
        this.loading = true
        // 附件的描述
        this.api.remark = this.form.remark
        const res = await this.postFile('files', {
          apiCode: 200007,
          content: this.api
        }, this.filesArr)
        this.loading = false
        if (res.code == 0) {
          this.form.remark = ''
          this.fileList = []
          this.filesArr.forEach((v, index) => {
            this.fileList.push({
              id: res.content.content[index].id,
              name: v.name,
              url: res.content.content[index].showUrl
            })
          })
          // this.fileName = str
          this.filesArr = []
          this.showMsg('上传成功')
          // 上传结果
          this.$emit('uploadResult', JSON.stringify(res.content.content))
          console.log(this.fileList)
        } else {
          this.showMsg(res.msg, 'warning')
        }
      }
    },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${ file.name }?`)
    // },
    // 删除附件
    async handleRemove(file, fileList) {
      // 如果文件已经是上传到服务器，才需要进行删除
      if (file.status == 'success') {
        const res = await this.postJson('common', {
          apiCode: 200006,
          content: {id: file.id}
        })
        this.loading = false
        if (res.code == 0) {
          this.fileList = []
          this.showMsg('删除成功')
        } else {
          this.showMsg(res.msg, 'warning')
        }
      }
    },
    handlePreview(file) {
      // 如果文件的图片的话，点击之后可以预览
      if (['png', 'jpg', 'jpeg'].includes(file.name.split('.')[1])) {
        this.dialogImageUrl = file.url
        this.dialogImgVisible = true
      }
    },
    handleExceed(files, fileList) {
      if (this.isMultiple) {
        this.showMsg(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件`, 'warning')
      } else {
        this.showMsg(`当前限制选择 1 个文件`, 'warning')
      }
    },
    handleTabsClick(tab) {
      if (tab.index == 1) {
        this.getHistory()
      }
    },
    async getHistory() {
      const res = await this.postJson('common', {apiCode: 200005, content: this.api})
      console.log(res.content.dataList)
      this.hisList = res.content.dataList
    },
    downFile(val) {
      window.open(val.row.httpUrl, 'blank')
      this.getHistory()
    },
    async deleteFile(id) {
      const flag = await this.$confirm(`确定移除?`)
      if (flag == 'confirm') {
        const res = await this.postJson('common', {
          apiCode: 200006,
          sysModule: 'station',
          content: {id}
        })
        if (res.code == 0) {
          this.hisList = this.hisList.filter(file => {
            console.log(file)
            return file.id != id
          })
          this.showMsg('删除成功')
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .upload-modal {
    .el-dialog {
      .el-dialog__body {
        padding: 10px 15px;
      }
      .el-dialog__header {
        padding: 10px 20px 10px;
        border-bottom: 1px solid $border-color;
      }
      .el-tabs__nav-scroll {
        background: none;
      }
    }
  }

</style>