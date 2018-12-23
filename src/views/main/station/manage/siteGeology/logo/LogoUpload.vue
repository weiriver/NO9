<template>
  <div>
    <!--<Upload style="display: inline-block;"-->
    <!--:max-size="48"-->
    <!--ref="upload"-->
    <!--:before-upload="beforeUpload"-->
    <!--action=""-->
    <!--:multiple="false"-->
    <!--:auto-upload="false"-->
    <!--:file-list="fileList"-->
    <!--:show-file-list="false"-->
    <!--&gt;-->
    <!--<Button type="ghost" icon="ios-cloud-upload-outline">{{fileName}}</Button>-->
    <!--<Button type="primary" @click="upload" :loading="loadingStatus">确定上传</Button>-->
    <!--</Upload>-->
    <!--action="https://jsonplaceholder.typicode.com/posts/"-->

    <!--<Upload-->
    <!--class="avatar-uploader"-->
    <!--:auto-upload="false"-->
    <!--:show-file-list="false"-->
    <!--:on-success="handleAvatarSuccess"-->
    <!--:before-upload="beforeUpload">-->
    <!--<img v-if="imageUrl" :src="imageUrl" class="avatar">-->
    <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
    <!--<Button type="primary" @click="upload" :loading="loadingStatus">确定上传</Button>-->
    <!--</Upload>-->
    <Upload
       class="upload-demo"
       ref="upload"
       :before-upload="beforeUpload"
       action="https://jsonplaceholder.typicode.com/posts/"
       :on-preview="handlePreview"
       :on-remove="handleRemove"
       :on-change="filesChange"
       :on-exceed="filesExceed"
       :file-list="fileList"
       :limit="1"
       :auto-upload="false">
      <Button slot="trigger" size="small" type="primary">选取文件</Button>
      <Button style="margin-left: 10px;" type="success" @click="submitUpload" :disabled="!fileIsReady">上传到服务器</Button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </Upload>
  </div>
</template>

<script>
export default {
  name: 'LogoUpload',
  data() {
    return {
      imageUrl: '',
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
        // ,
        // {
        //   name: 'food2.jpeg',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      fileName: '请选择上传的文件',
      filesArr: [],
      loadingStatus: false,
      fileIsReady: false
    }
  },
  methods: {
    // 文件超出限制数量的时候，提示
    filesExceed() {
      this.showMsg('最多只能上传一个文件', 'warning')
    },
    // 每次文件变化的时候，进行文件校验
    filesChange() {
      this.beforeUpload(this.$refs.upload.uploadFiles[0].raw)
    },
    // 移除操作
    handleRemove(file, fileList) {
      this.fileIsReady = false
    },
    // 预览操作
    handlePreview(file) {
    },
    // 文件上传的时候，进行校验
    async beforeUpload(file) {
      this.fileIsReady = await this.checkFile(file)
      return this.fileIsReady
    },
    // 验证文件大小和格式
    checkFile(file) {
      return new Promise((resolve, reject) => {
        if (file.size / 1000 > 500) {
          this.showMsg('文件容积太大', 'warning')
          resolve(false)
        } else {
          let validFileName = ['jpg', 'bmp', 'png']
          let index = file.name.lastIndexOf('.') + 1
          let fileSuffix = file.name.substr(index)
          if (validFileName.includes(fileSuffix)) {
            resolve(true)
          } else {
            this.showMsg('文件类型只支持： jpg, bmp, png', 'warning')
            resolve(false)
          }
        }
      })
    },
    // 上传附件到服务器
    async submitUpload() {
      this.loadingStatus = true
      let readyFile = this.$refs.upload.uploadFiles[0]
      let flag = await this.checkFile(readyFile)
      if (flag) {
        console.log(this.filesArr)
        console.log(this.$refs.upload)
        const res = await this.postFile('', {
          apiCode: 200007,
          content: {sysModule: 'station', hostBizObj: 'station_flag', hostBizId: '1'}
        }, [readyFile])
        if (res.code == 0) {
          this.loadingStatus = false
          // this.fileName = '请选择上传的文件'
          this.showMsg('上传成功', 'success')
          this.fileIsReady = false
          this.fileList = []
          // 上传结果
          this.$emit('uploadResult', '上传成功')
        } else {
          this.showMsg(res.msg, 'warning')
        }
      }

    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>