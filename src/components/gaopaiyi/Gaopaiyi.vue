<!--
厦门哲林高拍仪
型号：YR-1000A3S
-->
<template>
  <div class="gaopaiyi" :class="isDisabledPic ? 'gaopaiyi_disabled' : ''">
    <Upload :before-upload="handleUpload"
            accept="image/*" action="https://www">
      <Button class="openCaptureBtn openfile" :disabled="isDisabledPic" type="primary">本地</Button>
    </Upload>
    <Button @click="open1" class="openCaptureBtn upload" :disabled="isDisabledPic" type="primary">打开</Button>
    <Button @click="upload" class="openCaptureBtn" :disabled="isDisabledPic" type="primary">上传</Button>
    <img class="preview_img" alt="" :src="base64str">
    <!--点击导出，弹出框-->
    <Dialog :visible.sync="showModalFlag" title="获取图片" width="500"
            :append-to-body="true">
      <p slot="close" style="text-align:center; margin-top: 10px;">
        <Icon type="close" color="#999"></Icon>
      </p>
      <div class="demo-spin-article">
        <div class="">
          <object id="Capture" style="width: 400px;height: 300px;" align="middle" v-if="!isIdcard"
                  classid="clsid:9A73DB73-2CA3-478D-9A3F-7E9D6A8D327C"></object>
          <object id="idCard" style="width: 400px;height: 300px;" align="middle" v-if="isIdcard"
                  classid="clsid:9A73DB73-2CA3-478D-9A3F-7E9D6A8D327C"></object>
        </div>
        <!--<Spin size="large" fix v-show="spinShow">加载中...</Spin>-->
      </div>
      <div slot="footer">
        <Button type="ghost" @click="cancel">关闭</Button>
        <Button type="primary" @click="takePic" :disabled="!isInitFinished">拍照</Button>
      </div>

    </Dialog>
  </div>
</template>

<script>

import {mapMutations} from 'vuex'

