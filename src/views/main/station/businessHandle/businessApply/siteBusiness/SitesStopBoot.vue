<template>
  <Tabs type="border-card">
    <TabPane label="业务详情">
      <Form ref="Obj" :model="Obj" :rules="ruleInline" label-width="200px">
          <!--站点基本信息-->
          <h3> {{Obj.title?Obj.title:'站点基本信息'}}</h3>
          <!--站点编号-->
          <FormItem prop="stationCode" label="站点编号">
            <span v-show="$route.params.id">{{Obj.stationCode}}</span>
            <Select style="width: 69%;" v-show="!$route.params.id" v-model="Obj.stationCode" filterable
                    remote
                    :remote-method="remoteMethod1"
                    placeholder="编号最少8个字"
                    @change="queryStationInfo"
                    :loading="loading1">
              <Option v-for="(option, index) in options1"
                      :value="option.value"
                      :key="index" :label="option.label">
              </Option>
            </Select>
            <Button style="width: 29%;vertical-align: top;margin-left:1%" :disabled="!Obj.stationCode" @click="showDetail(Obj.stationCode)">站点信息
            </Button>
          </FormItem>
          <!--申请类型-->
          <FormItem prop="type" label="申请类型">
            <Input disabled v-if="detail.stationStatus" v-model="detail.stationStatus.value==='boot'?'停机':'开机'"/>
            <Input disabled v-if="!detail.stationStatus"/>
          </FormItem>
          <!--申请原因-->
          <FormItem label="申请原因" prop="reason">
            <Input v-model="Obj.reason" :maxlength='120' type="textarea" :autosize="{ minRows: 1, maxRows: 4}"/>
          </FormItem>
          <!--站点地址-->
          <FormItem label="站点地址">
            <Input disabled v-model="detail.stationAddr"/>
          </FormItem>
          <!--建站时间-->
          <FormItem label="建站时间">
            <Input disabled v-if="detail.setUpTime" v-model="detail.setUpTime"/>
            <Input disabled v-if="!detail.setUpTime"/>
          </FormItem>
          <!--身份证号码-->
          <FormItem label="身份证号码">
            <Input disabled v-if="detail.stationMaster" v-model="detail.stationMaster.idCard"/>
            <Input disabled v-if="!detail.stationMaster"/>
          </FormItem>
          <!--移动电话-->
          <FormItem label="移动电话">
            <Input disabled v-if="detail.stationMaster" v-model="detail.stationMaster.mobile"/>
            <Input disabled v-if="!detail.stationMaster"/>
          </FormItem>
          <!--附件信息-->
          <FormItem label="附件信息">
              <ModalUpload :api="uploadConf" @uploadResult="uploadResult" :type="uploadType" :isMultiple="true">
                 <div slot="warnTxt">类型：可用文件格式 txt、doc、xls、jpg、bmp、png、rar、zip、office2007 其中的一种</div>
              </ModalUpload>
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
        <!--点击“站点信息”弹出框-->
        <Dialog :visible.sync="ModalFlag" title="站点基本信息" width="900">
          <!--站点基本信息-->
          <Form ref="detail" :model="detail" :rules="ruleInline" label-width="200px">
            <FormItem label="站点编号">
                {{detail.stationCode}}
            </FormItem>
            <FormItem label="站点开机状态" v-if="detail.stationStatus">
                {{detail.stationStatus.text}}
            </FormItem>
            <FormItem label="区域编码">
                {{detail.regionCode}}
            </FormItem>
            <FormItem label="区域名称">
                {{detail.regionName}}
            </FormItem>
            <FormItem label="负责人" v-if="detail.stationMaster">
                {{detail.stationMaster.nameX}}
            </FormItem>
            <FormItem label="站点电话">
                {{detail.stationPhone}}
            </FormItem>
            <FormItem label="经营模式名">
                {{detail.operateModeName}}
            </FormItem>
            <FormItem label="建站时间">
                {{detail.setUpTime | ToTime}}
            </FormItem>
            <FormItem label="站点地址">
                {{detail.stationAddr}}
            </FormItem>
          </Form>
        </Dialog>
    </TabPane>
    <TabPane label="流程图">
      <mySteps :nodeList="nodeList"></mySteps>
    </TabPane>
  </Tabs>
</template>

