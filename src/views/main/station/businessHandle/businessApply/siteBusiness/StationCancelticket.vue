<template>
  <div>
    <!--<keep-alive>-->
    <Tabs class="_blue-header" type="border-card">
      <TabPane label="业务详情">
        <div>
          <h5>站点信息</h5>
          <Form ref="Obj" :model="Obj" label-width="200px" :rules="rules" class="Obj ruleForm">
            <div style="position: relative;">
              <FormItem label="投注站编号" prop="stationCode">
                <span v-show="$route.params.id">{{Obj.stationCode}}</span>
                <!--远程搜索-->
                <Select v-show="!$route.params.id" v-model="Obj.stationCode" filterable
                        remote
                        :remote-method="remoteMethod1"
                        @change="handleSelect"
                        placeholder="编号最少8个字"
                        :loading="loading1">
                  <Option v-for="(option, index) in options1" :value="option.value" :key="index"
                          :disabled="option.status == 'cancel' " :label="option.label">
                  </Option>
                </Select>
              </FormItem>
              <!--业主姓名-->
              <FormItem label="负责人姓名" prop="principal">
                <Input v-model="Obj.principal" disabled></Input>
              </FormItem>
              <!--身份证号-->
              <FormItem label="联系电话" prop="mobile">
                <Input v-model="Obj.mobile" disabled></Input>
              </FormItem>
              <!--手机号码-->
              <FormItem label="站点地址" prop="printAddr">
                <Input v-model="Obj.printAddr" disabled></Input>
              </FormItem>
              <!------------------------------------注销骗信息--------------------------------------->
              <h5>注销票信息</h5>
              <!--投注站保证金金额-->
              <FormItem label="游戏名称" prop="gameId">
                <Select v-model="Obj.gameId" @change="getIssueByGame">
                  <Option v-for="(game, index) in gameList" :value="game.value" :key="index" :label="game.text"></Option>
                </Select>
              </FormItem>
              <!--原区域-->
              <FormItem label="期号" prop="issue">
                <Input v-model="Obj.issue" :maxlength="10"></Input>
                <!--<Select v-model="Obj.issue">-->
                  <!--<Option v-for="(issue, index) in issueList" :value="issue.value" :key="index" :label="issue.text">-->
                  <!--</Option>-->
                <!--</Select>-->
              </FormItem>
              <!--原区域名称-->
              <FormItem label="流水号" prop="draw">
                <Input v-model="Obj.draw" :maxlength="10"></Input>
              </FormItem>
              <!--原站点地址-->
              <FormItem label="注销票投注时间" prop="saleTimeUS">
                <DatePicker style="width: 100%;" v-model="Obj.saleTimeUS" type="datetime"
                            format="yyyy-MM-dd HH:mm:ss"></DatePicker>
              </FormItem>
              <FormItem label="注销彩票原因" prop="reason">
                <Select v-model="Obj.reason">
                  <Option v-for="(reason, index) in cancelReason" :value="reason.value" :key="index" :label="reason.text"></Option>
                </Select>
              </FormItem>
              <FormItem label="注销票投注金额" prop="saleMoney">
                <Input v-model="Obj.saleMoney" :maxlength="10"></Input>
              </FormItem>
              <FormItem label="注销票面图片" prop="newAddress">
                <myEpai :is-idcard="false" @imguploadResult="imguploadResult"
                        :uploadConf='uploadConf' :imgType="'flow_cancel_ticket'" ref="flow_cancel_ticket"></myEpai>
              </FormItem>
            </div>
            <h5>附件信息</h5>
            <FormItem label="附件信息" prop="postcode">
              <ModalUpload class="" :api="uploadConf" :isMultiple="true">
                <div slot="warnTxt">只能上传jpg/png文件，且不超过500kb</div>
              </ModalUpload>
            </FormItem>
            <!--按钮区域-->
            <FormItem>
              <Button type="primary" class="mr20 mt12" @click="save('draft')">暂存</Button>
              <Button @click="reset" class="mr20 mt12">重置</Button>
              <Chuli :node-list="nodeList" :flowId="Obj.flowId" :nodeCode="beginNode.code"
                     @chuliConfirm="chuliConfirm" :instanceId="instanceId"
                     @vertify="checkForm" ref="chuliBtn"></Chuli>
            </FormItem>
          </Form>
        </div>
      </TabPane>
      <TabPane label="流程图">
        <Mysteps :nodeList='nodeList'></Mysteps>
      </TabPane>
    </Tabs>
    <!--</keep-alive>-->
  </div>
</template>