export default {
  name: 'dataDicEdit',
  props: {
    // flowCode: {
    //   type: String,
    //   default: ''
    // },
    // flowNodeCode: {
    //   type: String,
    //   default: ''
    // },
    isIdcard: {
      type: Boolean,
      default: false
    },
    uploadConf: {
      type: Object,
      default: function () {
        return {}
      }
    },
    imgType: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDisabledPic: this.isDisabled,
      spinShow: true,
      showModalFlag: false,
      Capture: {},
      base64str: '',
      isInitFinished: false,
      fileName: '',
      uploadObj: {
        apiCode: 200075,
        content: {imgStr: '', sysModule: 'flow', hostBizObj: 'flow_files', hostBizId: '1', remark: '', type: ''}
      }
    }
  },
  methods: {
    ...mapMutations({
      setGpy: 'SET_GPY'
    }),
    hideModal() {
      this.showModalFlag = false
    },
    // 上传图片
    upload() {
      if (!this.fileName) {
        this.showMsg('请选择上传图片', 'error')
        return
      }
      // this.$emit('imgStr', {
      //   type: 'upload',
      //   data: this.base64str
      // })
      // const userId = JSON.parse(sessionStorage.getItem('login')).uid
      this.uploadObj.content.hostBizId = this.uploadConf.hostBizId
      this.uploadObj.content.imgStr = this.base64str
      this.uploadObj.content.hostBizObj = this.uploadConf.hostBizObj
      this.uploadObj.content.type = this.imgType
      this.uploadObj.content.fileName = this.fileName

      console.log(this.uploadObj.content)
      this.postFile('postImg', this.uploadObj, []).then(res => {
        if (res.code === '0') {
          this.showMsg('上传成功')
          // 上传结果
          // this.$emit('uploadResult', 123)
        }
      })
    },
    async open1() {
      this.showModalFlag = true
      setTimeout(() => {
        let timer = setInterval(() => {
          console.log('我是定时器')
          const flag = this.isIdcard ? 'idCard' : 'Capture'
          var domExit = document.getElementById(flag)
          if (domExit) {
            clearInterval(timer)
            this.captureInit()
            this.spinShow = false
          }
        }, 100)
      }, 4000)
    },
    open() {
      // this.captureInit()
      // setTimeout(() => {
      this.gpy.OpenDevice(1)
      // }, 2000)
      // let ResSelect
      // let iDeviceIndex = 0
      // let that = this
      //
      // function OpenDevice(value) {
      //   var iType = parseInt(value)
      //   let iDeviceIndex = iType
      //   if (that.Capture.OpenDevice(iDeviceIndex) === 0) {
      //     alert('启动设备' + iType.toString() + '成功')
      //     that.Capture.SetCameraExposure(iDeviceIndex, 10) // 设置自动曝光
      //     FillInRes()
      //     var iW = that.Capture.GetResolutionWidth(iDeviceIndex, -1)
      //     var iH = that.Capture.GetResolutionHeight(iDeviceIndex, -1)
      //     var strRes = iW.toString() + '*' + iH.toString()
      //     for (var iDx = 0; iDx < ResSelect.length; iDx++) {
      //       if (strRes === ResSelect.options[iDx].text) {
      //         ResSelect.selectedIndex = iDx
      //         break
      //       }
      //     }
      //   } else {
      //     alert('启动设备' + iType.toString() + '失败')
      //   }
      // }
      //
      // // 读取分辨率列表
      // function FillInRes() {
      //   var iResVecLenth = ResSelect.options.length
      //   var iResWidth = 0
      //   var iResHeight = 0
      //   for (var i = 0; i < iResVecLenth; i++) {
      //     ResSelect.options.remove(0) // 清除分辨率select选项内容
      //   }
      //   iResVecLenth = that.Capture.GetResolutionCount(iDeviceIndex)
      //   for (var j = 0; j < iResVecLenth; j++) {
      //     iResWidth = that.Capture.GetResolutionWidth(iDeviceIndex, j)
      //     iResHeight = that.Capture.GetResolutionHeight(iDeviceIndex, j)
      //     var strRes = iResWidth.toString() + '*' + iResHeight.toString()
      //     var resopp = new Option(strRes, j.toString())
      //     ResSelect.add(resopp)
      //   }
      // }
      //
      // OpenDevice(1)
    },
    cancel() {
      this.spinShow = true
      this.showModalFlag = false
    },
    takePic() {
      this.showModalFlag = true
      const base64 = this.Capture.GetBase64String()
      this.base64str = `data:image/png;base64,${base64}`
      this.$emit('imgStr', {
        type: 'preview',
        data: this.base64str
      })
      this.gpy.CloseDeviceEx()
      this.spinShow = true
      this.showModalFlag = false
    },
    async captureInit() {
      const gpy = this.gpy
      try {
        const flag = this.isIdcard ? 'idCard' : 'Capture'
        const Capture = this.Capture = document.getElementById(flag) // 根据js的脚本内容，必须先获取object对象
        this.isInitFinished = await gpy.init(Capture)
        if (this.isInitFinished) {
          if (this.isIdcard) {
            gpy.OpenDevice(0)
          } else {
            gpy.OpenDevice(1)
          }
        }
      } catch (err) {
        console.log('未找到ICaptureVideo.ocx控件，请重新安装')
      }
    },
    handleUpload(file) {
      let fileName = file.name
      this.fileName = fileName
      // this.file = file;
      var reader = new FileReader()
      reader.readAsDataURL(file)
      let that = this
      reader.onload = function (e) {
        that.base64str = this.result
      }
      return false
    }
  },
  components: {},
  mounted() {
  },
  activated: function () {
  }
}
</script>

<style lang="scss" scoped>
  .gaopaiyi {
    width: 224px;
    width: 100%;
    height: 128px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
  }

  .openCaptureBtn {
    position: absolute;
    right: 4px;
    bottom: 4px;
    &.upload {
      bottom: 40px;
    }
    &.openfile {
      bottom: 80px;
    }
  }

  .maskright {
    position: absolute;
    right: -105%;
    top: 0;
    background: red;
  }

  .idCard {
    width: 800px;
    height: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
  }

  .open {
    position: absolute;
    right: 10px;
    bottom: 4px;
  }

  .mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .preview_img {
    width: 180px;
    height: 128px;
    margin-left: 0%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .ivu-upload {
    height: 0px !important;
    width: 0px !important;
  }

  .gaopaiyi_disabled {
    background-color: #f3f3f3;
  }

</style>

