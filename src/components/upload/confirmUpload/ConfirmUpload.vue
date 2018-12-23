<!--
上传组件（右侧带‘确认上传’按钮）
-->
<template>
  <div>
    <Upload
       class="confirm-upload"
       action=""
       ref="upload"
       :on-preview="handlePreview"
       :on-remove="handleRemove"
       :on-exceed="handleExceed"
       :before-remove="beforeRemove"
       :file-list="fileList"
       :multiple="isMultiple"
       :limit="!isMultiple?1:limit"
       :auto-upload="false">
      <Button slot="trigger" type="primary">选取文件</Button>
      <Button style="margin-left: 10px;"
              type="success"
              :loading="loading"
              @click="submitUpload">确认上传
      </Button>
      <div slot="tip" class="el-upload__tip">
        <slot name="warnTxt"></slot>
      </div>
    </Upload>
    <Dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </Dialog>
  </div>
</template>

<script>
export default {
  name: 'ConfirmUpload',
  props: {
    //  提示文字
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
    apiCode: {
      type: [Number, String],
      default: 200007 // 有的修改是200009 默认都是200007
    },
    isMultiple: {
      type: Boolean,
      default: false // 是否能多附件上传，默认单文件上传
    }
  },
  data() {
    return {
      loading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      filesArr: [],
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // },
        // {
        //   name: 'food2.jpeg',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ]
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
        const res = await this.postFile('files', {
          apiCode: this.apiCode,
          content: this.api
        }, this.filesArr)
        this.loading = false
        if (res.code == 0) {
          // let str = this.filesArr.map(v => v.name).join(',')
          this.fileList = []
          if (this.apiCode != 200009) {
            this.filesArr.forEach((v, index) => {
              this.fileList.push({
                id: res.content.content[index].id,
                name: v.name,
                url: res.content.content[index].showUrl
              })
            })
          }
          // this.fileName = str
          this.filesArr = []
          this.showMsg('上传成功')
          // 上传结果
          this.$emit('uploadResult', JSON.stringify(res.content.content))
          // 关闭弹窗
          // this.$emit('toggleModalFlag', false)
          console.log(this.fileList)
        } else {
          this.showMsg(res.msg, 'warning')
        }
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }?`)
    },
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
        this.dialogVisible = true
      }
    },
    handleExceed(files, fileList) {
      if (this.isMultiple) {
        this.showMsg(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件`, 'warning')
      } else {
        this.showMsg(`当前限制选择 1 个文件`, 'warning')
      }
    }
  }
}
</script>

<style lang="scss">
  .confirm-upload {
    max-width: 400px;
  }
</style>