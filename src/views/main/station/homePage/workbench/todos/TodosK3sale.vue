<template>
  <Tabs class="_blue-header" type="border-card" v-if="showContent">
    <TabPane label="业务详情">
      <Form :model="Obj" :rules="ruleInline" ref="Obj" label-width="200px" class="Obj ruleForm">
        <h3>
          {{Obj.title?Obj.title:'站点基本信息'}}
        </h3>
        <FormItem label="游戏名称">
          <Input value="快三" disabled/>
        </FormItem>
        <FormItem label="站点编号" prop="stationCode">
          <Select v-model="Obj.stationCode"
                  :disabled="!editableObj.stationCode.editable"
                  filterable
                  remote
                  :remote-method="remoteMethod1"
                  placeholder="编号最少8个字"
                  :loading="loading1">
            <Option v-for="(option, index) in options1"
                    :key="index"
                    :value="option.value"
                    :label="option.label"
                    :disabled="option.status == 'cancel'">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="投注权限" prop="wager">
          <Select v-model="Obj.wager" clearable :disabled="!editableObj.wager.editable">
            <Option v-for="item in stationRightPermissionEnum"
                    :key="item.id"
                    :value="item.value"
                    :label="item.text">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="兑奖权限" prop="cash">
          <Select v-model="Obj.cash" clearable :disabled="!editableObj.cash.editable">
            <Option v-for="item in stationRightPermissionEnum"
                    :key="item.id"
                    :value="item.value"
                    :label="item.text">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="注销权限" prop="cancel">
          <Select v-model="Obj.cancel" clearable :disabled="!editableObj.cancel.editable">
            <Option v-for="item in stationRightPermissionEnum"
                    :key="item.id"
                    :value="item.value"
                    :label="item.text">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="代兑费率">
          <Input v-model="Obj.cashCommission"  :maxlength='10'
                  :disabled="!editableObj.cashCommission.editable"/>
        </FormItem>
        <FormItem label="代销费率">
          <Input v-model="Obj.saleCommission" :maxlength='10'
                  :disabled="!editableObj.saleCommission.editable"/>
        </FormItem>
        <FormItem label="市级发行费比率">
          <Input v-model="Obj.stationCityRate"  :maxlength='10'
                  :disabled="!editableObj.stationCityRate.editable"/>
        </FormItem>
        <FormItem label="省级发行费比率">
          <Input v-model="Obj.stationProvRate" :maxlength='10'
                  :disabled="!editableObj.stationProvRate.editable"/>
        </FormItem>
        <FormItem label="中彩福利金比率">
          <Input v-model="Obj.stationZcRate" :maxlength='10'
                  :disabled="!editableObj.stationZcRate.editable"/>
        </FormItem>
        <FormItem label="兑换校验模式">
          <Input v-model="Obj.stationCashMode" :maxlength='10'
                  :disabled="!editableObj.stationCashMode.editable"/>
        </FormItem>
        <FormItem label="注销时间上限">
          <Input v-model="Obj.cancelTimeLimit" :maxlength='10'
                  :disabled="!editableObj.cancelTimeLimit.editable"/>
        </FormItem>
        <FormItem label="注销次数上限">
          <Input v-model="Obj.issueCancelTimes" :maxlength='10'
                  :disabled="!editableObj.issueCancelTimes.editable"/>
        </FormItem>
        <FormItem label="期注销金额上限">
          <Input v-model="Obj.issueCancelMoney" :maxlength='10'
                  :disabled="!editableObj.issueCancelMoney.editable"/>
        </FormItem>
        <FormItem label="单票最小兑换金额">
          <Input v-model="Obj.minCashPerTick" :maxlength='10'
                  :disabled="!editableObj.minCashPerTick.editable"/>
        </FormItem>
        <FormItem label="单票最大兑换金额">
          <Input v-model="Obj.maxCashPerTick" :maxlength='10'
                  :disabled="!editableObj.maxCashPerTick.editable"/>
        </FormItem>
        <FormItem label="单票最小金额">
          <Input v-model="Obj.minMoneyPerTick" :maxlength='10'
                  :disabled="!editableObj.minMoneyPerTick.editable"/>
        </FormItem>
        <FormItem label="单票最大金额">
          <Input v-model="Obj.maxMoneyPerTick" :maxlength='10'
                  :disabled="!editableObj.maxMoneyPerTick.editable"/>
        </FormItem>
        <FormItem label="单票保护金额">
          <Input v-model="Obj.protectMoney" :maxlength='10'
                  :disabled="!editableObj.protectMoney.editable"/>
        </FormItem>
        <FormItem label="最小兑奖奖等">
          <Input v-model="Obj.minWinLevel" :maxlength='10'
                  :disabled="!editableObj.minWinLevel.editable"/>
        </FormItem>
        <FormItem label="最大兑奖奖等">
          <Input v-model="Obj.maxWinLevel" :maxlength='10'
                  :disabled="!editableObj.maxWinLevel.editable"/>
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
                 @vertify="checkForm" ref="chuliBtn" class="mt12"></Chuli>
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
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'TodosK3sale',
  components: {
    ModalUpload,
    Chuli,
    Mysteps
  },
  data() {
    return {
      instanceId: JSON.parse(sessionStorage.getItem('todosK3sale')) ? JSON.parse(sessionStorage.getItem('todosK3sale')).instanceId : '',
      spinShow: false,
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      // 是否禁用图片修改
      isDisabled: true,
      historyFileData: [],
      firstParentCode: '', // 一级区域编码
      newFirstLevelCode: '', // 新一级区域编码
      loading1: false,
      options1: [],
      stationTypeList: [], // 站点类型列表
      radioList: [
        {value: '1', text: '开通'},
        {value: '0', text: '关闭'}
      ], // 单选列表
      ruleInline: {
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: 'change'}
        ],
        wager: [
          {required: true, message: '投注权限不能为空', trigger: 'change'}
        ],
        cash: [
          {required: true, message: '兑奖权限不能为空', trigger: 'change'}
        ],
        cancel: [
          {required: true, message: '注销权限不能为空', trigger: 'change'}
        ]
      }, // 校验规则
      Obj: {
        regionCode: '',
        flow: {
          content: ''
        }
      },
      resetObj: {},
      // 流程图跳线
      nodeList: [],
      // 表格加载
      loading: false,
      // 显示/隐藏 上传弹窗
      modalFlag: false,
      // 上传附件基本配置
      conf: {
        // tooltips: [1, 2],
        uploadUrl: ''
      },
      // 空站号列表显示/隐藏
      useableStationCodeFlag: false,
      // 内容区域开关
      showContent: false,
      // 显示隐藏的查询框
      searchBox_flag: false,
      // 代理商列表
      agentList: [],
      // 代销费类型
      commissionType: [],
      // 编号开头，必须以该数组的其中之一为开头
      stationCodeBeginRule: [],
      // 第一个步骤，起始节点
      beginNode: '',
      // 第一个步骤，起始节点
      currentNodeCode: '',
      // 可编辑对象
      editableObj: null,
      historyData: []
    }
  },
  computed: {
    stationRightPermissionEnum() {
      return this.$store.state['station_enumDic'].MisEnum$stationRightPermissionEnum
    }
  },
  methods: {
    // 站点编号后台请求
    remoteMethod1(query) {
      if (query !== '') {
        this.loading1 = true
        this.postJson('station', {
          apiCode: 300019,
          content: {
            searchKey: query
          }
        }).then(res => {
          if (res.code === '0') {
            this.loading1 = false
            this.options1 = res.content.map(v => {
              return {
                label: `${v.station_code}-${v.status_name}-${v.name_x}`,
                value: v.station_code,
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
        if (res.code === '0') {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.$router.go(-1)
        }
      })
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
        // console.log(nodelist)
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
              this.Obj[key] = obj[key] + ''
            }
          }
          this.$set(this.Obj, 'wager', res.content.bizObject.wager.value)
          this.$set(this.Obj, 'cash', res.content.bizObject.cash.value)
          this.$set(this.Obj, 'cancel', res.content.bizObject.cancel.value)
          console.log(this.Obj)
          this.showContent = true
        }
      })
    },
    ...mapMutations({
      SET_ENUM_DIC: 'SET_ENUM_DIC'
    })
  },
  mounted() {
    const buz = JSON.parse(sessionStorage.getItem('todosK3sale'))
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