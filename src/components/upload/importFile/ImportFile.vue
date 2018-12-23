<!--
导入组件（点击后为模态对话框，可查导入记录）
-->

<template>
  <!--<div>-->
  <div style="display: inline-block;">
    <Button type="primary" icon="el-icon-upload" @click="dialogModal = true" :style="btnStyle">导入
    </Button>

    <Dialog class="upload-modal" title="上传附件" :visible.sync="dialogModal" width="800px">
      <Tabs v-model="activeName" @tab-click="handleTabsClick">

        <TabPane label="选择附件" name="first">
          <div class="mt12" v-for="item in conf.tooltips" v-if="conf.tooltips.length">{{item}}</div>
          <div class="mt12" v-if="!conf.tooltips">提示：一次只能导入一个文件</div>
          <div class="mt10" v-if="!conf.tooltips">类型：可用文件格式 xlsx</div>
          <div class="mt10 mb12" v-if="!conf.tooltips">附件模板：<a @click="download"
                                                               style="color: #2b85e4;cursor: pointer;">点击下载导入模板</a>
          </div>
          <div v-if="showAreaSelect">
            所在区域:
            <div style="display: inline-block;width: 150px;">
              <AreaCascader :stage="1" :selectstageFlag="true" :allFlag="true"
                            @sendToAreaSelect="getValFromAreaCascader"></AreaCascader>
            </div>
          </div>
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

            <div slot="tip" class="el-upload__tip">
              <slot name="warnTxt"></slot>
            </div>
          </Upload>

          <!--<Form :model="form" class="mt12">-->
          <!--<FormItem label="附件描述" :label-width="'80px'">-->
          <!--<Input v-model="form.remark"></Input>-->
          <!--</FormItem>-->
          <!--</Form>-->

        </TabPane>

        <TabPane label="查看记录" name="second">
          <Table stripe
                 :data="hisList"
                 height="250"
                 border
                 v-show="!detailFlag"
                 style="width: 100%">
            <TableColumn
               label="序号"
               type="index"
               width="50">
            </TableColumn>
            <TableColumn prop="status" label="导入状态" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.importStatus">成功</span>
                <span v-else>失败</span>
              </template>
            </TableColumn>
            <TableColumn prop="detail" label="导入详情">
              <template slot-scope="scope">
                <span @click="toDetail(scope.row)" style="color: #2b85e4;cursor: pointer;">详情</span>
              </template>
            </TableColumn>
            <TableColumn prop="createDate" label="导入日期"></TableColumn>
            <TableColumn prop="createByName" label="导入人"></TableColumn>
          </Table>
          <div v-show="detailFlag" style="min-height: 200px">
            <p style="font-size: 14px;margin-bottom: 10px;">{{detailTime}}
              <span style="float: right;">
              <Button size="small" type="primary" @click="detailFlag=false">返回列表</Button>
            </span>
            </p>
            <div v-html="detailContent"></div>
          </div>
        </TabPane>

      </Tabs>
      <!--底部按钮-->
      <div slot="footer" class="dialog-footer">
        <Button @click="dialogModal = false">关 闭</Button>
        <Button style="margin-left: 10px;"
                type="success"
                :loading="loading"
                @click="submitUpload" v-if="activeName=='first'">确认上传
        </Button>
      </div>
    </Dialog>

    <Dialog :visible.sync="dialogImgVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </Dialog>
  </div>
</template>

<script>
import AreaCascader from '@/components/areaCascader/AreaCascader'

export default {
  name: 'ImportFile',
  components: {
    AreaCascader
  },
  props: {
    showAreaSelect: {
      type: Boolean,
      default: false
    },
    conf: {
      tooltips: []
    },
    btnStyle: '',
    //  提示文字
    maxSize: {
      type: [Number, String],
      default: 500 // 文件大小，默认500kb 单位:kb
    },
    // api: {
    //   type: [Object],
    //   default: function () {
    //     return {}
    //   } // 上传的接口
    // },
    uploadApiCode: {
      type: Number
    },
    downloadObj: {
      type: Object
    },
    recordObj: {
      type: Object
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
      detailTime: '2018-07-04 15:12', // 详情时间
      detailContent: '导入成功0条，导入失败1<br/>[][导入机顶盒[41010189]错误信息：所属站点编号不存在或者机顶盒编码已经存在。<br/>]', // 详情内容
      detailFlag: false, // 展示详情还是table   false-table；true-detail
      uploadObj: {
        apiCode: this.uploadApiCode,
        content: {}
      },
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
    getValFromAreaCascader(val) {
      console.log('我是从子组件获取的结果', val)
      const {regionCode, regionName} = val
      if (regionCode && regionName) {
        this.uploadObj.content = {
          regionCode, regionName
        }
      } else {
      }
    },
    toDetail(row) {
      console.log(row)
      this.detailTime = row.createDate
      this.detailContent = row.importDetail
      this.detailFlag = true
    },
    // 下载附件模板
    async download() {
      var newTab = window.open('about:blank')
      console.log(this.downloadObj)
      console.log(this.recordObj)
      const res = await this.postJson('common', {
        apiCode: 200002, content: {
          sysModule: this.downloadObj.sysModule ? this.downloadObj.sysModule : this.recordObj.sysModule,
          hostBizObj: this.downloadObj.hostBizObj,
          hostBizId: this.downloadObj.hostBizId
        }
      })
      if (res.code === '0') {
        console.log(res)
        newTab.location.href = res.content[0].httpUrl
        // setTimeout(function () {
        //   newTab.close()
        // }, 500)
      } else {
        Message.warning({
          content: '获取附件失败！',
          duration: 5,
          closable: true
        })
      }
    },
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
        console.log(this.uploadObj)
        // this.api.remark = this.form.remark
        const res = await this.postFile(this.recordObj.sysModule, this.uploadObj, this.filesArr)
        console.log(res)
        this.loading = false
        if (res.code == 0) {
          this.form.remark = ''
          this.fileList = []
          // this.filesArr.forEach((v, index) => {
          //   this.fileList.push({
          //     id: res.content.content[index].id,
          //     name: v.name,
          //     url: res.content.content[index].showUrl
          //   })
          // })
          // this.fileName = str
          this.filesArr = []
          this.showMsg('导入成功')
          // 上传结果
          this.$emit('uploadResult', JSON.stringify(res.content.content))
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
      // ben注释，对照河南导入版本
      // const res = await this.postJson('common', {apiCode: 200005, content: this.api})
      // ben修改的，改成河南对应版本导入
      const flag = this.recordObj.sysModule === 'station' ? '' : this.recordObj.sysModule
      const res = await this.postJson(flag, {
        apiCode: this.recordObj.apiCode, content:
          {
            sysModule: this.recordObj.sysModule,
            tableName: this.recordObj.tableName
          }
      })
      console.log(res.content.dataList)
      this.hisList = res.content.dataList
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
      .el-dialog__footer {
        padding: 10px 20px 38px; // zfSale 使用导入时候，关闭、确认上传按钮位置样式不对，固注释掉上方的padding，做了本修改
      }
      .el-tabs__nav-scroll {
        background: none;
      }
    }
  }

</style>