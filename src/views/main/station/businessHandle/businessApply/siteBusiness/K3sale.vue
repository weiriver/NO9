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
                  filterable
                  remote
                  :remote-method="remoteMethod1"
                  @change="stationCodeChange"
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
          <Select v-model="Obj.wager" clearable :disabled="disabledObj.wagerDisabled">
            <Option v-for="item in stationRightPermissionEnum"
                    :key="item.id"
                    :value="item.value"
                    :label="item.text">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="兑奖权限" prop="cash">
          <Select v-model="Obj.cash" clearable :disabled="disabledObj.cashDisabled">
            <Option v-for="item in stationRightPermissionEnum"
                    :key="item.id"
                    :value="item.value"
                    :label="item.text">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="注销权限" prop="cancel">
          <Select v-model="Obj.cancel" clearable :disabled="disabledObj.cancelDisabled">
            <Option v-for="item in stationRightPermissionEnum"
                    :key="item.id"
                    :value="item.value"
                    :label="item.text">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="代兑费率">
          <Input v-model="Obj.cashCommission" disabled/>
        </FormItem>
        <FormItem label="代销费率">
          <Input v-model="Obj.saleCommission" disabled/>
        </FormItem>
        <FormItem label="市级发行费比率">
          <Input v-model="Obj.stationCityRate" disabled/>
        </FormItem>
        <FormItem label="省级发行费比率">
          <Input v-model="Obj.stationProvRate" disabled/>
        </FormItem>
        <FormItem label="中彩福利金比率">
          <Input v-model="Obj.stationZCRate" disabled/>
        </FormItem>
        <FormItem label="兑换校验模式">
          <Input v-model="Obj.stationCashMode" disabled/>
        </FormItem>
        <FormItem label="注销时间上限">
          <Input v-model="Obj.cancelTimeLimit" disabled/>
        </FormItem>
        <FormItem label="注销次数上限">
          <Input v-model="Obj.issueCancelTimes" disabled/>
        </FormItem>
        <FormItem label="期注销金额上限">
          <Input v-model="Obj.issueCancelMoney" disabled/>
        </FormItem>
        <FormItem label="单票最小兑换金额">
          <Input v-model="Obj.minCashPerTick" disabled/>
        </FormItem>
        <FormItem label="单票最大兑换金额">
          <Input v-model="Obj.maxCashPerTick" disabled/>
        </FormItem>
        <FormItem label="单票最小金额">
          <Input v-model="Obj.minMoneyPerTick" disabled/>
        </FormItem>
        <FormItem label="单票最大金额">
          <Input v-model="Obj.maxMoneyPerTick" disabled/>
        </FormItem>
        <FormItem label="单票保护金额">
          <Input v-model="Obj.protectMoney" disabled/>
        </FormItem>
        <FormItem label="最小兑奖奖等">
          <Input v-model="Obj.minWinLevel" disabled/>
        </FormItem>
        <FormItem label="最大兑奖奖等">
          <Input v-model="Obj.maxWinLevel" disabled/>
        </FormItem>
        <!-- 处理和附件 -->
        <FormItem label="处理意见">
          <Input type="textarea" :autosize="true" v-model="Obj.flow.content" :maxlength='100'/>
        </FormItem>
        <FormItem label="附件信息">
          <ModalUpload class="" :api="uploadConf" :isMultiple="true">
            <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
          </ModalUpload>
        </FormItem>
        <FormItem>
          <Button type="primary" class="mr20 mt12" @click="save('draft')">暂存</Button>
          <Button @click="resetForm('Obj')" class="mr20 mt12">重置</Button>
          <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="beginNode.code"
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
  name: 'K3sale',
  components: {
    ModalUpload,
    Chuli,
    Mysteps
  },
  data() {
    const checkStatus = (rule, value, callback) => {
      this.postJson('station', {
        apiCode: 300018,
        content: {
          stationCode: value
        }
      }).then(res => {
        if (res.code == 0) {
          const obj = res.content
          // 状态码，0开机，1停机，2撤销
          if (obj.stationStatus.hotCode === '2') {
            callback(new Error(`该站点已经撤销`))
          } else {
            callback()
          }
        } else {
          callback(new Error(`获取站点信息错误,请稍候再试`))
        }
      })
    }

    return {
      instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
      flowCode: '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
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
          {required: true, message: '站点编号不能为空', trigger: 'change'},
          {validator: checkStatus, required: true, trigger: 'change'}
        ],
        wager: [
          {required: true, message: '投注权限不能为空', trigger: 'blur'}
        ],
        cash: [
          {required: true, message: '兑奖权限不能为空', trigger: 'blur'}
        ],
        cancel: [
          {required: true, message: '注销权限不能为空', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {
        flow: {content: ''}
      },
      resetObj: {},
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
        // tooltips: [1, 2],
        uploadUrl: ''
      },
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
      // 是否禁用投注权限，兑奖权限，注销权限
      disabledObj: {
        wagerDisabled: false,
        cashDisabled: false,
        cancelDisabled: false
      }
    }
  },
  computed: {
    stationRightPermissionEnum() {
      return this.$store.state['station_enumDic'].MisEnum$stationRightPermissionEnum
    }
  },
  methods: {
    stationCodeChange() {
      if (!this.Obj.stationCode) {
        return
      } else {
        console.log(123)
        this.postJson('biz', {
          apiCode: 200004,
          content: {
            stationCode: this.Obj.stationCode,
            gameId: 7 // 快3，写死
          }
        }).then(res => {
          if (res.code == 0) {
            const obj = res.content
            console.log(obj)
            if (obj) {
              // var merge = require('object-merge')
              this.Obj = Object.assign({}, this.Obj, obj)
              this.$set(this.Obj, 'wager', obj.wager.value)
              this.$set(this.Obj, 'cash', obj.cash.value)
              this.$set(this.Obj, 'cancel', obj.cancel.value)
              // for (let key in obj) { // 替代merge,assign
              //   if (key === 'wager') {
              //     this.$set(this.Obj, 'wager', obj.wager.value)
              //   } else if (key === 'cash') {
              //     this.$set(this.Obj, 'cash', obj.cash.value)
              //   } else if (key === 'cancel') {
              //     this.$set(this.Obj, 'cancel', obj.cancel.value)
              //   } else {
              //     this.$set(this.Obj, key, obj[key])
              //   }
              // }
              this.disabledObj.wagerDisabled = false
              this.disabledObj.cashDisabled = false
              this.disabledObj.cancelDisabled = false
              console.log('obj', this.Obj)
            } else { // 后台说当没有返回的时候 后面三个下拉为禁止状态
              this.disabledObj.wagerDisabled = true
              this.disabledObj.cashDisabled = true
              this.disabledObj.cancelDisabled = true
              // 没有数据返回时，清空数据（除站点编号、标题、流程信息）
              for (let key in this.Obj) {
                if ((key !== 'stationCode') && (key !== 'title') && (key !== 'flow') && (key !== 'flowId')) {
                  this.$set(this.Obj, key, '')
                }
              }
              // this.$refs['Obj'].resetFields() //disabled文本框无法清空
              console.log(this.Obj)
            }
          }
        })
      }
    },
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
          if (res.code == 0) {
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
        if (res.code == 0) {
          this.showMsg(`${draft ? '暂存' : '提交'}成功`)
          this.$router.go(-1)
        }
      })
    },
    init(isReset) {
      if (this.$route.query.from == 'apply') {
        this.showContent = false
        if (isReset) {
          this.Obj = this.resetObj
          this.disabledObj.wagerDisabled = false
          this.disabledObj.cashDisabled = false
          this.disabledObj.cancelDisabled = false
        }
        const buz = JSON.parse(sessionStorage.getItem('draftFromApply'))
        console.log(buz)
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
        this.getFlowInfo(flowId)
      } else {
        if (isReset) {
          this.Obj = this.resetObj
          this.disabledObj.wagerDisabled = false
          this.disabledObj.cashDisabled = false
          this.disabledObj.cancelDisabled = false
        }
        const buz = JSON.parse(sessionStorage.getItem('k3sale'))
        console.log(buz)
        const {id, flowName, flowCode} = buz
        this.flowCode = flowCode
        this.Obj.flowId = id
        this.Obj.title = flowName
        this.Obj.flow = {}
        this.Obj.flow.bizTitle = flowName
        this.Obj.flow.flowId = id
        this.Obj.flow.agreed = true // 是否同意，默认同意
        this.Obj.flow.flowName = flowName
        this.showContent = true
        // 获取流程图
        this.getFlowInfo(id)
      }
    },
    // 重置
    resetForm(formName) {
      this[formName] = {flow: {content: ''}}
      this.init(true)
    },
    // 获取流程图
    getFlowInfo(flowId) {
      this.postJsonWithMask('common', {
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
        const userId = JSON.parse(sessionStorage.getItem('login')).uid
        this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.Obj.flow.fromNodeCode}`
      })
    },
    // 获取草稿信息
    getDraftDetail(flowId, bizId, instanceId) {
      this.postJsonWithMask('common', {
        apiCode: 200112,
        content: {flowId, bizId, instanceId, showDetail: false}
      }).then(res => {
        console.log(res)
        // var merge = require('object-merge')
        this.Obj = Object.assign({}, this.Obj, res.content.bizObject)
        this.Obj.stationCode += ''
        this.Obj.wager = this.Obj.wager.value
        this.Obj.cash = this.Obj.cash.value
        this.Obj.cancel = this.Obj.cancel.value
        this.showContent = true
        console.log(this.Obj)
      })
    },
    ...mapMutations({
      SET_ENUM_DIC: 'SET_ENUM_DIC'
    })
  },
  mounted() {
    this.init(false)
  }
}
</script>

<style scoped>

</style>