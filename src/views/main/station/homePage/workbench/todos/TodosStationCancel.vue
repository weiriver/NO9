<template>
  <Tabs type="border-card" v-if="showContent">
    <TabPane label="业务详情">
      <Form ref="Obj" :model="Obj" :rules="ruleInline" label-width="200px">
          <!--站点信息-->
          <div v-if="editableObj">
            <h3>站点信息</h3>
            <!--投注站点号-->
            <FormItem prop="stationCode" label="投注站编号">
              <Select v-model="Obj.stationCode" filterable remote :remote-method="getStationList"
                      :loading="loadingStation" @on-change="queryStationInfo"
                      :disabled="!editableObj.stationCode.editable">
                <Option v-for="(station, index) in stationList" :disabled="station.station_status != 'stop'"
                        :value="station.station_code" :key="index"
                        :label="station.station_code">
                  {{station.station_code}}-{{station.status_name}}-{{station.name_x}}
                </Option>
              </Select>
            </FormItem>
            <!--负责人姓名-->
            <FormItem label="负责人姓名">
              <Input v-model="Obj.principal" :maxlength='10' :disabled="!editableObj.principal.editable"/>
            </FormItem>
            <!--联系电话-->
            <FormItem label="联系电话">
              <Input v-model="Obj.mobile" :maxlength='11' :disabled="!editableObj.mobile.editable"/>
            </FormItem>
            <!--身份证号码-->
            <FormItem label="身份证号码">
              <Input v-model="Obj.idCard" :maxlength='18' :disabled="!editableObj.idCard.editable"/>
            </FormItem>
            <!--站点地址-->
            <FormItem label="站点地址">
              <Input v-model="Obj.address" :maxlength='50' :disabled="!editableObj.address.editable"/>
            </FormItem>
            <!--投注站销售保证金额 -->
            <FormItem prop="deposit" label="投注站销售保证金额">
              <Input v-model="Obj.deposit" :disabled="!editableObj.deposit.editable"/>
            </FormItem>
            <!--撤销原因-->
            <FormItem prop="cancelReason" label="撤销原因">
              <Input v-model="Obj.cancelReason" :disabled="!editableObj.cancelReason.editable"/>
            </FormItem>
            <!--平账金额-->
            <FormItem  v-if="Obj.adjustmentAmount" label="平账金额">
              <Input v-model="Obj.adjustmentAmount" disabled/>
            </FormItem>
            <FormItem style="height: auto;" label="申请人照片">
                <ecamera :is-idcard="true" @imgStr="personalImg" :uploadConf='uploadConf' :imgType="'flow_head'" ref="flow_head"></ecamera>
            </FormItem>
            <FormItem label="身份证正面">
                <ecamera :is-idcard="false" @imgStr="personalImg"
                            :uploadConf='uploadConf' :imgType="'flow_idcard'" ref="flow_idcard"></ecamera>
            </FormItem>
            <FormItem label="销售保证金凭条">
              <ecamera :is-idcard="false" @imgStr="personalImg" :uploadConf='uploadConf' :imgType="'flow_deposit'" ref="flow_deposit"></ecamera>
            </FormItem>
          </div>
          <!--是否平帐-->
          <div v-if="!Obj.isAdjustment && isShowpingzhang && Obj.flow.fromNodeName === '财务部预审'">
            <!--热线账户余额-->
            <FormItem label="热线账户余额">
              {{ yue }}
            </FormItem>
            <FormItem label="调账金额">
              {{ -yue }}
            </FormItem>
            <FormItem class="mt20">
              <Button type="primary" @click="pingzhang">平账</Button>
                (*注意:只有热线账户余额为零才能打印撤机退款单!)
            </FormItem>
          </div>
          <!--站点流程文件-->
          <FormItem label="站点流程文件">
             <Button type="primary" @click="gotoOffice">站点撤销流程文件</Button>
          </FormItem>
          <!--附件信息-->
          <FormItem label="附件信息">
            <ModalUpload :historyFileList="historyFileData" :api="uploadConf" :type="uploadType"
                          @uploadResult="uploadResult" :isMultiple="true">
              <div slot="warnTxt">类型：可用文件格式 txt、doc、xls、jpg、bmp、png、rar、zip、office2007 其中的一种</div>
            </ModalUpload>
          </FormItem>
          <!--处理意见-->
          <h3>处理意见</h3>
          <Table stripe :data="historyData" :height="200" border style="width: 100%" ref="history">
            <TableColumn type="expand">
               <template slot-scope="scope">
                 <span class="expand-key">意见: </span>
                 <span class="expand-value">{{scope.row.changeThing? scope.row.changeThing:'--'}}</span>
               </template>
            </TableColumn>
            <TableColumn label="序号" width="50" type="index" align="center"></TableColumn>
            <TableColumn label="步骤名" prop="nodeName" width="130"></TableColumn>
            <TableColumn label="处理人" prop="acceptByName" minWidth="100"></TableColumn>
            <TableColumn label="下一步" prop="toNodeName" width="130"></TableColumn>
            <TableColumn label="处理意见" prop="content" minWidth="200"></TableColumn>
            <TableColumn label="处理时间" prop="finishDate" width="110">
              <template slot-scope="scope">
                {{ scope.row.finishDate | ToDate }}
              </template>
            </TableColumn>
          </Table>
          <FormItem label="意见内容" class="mt10">
              <Input style="height: auto" v-model="Obj.flow.content" type="textarea" :autosize="true" placeholder="" :maxlength='100'/>
          </FormItem>
          <!--保存-->
          <FormItem>
            <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="currentNodeCode"
                     @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                     @vertify="checkForm" ref="chuliBtn"></Chuli>
          </FormItem>
        </Form>
    </TabPane>
    <TabPane label="流程图">
      <mySteps :nodeList="nodeList" :currentNodeCode="currentNodeCode"></mySteps>
    </TabPane>
  </Tabs>