<script>
import ModalUpload from '@/components/upload/modalUpload/ModalUpload'
import Chuli from '@/components/chuli/Chuli'
import {mapMutations} from 'vuex'
export default {
  name: 'SitesStopBoot',
  data() {
    // const validator = (rule, value, callback) => {
    //   let id = this.options1.find(v => v.value == value)
    //   this.postJson('station', {// 根据站点编号查询站点明细
    //     apiCode: 300018,
    //     content: {
    //       stationCode: value
    //     }
    //   }).then(res => {
    //     if (res.code == '0') {
    //       this.detail = res.content
    //       this.Obj.type = res.content.stationStatus.value
    //       callback()
    //     } else {
    //       this.Obj.type = ''
    //       callback(new Error(`站点信息加载出错,请联系技术人员`))
    //     }
    //   })
    // }
    return {
      testValue: '',
      uploadType: ['txt', 'doc', 'xls', 'jpg', 'bmp', 'png', 'rar', 'zip', 'office2007'],
      stationMaster: {},
      instanceId: JSON.parse(sessionStorage.getItem('draftFromApply')) ? JSON.parse(sessionStorage.getItem('draftFromApply')).instanceId : '',
      flowCode: '',
      uploadConf: {
        sysModule: 'flow',
        hostBizObj: 'flow_files',
        hostBizId: ''
      },
      stationTypeList: [], // 站点类型列表
      ruleInline: {
        stationCode: [
          {required: true, message: '站点编号不能为空', trigger: 'blur'},
          // {validator: validator, trigger: 'change'},
          {min: 8, message: '编号长度为8位', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '申请类型不能为空,请先选择站点编号', trigger: 'blur'}
        ]
      }, // 校验规则
      Obj: {
        regionCode: ''
      },
      // 流程图跳线
      nodeList: [],
      // 显示/隐藏 坐标标注200005
      posFlag: false,
      // 加载状态
      loading1: false,
      options1: [],
      // 上传附件基本配置
      conf: {
        uploadUrl: ''
      },
      // 代理商列表
      agentList: [],
      // 代销费类型
      // 编号开头，必须以该数组的其中之一为开头
      stationCodeBeginRule: [],
      // 第一个步骤，起始节点
      beginNode: '',
      ModalFlag: false,
      detail: ''
    }
  },
  methods: {
    queryStationInfo (){
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
          if (res.code == '0') {
            this.detail = res.content
            this.Obj.type = res.content.stationStatus.value
            console.log(this.detail)
            console.log(this.Obj)
          } else {
            this.Obj.type = ''
            callback(new Error(`站点信息加载出错,请联系技术人员`))
          }
        })
      }
    },
    // 点击显示站点信息详情
    showDetail(stationCode) {
      this.ModalFlag = true
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
        this.stationMaster = {}
        this.detail = ''
      }
    },
    stationCodeChange(){
      if(this.Obj.stationCode){
        console.log(this.Obj.stationCode)
      }
    },
    // 上传结果
    uploadResult(file) {
      console.log('我是上传结果', file)
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
      this.Obj.type = this.detail.stationStatus.value == 'boot' ? 'stop' : 'boot'
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
      this.init()
    },
    init() {
      this.showContent = false
      this.Obj = {}
      this.detail = {}
      if (this.$route.query.from == 'apply') {
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
        this.getFlowInfo(flowId)
      } else {
        const buz = JSON.parse(sessionStorage.getItem('sitesStopBoot'))
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
    // 获取代理商列表
    getAgentList() {
      this.postJson('biz', {
        apiCode: 200005
      }).then(res => {
        this.agentList = res.content
      })
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
        const userId = JSON.parse(sessionStorage.getItem('login')).uid
        this.uploadConf.hostBizId = `temp$${userId}$${this.flowCode}$${this.Obj.flow.fromNodeCode}`
      })
    },
    // 获取站点类型列表
    getStationTypeList() {
      this.postJson('station', {
        apiCode: 300014
      }).then(res => {
        if (res.code === '0') {
          this.stationTypeList = res.content
          this.SET_ENUM_DIC({
            target: 'stationType',
            content: res.content
          })
          sessionStorage.setItem('stationType', JSON.stringify(res.content))
        }
      })
    },
    // 获取草稿信息
    getDraftDetail(flowId, bizId, instanceId) {
      this.postJsonWithMask('common', {
          apiCode: 200112,
          content: {flowId, bizId, instanceId, showDetail: false}
        }).then(res => {
          this.Obj.stationCode = null
          this.Obj = Object.assign(this.Obj, res.content.bizObject)
          this.Obj.type = this.Obj.type.value
          this.postJson('station', {
            apiCode: 300018,
            content: {
              stationCode: this.Obj.stationCode
            }
          }).then(res => {
            if (res.code === '0') {
              this.showContent = true
              this.detail = res.content
              this.Obj.type = res.content.stationStatus.value
            } else {
              this.Obj.type = ''
            }
          })
        })
    },
    ...mapMutations({
      SET_ENUM_DIC: 'SET_ENUM_DIC'
    })
  },
  components: {
    ModalUpload,
    Chuli
  },
  mounted() {
    this.init()
    // 获取代理商
    this.getAgentList()
    // 获取站点类型
    this.getStationTypeList()
  }
}
</script>

<style scoped>

</style>