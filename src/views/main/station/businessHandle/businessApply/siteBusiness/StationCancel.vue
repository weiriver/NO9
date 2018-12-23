<template>
  <Tabs type="border-card">
    <TabPane label="业务详情">
        <Form ref="Obj" :model="Obj" :rules="ruleInline" label-width="200px">
          <!--站点信息-->
          <h3> 站点信息</h3>
          <!--投注站编号-->
          <FormItem prop="stationCode" label="投注站编号">
           <Select v-model="Obj.stationCode" filterable remote :remote-method="getStationList"
                    :loading="loadingStation" @change="queryStationInfo">
              <Option v-for="(station, index) in stationList" :disabled="station.station_status != 'stop'" :value="station.station_code" :key="index"
                      :label="station.station_code">
                {{station.station_code}}-{{station.status_name}}-{{station.name_x}}
              </Option>
            </Select>
          </FormItem>
          <!--负责人姓名-->
          <FormItem label="负责人姓名" v-if="bFlag">
            <Input v-model="Obj.principal" :maxlength='10' readonly/>
          </FormItem>
          <!--联系电话-->
          <FormItem label="联系电话" v-if="bFlag">
            <Input v-model="Obj.mobile" :maxlength='11' readonly/>
          </FormItem>
          <!--身份证号码-->
          <FormItem label="身份证号码" v-if="bFlag">
            <Input v-model="Obj.idCard" :maxlength='18' readonly/>
          </FormItem>
          <!--站点地址-->
          <FormItem label="站点地址" v-if="bFlag">
            <Input v-model="Obj.address" :maxlength='50' readonly/>
          </FormItem>
          <!--投注站销售保证金额-->
          <FormItem label="投注站销售保证金额" prop="deposit">
            <Input v-model="Obj.deposit" :maxlength='10'/>
          </FormItem>
          <!--撤销原因-->
          <FormItem label="撤销原因" prop="cancelReason">
            <Input v-model="Obj.cancelReason" :maxlength='10'/>
          </FormItem>
          <!--申请人照片-->
          <FormItem label="申请人照片">
            <ecamera :is-idcard="true" @imguploadResult="imguploadResult"
                            :uploadConf='uploadConf' :imgType="'flow_head'" ref="flow_head"></ecamera>
          </FormItem>
          <!--申请人照片-->
          <FormItem label="申请人照片">
            <ecamera :is-idcard="false" @IDcardInfo="getIdCardInfo"
                            :uploadConf='uploadConf' :imgType="'flow_idcard'" ref="flow_idcard"></ecamera>
          </FormItem>
           <!--销售保证金凭条-->
          <FormItem label="销售保证金凭条">
            <ecamera :is-idcard="false"
                            :uploadConf='uploadConf' :imgType="'flow_deposit'" ref="flow_deposit"></ecamera>
          </FormItem>
          <!--附件信息-->
          <FormItem label="附件信息">
              <ModalUpload :api="uploadConf" @uploadResult="uploadResult" :type="uploadType" :isMultiple="true">
                 <div slot="warnTxt">类型：可用文件格式 txt、doc、xls、jpg、bmp、png、rar、zip、office2007 其中的一种</div>
              </ModalUpload>
          </FormItem>
          <!--处理意见-->
          <FormItem label="处理意见">
            <Input  v-model="Obj.flow.content" type="textarea" :autosize="true" placeholder=""/>
          </FormItem>
          <!--保存-->
          <FormItem>
            <Button type="ghost" class="mr20" @click="save('draft')">暂存</Button>
            <Button type="ghost" @click="reset" class="mr20 mt12">重置</Button>
            <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="beginNode.code"
                     @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                     @vertify="checkForm" ref="chuliBtn"></Chuli>
          </FormItem>
        </Form>
    </TabPane>
    <TabPane label="流程图">
      <mySteps :nodeList="nodeList"></mySteps>
    </TabPane>
  </Tabs>
</template>