</template>

<script>
import Ecamera from '@/components/gaopaiyi/Ecamera'
import Chuli from '@/components/chuli/Chuli'
import ModalUpload from '@/components/upload/modalUpload/ModalUpload'
export default {
  name: 'todosStationCancel',
  data() {
    const validatorSaleMoney = (rule, value, callback, source, options) => {
      if (this.Regexp.isNumber(value) && value <= 20000) {
        callback()
      } else {
        callback(new Error('请输入不大于20000的数字'))
      }
    }
    const validatorStationNo = (rule, value, callback, source, options) => {
      this.postJson('biz', {
        apiCode: 200001,
        content: {
          stationCode: this.Obj.stationCode
        }
      }).then(res => {
        if (res.code === '0') {
          if (!res.content) {
            callback(new Error('该站点不存在'))
          } else if (res.content && res.content.stationStat === '0') {
            callback(new Error('该站点不是停机状态，请先申请停机'))
          } else {
            callback()
          }
        }
      })
    }
    return {
      uploadType: ['txt', 'doc', 'xls', 'jpg', 'bmp', 'png', 'rar', 'zip', 'office2007'],
      instanceId: JSON.parse(sessionStorage.getItem('todosStationCancel')) ? JSON.parse(sessionStorage.getItem('todosStationCancel')).instanceId : '',
      pingzhangFlag: '0',
      yue: 0,
      // 显示平账的按钮
      isShowpingzhang: false,
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
          {required: true, message: '站点编号不能为空', trigger: 'blur'},
          {validator: validatorStationNo, trigger: 'change'}
        ],
        cancelReason: [{required: true, message: '撤销原因不能为空', trigger: 'blur'}],
        deposit: [
          {required: true, message: '投注站销售保证金不能为空', trigger: 'blur'},
          {validator: validatorSaleMoney, trigger: 'change'}
        ]
      }, // 校验规则
      Obj: {
        flow:{
          content:''
        }
      },
      // 站点编号集合
      stationList: [],
      fromNodeCode: '',
      flowId: '',
      // 流程图跳线
      nodeList: [],
      // 显示/隐藏 坐标标注200005
      posFlag: false,
      // 表格加载
      loading: false,
      // 显示/隐藏 上传弹窗
      modalFlag: false,
      // 上传附件基本配置
      conf: {
        uploadUrl: ''
      },
      // 空站号列表显示/隐藏
      useableStationCodeFlag: false,
      // 内容区域开关
      showContent: false,
      // 第一个步骤，起始节点
      beginNode: '',
      loadingStation: false,
      // 可编辑对象
      editableObj: null,
      // 处理意见
      historyData: []
    }
  },
  methods: {
    // 校验余额是否在范围内（0-2元）
    pingzhang() {
      this.postJsonWithMask('biz', {
        apiCode: 200007,
        content: {
          bizId: this.Obj.flow.bizId
        }
      }).then(res => {
        if (res.code === '0') {
          location.reload()
          console.log('平帐成功')
          this.getHotlineYuE()
        }
      })
    },
    // 校验余额是否在范围内（0-2元）
    getHotlineYuE() {
      return new Promise(resolve => {
        this.postJson('biz', {
          apiCode: 200006,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code === '0') {
            this.yue = res.content
            if (this.yue !== 0) {
              this.isShowpingzhang = true
              resolve(false)
            } else {
              resolve(true)
            }
          }
        })
      })
    },
    // 高拍仪获取到的 “票面图片” base64字符串
    personalImg(val) {
      if (val.type === 'upload') { // 上传
      } else { // 预览结果
      }
    },
    // 上传结果
    uploadResult(file) {
      // console.log('我是上传结果', file)
    },
    // vertify点击提交按钮时验证
    async checkForm(isBack) {
      // 如果当前步骤为财务部预审，且点击提交到“财务部审核”,先判断平账与否
      if (this.Obj.flow.fromNodeName === '财务部预审' && !isBack) {
        let res = await this.getHotlineYuE()
        if (!res) {
          this.showMsg('请平帐后再提交', 'warning')
          return
        }
      }
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
      this.posFlag = false
      this.Obj.flow.draft = draft ? 'true' : 'false'
      // 固定写死
      this.Obj.flow.sysModule = 'station'
      this.Obj.flow.processMode = 'web'
      this.postJsonWithMask('common', {
        apiCode: 200111,
        content: this.Obj
      }).then(res => {
        if (res.code === '0') {
          this.showMsg('提交成功')
          this.$router.go(-1)
        }
      })
    },
    // 校验输入的必填项和规则
    async validate() {
      var check = false
      await this.$refs['Obj'].validate((valid) => {
        if (valid) {
          check = true
        } else {
          this.showMsg('请输入正确的必填信息', 'error')
          check = false
        }
      })
      return check
    },
    // 获取站点类型列表
    getStationList(sCode) {
      this.postJson('station', {
        apiCode: 300019,
        content: {
          searchKey: sCode
        }
      }).then(res => {
        if (res.code === '0') {
          this.stationList = res.content
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
        const list = res.content
        this.editableObj = list.filter(v => {
          return v.nodeCode == this.currentNodeCode
        })[0].fieldDetails
      })
    },
    queryStationInfo() {
      if (!this.Obj.stationCode) {
        return
      } else {
        this.Obj.principal = ''
        this.Obj.mobile = ''
        this.Obj.address = ''
        this.Obj.idCard = ''
        this.postJson('station', {
          apiCode: 300018,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code === '0') {
            let response = res.content
            if (response.stationMaster) {
              this.Obj.principal = response.stationMaster.nameX
              this.Obj.mobile = response.stationMaster.mobile
              this.Obj.idCard = response.stationMaster.idCard
            }
            this.Obj.address = response.stationAddr
          }
        })
      }
    },
    // 改变处理状态，并获取相关业务信息
    getFlowDetail(flowId, bizId, waitTaskId, instanceId) {
      this.postJsonWithMask('common', {
        apiCode: 200110,
        content: {flowId, bizId, waitTaskId, instanceId}
      }).then(res => {
        if (res.code == 0) {
          this.historyData = res.content.finishList
          this.setNodeList(res)
          let obj = res.content.bizObject
          for (let key in obj) {
            if (obj[key] != null) {
              this.Obj[key] = (obj[key] + '')
            }
          }
          this.getHotlineYuE()
          this.showContent = true
          setTimeout(() => {
            this.setFlowFile(res.content.filesList)
          }, 100)
        }
      })
    },
    setNodeList(res) {
      const nodelist = res.content.flowDiagram.nodeList
      this.nodeList = nodelist
      const currentNodeInfo = nodelist.filter(v => {
        return v.code == this.currentNodeCode
      })[0]
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
    gotoOffice() {
      window.open(`http://10.13.0.129:10900/index?bizType=stationCancel&bizId=${this.Obj.flow.bizId}&instanceId=${this.Obj.flow.instanceId}`, '_blank')
    }
  },
  computed: {},
  components: {
    Ecamera,
    Chuli,
    ModalUpload
  },
  mounted: function () {
    const buz = JSON.parse(sessionStorage.getItem('todosStationCancel'))
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