<template>
  <Tabs class="_blue-header" type="border-card" v-if="showContent">
    <TabPane label="业务详情">
      <Form :model="Obj" :rules="ruleInline" ref="Obj" label-width="200px" class="Obj ruleForm">
        <h3>
          申请人信息
        </h3>
        <FormItem label="申请人姓名">
          <Input v-model="Obj.principal" :disabled="!editableObj.principal.editable" :maxlength='10'/>
        </FormItem>
        <FormItem label="移动电话">
          <Input v-model="Obj.mobile" :disabled="!editableObj.mobile.editable" :maxlength='11'/>
        </FormItem>
        <FormItem label="身份证号码">
          <Input v-model="Obj.idCard" :disabled="!editableObj.idCard.editable" :maxlength='18'/>
        </FormItem>
        <h3>
          站点基本信息
        </h3>
        <FormItem label="投注站点号" prop="stationCode">
          <Select v-model="Obj.stationCode" filterable remote :remote-method="getStationList"
                  :loading="loadingStation" @change="queryStationInfo" clearable
                  :disabled="!editableObj.stationCode.editable">
            <Option v-for="(station, index) in stationList"
                    :disabled="station.station_status == 'cancel'"
                    :key="index"
                    :value="station.station_code"
                    :label="`${station.station_code}-${station.status_name}-${station.name_x}`">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="原销售限额">
          <Input v-model="Obj.oldAccountLimit" :disabled="!editableObj.oldAccountLimit.editable" :maxlength='10'/>
        </FormItem>
        <FormItem label="投注站地址">
          <Input v-model="Obj.address" :disabled="!editableObj.address.editable" :maxlength='50'/>
        </FormItem>
        <FormItem label="申请销售限额" prop="newAccountLimit">
          <Input v-model="Obj.newAccountLimit" :disabled="!editableObj.newAccountLimit.editable" :maxlength='10'/>
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
          <ModalUpload class="" :api="uploadConf" :isMultiple="true"
                      :historyFileList="historyFileData" :isQueryHis="false">
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
      <Mysteps :nodeList='nodeList' :currentNodeCode="currentNodeCode"></Mysteps>
    </TabPane>
  </Tabs>
</template>

<script>
import ModalUpload from '@/components/upload/modalUpload/ModalUpload'
import Chuli from '@/components/chuli/Chuli'
import Mysteps from '@/components/mysteps/MySteps'

export default {
  name: 'TodosStationRelexSaleApply',
  components: {
    ModalUpload,
    Chuli,
    Mysteps
  },
  data() {
    const isMPNumber = (rule, value, callback, source, options) => {
      console.log(this.obj)
      if (value == '-') {
        this.Obj.newAccountLimit = 0
        callback()
      } else if (this.Regexp.isMPNumber(value * 1)) {
        this.Obj.newAccountLimit = -Math.abs(value)
        console.log(this.Obj.newAccountLimit)
        callback()
      } else {
        callback(new Error('只支持数字'))
      }
    }
    return {
      instanceId: JSON.parse(sessionStorage.getItem('todosStationRelexSaleApply')) ? JSON.parse(sessionStorage.getItem('todosStationRelexSaleApply')).instanceId : '',
      spinShow: false,
      currentNodeCode: '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      // 是否禁用图片修改
      isDisabled: true,
      historyFileData: [],
      ruleInline: {
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: 'change'},
          {min: 8, message: '编号长度为8位', trigger: 'blur'}
        ],
        newAccountLimit: [
          {required: true, message: '销售限额不能为空'},
          {validator: isMPNumber, message: '销售限额只能输入数字', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {
        stationCode: '',
        principal: '',
        mobile: '',
        idCard: '',
        address: '',
        oldAccountLimit: '',
        newAccountLimit: '',
        flow: {content: ''}
      },
      // 站点编号集合
      stationList: [],
      // 流程图跳线
      nodeList: [],
      // 表格加载
      loading: false,
      // 内容区域开关
      showContent: false,
      // 第一个步骤，起始节点
      beginNode: '',
      loadingStation: false,
      // 可编辑对象
      editableObj: null,
      historyData: []
    }
  },
  methods: {
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
      this.Obj.flow.bizKey = this.Obj.stationCode
      this.Obj.flow.draft = draft ? 'true' : 'false'
      // 固定写死
      this.Obj.flow.sysModule = 'station'
      this.Obj.flow.processMode = 'web'
      this.spinShow = true
      this.postJsonWithMask('common', {
        apiCode: 200111,
        content: this.Obj
      }).then(res => {
        this.spinShow = false
        if (res.code == 0) {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.$router.go(-1)
        }
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
    // 获取站点类型列表
    getStationList(sCode) {
      this.postJson('station', {
        apiCode: 300019,
        content: {
          searchKey: sCode
        }
      }).then(res => {
        if (res.code == 0) {
          this.stationList = res.content
        }
      })
    },
    // 改变站点编号时，获取站点详情
    queryStationInfo() {
      if (!this.Obj.stationCode) {
        return
      } else {
        this.Obj.oldAccountLimit = ''
        this.Obj.principal = ''
        this.Obj.mobile = ''
        this.Obj.idCard = ''
        this.Obj.address = ''
        this.postJson('biz', {
          apiCode: 200001,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code == 0) {
            let response = res.content
            console.log(response)
            this.Obj.oldAccountLimit = response.accountLimit
            this.Obj.principal = response.responsor
            this.Obj.mobile = response.cellPhone
            this.Obj.idCard = response.idCard
            this.Obj.address = response.address
          }
        })
      }
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
              this.Obj[key] = (obj[key] + '')
            }
          }
          console.log(this.Obj)
          this.showContent = true
        }
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
      // this.fromNodeCode = nodelist[1].code
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
    }
  },
  mounted() {
    const buz = JSON.parse(sessionStorage.getItem('todosStationRelexSaleApply'))
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