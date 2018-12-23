<template>
  <Tabs class="_blue-header" type="border-card" v-if="showContent">
    <TabPane label="业务详情">
      <Form :model="Obj" :rules="ruleInline" ref="Obj" label-width="200px" class="Obj ruleForm">
        <h3>
          {{Obj.title?Obj.title:'站点基本信息'}}
        </h3>

        <FormItem label="站点编号" prop="stationInfosArr">
          <Select reserve-keyword
                  v-model="Obj.stationInfosArr"
                  :disabled="!editableObj.stationCodes.editable"
                  multiple
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  :loading="loading">
            <Option v-for="(option, index) in options1"
                    :disabled="option.status == 'cancel'"
                    :key="index"
                    :value="option.value"
                    :label="option.label">
            </Option>
          </Select>
        </FormItem>
        <!-- 处理和附件 -->
        <h3>
          处理意见
        </h3>
        <!-- style="min-width: 800px;"  -->
        <Table :loading="loading" :height="200" border ref="history"
                :data="historyData" v-if="historyData.length">
          <TableColumn type="expand">
            <template slot-scope="scope">
              <span>意见: {{scope.row.changeThing ? scope.row.changeThing : '--'}}</span>
            </template>
          </TableColumn>
          <TableColumn label="序号" type="index"></TableColumn>
          <TableColumn label="步骤名" prop="nodeName"></TableColumn>
          <TableColumn label="处理人" prop="acceptByName"></TableColumn>
          <TableColumn label="下一步" prop="toNodeName"></TableColumn>
          <TableColumn label="处理意见" prop="content"></TableColumn>
          <TableColumn label="处理时间" prop="finishDate">
            <template slot-scope="scope">
              <span>{{scope.row.finishDate | ToDate}}</span>
            </template>
          </TableColumn>
        </Table>
        <FormItem label="意见内容" class="mt12">
          <Input type="textarea" :autosize="true" v-model="Obj.flow.content" :maxlength='100'/>
        </FormItem>
        <FormItem label="附件信息">
          <ModalUpload class="" :api="uploadConf" :isMultiple="true">
            <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
          </ModalUpload>
        </FormItem>
        <FormItem>
          <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"
                 @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                 @vertify="checkForm" ref="chuliBtn"></Chuli>
        </FormItem>
      </Form>
    </TabPane>
    <TabPane label="流程图">
      <Mysteps :nodeList='nodeList'></Mysteps>
    </TabPane>
  </Tabs>
</template>

<script>
import ModalUpload from '@/components/upload/modalUpload/ModalUpload'
import Chuli from '@/components/chuli/Chuli'
import Mysteps from '@/components/mysteps/MySteps'