<script>
import Ecamera from '@/components/gaopaiyi/Ecamera'
import Chuli from '@/components/chuli/Chuli'
import ModalUpload from '@/components/upload/modalUpload/ModalUpload'
export default {
  name: 'StationCancel',
  data() {
    const validatorSaleMoney = (rule, value, callback, source, options) => {
      if (this.Regexp.isNumber(value) && value <= 20000) {
        callback()
      } else {
        callback(new Error('请输入不大于20000的数字'))
      }
    }
    const validatorStationNo = async (rule, value, callback, source, options) => {
      var res = await this.postJson('biz', {
        apiCode: 200001,
        content: {
          stationCode: this.Obj.stationCode
        }
      })
      if (res.code === '0') {
        if (!res.content) {
          callback(new Error('该站点不存在'))
        } else if (res.content && res.content.stationStat === '0') {
          callback(new Error('该站点不是停机状态，请先申请停机'))
        }
      }
    }
    return {
      uploadType: ['txt', 'doc', 'xls', 'jpg', 'bmp', 'png', 'rar', 'zip', 'office2007'],
      bFlag: true,
      instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      ruleInline: {
        stationCode: [
          {
            required: true, message: '站点编号不能为空', trigger: 'change'
          },
          {
            validator: validatorStationNo, trigger: 'change'
          }
        ],
        cancelReason: [{
          required: true,
          message: '撤销原因不能为空',
          trigger: 'blur'
        }],
        deposit: [
          {
            required: true,
            message: '投注站销售保证金不能为空',
            trigger: 'change'
          },
          {
            validator: validatorSaleMoney,
            trigger: 'change'
          }
        ]
      }, // 校验规则
      Obj: {
        flow: {
          content: ''
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
      // 上传附件基本配置
      conf: {
        uploadUrl: ''
      },
      // 内容区域开关
      showContent: false,
      // 第一个步骤，起始节点
      beginNode: '',
      loadingStation: false
    }
  },
  methods: {
    // 获取身份证信息
    getIdCardInfo(val) {
    },
    // 图片上传结果
    imguploadResult(val) {
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
      if (val.nextInfo.acceptById) {
        this.Obj.flow.acceptByName = val.nextInfo.acceptByName
        this.Obj.flow.acceptById = val.nextInfo.acceptById
      }
      this.Obj.nodeBo = val.nodeBo
      this.Obj.flow.sendMsg = val.nextInfo.sendMsg
      this.Obj.flow.showDetail = val.nextInfo.showDetail
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
      // 固定写死
      this.Obj.flow.sysModule = 'station'
      this.Obj.flow.processMode = 'web'
      if (draft) {
        this.Obj.flow.draft = true
        this.submit(true)
      } else {
        this.Obj.flow.draft = false
        this.submit(false)
      }
    },
    submit(draft) {
      this.postJsonWithMask('common', {
        apiCode: 200079,
        content: this.Obj
      }).then(res => {
        if (res.code === '0') {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.Obj = {}
          this.Obj.flow = {}
          this.$router.go(-1)
        }
      })
    },
    // 重置
    reset() {
      this.Obj = {}
      this.init(true)
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
    // 获取流程图
    getFlowInfo(flowId, intanceId) {
      this.postJsonWithMask('common', {
        apiCode: 200053,
        content: {
          flowId,
          sysModule: 'station'
        }
      }).then(res => {
        const nodelist = res.content.nodeList
        this.beginNode = nodelist.filter(v => {
          return v.code.includes('begin')
        })[0]
        this.nodeList = nodelist
        this.fromNodeCode = nodelist[1].code
        this.Obj.flow.fromNodeCode = nodelist[1].code
        this.Obj.flow.fromNodeName = nodelist[1].nameX
        this.Obj.flow.toNodeCode = nodelist[2].code
        this.Obj.flow.toNodeName = nodelist[2].nameX
        this.Obj.flow.acceptByName = nodelist[2].acceptByName
        this.Obj.flow.acceptById = nodelist[2].acceptById
        this.Obj.flow.acceptByType = nodelist[2].acceptByType.value
        const userId = JSON.parse(sessionStorage.getItem('login')).uid
        if (this.$route.query.from == 'apply') { // 如果是从我的申请过来的修改，则存在实例ID
          this.uploadConf.hostBizId = `${intanceId}$${this.flowCode}$${this.fromNodeCode}`
        } else {
          this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
        }
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
        if (res.code === '0') {
          this.stationList = res.content
        }
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
              this.$set(this.Obj, 'principal', response.stationMaster.nameX)
              this.$set(this.Obj, 'mobile', response.stationMaster.mobile)
              this.$set(this.Obj, 'idCard', response.stationMaster.idCard)
            }
            this.$set(this.Obj, 'address', response.stationAddr)
            this.bFlag = false
            setTimeout(() => {
              this.bFlag = true
            }, 50)
          }
        })
      }
    },
    init(flag) {
      this.showContent = false
      // this.Obj = {}
      if (this.$route.query.from == 'apply') {// 我的申请--修改
        const buz = JSON.parse(sessionStorage.getItem('draftFromApply'))
        const {flowId, bizId, id, flowCode, flowName} = buz
        this.getDraftDetail(flowId, bizId, id)
        this.flowCode = flowCode
        this.Obj.flowId = flowId
        this.Obj.title = flowName
        this.Obj.flow = {}
        this.Obj.flow.bizTitle = flowName
        this.Obj.flow.flowId = flowId
        this.Obj.flow.agreed = true + '' // 是否同意，默认同意
        this.Obj.flow.flowName = flowName
        // 获取流程图
        this.getFlowInfo(flowId, id)
      } else {
        if (flag) {
          this.$refs.flow_head.clear()
          this.$refs.flow_idcard.clear()
          this.$refs.flow_deposit.clear()
        }
        const buz = JSON.parse(sessionStorage.getItem('stationCancel'))
        const {
          id,
          flowName,
          flowCode
        } = buz
        this.flowCode = flowCode
        this.Obj.flowId = id
        this.Obj.title = flowName
        this.Obj.flow = {}
        this.Obj.flow.bizTitle = flowName
        this.Obj.flow.flowId = id
        this.Obj.flow.agreed = true + '' // 是否同意，默认同意
        this.Obj.flow.flowName = flowName
        this.showContent = true
        // 获取流程图
        this.getFlowInfo(id)
      }
    },
    // 获取草稿信息
    getDraftDetail(flowId, bizId, instanceId) {
      this.postJsonWithMask('common', {
        apiCode: 200112,
        content: {flowId, bizId, instanceId, showDetail: false}
      }).then(res => {
        this.showContent = true
        this.setFlowFile(res.content.filesList)
        this.Obj = Object.assign({}, this.Obj, res.content.bizObject)
        this.$set(this.Obj, 'deposit', this.Obj.deposit ? this.Obj.deposit.toString() : '')
      })
    },
    setFlowFile(fileList) {
      if (fileList.length === 0) {
        return
      }
      fileList.forEach(file => {
        let fileType = file.extInfo
        if (fileType) {
          this.$refs[fileType].base64str = file.showUrl
        }
      })
    }
  },
  computed: {},
  components: {
    Ecamera,
    Chuli,
    ModalUpload
  },
  mounted() {
    this.init(false)
  }
}
</script>

<style scoped>

</style>