<script>
  import Mysteps from '@/components/mysteps/MySteps'
  import Chuli from '@/components/chuli/Chuli'
  import myEpai from '@/components/gaopaiyi/Ecamera'
  import {regexp} from '../../../../../../util/util'
  export default {
    name: 'a',
    components: {
      Mysteps, Chuli, myEpai
    },
    data() {
      const validator = (rule, value, callback) => {
        if (!value) return
        // 先判断，是否符合规则
        this.postJson('biz', {
          apiCode: 200001,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code === '0') {
            if (!res.content) {
              callback()
            } else if (res.content && res.content.stationStat === '2') {
              callback(new Error('该站点已经撤销不可使用'))
            } else {
              callback()
            }
          }
        })
      }
      const validatorSaleMoney = (rule, value, callback, source, options) => {
        if (regexp.isNumber(value) && value <= 20000) {
          callback()
        } else {
          callback(new Error('票金额请输入20000以内的整数'))
        }
      }
      return {
        instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
        // 流程图跳线
        nodeList: [],
        gameList: [],
        detail: [],
        uploadConf: {
          sysModule: 'flow',
          hostBizObj: 'flow_files',
          hostBizId: ''
        },
        flowCode: '',
        // 上传附件基本配置
        conf: {
          // tooltips: [1, 2],
          uploadUrl: ''
        },
        issueList: [],
        cancelReason: [
          {
            text: '错票',
            value: '错票'
          },
          {
            text: '残票',
            value: '残票'
          }
        ],
        firstParentCode: '', // 一级区域编码
        newFirstLevelCode: '', // 新一级区域编码
        resetObj: {},
        showContent: false,
        modalFlag: false,
        ModalFlag:false,
        beginNode: '',
        Obj: {
          stationCode: '',
          flow: {
            content: ''
          }
        },
        options1: [],
        loading1: false,
        rules: {
          stationCode: [
            {required: true, message: '站点编号不能为空', trigger: 'blur'},
            {validator: validator, required: true, trigger: 'change'}
          ],
          gameId: [
            {required: true, message: '游戏名称不能为空', trigger: 'change'}
          ],
          issue: [
            {required: true, message: '期号不能为空', trigger: 'change'}
          ],
          draw: [
            {required: true, message: '流水号不能为空', trigger: 'blur'}
          ],
          saleTimeUS: [
            {required: true, message: '注销票投注时间不能为空', trigger: 'change'}
          ],
          reason: [
            {required: true, message: '申请原因不能为空', trigger: 'change'}
          ],
          saleMoney: [
            {required: true, message: '注销票金额不能为空', trigger: 'blur'},
            {validator: validatorSaleMoney, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 图片上传结果
      imguploadResult(val) {
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
      handleSelect () {
        console.log(this.Obj.stationCode)
        this.postJson('station', {
          apiCode: 300018,
          content: {
            stationCode: this.Obj.stationCode
          }
        }).then(res => {
          if (res.code === '0') {
            let response = res.content
            this.$set(this.Obj, 'principal', response.stationMaster.nameX)
            this.$set(this.Obj, 'mobile', response.stationMaster.mobile)
            this.$set(this.Obj, 'printAddr', response.stationAddr)
          }
        })
      },
      // 上传结果
      uploadResult(file) {
        console.log('我是上传结果', file)
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
      // 获取游戏列表
      getGameList() {
        this.postJson('biz', {
          apiCode: 200016,
          content: {}
        }).then(res => {
          console.log(res)
          if (res.code === '0') {
            this.gameList = res.content.filter(item => {
              return item.value != 7
            })
          }
        })
      },
      // 重置
      reset() {
        // this.Obj.stationCode = ''
        this.init()
      },
      // 最底部按钮
      save(draft) {
        this.Obj.flow.bizKey = this.Obj.stationCode
        this.posFlag = false
        let arr = this.gameList.filter(item => item.value === this.Obj.gameId)
        if (arr.length > 0) {
          this.Obj.gameName = arr[0].text
        }
        // 转换投注时间
        this.Obj.saleTime = this.$options.filters.ToTime(this.Obj.saleTimeUS)
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
      submit(draft) {
        console.log('submit')
        console.log(this.Obj)
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
          const userId = JSON.parse(sessionStorage.getItem('login')).uid
          if (this.$route.query.from == 'apply') { // 如果是从我的申请过来的修改，则存在实例ID
            this.uploadConf.hostBizId = `${intanceId}$${this.flowCode}$${this.fromNodeCode}`
          } else {
            this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.fromNodeCode}`
          }
        })
      },
      // 获取草稿信息
      getDraftDetail(flowId, bizId, instanceId) {
        this.postJsonWithMask('common', {
          apiCode: 200112,
          content: {flowId, bizId, instanceId, showDetail: false}
        }).then(res => {
          console.log(res)
          this.showContent = true
          this.setFlowFile(res.content.filesList)
          // var merge = require('object-merge')
          this.Obj = Object.assign(this.Obj, res.content.bizObject)
          this.getIssueByGame()
          this.Obj.saleTimeUS = this.Obj.saleTime ? new Date(this.Obj.saleTime) : ''
          this.Obj.saleMoney = this.Obj.saleMoney ? this.Obj.saleMoney + '' : ''
          console.log(this.Obj)
        })
      },
      getIssueByGame () {
        if (this.$route.query.from != 'apply') {
          this.Obj.issue = ''
        }
        this.issueList = []
        if (!this.Obj.gameId) {
          return
        }
        this.postJsonWithMask('biz', {
          apiCode: 200002,
          content: {
            gameId: this.Obj.gameId
          }
        }).then(res => {
          console.log(res)
          if (res.code === '0') {
            this.issueList = res.content
          }
        })
      },
      init(flag) {
        console.log('init-1')
        this.showContent = false
        this.Obj = {}
        if (this.$route.query.from == 'apply') {
          console.log('init-1-apply')
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
          console.log('init-1-begin')
          if (flag) {
            this.$refs.as.clear()
          }
          const buz = JSON.parse(sessionStorage.getItem('stationCancelticket'))
          console.log(buz)
          const {id, flowName, flowCode} = buz
          console.log('id值:', id)
          this.flowCode = flowCode
          this.Obj.flowId = id
          this.Obj.title = flowName
          this.Obj.flow = {}
          this.Obj.flow.bizTitle = flowName
          this.Obj.flow.flowId = id
          this.Obj.flow.agreed = true // 是否同意，默认同意
          this.Obj.flow.flowName = flowName
          this.showContent = true
          console.log('init-1-end')
          // 获取流程图
          this.getFlowInfo(id)
        }
      },
    },
    mounted() {
      this.init(false)
      this.getGameList()
    }
  }
</script>

<style scoped>
</style>