export default {
  name: 'TodosClearProof',
  components: {
    ModalUpload,
    Chuli,
    Mysteps
  },
  data() {
    return {
      instanceId: JSON.parse(sessionStorage.getItem('todosClearProof')) ? JSON.parse(sessionStorage.getItem('todosClearProof')).instanceId : '',
      spinShow: false,
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      // 是否禁用图片修改
      isDisabled: true,
      historyFileData: [],
      ruleInline: {
        stationInfosArr: [
          {required: true, type: 'array', message: '站点编号不能为空', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {
        stationInfosArr: [],
        stationCodes: '',
        flow: {
          content: ''
        }
      },
      resetObj: {},
      // 流程图跳线
      nodeList: [],
      // 加载状态
      loading1: false,
      options1: [],
      // 表格加载
      loading: false,
      // 上传附件基本配置
      conf: {
        // tooltips: [1, 2],
        uploadUrl: ''
      },
      tabsIndex: 1, // tab切换，默认第一个
      showContent: false,
      // 表格内容信息
      data1: [],
      // 第一个步骤，起始节点
      beginNode: '',
      currentNodeCode: '',
      // 可编辑对象
      editableObj: null,
      historyData: []
    }
  },
  methods: {
    // 站点编号后台请求
    remoteMethod(query) {
      if (query !== '') {
        this.loading1 = true
        this.postJson('station', {
          apiCode: 300019,
          content: {
            searchKey: query
          }
        }).then(res => {
          if (res.code == 0) {
            this.loading1 = false
            this.options1 = res.content.map(v => {
              return {
                label: `${v.station_code}-${v.status_name}-${v.name_x}`,
                value: `${v.station_code}-${v.status_name}-${v.name_x}`,
                status: v.station_status
              }
            })
          }
        })
      } else {
        this.options1 = []
      }
    },
    // vertify点击提交按钮时验证
    checkForm() {
      this.$refs['Obj'].validate((valid) => {
        if (valid) {
          this.$refs['chuliBtn'].showSteps()
        } else {
          this.showMsg('请输入正确的必填信息', 'error')
        }
      })
    },
    // 提交到不同业务的按钮点击结果
    chuliConfirm(val) {
      this.Obj.flow.toNodeCode = val.nextInfo.toNodeCode
      this.Obj.flow.toNodeName = val.nextInfo.toNodeName
      if (val.nextInfo.acceptById) {
        this.Obj.flow.acceptByName = val.nextInfo.acceptByName
        this.Obj.flow.acceptById = val.nextInfo.acceptById
      }
      this.Obj.flow.sendMsg = val.nextInfo.sendMsg
      this.Obj.flow.showDetail = val.nextInfo.showDetail
      this.Obj.nodeBo = val.nodeBo
      this.Obj.flow.acceptByName = val.nodeBo.acceptByName
      this.Obj.flow.acceptById = val.nodeBo.acceptById
      this.Obj.flow.acceptByType = val.nodeBo.acceptByType
      // 提交到后台
      this.save()
    },
    // 最底部按钮
    save(draft) {
      this.Obj.stationCodesArr = []
      this.Obj.stationInfosArr.map(item => {
        this.Obj.stationCodesArr.push(item.slice(0, 8))
      })
      if (this.Obj.stationCodesArr && this.Obj.stationCodesArr.length > 0) {
        this.Obj.flow.bizKey = this.Obj.stationCodesArr.join(',')
        this.Obj.flow.draft = draft ? 'true' : 'false'
        // 固定写死
        this.Obj.flow.sysModule = 'station'
        this.Obj.flow.processMode = 'web'
        this.spinShow = true
        let obj = JSON.parse(JSON.stringify(this.Obj))
        obj.stationCodes = obj.stationCodesArr.join(',')
        obj.stationInfos = obj.stationInfosArr.join(',')
        delete obj.stationCodesArr
        delete obj.stationInfosArr
        this.postJsonWithMask('common', {
          apiCode: 200111,
          content: obj
        }).then(res => {
          this.spinShow = false
          if (res.code == 0) {
            this.showMsg(`${draft ? '暂存' : '提交'}成功`)
            this.$router.go(-1)
          }
        })
      } else {
        this.showMsg('请检查/输入正确的站点编号', 'warning')
      }
    },
    // 获取流程图
    getFlowInfo(flowId) {
      this.postJson('common', {
        apiCode: 200053,
        content: {
          flowId,
          sysModule: 'station'
        }
      }).then(res => {
        const nodelist = res.content.nodeList
        console.log(nodelist)
        this.beginNode = nodelist.filter(v => {
          return v.code.includes('begin')
        })[0]
        this.nodeList = nodelist
        this.Obj.flow.fromNodeCode = nodelist[1].code
        this.Obj.flow.fromNodeName = nodelist[1].nameX
        this.Obj.flow.toNodeCode = nodelist[2].code
        this.Obj.flow.toNodeName = nodelist[2].nameX
        this.Obj.flow.acceptByName = nodelist[2].acceptByName
        this.Obj.flow.acceptById = nodelist[2].acceptById
        this.Obj.flow.acceptByType = nodelist[2].acceptByType.value
        this.resetObj = JSON.parse(JSON.stringify(this.Obj))
      })
    },
    // 获取可编辑字段列表
    getEdiableList(flowId) {
      this.postJson('common', {
        apiCode: 200116,
        content: {
          flowId
        }
      }).then(res => {
        console.log(res.content)
        const list = res.content
        this.editableObj = list.filter(v => {
          return v.nodeCode == this.currentNodeCode
        })[0].fieldDetails
        console.log(this.editableObj)
      })
    },
    setNodeList(res) {
      const nodelist = res.content.flowDiagram.nodeList
      this.nodeList = nodelist
      console.log(nodelist)
      const currentNodeInfo = nodelist.filter(v => {
        return v.code == this.currentNodeCode
      })[0]
      // this.Obj.flow.acceptByName = currentNodeInfo.acceptByName
      // this.Obj.flow.acceptById = currentNodeInfo.acceptById
      // this.Obj.flow.acceptByType = currentNodeInfo.acceptByType.value
      this.fromNodeCode = nodelist[1].code
      this.uploadConf.hostBizId = `${currentNodeInfo.instanceId}$${this.flowCode}$${this.currentNodeCode}`
    },
    setFlowFile(fileList) {
      if (fileList.length === 0) {
        return
      }
      this.historyFileData = []
      let uid = this.$store.state.uid
      fileList.forEach(file => {
        let fileType = file.extInfo
        if (fileType) {
          this.$refs[fileType].base64str = file.showUrl
          // 设置图片是否可编辑
          if (uid == file.createBy) {
            this.$refs[fileType].isDisabledPic = false
          }
        } else {
          this.historyFileData.push(file)
        }
      })
    },
    // 改变处理状态，并获取相关业务信息
    getFlowDetail(flowId, bizId, waitTaskId, instanceId) {
      this.spinShow = true
      this.postJsonWithMask('common', {
        apiCode: 200110,
        content: {flowId, bizId, waitTaskId, instanceId}
      }).then(res => {
        this.spinShow = false
        if (res.code == 0) {
          // this.showMsg('数据加载成功')
          console.log('我是该流程的相关信息')
          console.log(res)
          this.historyData = res.content.finishList
          this.setNodeList(res)
          this.setFlowFile(res.content.filesList)
          let obj = res.content.bizObject
          for (let key in obj) {
            if (obj[key] != null) {
              this.Obj[key] = obj[key]
            }
          }
          this.$set(this.Obj, 'stationCodesArr', this.Obj.stationCodes.split(','))
          this.$set(this.Obj, 'stationInfosArr', this.Obj.stationInfos.split(','))
          this.options1 = []
          this.Obj.stationInfosArr.forEach((val) => {
            this.options1.push({
              label: val,
              value: val
            })
          })
          this.showContent = true
        }
      })
    }
  },
  mounted() {
    const buz = JSON.parse(sessionStorage.getItem('todosClearProof'))
    console.log(buz)
    const {flowId, flowName, flowCode, bizId, instanceId, id, nodeCode, nodeName} = buz
    this.flowCode = flowCode
    this.Obj.flowId = flowId
    this.Obj.title = flowName
    this.currentNodeCode = nodeCode
    this.Obj.nodeBo = {}
    this.Obj.nodeBo.instanceId = instanceId
    this.Obj.flow = {content: ''}
    this.Obj.flow.instanceId = instanceId
    this.Obj.flow.bizId = bizId
    this.Obj.flow.waitTaskId = id
    this.Obj.flow.fromNodeCode = nodeCode
    this.Obj.flow.fromNodeName = nodeName
    this.Obj.flow.bizTitle = flowName
    this.Obj.flow.flowId = flowId
    this.Obj.flow.agreed = true + '' // 是否同意，默认同意
    this.Obj.flow.flowName = flowName
    // 获取可编辑字段
    this.getEdiableList(flowId)
    // 改变处理状态，并获取相关业务信息
    this.getFlowDetail(flowId, bizId, id, instanceId)
  }
}
</script>

<style scoped>

</style>